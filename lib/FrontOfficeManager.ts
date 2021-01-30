import { TEAM_NAMES } from './constants/fullTeamNames'
import { RandomHeroGenerator } from './heroGenerator/RandomHeroGenerator'
import { Hero, Contract } from './model/Hero'
import { Record } from './model/Record'
import { Team } from './model/Team'
import { TeamGenerator } from './TeamGenerator'

export interface FreeAgent {
  hero: Hero
  previousTeamId: string
}

export class FrontOfficeManager {
  public static MAX_SALARY_CAP = 100
  public playerTeam: Team
  public expiringHeroes: Hero[] = []
  public teams: Team[]
  public freeAgents: FreeAgent[] = []
  public draftClass: Hero[] = []
  public draftOutcomes: any[] = []
  public hasDraftEnded: boolean = false

  public constructor(playerObj: any, leagueObj: any) {
    this.playerTeam = Team.deserializeObj(playerObj)
    this.teams = []
    this.configureOtherTeams(leagueObj)
    this.playerTeam.roster.forEach((hero: Hero) => {
      if (hero.getContract().duration == 0) {
        this.expiringHeroes.push(hero)
      }
    })
  }

  public configureOtherTeams(serializedLeagueObj: any): void {
    if (!serializedLeagueObj) {
      this.teams = TeamGenerator.generateRandomTeams({
        numTeams: TEAM_NAMES.length - 1,
        playerTeam: this.playerTeam,
      })
    } else {
      this.teams = serializedLeagueObj.map((team: any) =>
        Team.deserializeObj(team)
      )
    }
  }

  public getSerializedNonPlayerTeams(): any[] {
    return this.teams
      .filter((team: Team) => team.teamId !== this.playerTeam.teamId)
      .map((team: Team) => team.serialize())
  }

  public setPlayerTeamReference(playerTeam: Team) {
    this.playerTeam = playerTeam
  }

  public setTeamReference(teams: Team[]) {
    this.teams = teams
  }

  public getTeams(): Team[] {
    return this.teams
  }

  public getPlayerHeroes(): Hero[] {
    return this.playerTeam.roster
  }

  public finishDraft() {
    this.draftClass = []
    this.draftOutcomes = []
    this.hasDraftEnded = true
  }

  public decrementContractDuration(): void {
    this.playerTeam.roster.forEach((h: Hero) => {
      const contract = h.getContract()
      contract.duration--
      if (contract.duration == 0) {
        this.expiringHeroes.push(h)
      }
      h.setContract(contract)
    })

    this.teams.forEach((team: Team) => {
      if (team.teamId !== this.playerTeam.teamId) {
        team.roster.forEach((h: Hero) => {
          const contract = h.getContract()
          contract.duration--
          h.setContract(contract)
        })
        // Pick an eligible free agent at random and release them to free agency for the player to sign
        this.cpuReleaseRandFreeAgent(team)
      }
    })
  }

  private cpuReleaseRandFreeAgent(team: Team) {
    const eligibleFreeAgents: Hero[] = team.roster.filter(
      (h: Hero) => h.getContract().duration === 0
    )
    if (eligibleFreeAgents.length > 0) {
      const randomFreeAgent: Hero =
        eligibleFreeAgents[
          Math.floor(Math.random() * eligibleFreeAgents.length)
        ]
      this.freeAgents.push({
        hero: randomFreeAgent,
        previousTeamId: team.teamId,
      })
      team.releaseHero(randomFreeAgent.heroId)

      // Resign all other free agents
      eligibleFreeAgents.forEach((hero: Hero) => {
        if (hero.heroId !== randomFreeAgent.heroId) {
          const contract = hero.getContract()
          contract.duration = 5
          hero.setContract(contract)
        }
      })
    }
  }

  public static getAskingAmount(hero: Hero) {
    const ovr = hero.getOverall()
    let askingAmount = 5
    if (ovr > 60 && ovr <= 70) {
      askingAmount = 10
    }
    if (ovr > 70 && ovr <= 80) {
      askingAmount = 20
    }
    if (ovr >= 80) {
      askingAmount = 30
    }
    return askingAmount
  }

  public static getExtensionEstimate(hero: Hero, duration: number) {
    const contract = hero.getContract()
    const currDuration = contract.duration
    let askingAmount = Math.max(
      contract.amount,
      FrontOfficeManager.getAskingAmount(hero)
    )

    // Factor in potentials
    const potentialMultiplier = 0.15 * hero.potential + 0.8
    askingAmount *= potentialMultiplier

    // Factor in duration
    const durationMultiplier = 1.46429 - 0.0714286 * (duration + currDuration)
    askingAmount *= durationMultiplier
    askingAmount = Math.floor(askingAmount)

    // If hero is a rookie, the max they can ask for is 10
    return hero.isRookie
      ? Math.min(askingAmount, 10)
      : Math.min(askingAmount, 40)
  }

  public getTotalSalary(): number {
    return this.playerTeam.roster.reduce((acc, curr) => {
      const contract = curr.getContract()
      return acc + contract.amount
    }, 0)
  }

  public extendContract(heroId: string, newContract: Contract) {
    const hero: Hero = this.playerTeam.getHero(heroId) as Hero
    hero.setContract(newContract)
  }

  public releaseHero(heroId: string) {
    const releasedHero = this.playerTeam.getHero(heroId) as Hero
    this.playerTeam.releaseHero(heroId)

    // Add released her to free agents list
    this.freeAgents.push({
      hero: releasedHero,
      previousTeamId: this.playerTeam.teamId,
    })
  }

  public getFreeAgents() {
    return this.freeAgents
  }

