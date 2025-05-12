import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function MapsScreen() {
  const mapRef = useRef<MapView | null>(null);
  const router = useRouter();
  const { colors } = useTheme();

  const [location, setLocation] = useState<Region | null>(null);
  const [address, setAddress] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  const requestLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }

      setPermissionDenied(false);

      const currentLocation = await Location.getCurrentPositionAsync({});
      const region: Region = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(region);
      mapRef.current?.animateToRegion(region, 1000);

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: region.latitude,
        longitude: region.longitude,
      });

      if (reverseGeocode.length > 0) {
        const { district, subregion, city, region: provinsi, postalCode } = reverseGeocode[0];
        const fullAddress = [district, city, subregion, provinsi].join(', ') + ` - ${postalCode}`;
        setAddress(fullAddress);
      }

    } catch (error: any) {
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat mendapatkan lokasi Anda. Pastikan GPS Anda aktif dan coba lagi.',
        [{ text: 'OK', onPress: () => setPermissionDenied(true) }]
      );
      console.error('Error getting location:', error);
      setPermissionDenied(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={{ marginTop: 10 }}>Memuat lokasi Anda...</Text>
      </SafeAreaView>
    );
  }

  if (permissionDenied) {
    return (
      <SafeAreaView style={styles.center}>
        <Text variant="bodyMedium" style={[styles.warning, { color: colors.error }]}>
          Untuk menggunakan aplikasi ini, Anda harus mengizinkan akses lokasi.
        </Text>
        <Button
          mode="contained"
          contentStyle={{ height: 50 }}
          style={{ borderRadius: 8 }}
          onPress={requestLocation}
        >
          Coba Lagi
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {location && (
        <>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={location}
            showsUserLocation
            showsMyLocationButton
            provider={PROVIDER_GOOGLE}
          >
            <Marker coordinate={location} />
          </MapView>

          <View style={styles.bottomContainer}>
            <Text variant="titleMedium">Alamat Saya:</Text>
            <Text variant="bodyMedium" style={{ marginBottom: 20, marginTop: 5 }}>
              {address || 'Tidak ditemukan'}
            </Text>
            <Button
              mode="contained"
              contentStyle={{ height: 50 }}
              style={{ borderRadius: 8 }}
              onPress={() => router.push('/home')}
            >
              Lanjut ke Home
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  warning: {
    textAlign: 'center',
    marginBottom: 20,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
});
