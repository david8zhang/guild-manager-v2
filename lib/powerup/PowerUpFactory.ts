import { HealthPowerUp } from './HealthPowerUp'

export class PowerUpFactory {
  private powerUps = [new HealthPowerUp()]
  public generateRandomPowerup() {
    const randomPowerUpType = this.powerUps[
      Math.floor(Math.random() * this.powerUps.length)
    ]
    return randomPowerUpType.clone()
  }
}
