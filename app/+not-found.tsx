import { Stack } from 'expo-router';
import { Text } from 'react-native-paper';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text>
        Halaman yang Anda cari tidak ditemukan
      </Text>
    </>
  );
}
