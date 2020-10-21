import * as React from 'react'
import { Picker } from '@react-native-community/picker'
import { View } from 'react-native'

interface Props {
  selectedValue: string
  onValueChange: Function
  children: any
}

export const BorderedPicker: React.FC<Props> = ({ selectedValue, onValueChange, children }) => {
  return (
    <View style={{ borderStyle: 'solid', borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}>
      <Picker
        selectedValue={selectedValue}
        style={{ height: 40, fontSize: 15 }}
        onValueChange={(itemValue: any) => {
          onValueChange(itemValue)
        }}
      >
        { children }
      </Picker>
    </View>
  )
}