  public signFreeAgent(hero: Hero, contract: Contract) {
    hero.setContract(contract)
    this.playerTeam.addHero(hero)
    this.freeAgents = this.freeAgents.filter(
      (fa: FreeAgent) => fa.hero.heroId !== hero.heroId
    )
  }

  public serialize(): any {
    return {
      freeAgents: this.freeAgents.map((fa) => ({
        hero: fa.hero.serialize(),
        previousTeamId: fa.previousTeamId,
      })),
      draftClass: this.draftClass.map((hero: Hero) => hero.serialize()),
      hasDraftEnded: this.hasDraftEnded,
    }
  }

  public deserializeObj(frontOfficeObj: any) {
    this.freeAgents = frontOfficeObj.freeAgents.map((fa: any) => ({
      hero: Hero.deserializeHeroObj(fa.hero),
      previousTeamId: fa.previousTeamId,
    }))
    this.draftClass = frontOfficeObj.draftClass.map((hero: Hero) =>
      Hero.deserializeHeroObj(hero)
    )
    this.hasDraftEnded = frontOfficeObj.hasDraftEnded
  }

  public getProjectedSalaryCap(
    hero: Hero,
    newContract: Contract,
    isFreeAgent?: boolean
  ) {
    const currContract = hero.getContract()
    const diff = newContract.amount - currContract.amount
    const newTotalSalary = isFreeAgent
      ? this.getTotalSalary() + newContract.amount
      : this.getTotalSalary() + diff
    return {
      projectedSalary: newTotalSalary,
      capSpace: FrontOfficeManager.MAX_SALARY_CAP - newTotalSalary,
    }
  }

  public playerPickRookie(rookie: Hero) {
    this.playerTeam.addHero(rookie)
    this.draftClass = this.draftClass.filter((hero: Hero) => {
      return hero.heroId !== rookie.heroId
    })
    this.draftOutcomes.push({
      pickedHero: rookie,
      team: this.playerTeam,
    })
  }

  public processNextCPUDraftPick(currDraftIndex: number, draftOrder: string[]) {
    const teamToDraft = this.getTeam(draftOrder[currDraftIndex])
    const sortedDraftClass = this.draftClass.sort((a: Hero, b: Hero) => {
      return b.getOverall() - a.getOverall()
    })

    const heroToPick = sortedDraftClass[0]

    // CPU Hero gives rookie a 5 year contract
    const contract = heroToPick.contract
    contract.duration = 5
    heroToPick.setContract(contract)
    teamToDraft.addHero(heroToPick)

    this.draftOutcomes.push({
      pickedHero: heroToPick,
      team: teamToDraft,
    })

    this.draftClass = this.draftClass.filter(
      (h: Hero) => h.heroId !== heroToPick.heroId
    )
  }

  // If CPU has too many heroes, release the lowest ones to free agency (set the previousTeamId to null to prevent auto-resigning)
  public rebalanceCPUTeam(team: Team) {
    const cpuHeroesSortedByOVR = team.roster.sort((a: Hero, b: Hero) => {
      return b.getOverall() - a.getOverall()
    })
    const cutHeroes = cpuHeroesSortedByOVR.slice(6)
    cutHeroes.forEach((hero: Hero) => {
      team.releaseHero(hero.heroId)
      this.freeAgents.push({
        hero,
        previousTeamId: 'none',
      })
    })
  }

  public getDraftOutcomes(): any[] {
    return this.draftOutcomes
  }

  public hasContractsExpiring(): boolean {
    return (
      this.playerTeam.roster.find((hero: Hero) => {
        const contract = hero.getContract()
        return contract.duration === 0
      }) !== undefined
    )
  }

  public isHardCapped(hero: Hero, newContract: Contract) {
    const { projectedSalary } = this.getProjectedSalaryCap(hero, newContract)
    return projectedSalary > FrontOfficeManager.MAX_SALARY_CAP
  }

  public getTeam(teamId: string): Team {
    return this.teams.find((t: Team) => t.teamId == teamId) as Team
  }

  // Gets called once offseason is over and season restarts
  public onSeasonStart(): void {
    this.resignAllCPUFreeAgents()
    this.freeAgents = []
    this.hasDraftEnded = false
  }

  // Return all unsigned free agents to their respective teams
  public resignAllCPUFreeAgents() {
    this.freeAgents.forEach((freeAgent: FreeAgent) => {
      if (freeAgent.previousTeamId !== this.playerTeam.teamId) {
        const team: Team = this.getTeam(freeAgent.previousTeamId)
        if (team) {
          const contract = freeAgent.hero.getContract()

          // Sign a max 5 year contract
          contract.duration = 5
          freeAgent.hero.setContract(contract)
          team.addHero(freeAgent.hero)
        }
      }
    })
  }

  public getPlayer() {
    return this.playerTeam
  }

  public getDraftClass() {
    if (this.draftClass.length > 0) {
      return this.draftClass
    }
    const heroGenerator = new RandomHeroGenerator()
    const rookies = heroGenerator.generateAnyHeroType(20, 65, 80, 2)

    // Rookie contracts are initially not guaranteed - team can manage them
    rookies.forEach((rookie: Hero) => {
      const contract = rookie.getContract()
      contract.amount = 5
      contract.duration = 0
      rookie.setContract(contract)
      rookie.setIsRookie(true)
    })

    this.draftClass = rookies
    return this.draftClass
  }

  public getDraftOrder(teamRecords: { [teamId: string]: Record }): any {
    const sortedTeamIds = Object.keys(teamRecords).sort(
      (a: string, b: string) => {
        return (
          teamRecords[a].getWinLossRatio() - teamRecords[b].getWinLossRatio()
        )
      }
    )
    const playerDraftPick = sortedTeamIds.indexOf(this.playerTeam.teamId) + 1
    return {
      draftOrder: sortedTeamIds,
      playerDraftPick,
    }
  }
}
