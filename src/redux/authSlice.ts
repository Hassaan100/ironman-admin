import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminAuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AdminAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminCredentials: (
      state,
      action: PayloadAction<{ user: AdminAuthState['user']; token?: string }>
    ) => {
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
      }
      state.isAuthenticated = true;
    },
    logoutAdminAction: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAdminCredentials, logoutAdminAction } = authSlice.actions;
export default authSlice.reducer;
