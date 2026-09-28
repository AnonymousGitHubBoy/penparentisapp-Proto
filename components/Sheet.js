// components/Sheet.js
//
// One modal wrapper, two uses: the global Info sheet (US 7) and the
// per-screen Socials sheet (US 5). Building it once here means the Info
// button and the Socials button look and behave the same way, and a
// styling change only has to happen in one place.

import React from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, lift, radius, space } from '../theme';

export default function Sheet({ visible, onClose, title, subtitle, children }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose} // Android back button
    >
      <View style={s.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[s.card, lift]}>
          <View style={s.head}>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{title}</Text>
              {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
            </View>
            <Pressable onPress={onClose} style={s.close} hitSlop={10}>
              <Text style={s.closeText}>×</Text>
            </Pressable>
          </View>
          <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10,22,51,0.55)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: space.lg,
    paddingBottom: space.xl,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: space.md },
  title: { fontSize: 19, fontWeight: '700', color: colors.ink },
  subtitle: { fontSize: 12.5, color: colors.muted, marginTop: 3 },
  close: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.line,
  },
  closeText: { fontSize: 18, color: colors.ink, lineHeight: 18 },
});
