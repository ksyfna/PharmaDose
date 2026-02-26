import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Platform } from 'react-native';
import { Baby, Activity, Syringe, Info } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 95 : 75,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 10,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: '#1F2937',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pediatric',
          tabBarIcon: ({ color }) => <Baby color={color} size={26} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}>
                    <Info size={24} color="#6B7280" />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Renal',
          tabBarIcon: ({ color }) => <Activity color={color} size={26} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Insulin',
          tabBarIcon: ({ color }) => <Syringe color={color} size={26} />,
        }}
      />
    </Tabs>
  );
}
