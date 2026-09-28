import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Screen, Header, Card, Button, openLink } from '../components/ui';
import { colors, space } from '../theme';
import { LINKS } from '../links';

export default function SalonsScreen() {
  const [liveAlerts, setLiveAlerts] = useState(true);
  const [podcastAlerts, setPodcastAlerts] = useState(false);

  return (
    <Screen>
      <Header title="Salons" subtitle="Second Tuesday, about six times a year" />
      <View style={s.pad}>
        <Text style={s.h}>Tonight, 7pm ET</Text>
        <Text style={s.p}>
          Four professional writers with kids on what actually got the book finished.
          Watch live and ask them anything in the chat.
        </Text>

        <Button label="Watch live on YouTube" onPress={() => openLink(LINKS.youtubeLive)} />
        <Button label="Past salons" variant="outline" onPress={() => openLink(LINKS.youtube)} />
        <Button label="Listen on Spotify" variant="dark" onPress={() => openLink(LINKS.spotify)} />

        <View style={{ height: space.md }} />

        <Card>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.tTitle}>Tell me when a salon goes live</Text>
              <Text style={s.tSub}>One notification, half an hour before. Nothing else.</Text>
            </View>
            <Switch
              value={liveAlerts}
              onValueChange={setLiveAlerts}
              trackColor={{ true: colors.royal, false: '#C8CEDE' }}
            />
          </View>
        </Card>

        <Card>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.tTitle}>New episode in the feed</Text>
              <Text style={s.tSub}>When the salon lands on Spotify.</Text>
            </View>
            <Switch
              value={podcastAlerts}
              onValueChange={setPodcastAlerts}
              trackColor={{ true: colors.royal, false: '#C8CEDE' }}
            />
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { padding: space.lg },
  h: { fontSize: 17, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  p: { fontSize: 13.5, lineHeight: 20, color: colors.body, marginBottom: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tTitle: { fontSize: 13.5, fontWeight: '700', color: colors.ink },
  tSub: { fontSize: 12.5, color: colors.muted, marginTop: 2 },
});
