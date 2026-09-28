import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen, Header, Button } from '../components/ui';
import { colors, gradients, lift, radius, space } from '../theme';

const GOAL = 3000;
const KEY = 'pp.progress.v1';

// Rewards fire on their own when a threshold is crossed. Nothing to claim.
const REWARDS = [
  { at: 500, title: 'First 500', body: 'Five hundred words in. That is the hard part done.' },
  { at: 2260, title: 'Yay — you did it!', body: 'Ten thousand words since you joined. A novella\u2019s worth of early mornings.' },
  { at: GOAL, title: 'Week complete', body: 'You hit the goal you set. Rest it, or keep going.' },
];

export default function BrainstormScreen() {
  const [words, setWords] = useState(1840);
  const [earned, setEarned] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (!raw) return;
      const saved = JSON.parse(raw);
      setWords(saved.words ?? 1840);
      setEarned(saved.earned ?? []);
    });
  }, []);

  function save(w, e) {
    AsyncStorage.setItem(KEY, JSON.stringify({ words: w, earned: e }));
  }

  function log(amount = 420) {
    const next = words + amount;
    let nextEarned = earned;
    REWARDS.forEach((r) => {
      if (words < r.at && next >= r.at && !earned.includes(r.title)) {
        nextEarned = [...nextEarned, r.title];
        setTimeout(() => Alert.alert(r.title, r.body), 400);
      }
    });
    setWords(next);
    setEarned(nextEarned);
    save(next, nextEarned);
  }

  const pct = Math.min(100, Math.round((words / GOAL) * 100));

  return (
    <Screen>
      <Header title="Write" subtitle="Small goals, kept quietly" />
      <View style={s.pad}>
        <LinearGradient colors={gradients.header} style={[s.goal, lift]}>
          <Text style={s.big}>
            {words.toLocaleString()}
            <Text style={s.small}>  / {GOAL.toLocaleString()} words this week</Text>
          </Text>
          <View style={s.track}>
            <LinearGradient
              colors={gradients.gold}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[s.fill, { width: `${pct}%` }]}
            />
          </View>
          <Text style={s.streak}>Six days in a row. You have never gone past eight.</Text>
        </LinearGradient>

        <Button label="Log today's words" onPress={() => log()} />

        <Text style={s.h}>Earned so far</Text>
        <View style={s.badges}>
          {REWARDS.map((r) => (
            <View key={r.title} style={[s.badge, earned.includes(r.title) && s.badgeOn]}>
              <Text style={[s.badgeText, earned.includes(r.title) && s.badgeTextOn]}>{r.title}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { padding: space.lg },
  goal: { borderRadius: radius.lg, padding: 20, marginBottom: space.md },
  big: { color: '#fff', fontSize: 38, fontWeight: '700' },
  small: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.72)' },
  track: { height: 13, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 14, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  streak: { color: 'rgba(255,255,255,0.82)', fontSize: 12.5 },
  h: { fontSize: 17, fontWeight: '700', color: colors.ink, marginTop: space.md, marginBottom: space.sm },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 11 },
  badgeOn: { borderStyle: 'solid', borderColor: colors.karma, backgroundColor: colors.cream },
  badgeText: { fontSize: 11, color: colors.muted },
  badgeTextOn: { color: '#6B4D0E', fontWeight: '700' },
});
