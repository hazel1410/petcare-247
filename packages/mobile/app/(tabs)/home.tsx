import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/lib/store';
import { supabase } from '../../src/lib/supabase';

export default function HomeScreen() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuth();
    router.replace('/sign-in');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hello, {user?.user_metadata?.name ?? 'there'}!</Text>
      <Text style={styles.subtitle}>How can we help your pet today?</Text>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/ask')}>
          <Text style={styles.actionEmoji}>🩺</Text>
          <Text style={styles.actionTitle}>Ask a Vet</Text>
          <Text style={styles.actionDesc}>Get help now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/symptom-checker')}>
          <Text style={styles.actionEmoji}>🔍</Text>
          <Text style={styles.actionTitle}>Symptom Check</Text>
          <Text style={styles.actionDesc}>Check symptoms</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/emergency-finder')}>
          <Text style={styles.actionEmoji}>📍</Text>
          <Text style={styles.actionTitle}>Emergency Vet</Text>
          <Text style={styles.actionDesc}>Find nearby</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/poison-lookup')}>
          <Text style={styles.actionEmoji}>⚠️</Text>
          <Text style={styles.actionTitle}>Poison Check</Text>
          <Text style={styles.actionDesc}>Food safety</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F6' },
  content: { padding: 20 },
  greeting: { fontSize: 26, fontWeight: '800', color: '#2C3E50', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6B7C8D', marginBottom: 24 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    width: '47%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 2, elevation: 1,
  },
  actionEmoji: { fontSize: 32, marginBottom: 8 },
  actionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
  actionDesc: { fontSize: 13, color: '#6B7C8D', marginTop: 2 },
  signOut: { marginTop: 40, alignItems: 'center' },
  signOutText: { color: '#6B7C8D', fontSize: 14 },
});
