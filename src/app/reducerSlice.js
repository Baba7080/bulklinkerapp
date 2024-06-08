
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setData: (state, action) => {
      const { data, stateKey } = action.payload;
      state[stateKey] = data;
    },
  },
});

export const { setData } = appSlice.actions;

// Other code such as selectors can use the state itself
export const getData = (state) => state;

export default appSlice.reducer;