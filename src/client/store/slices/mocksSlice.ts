import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMocks = createAsyncThunk('mocks/fetchMocks', async () => {
  const response = await api.get('/mocks');
  return response.data;
});

const mocksSlice = createSlice({
  name: 'mocks',
  initialState: {
    mocks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMocks.fulfilled, (state, action) => {
        state.loading = false;
        state.mocks = action.payload.data;
      })
      .addCase(fetchMocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default mocksSlice.reducer;
