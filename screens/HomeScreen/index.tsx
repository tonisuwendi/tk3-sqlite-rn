import { Alert, Image, StyleSheet, View } from 'react-native'
import { FAB, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchBar from './components/SearchBar';
import MamaList from './components/MamaList';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { IMama } from '@/types/mama';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@clerk/clerk-expo';

export default function HomeScreen() {
  const [mamaList, setMamaList] = useState<IMama[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const { userId } = useAuth();

  const handleGetAllMamas = async () => {
    try {
      const { data: mamas, error } = await supabase.from('mamas').select('*').eq('user_id', userId);

      if (error) {
        Alert.alert(
          'Error',
          'Terjadi kesalahan saat mengambil data mama. Silakan coba lagi.',
        );
        console.error('Error fetching mamas:', error.message);
        return;
      }

      const newMamas = mamas?.map((mama) => ({
        ...mama,
        expectedBirthdate: mama.expected_birthdate,
        pregnancyAge: mama.pregnancy_age,
      }));
      setMamaList(newMamas);
    } catch (error: any) {
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat mengambil data mama. Silakan coba lagi.',
      );
      console.error('Error fetching mamas:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAllMamas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const filteredMamas = mamaList.filter((_mama) => _mama.name.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.main}>
        <SearchBar value={searchValue} onChange={setSearchValue} />
        <FAB
          icon="plus"
          label="Tambah Mama"
          style={styles.fab}
          color="#c44539"
          onPress={() => router.push('/add')}
        />
        {filteredMamas.length > 0 ? (
          <MamaList mamas={filteredMamas} />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', gap: 5, alignItems: 'center' }}>
            <Image
              source={require('@/assets/images/empty-folder.png')}
              style={{ width: 100, height: 100, marginBottom: 20 }}
            />
            <Text variant="titleMedium">
              Tidak ada data mama.
            </Text>
            <Text variant="titleMedium">
              {mamaList.length === 0 ? 'Yuk tambah mama dulu!' : 'Cari dengan keyword lain ya!'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 20,
    flex: 1,
  },
  fab: {
    backgroundColor: '#FFE8E4',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 20,
    zIndex: 9,
  },
});
