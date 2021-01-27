import * as React from 'react'
import { View, Text, Image } from 'react-native'

interface Props {}

export const AnnouncerWindow: React.FC<{}> = () => {
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 5,
        bottom: 10,
        height: 100,
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 5,
        width: '90%',
        backgroundColor: 'white',
        alignSelf: 'center',
        padding: 15,
        flexDirection: 'row',
      }}
    >
      <View style={{ height: '100%', width: 100 }}>
        <Image
          style={{ width: '100%', height: '100%' }}
          source={{
            uri:
              'https://cdn3.iconfinder.com/data/icons/american-football-9/66/63-512.png',
          }}
          resizeMode='contain'
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15 }}>Wow a big hit!</Text>
      </View>
    </View>
  )
}
