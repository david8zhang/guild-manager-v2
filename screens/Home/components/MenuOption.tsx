import * as React from 'react'
import { Pressable, Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

interface Props {
  onPress: Function
  optionName: string
  iconName: string
}

export const MenuOption: React.FC<Props> = ({
  onPress,
  optionName,
  iconName,
}) => {
  return (
    <Pressable
      onPress={() => onPress()}
      style={{
        width: 250,
        padding: 40,
        marginLeft: 5,
        marginRight: 5,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'gray',
      }}
    >
      <FontAwesome name={iconName} size={80} />
      <Text style={{ fontSize: 20, marginTop: 20 }}>{optionName}</Text>
    </Pressable>
  )
}
