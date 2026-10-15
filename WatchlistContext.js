import React, { createContext, useContext, useMemo, useState } from 'react';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const add = (movie) => setItems((current) => current.some((item) => item.id === movie.id) ? current : [movie, ...current]);
  const remove = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const contains = (id) => items.some((item) => item.id === id);
  const value = useMemo(() => ({ items, add, remove, contains }), [items]);
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const value = useContext(WatchlistContext);
  if (!value) throw new Error('useWatchlist must be used inside WatchlistProvider');
  return value;
}