import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, CustomModal } from '../../../components'
import { Team } from '../../../lib/model/Team'
import { SeasonManager } from '../../../lib/SeasonManager'
import { MatchOutcome } from '../../../lib/simulation/MatchSimulator'
import { MatchScore } from './MatchScore'

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
  if (!matchOutcome) return <View />
  const playerTeam = seasonManager.getPlayer()
  const enemyTeamName = Object.keys(matchOutcome.score).filter(
    (k: string) => k !== playerTeam.name
  )[0]

  const enemyTeam = seasonManager.getTeamByName(enemyTeamName) as Team
  const didPlayerWin = matchOutcome.winnerId === playerTeam.teamId
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
        <Button style={{ margin: 5 }} onPress={() => {}} text='View Stats' />
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
