import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, ImageBackground, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tmdb, imageUrl, getErrorMessage } from '../api/tmdb';
import MovieSection from '../components/MovieSection';
import { LoadingState, ErrorState, EmptyState } from '../components/ScreenState';
import { useWatchlist } from '../context/WatchlistContext';
import { colors } from '../theme';

export default function MovieDetailsScreen({ route, navigation }) {
  const { movieId, title } = route.params;
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [videos, setVideos] = useState([]);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [providers, setProviders] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [external, setExternal] = useState({});
  const [releases, setReleases] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { add, remove, contains } = useWatchlist();

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [details, cast, videoData, similar, recommended, reviewData, providerData, keywordData, ids, releaseData] = await Promise.all([
        tmdb.movieDetails(movieId), tmdb.movieCredits(movieId), tmdb.movieVideos(movieId),
        tmdb.similarMovies(movieId), tmdb.recommendations(movieId), tmdb.movieReviews(movieId),
        tmdb.watchProviders(movieId), tmdb.movieKeywords(movieId), tmdb.movieExternalIds(movieId), tmdb.movieReleaseDates(movieId)
      ]);
      setMovie(details);
      setCredits(cast || { cast: [], crew: [] });
      setVideos(videoData.results || []);
      const merged = [...(recommended.results || []), ...(similar.results || [])];
      setRelated(merged.filter((item, index) => merged.findIndex((x) => x.id === item.id) === index));
      setReviews(reviewData.results || []);
      setProviders(providerData.results?.IN || providerData.results?.US || null);
      setKeywords(keywordData.keywords || []);
      setExternal(ids || {});
      setReleases(releaseData.results || []);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }, [movieId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}><LoadingState label="Loading movie details…" /></ScrollView>;
  if (error) return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}><ErrorState message={error} onRetry={load} /></ScrollView>;
  if (!movie) return <EmptyState title="Movie unavailable" />;

  const saved = contains(movie.id);
  const trailer = videos.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
  const director = credits.crew?.find((person) => person.job === 'Director');
  const year = (movie.release_date || '').slice(0, 4);
  const certification = releases.flatMap((country) => country.release_dates || []).find((r) => r.certification)?.certification;

  return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}>
    <ImageBackground source={{ uri: imageUrl(movie.backdrop_path || movie.poster_path, 'w780') }} style={{ height: 280, justifyContent: 'flex-end' }} resizeMode="cover">
      <View style={{ height: '100%', backgroundColor: 'rgba(7,10,20,0.28)' }} />
      <Pressable onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 16, left: 18, width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(8,12,24,0.8)', alignItems: 'center', justifyContent: 'center' }}><Ionicons name="arrow-back" size={21} color="#fff" /></Pressable>
      {movie.poster_path ? <Image source={{ uri: imageUrl(movie.poster_path, 'w342') }} style={{ position: 'absolute', bottom: -45, left: 20, width: 112, height: 164, borderRadius: 13, borderWidth: 2, borderColor: colors.bg }} /> : null}
    </ImageBackground>
    <View style={{ paddingHorizontal: 20, paddingTop: 58 }}>
      <Text style={{ color: colors.text, fontSize: 26, fontWeight: '900', lineHeight: 32 }}>{movie.title}</Text>
      {movie.tagline ? <Text style={{ color: colors.accent, fontStyle: 'italic', marginTop: 5 }}>{movie.tagline}</Text> : null}
      <Text style={{ color: colors.muted, marginTop: 10 }}>{[year, movie.runtime ? `${movie.runtime} min` : null, certification].filter(Boolean).join('  ·  ')}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
        <Ionicons name="star" size={17} color={colors.gold} />
        <Text style={{ color: colors.text, fontWeight: '900', marginLeft: 6 }}>{movie.vote_average?.toFixed(1) || '—'} <Text style={{ color: colors.muted, fontWeight: '400' }}>({movie.vote_count?.toLocaleString() || 0} votes)</Text></Text>
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => saved ? remove(movie.id) : add(movie)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: saved ? colors.panel2 : colors.accent, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 13 }}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={16} color={saved ? colors.accent : '#140E24'} />
          <Text style={{ color: saved ? colors.text : '#140E24', fontWeight: '900', marginLeft: 6 }}>{saved ? 'Saved' : 'Watchlist'}</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
        {(movie.genres || []).map((genre) => <View key={genre.id} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginRight: 7, marginBottom: 7 }}><Text style={{ color: colors.muted, fontSize: 12 }}>{genre.name}</Text></View>)}
      </View>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 15, marginBottom: 7 }}>Overview</Text>
      <Text style={{ color: '#C0C8D8', fontSize: 14, lineHeight: 22 }}>{movie.overview || 'No overview is available for this movie.'}</Text>
      {director ? <Text style={{ color: colors.muted, marginTop: 13 }}>Directed by <Text style={{ color: colors.text, fontWeight: '700' }}>{director.name}</Text></Text> : null}
      {trailer ? <Pressable onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)} style={{ backgroundColor: colors.accent2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 14, marginTop: 20 }}>
        <Ionicons name="play-circle" size={20} color="#fff" /><Text style={{ color: '#fff', fontWeight: '900', marginLeft: 8 }}>Watch trailer on YouTube</Text>
      </Pressable> : null}
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 25, marginBottom: 12 }}>Cast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {credits.cast.slice(0, 12).map((person) => <Pressable key={person.credit_id || person.id} onPress={() => navigation.navigate('PersonDetails', { personId: person.id, name: person.name })} style={{ width: 90, marginRight: 12 }}>
          {person.profile_path ? <Image source={{ uri: imageUrl(person.profile_path, 'w185') }} style={{ width: 84, height: 100, borderRadius: 12, backgroundColor: colors.panel2 }} /> : <View style={{ width: 84, height: 100, borderRadius: 12, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="person" size={26} color={colors.muted} /></View>}
          <Text numberOfLines={2} style={{ color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 7 }}>{person.name}</Text>
          <Text numberOfLines={2} style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{person.character}</Text>
        </Pressable>)}
      </ScrollView>
      {providers ? <View style={{ marginTop: 24, backgroundColor: colors.panel, padding: 15, borderRadius: 15 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800' }}>Where to watch</Text>
        <Text style={{ color: colors.muted, marginTop: 5, lineHeight: 19 }}>Region: {providers.link ? 'India (IN) / available provider data' : 'India (IN)'}</Text>
        {[...(providers.flatrate || []), ...(providers.rent || []), ...(providers.buy || [])].slice(0, 8).map((p, i) => <Text key={`${p.provider_id}-${i}`} style={{ color: colors.text, marginTop: 7 }}>• {p.provider_name}</Text>)}
        {providers.link ? <Text onPress={() => Linking.openURL(providers.link)} style={{ color: colors.accent, marginTop: 10, fontWeight: '700' }}>View provider options ↗</Text> : null}
      </View> : null}
      {keywords.length ? <View style={{ marginTop: 22 }}><Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 9 }}>Keywords</Text><Text style={{ color: colors.muted, lineHeight: 21 }}>{keywords.slice(0, 12).map((k) => k.name).join('  ·  ')}</Text></View> : null}
      {external.imdb_id ? <Text onPress={() => Linking.openURL(`https://www.imdb.com/title/${external.imdb_id}/`)} style={{ color: colors.accent, marginTop: 17 }}>View on IMDb ↗</Text> : null}
      {reviews.length ? <View style={{ marginTop: 24 }}><Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 12 }}>Audience reviews</Text>{reviews.slice(0, 2).map((review) => <View key={review.id} style={{ backgroundColor: colors.panel, borderRadius: 14, padding: 14, marginBottom: 10 }}><Text style={{ color: colors.text, fontWeight: '800' }}>{review.author}</Text><Text numberOfLines={5} style={{ color: colors.muted, lineHeight: 20, marginTop: 7 }}>{review.content}</Text></View>)}</View> : null}
    </View>
    <MovieSection title="You might also like" movies={related} onMoviePress={(item) => navigation.push('MovieDetails', { movieId: item.id, title: item.title })} />
    <Text style={{ color: colors.muted, fontSize: 11, textAlign: 'center', margin: 22 }}>Movie data provided by TMDB. Not endorsed or certified by TMDB.</Text>
  </ScrollView>;
}