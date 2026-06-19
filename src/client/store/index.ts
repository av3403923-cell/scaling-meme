import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer from './slices/analyticsSlice';
import requestsReducer from './slices/requestsSlice';
import breakpointsReducer from './slices/breakpointsSlice';
import mocksReducer from './slices/mocksSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    requests: requestsReducer,
    breakpoints: breakpointsReducer,
    mocks: mocksReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
