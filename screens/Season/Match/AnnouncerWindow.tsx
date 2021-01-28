import * as React from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import { connect } from 'react-redux'
import { clearEvents } from '../../../redux/matchEventWidget'
import { critDialogs } from '../../../lib/constants/announcerDialog'

interface Props {
  matchEvents?: any
  clearEvents?: Function
}

const getAnnouncerDialogs = (matchEvent: any) => {
  let dialogPool = []
  console.log(matchEvent.attackResult.isCrit)
  if (matchEvent.attackResult.isCrit) {
    dialogPool = critDialogs
  } else {
    return ''
  }
  const dialog = dialogPool[Math.floor(Math.random() * dialogPool.length)]
  return `${dialog} ${matchEvent.attacker.name} dealt ${matchEvent.attackResult.damageDealt} damage to ${matchEvent.target.name}`
}

const AnnouncerWindow: React.FC<Props> = ({ matchEvents, clearEvents }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState('')

  React.useEffect(() => {
    if (matchEvents) {
      const dialog = getAnnouncerDialogs(matchEvents)
      if (dialog) {
        setAnnouncement(dialog)
        setIsOpen(true)
      }
    }
  }, [matchEvents])

  if (!isOpen) {
    return <View />
  }

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 100,
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
      <Pressable
        style={{ width: '100%', flexDirection: 'row' }}
        onPress={() => {
          clearEvents!()
          setIsOpen(false)
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
          <Text style={{ fontSize: 16 }}>{announcement}</Text>
        </View>
      </Pressable>
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  matchEvents: state.matchEvents,
})

export default connect(mapStateToProps, { clearEvents })(AnnouncerWindow)
