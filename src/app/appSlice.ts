import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import {
  ProtectedData,
  IExecDataProtector,
  ProtectDataParams,
  GrantedAccess,
  RevokedAccess,
} from '@iexec/dataprotector';
import { api } from './api';
import { getAccount } from 'wagmi/actions';
import { DAPP_WEB3_MAIL_ADDRESS } from '../config/config';
import { AddressZero } from '@ethersproject/constants';

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
          return { data: data || [] };
        } catch (e: any) {
          return { error: e.message };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ address }) => ({
                type: 'PROTECTED_DATA' as const,
                address,
              })),
              'PROTECTED_DATA',
            ]
          : ['PROTECTED_DATA'],
    }),
    createProtectedData: builder.mutation<string, ProtectDataParams>({
      queryFn: async (args) => {
        try {
          const data = await iExecDataProtector?.protectData(args);
          return { data: data?.address || 'No Protected Data Created' };
        } catch (e: any) {
          return { error: e.message };
        }
      },
      invalidatesTags: ['PROTECTED_DATA'],
    }),
    fetchGrantedAccess: builder.query<string[], string>({
      queryFn: async (protectedData) => {
        try {
          const grantedAccess = await iExecDataProtector?.fetchGrantedAccess({
            protectedData,
          });
          const grantedAccessList = grantedAccess
            ?.filter((item: GrantedAccess) => {
              const apprestrict = item?.apprestrict?.toLowerCase();
              return (
                apprestrict === DAPP_WEB3_MAIL_ADDRESS ||
                apprestrict === AddressZero
              );
            })
            .map((item: GrantedAccess) => {
              return item.requesterrestrict.toLowerCase();
            });
          return { data: grantedAccessList || [] };
        } catch (e: any) {
          return { error: e.message };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((address) => ({
                type: 'GRANTED_ACCESS' as const,
                id: address,
              })),
              'GRANTED_ACCESS',
            ]
          : ['GRANTED_ACCESS'],
    }),
    revokeOneAccess: builder.mutation<
      RevokedAccess | null,
      { protectedData: string; authorizedUser: string }
    >({
      queryFn: async (args) => {
        try {
          const grantedAccessList =
            await iExecDataProtector?.fetchGrantedAccess({
              ...args,
              authorizedApp: DAPP_WEB3_MAIL_ADDRESS,
            });
          let revokedAccess: RevokedAccess | null = null;
          if (grantedAccessList && grantedAccessList.length !== 0) {
            const tempRevokedAccess = await iExecDataProtector?.revokeOneAccess(
              grantedAccessList[0]
            );
            if (tempRevokedAccess) {
              revokedAccess = tempRevokedAccess;
            }
          }
          return { data: revokedAccess };
        } catch (e: any) {
          return { error: e.message };
        }
      },
      invalidatesTags: (_result, _error, args) => [
        { type: 'GRANTED_ACCESS', id: args.authorizedUser },
      ],
    }),
  }),
});

export const {
  useFetchProtectedDataQuery,
  useCreateProtectedDataMutation,
  useFetchGrantedAccessQuery,
  useRevokeOneAccessMutation,
} = homeApi;
