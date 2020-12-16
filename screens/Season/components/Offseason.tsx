import * as React from 'react'
import { View } from 'react-native'
import { Navbar } from '../../../components'

export const Offseason: React.FC<{}> = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Navbar title='Offseason' />
    </View>
  )
}
