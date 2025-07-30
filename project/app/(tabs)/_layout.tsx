import { Tabs } from 'expo-router';
import { Chrome as Home, Calculator, TrendingUp, Calendar, Map, Network } from 'lucide-react-native';
import { UserProvider } from '@/contexts/UserContext';

export default function TabLayout() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chiffres"
          options={{
            title: 'Mes Chiffres',
            tabBarIcon: ({ size, color }) => (
              <Calculator size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="historique"
          options={{
            title: 'Historique',
            tabBarIcon: ({ size, color }) => (
              <TrendingUp size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="planning"
          options={{
            title: 'Planning',
            tabBarIcon: ({ size, color }) => (
              <Calendar size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cartes"
          options={{
            title: 'Mes Cartes',
            tabBarIcon: ({ size, color }) => (
              <Map size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reseau"
          options={{
            title: 'Mon Réseau',
            tabBarIcon: ({ size, color }) => (
              <Network size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
}