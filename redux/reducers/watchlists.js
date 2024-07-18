import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  watchlists: [],
};

const watchlistSlice = createSlice({
  name: 'watchlists',
  initialState,
  reducers: {
    setWatchlistData: (state, action) => {
      const { useremail, lists } = action.payload;
      for (const l of lists) {
        state.watchlists.push(l)
      }
    },


    createWatchlist: (state, action) => {
      state.watchlists.push(action.payload);
    },


    deleteWatchlist: (state, action) => {
      const newState = JSON.parse(JSON.stringify(state));
      const userWatchlists = newState.watchlists.filter(list => list.id !== action.payload);
      newState.watchlists = userWatchlists;
      return newState
    },

    removeItemFromWatchlist: (state, action) => {
      const { id, title } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));
      const userWatchlists = newState.watchlists.find(w => w.id === Number(id));
      if (userWatchlists) {
        const movieIndex = userWatchlists.movie_list.findIndex(item => item.Title === title);
        if (movieIndex !== -1) {
          userWatchlists.movie_list.splice(movieIndex, 1);
        } else {
          console.log(`Movie titled "${movieTitle}" not found in the list.`);
        }
      }
      return newState;
    },

    addItemToWatchlist: (state, action) => {
      const { id, movie_data } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));
      const userWatchlists = newState.watchlists.find(w => w.id === id);
      if (userWatchlists) {
        userWatchlists.movie_list.push(movie_data)
      }
      return newState;
    },
  },
});

export const { createWatchlist, setWatchlistData, deleteWatchlist, addItemToWatchlist, removeItemFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
