import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { tmdb, imageUrl, getErrorMessage } from '../api/tmdb';
import MovieSection from '../components/MovieSection';
import { LoadingState, ErrorState } from '../components/ScreenState';
import { colors } from '../theme';

export default function PersonDetailsScreen({ route, navigation }) {
  const { personId } = route.params;
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [details, filmography] = await Promise.all([tmdb.personDetails(personId), tmdb.personMovieCredits(personId)]);
      setPerson(details);
      const movies = [...(filmography.cast || []), ...(filmography.crew || [])];
      setCredits(movies.filter((m, i) => movies.findIndex((x) => x.id === m.id) === i).sort((a, b) => (b.release_date || '').localeCompare(a.release_date || '')));
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [personId]);

  if (loading) return <LoadingState label="Loading profile…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}>
    <View style={{ padding: 20, alignItems: 'center' }}>
      {person?.profile_path ? <Image source={{ uri: imageUrl(person.profile_path, 'w342') }} style={{ width: 145, height: 185, borderRadius: 18, backgroundColor: colors.panel2 }} /> : null}
      <Text style={{ color: colors.text, fontSize: 25, fontWeight: '900', marginTop: 17, textAlign: 'center' }}>{person?.name}</Text>
      <Text style={{ color: colors.muted, marginTop: 6 }}>{person?.known_for_department || 'Film industry'}</Text>
      {person?.birthday ? <Text style={{ color: colors.muted, marginTop: 5 }}>Born {person.birthday}{person.place_of_birth ? ` · ${person.place_of_birth}` : ''}</Text> : null}
      {person?.biography ? <Text style={{ color: '#C0C8D8', lineHeight: 22, marginTop: 18 }}>{person.biography}</Text> : null}
    </View>
    <MovieSection title="Filmography" subtitle="Movies featuring this person" movies={credits} onMoviePress={(movie) => navigation.push('MovieDetails', { movieId: movie.id, title: movie.title })} />
  </ScrollView>;
}