import { View, Text, StyleSheet } from 'react-native';

export default function AskScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🩺</Text>
      <Text style={styles.title}>Ask a Vet</Text>
      <Text style={styles.desc}>Select a pet and describe what's happening. A qualified vet will respond shortly.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F6', justifyContent: 'center', alignItems: 'center', padding: 24 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  desc: { fontSize: 14, color: '#6B7C8D', textAlign: 'center', lineHeight: 20 },
});
