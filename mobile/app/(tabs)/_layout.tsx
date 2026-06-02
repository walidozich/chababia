import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors, typography } from '../../src/design-system';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.canvasSoft },
        headerTitleStyle: { ...typography.bodySmStrong, color: colors.ink },
        tabBarActiveTintColor: colors.onPrimary,
        tabBarInactiveTintColor: colors.mute,
        tabBarActiveBackgroundColor: colors.primary,
        tabBarInactiveBackgroundColor: colors.canvas,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: typography.caption,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Opportunités',
          headerTitle: 'Chababia',
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Mes billets',
          headerTitle: 'Mes billets',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          headerTitle: 'Paramètres',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.canvas,
    borderTopColor: colors.canvasSoft,
    paddingTop: 4,
    height: 56,
  },
  tabBarItem: {
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    paddingVertical: 4,
  },
});
