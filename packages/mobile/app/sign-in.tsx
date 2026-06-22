import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/lib/store';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    if (data.user && data.session) {
      setAuth(data.user, data.user.user_metadata?.role as any, data.session.access_token);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to PetCare 24/7</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <Link href="/sign-up" style={styles.link}>
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F9F9F6' },
  title: { fontSize: 28, fontWeight: '800', color: '#2C3E50', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7C8D', textAlign: 'center', marginBottom: 32 },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E0E6E8',
    borderRadius: 12, padding: 14, fontSize: 16, color: '#2C3E50',
  },
  button: {
    backgroundColor: '#4A9E8E', borderRadius: 9999, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#4A9E8E', fontSize: 14 },
});
