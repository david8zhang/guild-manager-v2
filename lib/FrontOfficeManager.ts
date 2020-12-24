import { TEAM_NAMES } from './constants/fullTeamNames'
import { Hero, Contract } from './model/Hero'
import { Team } from './model/Team'
import { TeamGenerator } from './TeamGenerator'

export class FrontOfficeManager {
  public static MAX_SALARY_CAP = 100
  public playerTeam: Team
  public expiringHeroes: Hero[] = []
  public teams: Team[]

  public constructor(playerObj: any) {
    this.playerTeam = Team.deserializeObj(playerObj)
    this.teams = playerObj.league
      ? playerObj.league.map((t: Team) => Team.deserializeObj(t))
      : TeamGenerator.generateRandomTeams({
          numTeams: TEAM_NAMES.length - 1,
          playerTeam: this.playerTeam,
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
    this.playerTeam.releaseHero(heroId)
  }

  public getProjectedSalaryCap(hero: Hero, newContract: Contract) {
    const currContract = hero.getContract()
    const diff = newContract.amount - currContract.amount
    return {
      projectedSalary: this.getTotalSalary() + diff,
      diff,
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

  public getPlayer() {
    return this.playerTeam
  }
}
