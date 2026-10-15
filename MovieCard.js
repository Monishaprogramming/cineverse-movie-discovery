import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { imageUrl } from '../api/tmdb';
import { colors } from '../theme';

export default function MovieCard({ movie, onPress, compact = false }) {
  const poster = imageUrl(movie.poster_path, 'w342');
  return <Pressable onPress={onPress} style={{ width: compact ? 124 : 145, marginRight: 14 }}>
    <View style={{ height: compact ? 180 : 212, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.panel2 }}>
      {poster ? <Image source={{ uri: poster }} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> :
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}><Ionicons name="film-outline" size={32} color={colors.muted} /><Text style={{ color: colors.muted, textAlign: 'center', marginTop: 8 }}>No poster</Text></View>}
      <View style={{ position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(7,10,18,0.84)', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 }}>
        <Ionicons name="star" size={11} color={colors.gold} />
        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', marginLeft: 4 }}>{movie.vote_average ? movie.vote_average.toFixed(1) : '—'}</Text>
      </View>
    </View>
    <Text numberOfLines={2} style={{ color: colors.text, fontWeight: '700', marginTop: 9, lineHeight: 18 }}>{movie.title || movie.name || 'Untitled'}</Text>
    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 3 }}>{(movie.release_date || '').slice(0, 4) || 'Release date n/a'}</Text>
  </Pressable>;
}