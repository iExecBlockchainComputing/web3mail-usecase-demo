import { type Connector } from 'wagmi';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
import {
  IExecWeb3telegram,
  SendTelegramParams,
  SendTelegramResponse,
} from '@iexec/web3telegram';

import { WEB3MAIL_IDAPPS_WHITELIST_SC } from '../config/config';
import { buildErrorData } from '../utils/errorForClient';
import { RootState } from './store';
import { api } from './api';

// Configure iExec Data Protector & Web3Mail
let iExecDataProtector: IExecDataProtector | null = null;
let iExecWeb3Mail: IExecWeb3mail | null = null;
let iExecWeb3Telegram: IExecWeb3telegram | null = null;

export interface AppState {
  status: 'Not Connected' | 'Connected' | 'Loading' | 'Failed';
  error: string | null;
}

const initialState: AppState = {
  status: 'Not Connected',
  error: null,
};

export const initSDK = createAsyncThunk(
  'app/initSDK',
  async ({ connector }: { connector: Connector }) => {
    const provider = await connector?.getProvider();
    const smsURL = 'https://sms.scone-debug.v8-bellecour.iex.ec';
    console.log('smsURL', smsURL);
    iExecDataProtector = new IExecDataProtector(provider, {
      iexecOptions: {
        smsURL,
      },
    });
    iExecWeb3Mail = new IExecWeb3mail(provider);
    iExecWeb3Telegram = new IExecWeb3telegram(provider, {
      iexecOptions: {
        smsURL,
      },
    });
  }
);

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
        state.error = String(action.error.message);
      });
  },
});

export default appSlice.reducer;

export const selectAppIsConnected = (state: RootState) =>
  state.app.status === 'Connected';

export const { resetAppState } = appSlice.actions;

