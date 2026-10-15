import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tmdb, getErrorMessage } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { LoadingState, ErrorState, EmptyState } from '../components/ScreenState';
import { colors } from '../theme';

const filters = [
  { label: 'Popular', params: { sort_by: 'popularity.desc' } },
  { label: 'Top rated', params: { sort_by: 'vote_average.desc', 'vote_count.gte': 200 } },
  { label: 'New releases', params: { sort_by: 'primary_release_date.desc', 'primary_release_date.lte': new Date().toISOString().slice(0, 10) } },
  { label: 'Family', params: { with_genres: '10751', sort_by: 'popularity.desc' } }
];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Popular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { tmdb.movieGenres().then((data) => setGenres(data.genres || [])).catch(() => {}); }, []);
  useEffect(() => {
    if (query.trim().length < 2) return;
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try { const data = await tmdb.searchMovies(query.trim()); setResults(data.results || []); }
      catch (e) { setError(getErrorMessage(e)); }
      finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const loadFilter = async (filter) => {
    setActiveFilter(filter.label); setQuery(''); setLoading(true); setError('');
    try {
      const data = await tmdb.discoverMovies({ ...filter.params, page: 1, include_adult: false });
      setResults(data.results || []);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadFilter(filters[0]); }, []);

  return <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: 18 }}>
    <Text style={{ color: colors.text, fontSize: 27, fontWeight: '900', paddingHorizontal: 20 }}>Explore movies</Text>
    <Text style={{ color: colors.muted, marginHorizontal: 20, marginTop: 5, marginBottom: 18 }}>Search a title or browse by mood.</Text>
    <View style={{ marginHorizontal: 20, backgroundColor: colors.panel, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border }}>
      <Ionicons name="search" size={19} color={colors.muted} />
      <TextInput value={query} onChangeText={setQuery} placeholder="Search movies…" placeholderTextColor={colors.muted} style={{ flex: 1, color: colors.text, paddingVertical: 15, paddingHorizontal: 10 }} returnKeyType="search" />
      {query ? <Pressable onPress={() => setQuery('')}><Ionicons name="close-circle" size={20} color={colors.muted} /></Pressable> : null}
    </View>
    {!query ? <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 52, marginTop: 17 }} contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'center' }}>
      {filters.map((filter) => <Pressable key={filter.label} onPress={() => loadFilter(filter)} style={{ marginRight: 9, paddingHorizontal: 15, paddingVertical: 9, borderRadius: 20, backgroundColor: activeFilter === filter.label ? colors.accent : colors.panel2, borderWidth: 1, borderColor: activeFilter === filter.label ? colors.accent : colors.border }}>
        <Text style={{ color: activeFilter === filter.label ? '#130D24' : colors.text, fontWeight: '800', fontSize: 12 }}>{filter.label}</Text>
      </Pressable>)}
    </ScrollView> : <Text style={{ color: colors.muted, marginHorizontal: 20, marginTop: 13, fontSize: 12 }}>Genres available: {genres.slice(0, 5).map((g) => g.name).join(' · ')}</Text>}
    {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={() => query ? setQuery(query + ' ') : loadFilter(filters.find((f) => f.label === activeFilter) || filters[0])} /> :
      results.length ? <FlatList key={query ? 'search' : activeFilter} data={results} numColumns={2} keyExtractor={(item) => String(item.id)} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 25 }} columnWrapperStyle={{ justifyContent: 'space-between' }} renderItem={({ item }) => <View style={{ marginBottom: 22 }}><MovieCard movie={item} onPress={() => navigation.navigate('MovieDetails', { movieId: item.id, title: item.title })} /></View>} /> :
      <EmptyState title={query.length < 2 ? 'Start with a title' : 'No movies found'} subtitle={query.length < 2 ? 'Enter at least two characters to search.' : 'Try another title or choose a category.'} />}
  </View>;
}