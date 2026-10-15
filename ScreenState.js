import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { colors } from '../theme';

export function LoadingState({ label = 'Finding your next favorite…' }) {
  return <View style={{ padding: 28, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator size="large" color={colors.accent} />
    <Text style={{ color: colors.muted, marginTop: 12 }}>{label}</Text>
  </View>;
}

export function ErrorState({ message, onRetry }) {
  return <View style={{ padding: 24, alignItems: 'center' }}>
    <Text style={{ fontSize: 30, marginBottom: 8 }}>✦</Text>
    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>We hit a small plot twist</Text>
    <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>{message}</Text>
    {onRetry ? <Pressable onPress={onRetry} style={{ marginTop: 16, backgroundColor: colors.accent2, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
      <Text style={{ color: '#fff', fontWeight: '700' }}>Try again</Text>
    </Pressable> : null}
  </View>;
}

export function EmptyState({ title = 'Nothing here yet', subtitle = 'Try another search or come back soon.' }) {
  return <View style={{ padding: 28, alignItems: 'center' }}>
    <Text style={{ color: colors.text, fontSize: 17, fontWeight: '700' }}>{title}</Text>
    <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 8 }}>{subtitle}</Text>
  </View>;
}