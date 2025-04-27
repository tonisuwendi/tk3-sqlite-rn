import { useCallback, useState } from 'react'
import { StyleSheet, View, Image, ScrollView } from 'react-native'
import { Appbar, Button, Snackbar, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { getMamaById, insertMama, updateMama } from '@/database/mamaDatabase';

export default function FormScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [pregnancyAge, setPregnancyAge] = useState('');
  const [expectedBirthdate, setExpectedBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleGetMama = async (_id: number) => {
    const mama = await getMamaById(_id);
    if (mama) {
      setName(mama.name);
      setAge(mama.age);
      setPhone(mama.phone);
      setPregnancyAge(mama.pregnancyAge);
      setExpectedBirthdate(mama.expectedBirthdate);
      setAddress(mama.address);
      setNote(mama.note);
      setPhoto(mama.photo);
    } else {
      setSnackbarMsg('Mama tidak ditemukan');
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      handleGetMama(id ? parseInt(id as string) : 0);
    }, [id])
  );

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (
      !name ||
      !age ||
      !phone ||
      !pregnancyAge ||
      !expectedBirthdate ||
      !address ||
      !note ||
      !photo
    ) {
      setSnackbarMsg('Semua data harus diisi');
      return;
    }
    setDisabledButton(true);
    const payload = {
      name,
      age,
      phone,
      pregnancyAge,
      expectedBirthdate,
      address,
      note,
      photo: photo || '',
    };
    if (id) {
      await updateMama({ id: parseInt(id as string), ...payload });
    } else {
      await insertMama(payload);
    }
    setSnackbarMsg('Berhasil menyimpan data mama');
    setTimeout(() => {
      router.back();
    }, 1000);
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={id ? 'Edit Mama' : 'Tambah Mama'} />
      </Appbar.Header>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.imageContainer}>
              {photo && (
                <Image source={{ uri: photo }} style={styles.image} />
              )}
              <Button mode="outlined" onPress={handleChoosePhoto} style={styles.imageButton}>
                {!!photo ? 'Ganti Foto' : 'Pilih Foto'}
              </Button>
            </View>
            <TextInput
              label="Nama Mama"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.input}
              outlineStyle={{ borderRadius: 8 }}
            />
            <TextInput
              label="Umur"
              mode="outlined"
              value={age}
              onChangeText={setAge}
              placeholder="Misal: 25 tahun"
              style={styles.input}
              outlineStyle={{ borderRadius: 8 }}
            />
            <TextInput
              label="No. Telepon"
              mode="outlined"
              value={phone}
              onChangeText={setPhone}
              placeholder="08xxx"
              style={styles.input}
              outlineStyle={{ borderRadius: 8 }}
            />
            <TextInput
              label="Usia Kehamilan"
              mode="outlined"
              value={pregnancyAge}
              onChangeText={setPregnancyAge}
              placeholder="2 Minggu"
              style={styles.input}
              outlineStyle={{ borderRadius: 8 }}
            />
            <TextInput
              label="Perkiraan Lahir"
              mode="outlined"
              value={expectedBirthdate}
              onChangeText={setExpectedBirthdate}
              placeholder="Misal: 14 Jul 2025"
              style={styles.input}
              outlineStyle={{ borderRadius: 8 }}
            />
            <TextInput
              label="Alamat"
              mode="outlined"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              outlineStyle={{ borderRadius: 8 }}
              multiline
            />
            <TextInput
              label="Catatan"
              mode="outlined"
              value={note}
              onChangeText={setNote}
              style={styles.input}
              outlineStyle={{ borderRadius: 8 }}
              multiline
            />
            <Button
              mode="contained"
              disabled={disabledButton}
              onPress={handleSave}
              contentStyle={{ height: 50 }}
              style={styles.saveButton}
            >
              Simpan
            </Button>
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
}

const styles = StyleSheet.create({
  imageEmpty: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#aaa',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageButton: {
    borderRadius: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    minHeight: 50,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 8,
    marginBottom: 30,
  },
})
