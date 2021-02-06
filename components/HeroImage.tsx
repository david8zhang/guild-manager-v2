import * as React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Hero, HeroType } from '../lib/model/Hero'
import {
  FEMALE_HAIR,
  MALE_EYES,
  MALE_HAIR,
  FEMALE_EYES,
  EYEBROW,
  MOUTH,
  FACES,
  BODY,
} from '../lib/constants/imageMap'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HeroFactory } from '../lib/factory/HeroFactory'

interface Props {
  hero: any
  width: number
  height: number
  teamColor: string
  style?: any
  hideOverlay?: boolean
}

export const HeroImage: React.FC<Props> = ({
  hero,
  width,
  height,
  teamColor,
  style,
  hideOverlay,
}) => {
  const { heroType, heroImageData } = hero

  const allEyes = { ...FEMALE_EYES, ...MALE_EYES }
  const allHair = { ...FEMALE_HAIR, ...MALE_HAIR }

  const bodyImage = (BODY as any)[heroImageData.body]
  const eyesImage = (allEyes as any)[heroImageData.eyes]
  const hairImage = (allHair as any)[heroImageData.hair]
  const mouthImage = (MOUTH as any)[heroImageData.mouth]
  const faceImage = (FACES as any)[heroImageData.face]
  const eyebrowsImage = (EYEBROW as any)[heroImageData.eyebrow]

  return (
    <View style={{ width: '100%', height: '100%', ...style }}>
      <Image
        source={bodyImage}
        style={{
          ...styles.imageStyle,
          width,
          height,
          backgroundColor: teamColor,
        }}
      />
      <Image
        source={faceImage}
        style={{ ...styles.imageStyle, width, height }}
      />
      <Image
        source={mouthImage}
        style={{ ...styles.imageStyle, width, height }}
      />
      <Image
        source={eyesImage}
        style={{ ...styles.imageStyle, width, height }}
      />
      <Image
        source={eyebrowsImage}
        style={{ ...styles.imageStyle, width, height }}
      />
      <Image
        source={hairImage}
        style={{ ...styles.imageStyle, width, height }}
      />
      {!hideOverlay && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            padding: 5,
            borderColor: 'black',
            borderWidth: 1,
            backgroundColor: 'white',
          }}
        >
          <Image
            source={HeroFactory.getIcon(heroType)}
            style={{ width: 20, height: 20 }}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  imageStyle: {
    position: 'absolute',
  },
})
