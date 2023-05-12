import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IExecDataProtector } from '@iexec/dataprotector';
import { connect } from 'wagmi/actions';
import { InjectedConnector } from '@wagmi/connectors/injected';

export const api = createApi({
  baseQuery: fetchBaseQuery(),
  endpoints: () => ({}),
});

export const getIExecDataProtectorAndRefresh =
  async (): Promise<IExecDataProtector> => {
    try {
      const result = await connect({
        connector: new InjectedConnector() as any,
      });
      const provider = await result.connector?.getProvider();
      const iExecDataProtector = new IExecDataProtector(provider);
      return iExecDataProtector;
    } catch (error) {
      return error;
    }
  };
