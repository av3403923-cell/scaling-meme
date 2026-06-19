import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAnalytics = createAsyncThunk('analytics/fetchAnalytics', async () => {
  const response = await api.get('/analytics/stats');
  return response.data;
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;
