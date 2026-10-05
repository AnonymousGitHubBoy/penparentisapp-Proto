// App.js — five tabs; Brainstorm sits center and raised, and is its own
// small stack (a landing screen, then a dedicated full-screen typer).

import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import SalonsScreen from './screens/SalonsScreen';
import BrainstormHomeScreen from './screens/BrainstormHomeScreen';
import BrainstormWriterScreen from './screens/BrainstormWriterScreen';
import CommunitiesScreen from './screens/CommunitiesScreen';
import Sheet from './components/Sheet';
import { colors, gradients, lift } from './theme';
import { DONORS, CREDITS } from './donors';

const Tabs = createMaterialTopTabNavigator();
const BrainstormStackNav = createNativeStackNavigator();

const ICONS = {
  Home: 'book',
  Events: 'calendar',
  Salons: 'play-circle',
  Communities: 'chatbubbles',
};

function BrainstormStack() {
  return (
    <BrainstormStackNav.Navigator screenOptions={{ headerShown: false }}>
      <BrainstormStackNav.Screen name="BrainstormHome" component={BrainstormHomeScreen} />
      <BrainstormStackNav.Screen name="BrainstormWriter" component={BrainstormWriterScreen} />
    </BrainstormStackNav.Navigator>
  );
}

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
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'Brainstorm') {
            return (
              <LinearGradient colors={gradients.button} style={s.centerIcon}>
                <Ionicons name="pencil" size={22} color="#fff" />
              </LinearGradient>
            );
          }
          return <Ionicons name={ICONS[route.name]} size={focused ? 23 : 21} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '600', textTransform: 'none', marginTop: 2 },
        tabBarStyle: { backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line, elevation: 0 },
        tabBarIndicatorStyle: {
          backgroundColor: colors.royalDeep, height: 3, borderRadius: 3, width: 26, marginLeft: '6%', top: 0,
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Events" component={EventsScreen} />
      <Tabs.Screen name="Brainstorm" component={BrainstormStack} />
      <Tabs.Screen name="Salons" component={SalonsScreen} />
      <Tabs.Screen name="Communities" component={CommunitiesScreen} />
    </Tabs.Navigator>
  );
}

function InfoButton({ onPress }) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable onPress={onPress} hitSlop={10} style={[s.infoBtn, { top: insets.top + 8 }]}>
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

        <Sheet
          visible={infoOpen}
          onClose={() => setInfoOpen(false)}
          title="About this app"
          subtitle="Pen Parentis is a 501(c)(3) literary nonprofit"
        >
          <Text style={s.lede}>This app is a thank-you gift, built by and for this community.</Text>
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
  centerIcon: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    marginTop: -18,
    borderWidth: 3, borderColor: colors.paper,
    shadowColor: colors.royalDeep, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 6,
  },
  lede: { fontSize: 13.5, lineHeight: 20, color: colors.body, marginBottom: 18 },
  h: { fontSize: 13, fontWeight: '700', color: colors.ink, marginBottom: 10, marginTop: 4 },
  donorWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { backgroundColor: '#fff', borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 },
  chipText: { fontSize: 12, color: colors.body },
  credit: { fontSize: 13, color: colors.body, marginBottom: 4 },
});