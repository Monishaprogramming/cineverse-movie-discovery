import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { colors } from '../theme';
import MovieCard from './MovieCard';

export default function MovieSection({ title, subtitle, movies = [], onMoviePress, onSeeAll }) {
  if (!movies.length) return null;
  return <View style={{ marginTop: 25 }}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 13 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 19, fontWeight: '800' }}>{title}</Text>
        {subtitle ? <Text style={{ color: colors.muted, fontSize: 12, marginTop: 3 }}>{subtitle}</Text> : null}
      </View>
      {onSeeAll ? <Pressable onPress={onSeeAll}><Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>See all</Text></Pressable> : null}
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
      {movies.slice(0, 12).map((movie) => <MovieCard key={movie.id} movie={movie} onPress={() => onMoviePress(movie)} />)}
    </ScrollView>
  </View>;
}