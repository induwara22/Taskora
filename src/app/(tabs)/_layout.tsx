import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#64748B',
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Tasks',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons 
              name="checkbox-marked-circle-outline" 
              size={size} 
              color={typeof color === 'string' ? color : '#0EA5E9'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Record',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons 
              name="plus-box-outline" 
              size={size} 
              color={typeof color === 'string' ? color : '#0EA5E9'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}