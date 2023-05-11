import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import {
  ProtectedData,
  IExecDataProtector,
  ProtectedDataWithSecretProps,
  ProtectDataParams,
} from '@iexec/dataprotector';
import { api, getIExecDataProtectorAndRefresh } from './api';

let iExecDataProtector: IExecDataProtector | null = null;

export interface AppState {
  protectedDataArray: ProtectedData[] | [];
  status: 'Not Connected' | 'Connected' | 'Loading' | 'Failed';
  error: string | null;
}

const initialState: AppState = {
  protectedDataArray: [],
  status: 'Not Connected',
  error: null,
};

export const initDataProtector = createAsyncThunk(
  'app/initDataProtector',
  async () => {
    //try {
    iExecDataProtector = await getIExecDataProtectorAndRefresh();
    console.log('iExecDataProtector in createAsyncThunk: ', iExecDataProtector);
    // } catch (e: any) {
    //   console.log('error in createAsyncThunk: ', e);
    //   return { error: e.message };
    // }
  }
);

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setProtectedDataArray: (state, action) => {
      state.protectedDataArray = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initDataProtector.pending, (state) => {
        state.status = 'Loading';
      })
      .addCase(initDataProtector.fulfilled, (state) => {
        state.status = 'Connected';
      })
      .addCase(initDataProtector.rejected, (state, action) => {
        state.status = 'Failed';
        state.error = '' + action.error.message;
      });
  },
});

export default appSlice.reducer;
export const { setProtectedDataArray } = appSlice.actions;
export const selectProtectedDataArray = (state: RootState) =>
  state.app.protectedDataArray;
export const selectthereIsSomeRequestPending = (state: RootState) =>
  Object.values(state.api.mutations).some(
    (query) => query?.status === 'pending'
  );
export const selectAppIsConnected = (state: RootState) =>
  state.app.status === 'Connected';
export const selectAppStatus = (state: RootState) => state.app.status;
export const selectAppError = (state: RootState) => state.app.error;

export const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchProtectedData: builder.mutation<ProtectedData[], string>({
      queryFn: async (owner) => {
        try {
          console.log('iExecDataProtector Fetch API: ', iExecDataProtector);
          const data = await iExecDataProtector?.fetchProtectedData(owner);
          return { data: data || [] };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    createPotectedData: builder.mutation<
      ProtectedDataWithSecretProps,
      ProtectDataParams
    >({
      queryFn: async (args) => {
        try {
          const data = await iExecDataProtector?.protectData(args);
          return { data: data || {} };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
  }),
});

export const { useFetchProtectedDataMutation, useCreatePotectedDataMutation } =
  homeApi;
