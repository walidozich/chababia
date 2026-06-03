import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors, typography } from '@/src/design-system';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.ink,
        tabBarStyle: {
          backgroundColor: colors.canvas,
          borderTopColor: colors.ink,
          borderTopWidth: 1,
          paddingTop: Platform.OS === 'ios' ? 0 : 6,
        },
        tabBarLabelStyle: {
          ...typography['body-sm-strong'],
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Opportunités',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Mes billets',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="ticket.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
