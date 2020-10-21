import * as React from 'react'
import {TextInput } from 'react-native'

interface Props {
  onChangeText: Function
  value: string
  style?: any
}

export const Input: React.FC<Props> = ({ onChangeText, value, style }) => {
  const inputStyle = {
    fontSize: 16,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    ...style
  }
  return (
    <TextInput
      style={inputStyle}
      onChangeText={(text: string) => onChangeText(text)}
      value={value}
    />
  )
}