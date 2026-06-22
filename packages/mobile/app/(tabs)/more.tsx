import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const menuItems = [
  { title: 'Symptom Checker', icon: '🔍', route: '/symptom-checker' },
  { title: 'Poison Lookup', icon: '⚠️', route: '/poison-lookup' },
  { title: 'Emergency Vet Finder', icon: '📍', route: '/emergency-finder' },
  { title: 'Medical Records', icon: '📋', route: '/records' },
  { title: 'Reminders', icon: '⏰', route: '/reminders' },
  { title: 'Community', icon: '💬', route: '/community' },
  { title: 'Local Services', icon: '🔧', route: '/services' },
  { title: 'Telehealth', icon: '📹', route: '/telehealth' },
  { title: 'Pet-Friendly Places', icon: '🐕', route: '/pet-friendly' },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {menuItems.map((item) => (
        <TouchableOpacity key={item.title} style={styles.menuItem} onPress={() => router.push(item.route)}>
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F6' },
  content: { padding: 16 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 16, borderRadius: 12, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  menuIcon: { fontSize: 24, marginRight: 12 },
  menuTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  chevron: { fontSize: 24, color: '#A0AEBF' },
});
