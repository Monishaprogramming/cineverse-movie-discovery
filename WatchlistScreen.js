import React from 'react';
import { View, Text, FlatList } from 'react-native';
import MovieCard from '../components/MovieCard';
import { EmptyState } from '../components/ScreenState';
import { useWatchlist } from '../context/WatchlistContext';
import { colors } from '../theme';

export default function WatchlistScreen({ navigation }) {
  const { items } = useWatchlist();
  return <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: 22 }}>
    <Text style={{ color: colors.text, fontSize: 27, fontWeight: '900', marginHorizontal: 20 }}>My watchlist</Text>
    <Text style={{ color: colors.muted, marginHorizontal: 20, marginTop: 5, marginBottom: 8 }}>{items.length} {items.length === 1 ? 'movie' : 'movies'} saved for later</Text>
    {items.length ? <FlatList data={items} numColumns={2} keyExtractor={(item) => String(item.id)} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18 }} columnWrapperStyle={{ justifyContent: 'space-between' }} renderItem={({ item }) => <View style={{ marginBottom: 22 }}><MovieCard movie={item} onPress={() => navigation.navigate('MovieDetails', { movieId: item.id, title: item.title })} /></View>} /> :
      <EmptyState title="Your list is waiting" subtitle="Open any movie and tap Save to watchlist. Your picks will appear here during this session." />}
  </View>;
}