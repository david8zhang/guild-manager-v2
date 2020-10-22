import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

interface Props {
  title: string
  style?: any
}

export const Navbar: React.FC<Props> = ({ title, style }) => {
  const navStyle: any = {
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    ...style,
  }
  return (
    <View style={navStyle}>
      <Pressable onPress={() => {}}>
        <FontAwesome name='bars' size={20} color='gray' />
      </Pressable>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ fontSize: 18 }}>{title}</Text>
      </View>
    </View>
  )
}
