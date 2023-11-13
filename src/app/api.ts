import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery(),
  tagTypes: ['GRANTED_ACCESS', 'PROTECTED_DATA', 'CONTACTS'],
  endpoints: () => ({}),
});
