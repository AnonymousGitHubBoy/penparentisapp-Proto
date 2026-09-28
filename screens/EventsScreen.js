// screens/EventsScreen.js — US 2: "a calendar ... see upcoming events ...
// keep track of important dates."
//
// Built as a lightweight week strip + agenda list rather than a full
// month grid. That's a deliberate scope call, not a shortcut forever:
// a real calendar library (react-native-calendars) is a bigger, heavier
// component, and whether the director wants month-view or agenda-view
// is worth confirming before building the heavier version. Swapping the
// WeekStrip below for a real <Calendar> later doesn't touch anything
// else on this screen.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, Card, Button, openLink } from '../components/ui';
import { colors, lift, radius, space } from '../theme';
import { LINKS } from '../links';

// Replace this array with a fetch from your own endpoint later.
const EVENTS = [
  { day: 'Wed', date: 24, when: 'Thu 24 Sep · 6:30pm · Manhattan', name: 'Pop-up: writer-parent networking', meta: 'Free · 12 spots left · strollers welcome' },
  { day: 'Thu', date: 25, when: 'Sat 11 Oct · all day · Chicago', name: 'National Writer-Parent Meetup', meta: 'Tickets $25 · sliding scale available' },
  { day: null, date: null, when: 'Rolling · online', name: 'Fellowship info session', meta: 'For parents of a child under ten' },
];

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY = 'Wed'; // wire to a real date once this reads from a live source
const EVENT_DAYS = new Set(EVENTS.filter((e) => e.day).map((e) => e.day));

function WeekStrip() {
  return (
    <View style={s.strip}>
      {WEEK.map((d) => (
        <View key={d} style={s.dayCol}>
          <Text style={[s.dayLabel, d === TODAY && s.dayLabelOn]}>{d}</Text>
          <View style={[s.dayDot, d === TODAY && s.dayDotOn]}>
            {EVENT_DAYS.has(d) && <View style={s.eventMark} />}
          </View>
        </View>
      ))}
    </View>
  );
}

export default function EventsScreen() {
  return (
    <Screen>
      <Header title="Events" subtitle="Signup runs through Eventbrite" />
      <View style={s.pad}>
        <WeekStrip />
        <Text style={s.calNote}>This week — a gold dot marks a day with something on</Text>

        {EVENTS.map((e) => (
          <Card key={e.name}>
            <Text style={s.when}>{e.when}</Text>
            <Text style={s.name}>{e.name}</Text>
            <Text style={s.meta}>{e.meta}</Text>
          </Card>
        ))}
        <View style={{ height: space.sm }} />
        <Button label="Register on Eventbrite" onPress={() => openLink(LINKS.eventbrite)} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { padding: space.lg },
  strip: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dayCol: { alignItems: 'center', gap: 6, width: 34 },
  dayLabel: { fontSize: 11, fontWeight: '600', color: colors.muted },
  dayLabelOn: { color: colors.royalDeep },
  dayDot: {
    width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  dayDotOn: { backgroundColor: colors.royal },
  eventMark: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.karma },
  calNote: { fontSize: 11.5, color: colors.muted, marginBottom: space.md },
  when: { fontSize: 11.5, fontWeight: '700', color: colors.royal },
  name: { fontSize: 15.5, fontWeight: '700', color: colors.ink, marginVertical: 4 },
  meta: { fontSize: 12, color: colors.muted },
});
