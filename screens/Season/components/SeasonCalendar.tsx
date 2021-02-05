import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Team } from '../../../lib/model/Team'

interface Props {
  currentMatchIndex: number
  matchList: any[]
  onMatchPress: Function
  matchIndexToBold: number
}

export const SeasonCalendar: React.FC<Props> = ({
  currentMatchIndex,
  matchList,
  onMatchPress,
  matchIndexToBold,
}) => {
  const [ref, setRef] = React.useState<any>(null)

  React.useEffect(() => {
    if (ref) {
      ref.scrollTo({
        x: (currentMatchIndex - 4) * 48,
      })
    }
  }, [ref])

  return (
    <ScrollView
      style={{ flex: 1 }}
      horizontal
      ref={(ref: any) => {
        setRef(ref)
      }}
    >
      {matchList.map((m, index: number) => {
        return (
          <Pressable
            key={`match-${index}`}
            style={{ margin: 10 }}
            onPress={() => {
              onMatchPress(index)
            }}
          >
            <Text
              style={{
                fontWeight: matchIndexToBold === index ? 'bold' : 'normal',
              }}
            >
              {Team.getNameAbbrevForName(m.teamInfo.name)}
            </Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}
