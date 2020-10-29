import * as React from 'react'
import { Text, View } from 'react-native'
import { Button } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { Hero } from '../../../lib/model/Hero'

interface Props {
  playerHeroes: Hero[]
  enemyHeroes: Hero[]
}

export const Match: React.FC<Props> = ({ playerHeroes, enemyHeroes }) => {
  const [matchManager, setMatchManager] = React.useState<MatchManager | null>(
    null
  )
  const [matchTime, setMatchTime] = React.useState(0)
  React.useEffect(() => {
    const config = {
      playerHeroes,
      enemyHeroes,
      onTickCallback: (currentTime: number) => {
        setMatchTime(currentTime)
      },
    }
    const manager = new MatchManager(config)
    setMatchManager(manager)
    manager.startMatch()
    return () => {
      matchManager?.stopMatch()
    }
  }, [])

  const minutes = Math.floor(matchTime / 60)
  const seconds = matchTime % 60

  return (
    <View>
      <Text>
        {minutes}:{seconds}
      </Text>
    </View>
  )
}
