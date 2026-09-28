import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, Card, Button, openLink } from '../components/ui';
import { colors, space } from '../theme';
import { LINKS } from '../links';

export default function CommunitiesScreen() {
  return (
    <Screen>
      <Header title="Community" subtitle="The National Writer-Parent Hub" />
      <View style={s.pad}>
        <Text style={s.h}>There is almost always someone up</Text>
        <Text style={s.p}>
          Our Discord runs around the clock: accountability groups, residency tips, and a
          channel for the 4am feed shift. Free to join, no meetings, no hierarchy.
        </Text>
        <Button label="Join the Discord" onPress={() => openLink(LINKS.discord)} />
        <Button label="Find a weekly accountability group" variant="outline" onPress={() => openLink(LINKS.cycleOfSupport)} />
        <View style={{ height: space.sm }} />
        <Card>
          <Text style={s.when}>#residencies</Text>
          <Text style={s.meta}>The only list of residencies that support writers with kids.</Text>
        </Card>
        <Card>
          <Text style={s.when}>#3am-club</Text>
          <Text style={s.meta}>41 members writing right now.</Text>
        </Card>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { padding: space.lg },
  h: { fontSize: 17, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  p: { fontSize: 13.5, lineHeight: 20, color: colors.body, marginBottom: space.md },
  when: { fontSize: 11.5, fontWeight: '700', color: colors.royal },
  meta: { fontSize: 12, color: colors.muted, marginTop: 3 },
});
