import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBreakpoints = createAsyncThunk('breakpoints/fetchBreakpoints', async () => {
  const response = await api.get('/breakpoints');
  return response.data;
});

const breakpointsSlice = createSlice({
  name: 'breakpoints',
  initialState: {
    breakpoints: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreakpoints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBreakpoints.fulfilled, (state, action) => {
        state.loading = false;
        state.breakpoints = action.payload.data;
      })
      .addCase(fetchBreakpoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default breakpointsSlice.reducer;
