import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAccount } from 'wagmi/actions';
import { IExec } from 'iexec';
import {
  ProtectedData,
  IExecDataProtector,
  ProtectDataParams,
  GrantedAccess,
  RevokedAccess,
  GrantAccessParams,
} from '@iexec/dataprotector';
import {
  IExecWeb3mail,
  SendEmailParams,
  SendEmailResponse,
  Contact,
} from '@iexec/web3mail';
import { SMART_CONTRACT_WEB3MAIL_WHITELIST } from '../config/config';
import { grantAccess } from './grantAccess';
import { RootState } from './store';
import { api } from './api';

// Configure iExec Data Protector & Web3Mail
let iExecDataProtector: IExecDataProtector | null = null;
let iExecWeb3Mail: IExecWeb3mail | null = null;
let iexec: IExec;

export interface AppState {
  status: 'Not Connected' | 'Connected' | 'Loading' | 'Failed';
  error: string | null;
}

const initialState: AppState = {
  status: 'Not Connected',
  error: null,
};

export const initSDK = createAsyncThunk('app/initSDK', async () => {
  try {
    const result = getAccount();
    const provider = await result.connector?.getProvider();
    iExecDataProtector = new IExecDataProtector(provider);
    iExecWeb3Mail = new IExecWeb3mail(provider);
    iexec = new IExec({ ethProvider: provider });
  } catch (e: any) {
    return { error: e.message };
  }
});

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    resetAppState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(initSDK.pending, (state) => {
        state.status = 'Loading';
      })
      .addCase(initSDK.fulfilled, (state) => {
        state.status = 'Connected';
      })
      .addCase(initSDK.rejected, (state, action) => {
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
export const { resetAppState } = appSlice.actions;

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
                id: address,
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

    fetchGrantedAccess: builder.query<
      { grantedAccessList: string[]; count: number },
      { protectedData: string; page: number; pageSize: number }
    >({
      queryFn: async (args) => {
        try {
          const { protectedData, page, pageSize } = args;
          const allGrantedAccess = await iExecDataProtector?.fetchGrantedAccess(
            {
              protectedData,
              authorizedApp: SMART_CONTRACT_WEB3MAIL_WHITELIST,
              page,
              pageSize,
            }
          );
          if (!allGrantedAccess) {
            throw new Error('No granted access found');
          }
          const { grantedAccess: grantedAddresses, count } = allGrantedAccess;
          const grantedAddressesList = grantedAddresses?.map(
            (item: GrantedAccess) => {
              return item.requesterrestrict.toLowerCase();
            }
          );
          return {
            data: { grantedAccessList: grantedAddressesList || [], count },
          };
        } catch (e: any) {
          return { error: e.message };
        }
      },
      providesTags: (result) => {
        if (!result?.grantedAccessList) {
          return ['GRANTED_ACCESS'];
        }
        return [
          ...result.grantedAccessList.map((address) => ({
            type: 'GRANTED_ACCESS' as const,
            id: address,
          })),
          'GRANTED_ACCESS',
        ];
      },
    }),

    revokeOneAccess: builder.mutation<
      RevokedAccess | null,
      { protectedData: string; authorizedUser: string }
    >({
      queryFn: async (args) => {
        try {
          const { protectedData, authorizedUser } = args;
          const allGrantedAccess = await iExecDataProtector?.fetchGrantedAccess(
            {
              protectedData,
              authorizedApp: SMART_CONTRACT_WEB3MAIL_WHITELIST,
              authorizedUser,
            }
          );
          let revokedAccess: RevokedAccess | null = null;
          if (
            allGrantedAccess &&
            allGrantedAccess.grantedAccess?.length !== 0
          ) {
            const tempRevokedAccess = await iExecDataProtector?.revokeOneAccess(
              allGrantedAccess.grantedAccess[0]
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

    grantNewAccess: builder.mutation<string, GrantAccessParams>({
      queryFn: async (args) => {
        try {
          // const data = await iExecDataProtector?.grantAccess(args);
          // Go through a more low level iexec function = bypass enclave check done in dataprotector-sdk
          const data = await grantAccess({ iexec, ...args });
          return { data: data?.sign || '' };
        } catch (e: any) {
          return { error: e.message };
        }
      },
      invalidatesTags: ['GRANTED_ACCESS'],
    }),

    fetchMyContacts: builder.query<Contact[], string>({
      queryFn: async () => {
        try {
          const contacts = await iExecWeb3Mail?.fetchMyContacts();
          return { data: contacts || [] };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),

    sendEmail: builder.mutation<SendEmailResponse | null, SendEmailParams>({
      queryFn: async (args) => {
        try {
          const sendEmailResponse = await iExecWeb3Mail?.sendEmail(args);
          return { data: sendEmailResponse || null };
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
  useRevokeOneAccessMutation,
  useFetchMyContactsQuery,
  useGrantNewAccessMutation,
  useSendEmailMutation,
} = homeApi;
