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

  public static getExtensionEstimate(hero: Hero, duration: number) {
    const contract = hero.getContract()
    const currDuration = contract.duration
    let askingAmount = contract.amount

    // Factor in potentials
    const potentialMultiplier = 0.15 * hero.potential + 0.8
    askingAmount *= potentialMultiplier

    // Factor in duration
    const durationMultiplier = 1.46429 - 0.0714286 * (duration + currDuration)
    askingAmount *= durationMultiplier

    return Math.max(Math.floor(askingAmount), 40)
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

  public getPlayer() {
    return this.playerTeam
  }
}
