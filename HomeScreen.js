import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, ImageBackground, Pressable, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tmdb, imageUrl, getErrorMessage } from '../api/tmdb';
import MovieSection from '../components/MovieSection';
import { LoadingState, ErrorState } from '../components/ScreenState';
import { colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const results = await Promise.all([
        tmdb.trendingMovies('week'), tmdb.nowPlaying(), tmdb.popularMovies(),
        tmdb.topRatedMovies(), tmdb.upcomingMovies()
      ]);
      setSections({
        trending: results[0].results || [], now: results[1].results || [],
        popular: results[2].results || [], top: results[3].results || [], upcoming: results[4].results || []
      });
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const openMovie = (movie) => navigation.navigate('MovieDetails', { movieId: movie.id, title: movie.title });

  const hero = sections.trending?.[0];
  return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.accent} />}>
    <View style={{ paddingTop: 18, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View>
        <Text style={{ color: colors.accent, fontSize: 12, letterSpacing: 3, fontWeight: '900' }}>CINEVERSE</Text>
        <Text style={{ color: colors.text, fontSize: 25, fontWeight: '900', marginTop: 5 }}>Find your next story.</Text>
      </View>
      <View style={{ width: 44, height: 44, borderRadius: 15, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="sparkles" size={22} color={colors.gold} />
      </View>
    </View>
    {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={() => load()} /> : <>
      {hero ? <Pressable onPress={() => openMovie(hero)} style={{ marginHorizontal: 20, marginTop: 22, height: 390, borderRadius: 22, overflow: 'hidden', backgroundColor: colors.panel }}>
        <ImageBackground source={{ uri: imageUrl(hero.backdrop_path || hero.poster_path, 'w780') }} resizeMode="cover" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(5,8,17,0.12)' }} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20, paddingTop: 65, backgroundColor: 'rgba(5,8,17,0.84)' }}>
            <View style={{ alignSelf: 'flex-start', backgroundColor: colors.accent2, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 5, marginBottom: 10 }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 }}>TRENDING THIS WEEK</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900' }}>{hero.title}</Text>
            <Text numberOfLines={2} style={{ color: '#D5D9E4', lineHeight: 20, marginTop: 7 }}>{hero.overview || 'A story worth discovering.'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
              <Ionicons name="star" size={15} color={colors.gold} />
              <Text style={{ color: '#fff', fontWeight: '800', marginLeft: 5 }}>{hero.vote_average?.toFixed(1) || '—'}</Text>
              <Text style={{ color: '#CBD0DD', marginLeft: 12 }}>{(hero.release_date || '').slice(0, 4)}</Text>
              <View style={{ flex: 1 }} />
              <View style={{ backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#100D20', fontWeight: '900', marginRight: 6 }}>Explore</Text><Ionicons name="arrow-forward" size={15} color="#100D20" />
              </View>
            </View>
          </View>
        </ImageBackground>
      </Pressable> : null}
      <MovieSection title="Trending now" subtitle="The movies everyone's talking about" movies={sections.trending} onMoviePress={openMovie} />
      <MovieSection title="In theatres" subtitle="Currently playing" movies={sections.now} onMoviePress={openMovie} />
      <MovieSection title="Popular picks" movies={sections.popular} onMoviePress={openMovie} />
      <MovieSection title="Critics' corner" subtitle="Highest-rated movies" movies={sections.top} onMoviePress={openMovie} />
      <MovieSection title="Coming soon" movies={sections.upcoming} onMoviePress={openMovie} />
      <Text style={{ color: colors.muted, fontSize: 11, textAlign: 'center', marginVertical: 26, paddingHorizontal: 24 }}>Movie data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</Text>
    </>}
  </ScrollView>;
}