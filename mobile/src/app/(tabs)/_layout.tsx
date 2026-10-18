import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import Logo from '@/components/Logo';
import { useCart } from '@/context/CartContext';
import { colors, fonts } from '@/theme';

export default function TabLayout() {
  const { count } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.gray600,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.gray100 },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
        sceneStyle: { backgroundColor: colors.white },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitleAlign: 'left',
          headerTitle: () => <Logo />,
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'watch' : 'watch-outline'} size={22} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: count > 0 ? (count > 99 ? '99+' : count) : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.accent, color: colors.ink, fontFamily: fonts.bold, fontSize: 11 },
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'bag-handle' : 'bag-handle-outline'} size={22} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
