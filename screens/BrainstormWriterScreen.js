// screens/BrainstormWriterScreen.js — "a typer": minimal chrome, full-screen,
// a fresh stopwatch each time you enter, nothing between you and the page.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sheet from '../components/Sheet';
import { colors, lift, radius, space } from '../theme';

const GOAL_KEY = 'pp.goal.v1';
const PROGRESS_KEY = 'pp.progress.v2';
const TIME_KEY = 'pp.time.v1';
const CHECKINS_KEY = 'pp.checkins.v1';

const OUTCOMES = ['Exceeded', 'Met', 'Some of it', 'None of it', 'Something came up'];

function countWords(text) {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

function startOfWeek() {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() + ((day === 0 ? -6 : 1) - day));
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function BrainstormWriterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [seconds, setSeconds] = useState(0);
  const highestThisEntry = useRef(0);
  const [cumulativeWords, setCumulativeWords] = useState(0);
  const [goal, setGoal] = useState(null);
  const [checkInOpen, setCheckInOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const g = await AsyncStorage.getItem(GOAL_KEY);
      if (g) setGoal(JSON.parse(g));
      const p = await AsyncStorage.getItem(PROGRESS_KEY);
      if (p) {
        const saved = JSON.parse(p);
        setCumulativeWords(saved.weekStart === startOfWeek() ? saved.words || 0 : 0);
      }
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  function onChangeText(t) {
    setText(t);
    const words = countWords(t);
    if (words > highestThisEntry.current) {
      const delta = words - highestThisEntry.current;
      highestThisEntry.current = words;
      const next = cumulativeWords + delta;
      setCumulativeWords(next);
      AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify({ weekStart: startOfWeek(), words: next }));
    }
  }

  function pctNow() {
    if (!goal) return 0;
    const minutes = seconds / 60;
    if (goal.type === 'word') return goal.wordTarget ? Math.round((cumulativeWords / goal.wordTarget) * 100) : 0;
    if (goal.type === 'time') return goal.timeTarget ? Math.round((minutes / goal.timeTarget) * 100) : 0;
    const wPct = goal.wordTarget ? cumulativeWords / goal.wordTarget : 0;
    const tPct = goal.timeTarget ? minutes / goal.timeTarget : 0;
    return Math.round(((wPct + tPct) / 2) * 100);
  }

  async function finish() {
    const raw = await AsyncStorage.getItem(TIME_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    const prevMinutes = saved && saved.weekStart === startOfWeek() ? saved.minutes : 0;
    const nextMinutes = prevMinutes + Math.round(seconds / 60);
    await AsyncStorage.setItem(TIME_KEY, JSON.stringify({ weekStart: startOfWeek(), minutes: nextMinutes }));
    setCheckInOpen(true);
  }

  async function logOutcome(outcome) {
    const entry = { date: new Date().toISOString(), type: goal?.type, pct: pctNow(), outcome };
    const raw = await AsyncStorage.getItem(CHECKINS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify([entry, ...list]));
    setCheckInOpen(false);
    navigation.goBack();
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={s.close}>×</Text>
        </Pressable>
        <View style={s.statsInline}>
          <Text style={s.statText}>{countWords(text)} words</Text>
          <Text style={s.dotSep}>·</Text>
          <Text style={s.statText}>{mm}:{ss}</Text>
        </View>
      </View>

      <TextInput
        value={text}
        onChangeText={onChangeText}
        multiline
        autoFocus
        placeholder="Start typing…"
        placeholderTextColor={colors.muted}
        style={s.editor}
        textAlignVertical="top"
      />

      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable style={s.finishBtn} onPress={finish}>
          <Text style={s.finishText}>Finish &amp; check in</Text>
        </Pressable>
      </View>

      <Sheet visible={checkInOpen} onClose={() => setCheckInOpen(false)} title="How did it go?" subtitle={`You're at ${pctNow()}% of this goal`}>
        <View style={{ gap: 8 }}>
          {OUTCOMES.map((o) => (
            <Pressable key={o} style={[s.optCard, lift]} onPress={() => logOutcome(o)}>
              <Text style={s.optLabel}>{o}</Text>
            </Pressable>
          ))}
        </View>
      </Sheet>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingBottom: 10 },
  close: { fontSize: 28, color: colors.muted, lineHeight: 28 },
  statsInline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  dotSep: { color: colors.muted },
  editor: { flex: 1, paddingHorizontal: space.lg, fontSize: 17, lineHeight: 26, color: colors.ink },
  bottomBar: { paddingHorizontal: space.lg, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
  finishBtn: { backgroundColor: colors.royal, borderRadius: radius.md, paddingVertical: 15, alignItems: 'center' },
  finishText: { color: '#fff', fontWeight: '700', fontSize: 14.5 },
  optCard: { backgroundColor: '#fff', borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.line },
  optLabel: { fontSize: 14.5, fontWeight: '700', color: colors.ink },
});