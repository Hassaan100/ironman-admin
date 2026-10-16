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

const getInitialAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('ironman_admin_token');
  }
  return null;
};

const initialState: AdminAuthState = {
  user: null,
  token: getInitialAdminToken(),
  isAuthenticated: !!getInitialAdminToken(),
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
        if (typeof window !== 'undefined') {
          localStorage.setItem('ironman_admin_token', action.payload.token);
        }
      }
      state.isAuthenticated = true;
    },
    logoutAdminAction: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ironman_admin_token');
      }
    },
  },
});

export const { setAdminCredentials, logoutAdminAction } = authSlice.actions;
export default authSlice.reducer;
