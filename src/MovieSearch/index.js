import { useState } from 'react';
import './styles.css';
import LoadingSpinner from '../LoadingSpinner';

export default function MovieSearch() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_MOVIE_SEARCH_API_KEY;

  const searchMovie = async () => {
    if (!query) return;
    if (!apiKey) {
      setError('API key is missing');
      return;
    }
    try {
      setMovies([]);
      setIsLoading(true);
      setError(null);
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      setError('Failed to fetch movies');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="MovieSearch">
        <h1>Movie Search</h1>
        <p>Find your favorite movies!</p>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie"
        />
        <button onClick={searchMovie} disabled={isLoading}>
          Search
        </button>
      </div>

      <div className="Movies">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : (
          movies
            ?.filter((movie) => movie?.poster_path)
            ?.sort((a, b) => b?.release_date.localeCompare(a?.release_date))
            ?.map((movie) => (
              <div key={movie?.id} className="Movie">
                <h2>{movie?.title}</h2>
                <p>
                  Release Date:{' '}
                  {new Date(movie?.release_date).toLocaleDateString()}
                </p>
                <p>Rating: {movie?.vote_average.toFixed(2)}</p>
                <img
                  src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie?.poster_path}`}
                  alt={movie?.title}
                />
                <p>{movie?.overview}</p>
              </div>
            ))
        )}
      </div>
    </>
  );
}
