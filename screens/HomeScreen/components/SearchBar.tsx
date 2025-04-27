import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

export default function SearchBar({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  return (
    <>
      <Text variant="titleLarge" style={styles.appName}>
        Halo Mama
      </Text>
      <TextInput
        mode="outlined"
        placeholder="Cari Mama..."
        style={styles.searchInput}
        theme={{ roundness: 100 }}
        outlineStyle={{ borderWidth: 0 }}
        left={<TextInput.Icon icon="magnify" />}
        value={value}
        onChangeText={onChange}
      />
    </>
  )
}

const styles = StyleSheet.create({
  appName: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 0,
    backgroundColor: 'white',
    borderRadius: 30,
  },
});
