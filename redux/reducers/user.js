import { createSlice } from '@reduxjs/toolkit';

const userReducer = createSlice({
  name: 'user',
  initialState: {
    username: '',
    useremail: '',
    genre: [],
    feedSuggestions: ['titanic', 'rambo', 'street', 'mission', 'fighter'],
    watchList: []
  },

  reducers: {
    authentication: (state, action) => {
      state.username = action.payload.username
      state.useremail = action.payload.useremail
    },
    selectGenre: (state, action) => {
      state.genre = action.payload.genre;
    },
    addToWatchList: (state, action) => {
      console.log(action)
      state.watchList = [...state.watchList, action.payload]
    }
  },
});

export const { authentication, selectGenre, addToWatchList } = userReducer.actions;

export default userReducer.reducer;
