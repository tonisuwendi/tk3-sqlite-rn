import { ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import MamaItem from './MamaItem';
import { IMama } from '@/types/mama';

export default function MamaList({ mamas }: { mamas: IMama[] }) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text variant="labelMedium" style={styles.labelResult}>
        Menampilkan {mamas.length} data
      </Text>
      <ScrollView style={{ marginBottom: 180 }}>
        <View style={styles.list}>
          {mamas.map((mama) => (
            <MamaItem key={mama.id} mama={mama} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginBottom: 50,
  },
  labelResult: {
    fontSize: 14,   
    paddingBottom: 20,
  },
});
