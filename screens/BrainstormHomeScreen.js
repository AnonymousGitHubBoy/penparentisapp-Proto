// screens/BrainstormHomeScreen.js — the landing screen: goal, progress, this
// week's numbers, and a button into the dedicated writing screen.

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Screen, Header, Button } from '../components/ui';
import Sheet from '../components/Sheet';
import { colors, gradients, lift, radius, space } from '../theme';

const GOAL_KEY = 'pp.goal.v1';
const PROGRESS_KEY = 'pp.progress.v2';
const TIME_KEY = 'pp.time.v1';
const CHECKINS_KEY = 'pp.checkins.v1';

function startOfWeek() {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() + ((day === 0 ? -6 : 1) - day));
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function BrainstormHomeScreen({ navigation }) {
  const [goal, setGoal] = useState(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [pickedType, setPickedType] = useState(null);
  const [wordTargetInput, setWordTargetInput] = useState('');
  const [timeTargetInput, setTimeTargetInput] = useState('');

  const [cumulativeWords, setCumulativeWords] = useState(0);
  const [cumulativeMinutes, setCumulativeMinutes] = useState(0);
  const [checkins, setCheckins] = useState([]);

  // Reloads every time this screen regains focus — e.g. coming back from a
  // writing session — so these numbers are never left stale.
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const g = await AsyncStorage.getItem(GOAL_KEY);
        if (g) setGoal(JSON.parse(g));
        else setSetupOpen(true);

        const p = await AsyncStorage.getItem(PROGRESS_KEY);
        if (p) {
          const saved = JSON.parse(p);
          setCumulativeWords(saved.weekStart === startOfWeek() ? saved.words || 0 : 0);
        }
        const t = await AsyncStorage.getItem(TIME_KEY);
        if (t) {
          const saved = JSON.parse(t);
          setCumulativeMinutes(saved.weekStart === startOfWeek() ? saved.minutes || 0 : 0);
        }
        const c = await AsyncStorage.getItem(CHECKINS_KEY);
        if (c) setCheckins(JSON.parse(c));
      })();
    }, [])
  );

  function openGoalSetup() {
    setSetupStep(1);
    setSetupOpen(true);
  }

  function saveGoal() {
    const g = {
      type: pickedType,
      wordTarget: pickedType !== 'time' ? Number(wordTargetInput) || 0 : undefined,
      timeTarget: pickedType !== 'word' ? Number(timeTargetInput) || 0 : undefined,
    };
    setGoal(g);
    AsyncStorage.setItem(GOAL_KEY, JSON.stringify(g));
    setSetupOpen(false);
  }

  function pct() {
    if (!goal) return 0;
    if (goal.type === 'word') return goal.wordTarget ? Math.round((cumulativeWords / goal.wordTarget) * 100) : 0;
    if (goal.type === 'time') return goal.timeTarget ? Math.round((cumulativeMinutes / goal.timeTarget) * 100) : 0;
    const wPct = goal.wordTarget ? cumulativeWords / goal.wordTarget : 0;
    const tPct = goal.timeTarget ? cumulativeMinutes / goal.timeTarget : 0;
    return Math.round(((wPct + tPct) / 2) * 100);
  }

  const todayStr = new Date().toDateString();
  const todayCheckin = checkins.find((c) => new Date(c.date).toDateString() === todayStr);
  const weekCount = checkins.filter((c) => new Date(c.date).getTime() >= startOfWeek()).length;

  return (
    <Screen>
      <Header title="Brainstorm" subtitle="Small goals, kept quietly" />
      <View style={s.pad}>
        {goal && (
          <LinearGradient colors={gradients.header} style={[s.goal, lift]}>
            <Text style={s.goalLabel}>
              {goal.type === 'word' && `Goal: ${goal.wordTarget.toLocaleString()} words`}
              {goal.type === 'time' && `Goal: ${goal.timeTarget} minutes`}
              {goal.type === 'both' && `Goal: ${goal.wordTarget.toLocaleString()} words & ${goal.timeTarget} minutes`}
            </Text>
            <Text style={s.big}>{Math.min(999, pct())}%</Text>
            <View style={s.track}>
              <LinearGradient colors={gradients.gold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.fill, { width: `${Math.min(100, pct())}%` }]} />
            </View>
            <Pressable onPress={openGoalSetup}><Text style={s.editGoal}>Change goal</Text></Pressable>
          </LinearGradient>
        )}

        <Button label="Start writing" onPress={() => navigation.navigate('BrainstormWriter')} />

        <Text style={s.h}>This week</Text>
        <View style={[s.logCard, lift]}>
          <Text style={s.logLine}>{cumulativeWords.toLocaleString()} words written, counting ones you deleted</Text>
          <Text style={s.logLine}>{cumulativeMinutes} minutes logged</Text>
          <Text style={s.logLine}>{weekCount} check-in{weekCount === 1 ? '' : 's'}</Text>
          {todayCheckin && <Text style={s.logLine}>Today: {todayCheckin.outcome}</Text>}
        </View>
      </View>

      <Sheet visible={setupOpen} onClose={() => goal && setSetupOpen(false)} title={setupStep === 1 ? "What's your goal?" : 'How much?'}>
        {setupStep === 1 && (
          <View style={{ gap: 10 }}>
            {[
              { k: 'word', label: 'Words', sub: 'A target word count' },
              { k: 'time', label: 'Time', sub: 'A target number of minutes' },
              { k: 'both', label: 'Both', sub: 'Words and time together' },
            ].map((o) => (
              <Pressable key={o.k} style={[s.optCard, lift]} onPress={() => { setPickedType(o.k); setSetupStep(2); }}>
                <Text style={s.optLabel}>{o.label}</Text>
                <Text style={s.optSub}>{o.sub}</Text>
              </Pressable>
            ))}
            <View style={[s.optCard, s.optDisabled]}>
              <Text style={s.optLabel}>Sessions <Text style={s.soon}>· soon</Text></Text>
              <Text style={s.optSub}>How many times you sit down to write — coming with the full timer piece</Text>
            </View>
          </View>
        )}
        {setupStep === 2 && (
          <View>
            {pickedType !== 'time' && (
              <>
                <Text style={s.inputLabel}>How many words?</Text>
                <TextInput value={wordTargetInput} onChangeText={setWordTargetInput} keyboardType="number-pad" placeholder="e.g. 3000" style={s.input} />
              </>
            )}
            {pickedType !== 'word' && (
              <>
                <Text style={s.inputLabel}>How many minutes?</Text>
                <TextInput value={timeTargetInput} onChangeText={setTimeTargetInput} keyboardType="number-pad" placeholder="e.g. 90" style={s.input} />
              </>
            )}
            <Button label="Set goal" onPress={saveGoal} />
          </View>
        )}
      </Sheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { padding: space.lg },
  goal: { borderRadius: radius.lg, padding: 20, marginBottom: space.md },
  goalLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12.5, marginBottom: 6 },
  big: { color: '#fff', fontSize: 38, fontWeight: '700' },
  track: { height: 13, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 12, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  editGoal: { color: colors.cream, fontSize: 12, fontWeight: '600', textDecorationLine: 'underline' },
  h: { fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: space.md, marginBottom: space.sm },
  logCard: { backgroundColor: '#fff', borderRadius: radius.md, padding: 14 },
  logLine: { fontSize: 13, color: colors.body, marginBottom: 4 },
  optCard: { backgroundColor: '#fff', borderRadius: radius.md, padding: 14 },
  optDisabled: { opacity: 0.55 },
  optLabel: { fontSize: 14.5, fontWeight: '700', color: colors.ink },
  optSub: { fontSize: 12, color: colors.muted, marginTop: 3 },
  soon: { color: colors.karma, fontWeight: '600' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.ink, marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 12, fontSize: 15, marginBottom: 6 },
});