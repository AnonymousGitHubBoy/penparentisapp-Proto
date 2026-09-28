// screens/UnlockScreen.js
//
// This replaces a login screen. There is no email/password, no account,
// no "forgot password" flow — just a code from the thank-you email.
// Once verified, the phone remembers it (AsyncStorage) and never asks again.
//
// Wire this in by checking AsyncStorage('pp.unlocked') before <App /> renders
// the tab navigator — see the note at the bottom of this file.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, gradients, space, radius } from '../theme';
import { LINKS } from '../links';
import { openLink } from '../components/ui';

// Points at your small backend. See BACKEND-NOTES.md for what this looks like.
const VERIFY_URL = 'https://your-project.supabase.co/functions/v1/verify-code';

export default function UnlockScreen({ onUnlocked }) {
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  async function redeem() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setChecking(true);
    setError('');
    try {
      const res = await fetch(VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();
      if (data.valid) {
        await AsyncStorage.setItem('pp.unlocked', 'true');
        onUnlocked();
      } else {
        setError("That code didn't match. Check the email and try again.");
      }
    } catch (e) {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <LinearGradient colors={gradients.header} style={s.fill}>
      <KeyboardAvoidingView
        style={s.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.pad}>
          <Text style={s.word}>Pen Parentis</Text>
          <Text style={s.tag}>parenting done, write.</Text>

          <Text style={s.h1}>This app is a gift{'\n'}for our donors.</Text>
          <Text style={s.p}>
            Enter the code from your thank-you email to unlock it. No account,
            no password — just this, once.
          </Text>

          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="WRITE-XXXX"
            placeholderTextColor="rgba(255,255,255,0.45)"
            autoCapitalize="characters"
            autoCorrect={false}
            style={s.input}
            onSubmitEditing={redeem}
          />
          {error ? <Text style={s.error}>{error}</Text> : null}

          <Pressable
            onPress={redeem}
            disabled={checking || !code.trim()}
            style={({ pressed }) => [
              s.btn,
              (checking || !code.trim()) && s.btnDisabled,
              pressed && { opacity: 0.9 },
            ]}
          >
            {checking ? (
              <ActivityIndicator color={colors.royalDeep} />
            ) : (
              <Text style={s.btnText}>Unlock</Text>
            )}
          </Pressable>

          <Pressable onPress={() => openLink(LINKS.donate)} style={s.donateRow}>
            <Text style={s.donateText}>
              Haven't given yet? <Text style={s.donateLink}>Donate to get a code</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1 },
  pad: { flex: 1, justifyContent: 'center', paddingHorizontal: space.xl },
  word: { fontSize: 28, fontWeight: '700', color: '#fff' },
  tag: { fontSize: 12.5, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: 4, marginBottom: 34 },
  h1: { fontSize: 24, fontWeight: '700', color: '#fff', lineHeight: 31, marginBottom: 12 },
  p: { fontSize: 13.5, color: 'rgba(255,255,255,0.82)', lineHeight: 20, marginBottom: 26 },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    letterSpacing: 2,
    color: '#fff',
    marginBottom: 10,
  },
  error: { color: colors.karmaLight, fontSize: 12.5, marginBottom: 10 },
  btn: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: colors.royalDeep, fontWeight: '700', fontSize: 14.5 },
  donateRow: { marginTop: 22, alignItems: 'center' },
  donateText: { color: 'rgba(255,255,255,0.7)', fontSize: 12.5 },
  donateLink: { color: colors.cream, fontWeight: '700', textDecorationLine: 'underline' },
});

/*
  WIRING THIS INTO App.js
  ------------------------
  At the top of App.js, before rendering <Tabs.Navigator>, check the stored flag:

    const [unlocked, setUnlocked] = useState(null); // null = still checking
    useEffect(() => {
      AsyncStorage.getItem('pp.unlocked').then(v => setUnlocked(v === 'true'));
    }, []);

    if (unlocked === null) return null; // or a splash screen
    if (!unlocked) return <UnlockScreen onUnlocked={() => setUnlocked(true)} />;
    // ...otherwise render the tab navigator as before
*/
