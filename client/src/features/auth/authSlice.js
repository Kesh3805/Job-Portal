import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const token = localStorage.getItem('accessToken');

const initialState = {
  user: null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
  initialized: false
};

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.initialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.initialized = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.initialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.initialized = true;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
  }
});

export const { clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
