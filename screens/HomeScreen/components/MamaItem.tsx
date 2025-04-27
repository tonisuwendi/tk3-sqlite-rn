import { IMama } from '@/types/mama';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'

export default function MamaItem({ mama }: { mama: IMama }) {
  const router = useRouter();

  return (
    <View style={styles.boxItem}>
      <View style={styles.boxItemHeader}>
        <Image
          source={{ uri: mama.photo }}
          width={50}
          height={50}
          style={{ borderRadius: 100 }}
        />
        <View>
          <Text variant="titleMedium">
            {mama.name}
          </Text>
          <Text variant="bodySmall" style={{ marginTop: 2 }}>
            {mama.age}
          </Text>
        </View>
      </View>
      <View style={styles.boxItemBody}>
        <View>
          <Text>
            Usia Kehamilan
          </Text>
          <Text variant="titleMedium" style={{ color: '#FF6F61', fontWeight: 'bold' }}>
            {mama.pregnancyAge}
          </Text>
        </View>
        <View style={styles.dividerVertical} />
        <View>
          <Text>
            Perkiraan Lahir
          </Text>
          <Text variant="titleMedium" style={{ color: '#FF6F61', fontWeight: 'bold' }}>
            {mama.expectedBirthdate}
          </Text>
        </View>
      </View>
      <View style={{ padding: 12, marginTop: -35 }}>
        <Button
          onPress={() => router.push(`/detail/${mama.id}`)}
          mode="contained"
          style={{ borderRadius: 8 }}
          icon="arrow-right"
          contentStyle={{ flexDirection: 'row-reverse' }}
        >
          Lihat Mama
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  boxItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  boxItemHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  boxItemBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#f7f5f5',
    padding: 12,
    borderRadius: 8,
    paddingBottom: 35,
  },
  dividerVertical: {
    width: 1,
    height: '80%',
    backgroundColor: '#ccc',
  }
});
