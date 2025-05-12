import { useClerk, useUser } from '@clerk/clerk-expo';
import { Image, StyleSheet, View } from 'react-native';
import { Menu, Text, TextInput } from 'react-native-paper';
import * as Linking from 'expo-linking'
import { useState } from 'react';

export default function SearchBar({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isLoading, setLoading] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut()
      Linking.openURL(Linking.createURL('/'))
    } catch (err: any) {
      console.error(err.message)
    } finally {
      setVisibleMenu(false);
      setLoading(false);
    }
  }

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="titleLarge" style={styles.appName}>
          Halo Mama
        </Text>
        <Menu
          visible={visibleMenu}
          onDismiss={() => setVisibleMenu(false)}
          anchor={(
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text variant="titleSmall" onPress={() => setVisibleMenu(true)}>{user?.firstName}</Text>
              <Image
                source={{ uri: user?.imageUrl }}
                width={30}
                height={30}
                style={{ borderRadius: 50 }}
              />
            </View>
          )}>
          <Menu.Item onPress={handleLogout} title={isLoading ? 'Loading...' : 'Logout'} leadingIcon="logout" />
        </Menu>
      </View>
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
