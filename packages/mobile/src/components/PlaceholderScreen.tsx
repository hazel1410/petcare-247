import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function PlaceholderScreen({ title, emoji = '🚧', description }: { title?: string; emoji?: string; description?: string }) {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: title ?? 'Coming Soon' }} />
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title ?? 'Coming Soon'}</Text>
      <Text style={styles.desc}>
        {description ?? 'This feature is under development and will be available soon.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F6', justifyContent: 'center', alignItems: 'center', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  desc: { fontSize: 14, color: '#6B7C8D', textAlign: 'center', lineHeight: 20, maxWidth: 300 },
});