export const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchProtectedData: builder.query<ProtectedData[], string>({
      queryFn: async (owner) => {
        try {
          const data = await iExecDataProtector?.fetchProtectedData({ owner });
          return { data: data || [] };
        } catch (err: any) {
          const errorData = buildErrorData(err);
          console.error('[fetchProtectedData]', errorData);
          return { error: errorData.reason || err.message };
        }
      },
      providesTags: ['PROTECTED_DATA'],
    }),

    createProtectedData: builder.mutation<string, ProtectDataParams>({
      queryFn: async (args) => {
        try {
          const data = await iExecDataProtector?.protectData(args);
          return { data: data?.address || 'No Protected Data Created' };
        } catch (err: any) {
          const errorData = buildErrorData(err);
          console.error('[createProtectedData]', errorData);
          return { error: errorData.reason || err.message };
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
          const grantedAccessResponse =
            await iExecDataProtector?.fetchGrantedAccess({
              protectedData,
              authorizedApp: WEB3MAIL_IDAPPS_WHITELIST_SC,
              page,
              pageSize,
            });
          if (!grantedAccessResponse) {
            throw new Error('No granted access found');
          }
          const { grantedAccess, count } = grantedAccessResponse;
          const grantedAddressesList = grantedAccess?.map(
            (item: GrantedAccess) => {
              return item.requesterrestrict.toLowerCase();
            }
          );
          return {
            data: { grantedAccessList: grantedAddressesList || [], count },
          };
        } catch (err: any) {
          const errorData = buildErrorData(err);
          console.error('[fetchGrantedAccess]', errorData);
          return { error: errorData.reason || err.message };
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
          const grantedAccessResponse =
            await iExecDataProtector?.fetchGrantedAccess({
              protectedData,
              authorizedApp: WEB3MAIL_IDAPPS_WHITELIST_SC,
              authorizedUser,
            });
          let revokedAccess: RevokedAccess | null = null;
          if (
            grantedAccessResponse &&
            grantedAccessResponse.grantedAccess?.length !== 0
          ) {
            const tempRevokedAccess = await iExecDataProtector?.revokeOneAccess(
              grantedAccessResponse.grantedAccess[0]
            );
            if (tempRevokedAccess) {
              revokedAccess = tempRevokedAccess;
            }
          }
          return { data: revokedAccess };
        } catch (err: any) {
          const errorData = buildErrorData(err);
          console.error('[revokeOneAccess]', errorData);
          return { error: errorData.reason || err.message };
        }
      },
      invalidatesTags: (_result, _error, args) => [
        { type: 'GRANTED_ACCESS', id: args.authorizedUser },
        'CONTACTS',
      ],
    }),

    grantNewAccess: builder.mutation<string, GrantAccessParams>({
      queryFn: async (args) => {
        console.log('args', args);
        try {
          const data = await iExecDataProtector?.grantAccess(args);
          return { data: data?.sign || '' };
        } catch (err: any) {
          const errorData = buildErrorData(err);
          console.error('[grantNewAccess]', errorData);
          return { error: errorData.reason || err.message };
        }
      },
      invalidatesTags: ['GRANTED_ACCESS', 'CONTACTS'],
    }),

    fetchMyContacts: builder.query<Contact[], string>({
      queryFn: async () => {
        try {
          const contacts = await iExecWeb3Mail?.fetchMyContacts({
            isUserStrict: false, // Keep existing behaviour
            // isUserStrict, // TODO
          }); //todo : fetch pour afficher la liste des contact telegraù sur la page sendtelegram
          return { data: contacts || [] };
        } catch (err: any) {
          const errorData = buildErrorData(err);
          console.error('[fetchMyContacts]', errorData);
          return { error: errorData.reason || err.message };
        }
      },
      providesTags: () => {
        return ['CONTACTS'];
      },
    }),

    fetchMyTelegramContacts: builder.query<Contact[], string>({
      queryFn: async () => {
        try {
          console.log('appslice call');
          // console.log(iExecWeb3Telegram);

          const contacts = await iExecWeb3Telegram?.fetchMyContacts(); //todo : fetch pour afficher la liste des contact telegraù sur la page sendtelegram
          console.log('contacts :', contacts);
          return { data: contacts || [] };
        } catch (err: any) {
          const errorData = buildErrorData(err);
          console.error('[fetchMyContacts]', errorData);
          return { error: errorData.reason || err.message };
        }
      },
      providesTags: () => {
        return ['CONTACTS'];
      },
    }),

    sendEmail: builder.mutation<SendEmailResponse | null, SendEmailParams>({
      queryFn: async (args) => {
        try {
          const sendEmailResponse = await iExecWeb3Mail?.sendEmail(args);
          return { data: sendEmailResponse || null };
        } catch (err: any) {
          const errorData = buildErrorData(err);
          console.error('[sendEmail]', errorData);
          // Temporary workaround to have a more explicit error
          if (err.message === 'Dataset order not found') {
            return {
              error: `${err.message}: you might have exceeded the allowed quota defined by the user.`,
            };
          }
          return { error: errorData.reason || err.message };
        }
      },
    }),

    //sendTelegram: builder.mutation<SendTelegramResponse | null, SendTelegramParams>({
    sendTelegram: builder.mutation<
      SendTelegramResponse | null,
      SendTelegramParams
    >({
      queryFn: async (args) => {
        console.log('args', args);
        try {
          const sendTelegramResponse =
            await iExecWeb3Telegram?.sendTelegram(args); //TODO : changer sendTelegram, avec le new sdk ?
          return { data: sendTelegramResponse || null };
        } catch (err: any) {
          const errorData = buildErrorData(err);
          console.error('[sendTelegram]', errorData);
          // Temporary workaround to have a more explicit error
          if (err.message === 'Dataset order not found') {
            return {
              error: `${err.message}: you might have exceeded the allowed quota defined by the user.`,
            };
          }
          return { error: errorData.reason || err.message };
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
  useFetchMyTelegramContactsQuery,
  useGrantNewAccessMutation,
  useSendEmailMutation,
  useSendTelegramMutation,
} = homeApi;
