import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload;
      state.isLoggedIn = true;
      state.user = payload;
    },
    removeUser: (state) => {
      state.isLoggedIn = false;
      state.user = {};
    },
  },
});

// ✅ Correct export syntax
export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
