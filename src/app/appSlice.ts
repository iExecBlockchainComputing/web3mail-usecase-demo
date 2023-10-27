import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAccount } from 'wagmi/actions';
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
    fetchGrantedAccess: builder.query<string[], string>({
      queryFn: async (protectedData) => {
        try {
          const grantedAccess = await iExecDataProtector?.fetchGrantedAccess({
            protectedData,
            authorizedApp: SMART_CONTRACT_WEB3MAIL_WHITELIST,
          });
          const grantedAccessList = grantedAccess?.map(
            (item: GrantedAccess) => {
              return item.requesterrestrict.toLowerCase();
            }
          );
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
              authorizedApp: SMART_CONTRACT_WEB3MAIL_WHITELIST,
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
      queryFn: async (args) => {
        console.log('args', args);
        const { page, pageSize } = args;
        try {
          //TODO : update function parameters (page, pageSize)
          console.log('CALL');
          const contacts = await iExecWeb3Mail?.fetchMyContacts({
            page: page || 1,
            pageSize: pageSize,
          });
          console.log('-> contacts', contacts);
          for (let i = 0; i < 15; i++) {
            contacts.push({
              accessGrantTimestamp: '2023-10-24T15:30:27.419Z',
              address: i + '0xcd7c44e832ae9371f7956a73322498064fc5183',
              owner: i + '0x253bde8071d213a8a87e93a674f516f9fb623b4',
            });
          }
          return { data: contacts || [] };
        } catch (e: any) {
          console.log('plop?', e);
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
