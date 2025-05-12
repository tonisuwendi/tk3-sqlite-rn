import { useCallback, useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuth, useSSO } from '@clerk/clerk-expo';
import { Redirect, useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser()

  const { startSSOFlow } = useSSO();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri({
          native: 'mamoriaapp://sso-callback'
        }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
        await supabase.auth.signInAnonymously();
        router.replace('/maps');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      console.error(err.message)
    }
  }, [router, startSSOFlow]);

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text variant="titleLarge" style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    )
  }

  if (isSignedIn) {
    return <Redirect href="/maps" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/illustration.jpg')}
        style={styles.image}
      />
      <Text variant="titleLarge">Halo, Mama!</Text>
      <Text variant="bodyMedium" style={styles.description}>
        Aplikasi pencatatan ibu hamil yang memudahkan pemantauan kehamilan, kapan saja dan di mana saja.
      </Text>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={onPress}
      >
        <Image
          source={require('@/assets/images/google.png')}
          style={{ width: 16, height: 16 }}
        />
        <Text>
          Login dengan Google
        </Text>
      </TouchableOpacity>
      <Snackbar
        visible={!!errorMsg}
        onDismiss={() => setErrorMsg('')}
      >
        {errorMsg}
      </Snackbar>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: '80%',
    height: 'auto',
    aspectRatio: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
  },
  googleButton: {
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
