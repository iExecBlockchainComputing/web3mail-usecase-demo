import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { api } from './api';
import appReducer from './appSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['app/initSDK/fulfilled', 'app/initSDK/rejected'],
        ignoredPaths: ['app.iExecDataProtector', 'api.mutations'],
      },
    }).concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
