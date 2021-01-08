import { HealthPowerUp } from './HealthPowerUp'

export class PowerUpFactory {
  private powerUps = [new HealthPowerUp([0, 0])]
  public generateRandomPowerup(position: number[]) {
    const randomPowerUpType = this.powerUps[
      Math.floor(Math.random() * this.powerUps.length)
    ]
    return randomPowerUpType.clone(position)
  }
}
