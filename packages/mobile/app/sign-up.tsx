import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/lib/store';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'vet'>('owner');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    if (data.user && data.session) {
      setAuth(data.user, role, data.session.access_token);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Check your email', 'We sent you a confirmation link.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Join PetCare 24/7</Text>
      <Text style={styles.subtitle}>Create your free account</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input} value={email} onChangeText={setEmail}
          placeholder="your@email.com" autoCapitalize="none" keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input} value={password} onChangeText={setPassword}
          placeholder="At least 8 characters" secureTextEntry
        />

        <Text style={styles.label}>I am a...</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'owner' && styles.roleBtnActive]}
            onPress={() => setRole('owner')}
          >
            <Text style={[styles.roleBtnText, role === 'owner' && styles.roleBtnTextActive]}>Pet Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'vet' && styles.roleBtnActive]}
            onPress={() => setRole('vet')}
          >
            <Text style={[styles.roleBtnText, role === 'vet' && styles.roleBtnTextActive]}>Veterinarian</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <Link href="/sign-in" style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F6' },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: '#2C3E50', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7C8D', textAlign: 'center', marginBottom: 32 },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E0E6E8',
    borderRadius: 12, padding: 14, fontSize: 16, color: '#2C3E50',
  },
  roleRow: { flexDirection: 'row', gap: 12 },
  roleBtn: {
    flex: 1, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#E0E6E8',
    alignItems: 'center', backgroundColor: '#FFFFFF',
  },
  roleBtnActive: { borderColor: '#4A9E8E', backgroundColor: '#F0F4F0' },
  roleBtnText: { fontSize: 14, fontWeight: '600', color: '#6B7C8D' },
  roleBtnTextActive: { color: '#4A9E8E' },
  button: {
    backgroundColor: '#4A9E8E', borderRadius: 9999, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#4A9E8E', fontSize: 14 },
});
