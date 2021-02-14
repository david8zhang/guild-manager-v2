import * as React from 'react'
import { Dimensions, Pressable, Text, View } from 'react-native'
import { Button, CustomModal } from '../../../components'
import { Team } from '../../../lib/model/Team'
import { SeasonManager } from '../../../lib/SeasonManager'
import { MatchOutcome } from '../../../lib/simulation/MatchSimulator'
import { MatchScore } from './MatchScore'
import { FontAwesome } from '@expo/vector-icons'
import { MatchStats } from './MatchStats'
import { PostMatchStatGains } from './PostMatchStatGains'

interface Props {
  matchOutcome: MatchOutcome
  seasonManager: SeasonManager
  isOpen: boolean
  onContinue: Function
}

export const MatchResultModal: React.FC<Props> = ({
  isOpen,
  matchOutcome,
  seasonManager,
  onContinue,
}) => {
  const [showMatchStats, setShowMatchStats] = React.useState(false)
  const [showStatIncreases, setShowStatIncreases] = React.useState(false)

  if (!matchOutcome) return <View />
  const playerTeam = seasonManager.getPlayer()
  const enemyTeamName = Object.keys(matchOutcome.score).filter(
    (k: string) => k !== playerTeam.name
  )[0]

  const enemyTeam = seasonManager.getTeamByName(enemyTeamName) as Team
  const didPlayerWin = matchOutcome.winnerId === playerTeam.teamId

  if (showMatchStats) {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'white',
          position: 'absolute',
          zIndex: 10,
        }}
      >
        {!showStatIncreases && (
          <MatchStats
            seasonManager={seasonManager}
            playerTeam={playerTeam}
            enemyTeam={enemyTeam}
            onContinue={() => {
              setShowStatIncreases(true)
            }}
            matchStats={matchOutcome.heroMatchStats}
          />
        )}
        {showStatIncreases && (
          <PostMatchStatGains
            seasonManager={seasonManager}
            onBack={() => {
              setShowStatIncreases(false)
            }}
            onContinue={() => {
              setShowStatIncreases(false)
              setShowMatchStats(false)
            }}
            statIncreases={matchOutcome.statIncreases[playerTeam.teamId]}
          />
        )}
      </View>
    )
  }

  return (
    <CustomModal
      customHeight={350}
      customWidth={400}
      isOpen={isOpen}
      hideCloseButton
      onClose={() => {}}
    >
      <View
        style={{
          height: '80%',
          padding: 5,
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 20 }}>
          You {didPlayerWin ? 'Won!' : 'Lost...'}
        </Text>

        <MatchScore
          playerTeam={playerTeam}
          team={enemyTeam}
          playerScore={matchOutcome.score[playerTeam.name]}
          enemyScore={matchOutcome.score[enemyTeam.name]}
          isHome={true}
        />
      </View>
      <View
        style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}
      >
        <Button
          style={{ margin: 5 }}
          onPress={() => {
            setShowMatchStats(true)
          }}
          text='View Stats'
        />
        <Button
          style={{ margin: 5 }}
          onPress={() => {
            onContinue()
          }}
          text='Continue'
        />
      </View>
    </CustomModal>
  )
}
