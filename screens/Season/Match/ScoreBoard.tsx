import * as React from 'react'
import { Text, View } from 'react-native'

interface Props {
  score: any
  turnsRemaining: number
  playerColor: string
  enemyColor: string
}

export const ScoreBoard: React.FC<Props> = ({
  score,
  turnsRemaining,
  playerColor,
  enemyColor,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: 550,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      {Object.keys(score).map((key: string, index: number) => {
        return (
          <View
            key={key}
            style={{
              flex: 1,
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: 'black',
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                backgroundColor: index == 0 ? playerColor : enemyColor,
                flex: 1,
              }}
            ></View>
            <View style={{ flexDirection: 'row', padding: 10, flex: 3 }}>
              <Text style={{ fontSize: 20, flex: 1 }}>{key}</Text>
              <Text style={{ fontSize: 20 }}>{score[key]}</Text>
            </View>
          </View>
        )
      })}
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 10,
        }}
      >
        <Text style={{ fontSize: 24 }}>
          {turnsRemaining > 0 ? turnsRemaining : 'FINAL'}
        </Text>
        {turnsRemaining > 0 && (
          <Text style={{ fontSize: 12 }}>Turns remaining</Text>
        )}
      </View>
    </View>
  )
}
