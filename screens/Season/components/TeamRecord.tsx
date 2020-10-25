import * as React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  name: string
  abbrev: string
  record: {
    numWins: number
    numLosses: number
  }
  onPress: Function
}

export const TeamRecord: React.FC<Props> = ({
  name,
  record,
  onPress,
  abbrev,
}) => {
  const [isPressed, setIsPressed] = React.useState(false)
  return (
    <Pressable
      onPress={() => onPress()}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={{
        flexDirection: 'row',
        marginBottom: 5,
        backgroundColor: isPressed ? '#ddd' : 'white',
      }}
    >
      <Text style={{ flex: 1, fontSize: 15 }}>
        {name} ({abbrev})
      </Text>
      <Text>
        {record.numWins}W - {record.numLosses}L
      </Text>
    </Pressable>
  )
}
