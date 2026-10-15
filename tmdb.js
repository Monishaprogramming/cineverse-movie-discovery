import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;

export const imageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: ACCESS_TOKEN ? { Authorization: `Bearer ${ACCESS_TOKEN}`, accept: 'application/json' } : { accept: 'application/json' }
});

client.interceptors.request.use((config) => {
  if (!ACCESS_TOKEN) {
    throw new Error('TMDB token is missing. Add EXPO_PUBLIC_TMDB_ACCESS_TOKEN to your .env file and restart Expo.');
  }
  return config;
});

async function get(path, params = {}) {
  const response = await client.get(path, { params: { language: 'en-US', ...params } });
  return response.data;
}

// 20 distinct endpoint patterns are wrapped below. See README for the complete list.
export const tmdb = {
  configuration: () => get('/configuration'),
  trendingMovies: (window = 'week', page = 1) => get(`/trending/movie/${window}`, { page }),
  nowPlaying: (page = 1) => get('/movie/now_playing', { page }),
  popularMovies: (page = 1) => get('/movie/popular', { page }),
  topRatedMovies: (page = 1) => get('/movie/top_rated', { page }),
  upcomingMovies: (page = 1) => get('/movie/upcoming', { page }),
  searchMovies: (query, page = 1) => get('/search/movie', { query, page, include_adult: false }),
  movieDetails: (id) => get(`/movie/${id}`),
  movieCredits: (id) => get(`/movie/${id}/credits`),
  movieVideos: (id) => get(`/movie/${id}/videos`),
  similarMovies: (id, page = 1) => get(`/movie/${id}/similar`, { page }),
  recommendations: (id, page = 1) => get(`/movie/${id}/recommendations`, { page }),
  movieReviews: (id, page = 1) => get(`/movie/${id}/reviews`, { page }),
  movieImages: (id) => get(`/movie/${id}/images`),
  watchProviders: (id) => get(`/movie/${id}/watch/providers`),
  movieExternalIds: (id) => get(`/movie/${id}/external_ids`),
  movieReleaseDates: (id) => get(`/movie/${id}/release_dates`),
  movieKeywords: (id) => get(`/movie/${id}/keywords`),
  movieLists: (id, page = 1) => get(`/movie/${id}/lists`, { page }),
  movieGenres: () => get('/genre/movie/list'),
  discoverMovies: (params = {}) => get('/discover/movie', params),
  personDetails: (id) => get(`/person/${id}`),
  personMovieCredits: (id) => get(`/person/${id}/movie_credits`)
};

export function getErrorMessage(error) {
  if (error?.response?.status === 401) return 'TMDB rejected the API token. Check your token in .env.';
  if (error?.response?.status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (error?.code === 'ECONNABORTED') return 'The request took too long. Check your connection and retry.';
  if (error?.message?.includes('TMDB token is missing')) return error.message;
  return error?.response?.data?.status_message || 'Something went wrong. Please check your connection and try again.';
}