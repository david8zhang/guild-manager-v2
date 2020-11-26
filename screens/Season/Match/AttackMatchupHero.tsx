import * as React from 'react'
import { Text, View } from 'react-native'
import { HeroImage } from '../../../components'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AttackMatchupHealthBar } from './AttackMatchupHealthBar'
import { BuffDisplay } from './BuffDisplay'

interface Props {
  name: string
  currHealth: number
  health: number
  predictedDamageTaken: number
  hero: HeroInMatch
  color: string
  imageOptions?: {
    width: number
    height: number
  }
}

export const AttackMatchupHero: React.FC<Props> = ({
  name,
  currHealth,
  health,
  predictedDamageTaken,
  hero,
  color,
  imageOptions,
}) => {
  const { attack, defense, magic, speed } = hero.getHeroRef()
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>
        {name}
      </Text>
      <View
        style={{
          flex: 1,
          width: imageOptions ? imageOptions.width : 100,
          marginBottom: 20,
        }}
      >
        <HeroImage
          hero={hero.getHeroRef()}
          width={imageOptions ? imageOptions.width : 100}
          height={imageOptions ? imageOptions.height : 100}
          teamColor={color}
        />
      </View>
      <View style={{ flex: 2, flexDirection: 'column' }}>
        <BuffDisplay hero={hero} />
        <AttackMatchupHealthBar
          predictedDmg={predictedDamageTaken}
          currHealth={currHealth}
          health={health}
          style={{ marginBottom: 10 }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 0,
          }}
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 15 }}>ATK: {attack}</Text>
            <Text style={{ fontSize: 15 }}>DEF: {defense}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 15 }}>SPD: {speed}</Text>
            <Text style={{ fontSize: 15 }}>MGK: {magic}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
