import { createSlice } from '@reduxjs/toolkit';

const applicationReducer = createSlice({
  name: 'application',
  initialState: {
    db:null,
    showInputAddWatchList: false,
    showPopup: false,
    showSearch: false,
    currentIndex: null
  },

  reducers: {
    setDatabase: (state, action) => {
      state.db = action.payload
    },
    setShowInputAddWatchList: (state, action) => {
      state.showInputAddWatchList = action.payload
    },
    setShowPopup: (state, action) => {
      state.showPopup = action.payload
    },
    setShowSearch: (state, action) => {
      state.showSearch = action.payload
    }
  },
});

export const { setDatabase, setShowInputAddWatchList, setShowPopup, setShowSearch } = applicationReducer.actions;

export default applicationReducer.reducer;
