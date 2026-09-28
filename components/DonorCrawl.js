// components/DonorCrawl.js — US 8: "a banner scroll which will display a list of donors."
//
// A looped horizontal scroll. The row is rendered twice back-to-back and
// the whole thing is translated left forever; when it's shifted by exactly
// one row's width it resets to 0, which is invisible to the eye because
// the second copy is sitting right where the first one started.

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { DONORS } from '../donors';

const SPEED = 40; // pixels per second — tune for taste

export default function DonorCrawl() {
  const x = useRef(new Animated.Value(0)).current;
  const [rowWidth, setRowWidth] = useState(0);

  useEffect(() => {
    if (!rowWidth) return;
    x.setValue(0);
    const loop = Animated.loop(
      Animated.timing(x, {
        toValue: -rowWidth,
        duration: (rowWidth / SPEED) * 1000,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rowWidth]);

  const line = 'Thank you ' + DONORS.join('   ·   ') + '   ·   ';

  return (
    <View style={s.wrap}>
      <Animated.View style={[s.row, { transform: [{ translateX: x }] }]}>
        <Text
          style={s.text}
          onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
        >
          {line}
        </Text>
        <Text style={s.text}>{line}</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { height: 34, backgroundColor: colors.ink, overflow: 'hidden', justifyContent: 'center' },
  row: { flexDirection: 'row' },
  text: { color: '#F0E6D2', fontSize: 11.5, paddingRight: 0 },
});
