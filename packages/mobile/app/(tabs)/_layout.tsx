import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A9E8E',
        tabBarInactiveTintColor: '#A0AEBF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEF2F4',
          paddingTop: 4,
        },
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#2C3E50',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🐾</Text>,
        }}
      />
      <Tabs.Screen
        name="ask"
        options={{
          title: 'Ask a Vet',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🩺</Text>,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
