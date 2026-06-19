import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRequests = createAsyncThunk('requests/fetchRequests', async () => {
  const response = await api.get('/requests');
  return response.data;
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.data;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default requestsSlice.reducer;
