import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuthStore } from '../../src/lib/store';

export default function PetsScreen() {
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.emptyTitle}>No pets yet</Text>
      <Text style={styles.emptyDesc}>Add your first pet to get started with vet consultations, reminders, and more.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F6', justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#6B7C8D', textAlign: 'center', lineHeight: 20 },
});
