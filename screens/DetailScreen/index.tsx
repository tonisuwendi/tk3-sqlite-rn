import { ScrollView, StyleSheet, View } from 'react-native'
import { Appbar, Menu, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context'
import MainInfo from './components/MainInfo';
import DetailInfo from './components/DetailInfo';
import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { IMama } from '@/types/mama';
import { supabase } from '@/utils/supabase';
import { createFileUrl } from '@/utils/helpers';

export default function DetailScreen() {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [mamaData, setMamaData] = useState<IMama | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleGetMama = async (_id: number) => {
    const { data } = await supabase.from('mamas').select('*').eq('id', _id).single();
    setMamaData({
      id: data.id,
      name: data.name,
      age: data.age,
      phone: data.phone,
      pregnancyAge: data.pregnancy_age,
      expectedBirthdate: data.expected_birthdate,
      address: data.address,
      note: data.note,
      photo: createFileUrl(data.photo),
    });
  };

  useFocusEffect(
    useCallback(() => {
      handleGetMama(id ? parseInt(id as string) : 0);
    }, [id])
  );

  const handleDelete = async () => {
    await supabase.from('mamas').delete().eq('id', id)
    setSnackbarMsg('Data berhasil dihapus');
    setTimeout(() => {
      router.back();
    }, 1000);
  }

  const handleGoToEdit = () => {
    setVisibleMenu(false);
    router.push(`/edit/${id}`);
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Detail Mama" />
        <Menu
          visible={visibleMenu}
          onDismiss={() => setVisibleMenu(false)}
          anchor={<Appbar.Action icon="menu" onPress={() => setVisibleMenu(true)} />}>
          <Menu.Item onPress={handleGoToEdit} title="Ubah Data" leadingIcon="file-edit" />
          <Menu.Item onPress={handleDelete} title="Hapus" leadingIcon="trash-can" />
        </Menu>
      </Appbar.Header>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.main}>
            <View style={styles.mainInfo}>
              <MainInfo mama={mamaData} />
              <DetailInfo mama={mamaData} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Snackbar
        visible={!!snackbarMsg}
        onDismiss={() => setSnackbarMsg('')}
      >
        {snackbarMsg}
      </Snackbar>
    </>
  )
};

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 20,
    flex: 1,
  },
  mainInfo: {
    alignItems: 'center',
    flexDirection: 'column',
  }
});
