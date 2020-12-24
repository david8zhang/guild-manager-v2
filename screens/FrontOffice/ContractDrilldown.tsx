import * as React from 'react'
import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Hero } from '../../lib/model/Hero'
import { HeroFactory } from '../../lib/factory/HeroFactory'
import { Button } from '../../components'
import { ContractExtensionModal } from './ContractExtensionModal'
import { Portal } from 'react-native-paper'

interface Props {
  hero: Hero
  onBack: Function
}

export const ContractDrilldown: React.FC<Props> = ({ hero, onBack }) => {
  const contract = hero.getContract()
  const [isExtendingContract, setIsExtendingContract] = React.useState(false)

  const stars = []
  for (let i = 0; i < hero.potential; i++) {
    stars.push(<FontAwesome key={`star-${i}`} name='star' size={15} />)
  }
  return (
    <View style={{ padding: 15 }}>
      <Portal>
        <ContractExtensionModal
          isOpen={isExtendingContract}
          hero={hero}
          onClose={() => {
            setIsExtendingContract(false)
          }}
        />
      </Portal>

      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
      >
        <Pressable
          style={{ padding: 5 }}
          onPress={() => {
            onBack()
          }}
        >
          <FontAwesome name='chevron-left' size={15} />
        </Pressable>
        <Text style={{ fontSize: 25, marginLeft: 10 }}>{hero.name}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.headerText}>ATK</Text>
        <Text style={styles.headerText}>DEF</Text>
        <Text style={styles.headerText}>SPD</Text>
        <Text style={styles.headerText}>MGK</Text>
        <Text style={styles.headerText}>HP</Text>
        <Text style={styles.headerText}>Pot.</Text>
        <Text style={styles.headerText}>Type</Text>
        <Text style={styles.headerText}>Contract</Text>
        <Text style={styles.headerText}>Salary</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.textRow}>{hero.attack}</Text>
        <Text style={styles.textRow}>{hero.defense}</Text>
        <Text style={styles.textRow}>{hero.speed}</Text>
        <Text style={styles.textRow}>{hero.magic}</Text>
        <Text style={styles.textRow}>{hero.health}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {stars}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            style={{ width: 15, height: 15 }}
            source={HeroFactory.getIcon(hero.heroType)}
          ></Image>
        </View>
        <Text style={styles.textRow}>
          {contract.duration === 0 ? 'Expiring' : `${contract.duration} Yrs.`}
        </Text>
        <Text style={styles.textRow}>{contract.amount}G</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 30 }}>
        {contract.duration <= 2 && (
          <Button
            text='Extend Contract'
            style={{ width: 200, marginRight: 10 }}
            textStyle={{ fontSize: 13 }}
            onPress={() => {
              setIsExtendingContract(true)
            }}
          />
        )}
        {contract.duration === 0 && (
          <Button
            text='Release'
            style={{ width: 200 }}
            textStyle={{ fontSize: 13 }}
            onPress={() => {}}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textRow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
})
