import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, CustomModal } from '../../../components'
import { Team } from '../../../lib/model/Team'
import { SeasonManager } from '../../../lib/SeasonManager'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

interface Props {
  onContinue: Function
  isOpen: boolean
  seasonManager: SeasonManager
  didWin: boolean
}

export const ChampionshipResultsModal: React.FC<Props> = ({
  onContinue,
  isOpen,
  seasonManager,
  didWin,
}) => {
  const playerTeam: Team = seasonManager.getPlayer()

  return (
    <CustomModal
      customHeight={300}
      customWidth={400}
      onClose={() => {}}
      hideCloseButton
      isOpen={isOpen}
    >
      <View
        style={{
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {didWin ? (
          <FontAwesome name='trophy' size={100} style={{ marginBottom: 10 }} />
        ) : (
          <MaterialCommunityIcons
            name='emoticon-sad-outline'
            size={100}
            style={{ marginBottom: 10 }}
          />
        )}
        <Text style={{ fontSize: 25, marginBottom: 10 }}>
          {didWin ? 'Congratulations!' : 'Better luck next time!'}
        </Text>
        <Text style={{ marginBottom: 30, fontSize: 16, textAlign: 'center' }}>
          {didWin
            ? `${playerTeam.name} have won the championship!`
            : "You couldn't win a championship this year. Try again next year!"}
        </Text>
        <Button
          onPress={() => {
            onContinue()
          }}
          text='Continue'
        />
      </View>
    </CustomModal>
  )
}
