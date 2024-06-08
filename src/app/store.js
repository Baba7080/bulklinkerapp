import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducerSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});