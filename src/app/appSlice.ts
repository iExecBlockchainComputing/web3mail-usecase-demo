import {
  ProtectedData,
  IExecDataProtector,
  ProtectDataParams,
  GrantedAccess,
  RevokedAccess,
  GrantAccessParams,
} from '@iexec/dataprotector';
import { SendEmailParams, SendEmailResponse, Contact } from '@iexec/web3mail';
import { WEB3MAIL_IDAPPS_WHITELIST_SC } from '../config/config';
import { buildErrorData } from '../utils/errorForClient';

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
          });
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
  }),
});
