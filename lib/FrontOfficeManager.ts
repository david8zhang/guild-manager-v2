import { TEAM_NAMES } from './constants/fullTeamNames'
import { Hero, Contract } from './model/Hero'
import { Team } from './model/Team'
import { TeamGenerator } from './TeamGenerator'

export interface FreeAgent {
  hero: Hero
  previousTeamId: String
}

export class FrontOfficeManager {
  public static MAX_SALARY_CAP = 100
  public playerTeam: Team
  public expiringHeroes: Hero[] = []
  public teams: Team[]
  public freeAgents: FreeAgent[] = []

  public constructor(playerObj: any) {
    this.playerTeam = Team.deserializeObj(playerObj)
    this.teams = playerObj.league
      ? playerObj.league.map((t: Team) => Team.deserializeObj(t))
      : TeamGenerator.generateRandomTeams({
          numTeams: TEAM_NAMES.length - 1,
          playerTeam: this.playerTeam,
        })

    this.playerTeam.roster.forEach((hero: Hero) => {
      if (hero.getContract().duration == 0) {
        this.expiringHeroes.push(hero)
      }
    })
  }

  public setPlayerTeamReference(playerTeam: Team) {
    this.playerTeam = playerTeam
  }

  public setTeamReference(teams: Team[]) {
    this.teams = teams
  }

  public getPlayerHeroes(): Hero[] {
    return this.playerTeam.roster
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
      team.roster.forEach((h: Hero) => {
        if (team.teamId !== this.playerTeam.teamId) {
          const contract = h.getContract()
          contract.duration--

          // If CPU controlled hero contract expires, make them a free agent.
          // If the player does not sign them after offseason, then all CPU free agents are resigned to their original team
          if (contract.duration == 0) {
            team.releaseHero(h.heroId)
            this.freeAgents.push({
              hero: h,
              previousTeamId: team.teamId,
            })
          }
          h.setContract(contract)
        }
      })
    })
  }

  public static getAskingAmount(hero: Hero) {
    const ovr = hero.getOverall()
    let askingAmount = 5
    if (ovr > 60 && ovr <= 70) {
      askingAmount = 10
    }
    if (ovr > 70 && ovr <= 80) {
      askingAmount = 15
    }
    if (ovr >= 80) {
      askingAmount = 20
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

    return Math.min(Math.floor(askingAmount), 40)
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
    }
  }

  public deserializeObj(frontOfficeObj: any) {
    this.freeAgents = frontOfficeObj.freeAgents.map((fa: any) => ({
      hero: Hero.deserializeHeroObj(fa.hero),
      previousTeamId: fa.previousTeamId,
    }))
  }

  public getProjectedSalaryCap(hero: Hero, newContract: Contract) {
    const currContract = hero.getContract()
    const diff = newContract.amount - currContract.amount
    return {
      projectedSalary: this.getTotalSalary() + diff,
      capSpace:
        FrontOfficeManager.MAX_SALARY_CAP - (this.getTotalSalary() + diff),
    }
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
    if (projectedSalary > FrontOfficeManager.MAX_SALARY_CAP) {
      return true
    } else {
      return false
    }
  }

  // Gets called once offseason is over and season restarts
  public onSeasonStart(): void {
    // Return all unsigned free agents to their respective teams
  }

  public getPlayer() {
    return this.playerTeam
  }
}
