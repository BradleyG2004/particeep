import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from './movies';
// import { movies$ } from './movies';

interface MoviesState {
  movies: Movie[];
  filteredMovies: Movie[];
  categories: string[];
  category: string;
  moviesPerPage: number;
  currentPage: number;
}

const initialState: MoviesState = {
  movies: [],
  filteredMovies: [],
  categories: [],
  category: 'All',
  moviesPerPage: 8,
  currentPage: 1,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
      state.categories = Array.from(new Set(action.payload.map(movie => movie.category)));
      state.filteredMovies = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.filteredMovies = action.payload === 'All'
        ? state.movies
        : state.movies.filter(movie => movie.category === action.payload);
      state.currentPage = 1;
    },
    deleteMovie: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter(movie => movie.id !== action.payload);
      state.filteredMovies = state.filteredMovies.filter(movie => movie.id !== action.payload);
      state.categories = Array.from(new Set(state.movies.map(movie => movie.category)));
    },
    setMoviesPerPage: (state, action: PayloadAction<number>) => {
      state.moviesPerPage = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    toggleLikeDislike: (state, action: PayloadAction<{ id: string; isLike: boolean }>) => {
        const movieIndex = state.movies.findIndex(movie => movie.id === action.payload.id);
        if (movieIndex >= 0) {
          const movie = state.movies[movieIndex];
          if (action.payload.isLike) {
            movie.likes += 1;
            movie.dislikes = Math.max(0, movie.dislikes - 1); // Reduce dislike if liked
          } else {
            movie.dislikes += 1;
            movie.likes = Math.max(0, movie.likes - 1); // Reduce like if disliked
          }
          state.filteredMovies = [...state.movies];
        }
      },
  },
});

export const { setMovies, setCategory, deleteMovie, setMoviesPerPage, setCurrentPage, toggleLikeDislike } = moviesSlice.actions;
export default moviesSlice.reducer;
