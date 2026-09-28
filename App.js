// App.js — the foundation, plus US 7: a global Info button.
//
// The Info button sits OUTSIDE the tab navigator, layered on top of it in a
// plain View. That's deliberate: it needs to show on every tab without being
// pasted into five separate screen files. One button, one place to maintain.

import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import SalonsScreen from './screens/SalonsScreen';
import BrainstormScreen from './screens/BrainstormScreen';
import CommunitiesScreen from './screens/CommunitiesScreen';
import Sheet from './components/Sheet';
import { colors, lift } from './theme';
import { DONORS, CREDITS } from './donors';

const Tabs = createMaterialTopTabNavigator();

// Button labels here match the backlog's user-story titles on purpose —
// Communities / Events / Salons / Brainstorm — so a tester can trace a
// screen back to its US number just by reading the tab.
const ICONS = {
  Home: 'book',
  Events: 'calendar',
  Salons: 'play-circle',
  Brainstorm: 'bulb',
  Communities: 'chatbubbles',
};

function TabNavigator() {
  return (
    <Tabs.Navigator
      tabBarPosition="bottom"
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        swipeEnabled: true,
        tabBarShowIcon: true,
        tabBarActiveTintColor: colors.royalDeep,
        tabBarInactiveTintColor: colors.tabIdle,
        tabBarPressColor: 'rgba(27,63,160,0.08)',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={ICONS[route.name]} size={focused ? 23 : 21} color={color} />
        ),
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '600', textTransform: 'none', marginTop: 2 },
        tabBarStyle: { backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line, elevation: 0 },
        tabBarIndicatorStyle: {
          backgroundColor: colors.royalDeep, height: 3, borderRadius: 3, width: 26, marginLeft: '6%', top: 0,
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Events" component={EventsScreen} />
      <Tabs.Screen name="Salons" component={SalonsScreen} />
      <Tabs.Screen name="Brainstorm" component={BrainstormScreen} />
      <Tabs.Screen name="Communities" component={CommunitiesScreen} />
    </Tabs.Navigator>
  );
}

function InfoButton({ onPress }) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={[s.infoBtn, { top: insets.top + 8 }]}
    >
      <Text style={s.infoBtnText}>i</Text>
    </Pressable>
  );
}

export default function App() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <View style={{ flex: 1 }}>
          <TabNavigator />
          <InfoButton onPress={() => setInfoOpen(true)} />
        </View>

        {/* US 7: donor list + credits, reached from the Info button. */}
        <Sheet
          visible={infoOpen}
          onClose={() => setInfoOpen(false)}
          title="About this app"
          subtitle="Pen Parentis is a 501(c)(3) literary nonprofit"
        >
          <Text style={s.lede}>
            This app is a thank-you gift, built by and for this community.
          </Text>

          <Text style={s.h}>Thank you to our donors</Text>
          <View style={s.donorWrap}>
            {DONORS.map((d) => (
              <View key={d} style={[s.chip, lift]}>
                <Text style={s.chipText}>{d}</Text>
              </View>
            ))}
          </View>

          <Text style={s.h}>Design &amp; development</Text>
          {CREDITS.map((c) => (
            <Text key={c.role} style={s.credit}>{c.role}: {c.name}</Text>
          ))}
        </Sheet>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  infoBtn: {
    position: 'absolute', right: 14,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(10,22,51,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  infoBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', fontStyle: 'italic' },
  lede: { fontSize: 13.5, lineHeight: 20, color: colors.body, marginBottom: 18 },
  h: { fontSize: 13, fontWeight: '700', color: colors.ink, marginBottom: 10, marginTop: 4 },
  donorWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { backgroundColor: '#fff', borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 },
  chipText: { fontSize: 12, color: colors.body },
  credit: { fontSize: 13, color: colors.body, marginBottom: 4 },
});
