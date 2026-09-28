import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, Header, Button, openLink } from '../components/ui';
import Sheet from '../components/Sheet';
import DonorCrawl from '../components/DonorCrawl';
import { colors, lift, radius, space } from '../theme';
import { LINKS } from '../links';

// US 5: three networks named in the backlog, plus two we already had links
// for. Named ones are listed first since those are the ones called out.
const SOCIALS = [
  { label: 'Facebook', url: LINKS.facebook },
  { label: 'LinkedIn', url: LINKS.linkedin },
  { label: 'Instagram', url: LINKS.instagram },
  { label: 'Bluesky', url: LINKS.bluesky },
  { label: 'X', url: LINKS.x },
];

export default function HomeScreen({ navigation }) {
  const [socialsOpen, setSocialsOpen] = useState(false);

  return (
    <Screen>
      <Header title="Pen Parentis" subtitle="parenting done, write.">
        <Text style={s.greet}>
          Morning, Maya. <Text style={s.greetBold}>Day 6</Text> of your streak — 480 words
          yesterday, written before anyone else was up.
        </Text>
      </Header>

      <View style={s.pad}>
        <View style={[s.live, lift]}>
          <View style={s.dot} />
          <View style={{ flex: 1 }}>
            <Text style={s.liveTitle}>Salon tonight, 7pm ET</Text>
            <Text style={s.liveSub}>Second Tuesday, as always</Text>
          </View>
          <Pressable style={s.pill} onPress={() => navigation.navigate('Salons')}>
            <Text style={s.pillText}>Remind me</Text>
          </Pressable>
        </View>

        <Button label="Socials" variant="outline" onPress={() => setSocialsOpen(true)} />

        <Pressable onPress={() => openLink(LINKS.donate)}>
          <LinearGradient
            colors={[colors.karmaLight, colors.karma]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[s.karma, lift]}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.karmaTitle}>Get Karma</Text>
              <Text style={s.karmaSub}>Keep the salons free for the next parent</Text>
            </View>
            <View style={s.give}><Text style={s.giveText}>Give</Text></View>
          </LinearGradient>
        </Pressable>
      </View>

      <DonorCrawl />

      <Sheet
        visible={socialsOpen}
        onClose={() => setSocialsOpen(false)}
        title="Follow along"
      >
        {SOCIALS.map((n) => (
          <Pressable
            key={n.label}
            style={s.socialRow}
            onPress={() => { setSocialsOpen(false); openLink(n.url); }}
          >
            <Text style={s.socialText}>{n.label}</Text>
            <Text style={s.socialArrow}>›</Text>
          </Pressable>
        ))}
      </Sheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { padding: space.lg, paddingTop: space.md },
  greet: { color: 'rgba(255,255,255,0.94)', fontSize: 14, lineHeight: 21, marginTop: space.md },
  greetBold: { fontWeight: '700', color: colors.cream },
  live: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.cream, borderRadius: radius.md, padding: 14, marginBottom: space.md,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.karma },
  liveTitle: { fontWeight: '700', fontSize: 13.5, color: colors.ink },
  liveSub: { fontSize: 12, color: colors.muted },
  pill: { backgroundColor: colors.royal, borderRadius: radius.pill, paddingVertical: 9, paddingHorizontal: 14 },
  pillText: { color: '#fff', fontSize: 12.5, fontWeight: '600' },
  karma: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, padding: 16, marginTop: space.xs },
  karmaTitle: { fontSize: 17, fontWeight: '700', color: '#231702' },
  karmaSub: { fontSize: 11.5, color: 'rgba(35,23,2,0.82)' },
  give: { backgroundColor: colors.ink, borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 15 },
  giveText: { color: colors.cream, fontWeight: '700', fontSize: 13 },
  socialRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  socialText: { fontSize: 14.5, color: colors.ink, fontWeight: '600' },
  socialArrow: { fontSize: 18, color: colors.muted },
});
