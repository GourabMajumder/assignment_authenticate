import { configureStore } from '@reduxjs/toolkit';
import application from './reducers/application';
import user from './reducers/user';
import watchlists from './reducers/watchlists';

const store = configureStore({
  reducer: {
    user: user,
    application: application,
    watchlists: watchlists
  },
});

export default store;
