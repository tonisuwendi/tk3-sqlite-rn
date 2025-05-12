import { useCallback, useState } from 'react'
import { StyleSheet, View, Image, ScrollView } from 'react-native'
import { Appbar, Button, Snackbar, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@clerk/clerk-expo';
import { createFileUrl } from '@/utils/helpers';

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
  const { userId } = useAuth();

  const handleGetMama = async (_id: number) => {
    const { data } = await supabase.from('mamas').select('*').eq('id', _id).single();
    if (data) {
      setName(data.name);
      setAge(data.age);
      setPhone(data.phone);
      setPregnancyAge(data.pregnancy_age);
      setExpectedBirthdate(data.expected_birthdate);
      setAddress(data.address);
      setNote(data.note);
      setPhoto(createFileUrl(data.photo));
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
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
      setSnackbarMsg('Terjadi kesalahan saat memilih foto');
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

    try {
      setDisabledButton(true);

      let photoPath = null;

      if (photo?.startsWith('file://')) {
        const response = await fetch(photo);
        const blob = await response.blob();
        const user = await supabase.auth.getUser();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const upload = await supabase.storage.from('mamas').upload(`${user.data.user?.id}/${Date.now()}.jpg`, arrayBuffer, { contentType: 'image/jpeg', upsert: false });

        if (upload.error) {
          throw upload.error;
        }

        photoPath = upload.data?.path;
      } else {
        photoPath = photo;
      }

      const payload = {
        user_id: userId,
        name,
        age,
        phone,
        pregnancy_age: pregnancyAge,
        expected_birthdate: expectedBirthdate,
        address,
        note,
        photo: photoPath,
      };

      if (id) {
        await supabase.from('mamas').update(payload).eq('id', id);
      } else {
        await supabase.from('mamas').insert(payload);
      }

      setSnackbarMsg('Berhasil menyimpan data mama');
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.error('Error saving mama:', error);
      setSnackbarMsg('Terjadi kesalahan saat menyimpan data mama');
      setDisabledButton(false);
    }
  };

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
    backgroundColor: '#ddd',
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
