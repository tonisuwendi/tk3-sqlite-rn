import { IMama } from '@/types/mama';
import { Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function MainInfo({ mama }: { mama: IMama | null }) {
  return (
    <>
      <Image
        source={{ uri: mama?.photo }}
        width={20}
        height={20}
        style={styles.image}
      />
      <Text variant="titleLarge" style={styles.title}>
        {mama?.name}
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        {mama?.age}
      </Text>
    </>
  )
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#ddd',
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 5,
  },
});