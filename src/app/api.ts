import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IExecDataProtector } from '@iexec/dataprotector';
import { getAccount } from 'wagmi/actions';

export const api = createApi({
  baseQuery: fetchBaseQuery(),
  endpoints: () => ({}),
});