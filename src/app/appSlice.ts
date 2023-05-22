import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import {
  ProtectedData,
  IExecDataProtector,
  ProtectedDataWithSecretProps,
  ProtectDataParams,
  GrantedAccess,
} from '@iexec/dataprotector';
import { api } from './api';
import { getAccount } from 'wagmi/actions';

let iExecDataProtector: IExecDataProtector | null = null;

export interface AppState {
  status: 'Not Connected' | 'Connected' | 'Loading' | 'Failed';
  error: string | null;
}

const initialState: AppState = {
  status: 'Not Connected',
  error: null,
};

export const initDataProtector = createAsyncThunk(
  'app/initDataProtector',
  async () => {
    try {
      const result = getAccount();
      const provider = await result.connector?.getProvider();
      iExecDataProtector = new IExecDataProtector(provider);
    } catch (e: any) {
      return { error: e.message };
    }
  }
);

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {},
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
export const selectThereIsSomeRequestPending = (state: RootState) =>
  Object.values(state.api.queries).some(
    (query) => query?.status === 'pending'
  ) ||
  Object.values(state.api.mutations).some(
    (query) => query?.status === 'pending'
  );
export const selectAppIsConnected = (state: RootState) =>
  state.app.status === 'Connected';
export const selectAppStatus = (state: RootState) => state.app.status;
export const selectAppError = (state: RootState) => state.app.error;

export const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchProtectedData: builder.query<ProtectedData[], string>({
      queryFn: async (owner) => {
        try {
          const data = await iExecDataProtector?.fetchProtectedData({ owner });
          return { data: data };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    createProtectedData: builder.mutation<
      ProtectedDataWithSecretProps,
      ProtectDataParams
    >({
      queryFn: async (args) => {
        try {
          const data = await iExecDataProtector?.protectData(args);
          return { data: data.address };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    fetchGrantedAccess: builder.query<GrantedAccess[], string>({
      queryFn: async (protectedData) => {
        try {
          const data = await iExecDataProtector?.fetchGrantedAccess({
            protectedData,
          });
          return { data: data };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
  }),
});

export const {
  useFetchProtectedDataQuery,
  useCreateProtectedDataMutation,
  useFetchGrantedAccessQuery,
} = homeApi;
