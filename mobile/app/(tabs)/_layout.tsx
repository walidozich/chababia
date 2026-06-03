import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { typography } from '@/src/design-system';
import { useTheme } from '@/src/theme/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBg,
          borderTopColor: colors.tabBorder,
          borderTopWidth: 1,
          paddingTop: Platform.OS === 'ios' ? 4 : 6,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarLabelStyle: {
          ...typography['body-sm-strong'],
          fontSize: 11,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Opportunités', tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} /> }} />
      <Tabs.Screen name="tickets" options={{ title: 'Mes billets', tabBarIcon: ({ color }) => <IconSymbol size={24} name="ticket.fill" color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Paramètres', tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape.fill" color={color} /> }} />
    </Tabs>
  );
}
