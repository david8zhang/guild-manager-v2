import * as React from 'react'
import { Dimensions, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Team } from '../../../lib/model/Team'

interface Props {
  currentMatchIndex: number
  matchList: any[]
}

export const SeasonCalendar: React.FC<Props> = ({
  currentMatchIndex,
  matchList,
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
          <View key={`match-${index}`} style={{ margin: 10 }}>
            <Text
              style={{
                fontWeight: currentMatchIndex === index ? 'bold' : 'normal',
              }}
            >
              {Team.getNameAbbrevForName(m.teamInfo.name)}
            </Text>
          </View>
        )
      })}
    </ScrollView>
  )
}
