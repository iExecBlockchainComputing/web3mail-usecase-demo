import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {
  EthereumClient,
  w3mProvider,
  w3mConnectors,
} from '@web3modal/ethereum';
import { createClient, configureChains } from 'wagmi';
import { watchAccount, watchNetwork } from 'wagmi/actions';
import { bellecour } from '../utils/walletConnection';
import { api } from './api';
import appReducer, { initSDK } from './appSlice';

// Wagmi Client initialization
if (!import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID) {
  throw new Error(
    'You need to provide VITE_WALLET_CONNECT_PROJECT_ID env variable'
  );
}
export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!;
const chains = [bellecour];
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({
    version: 2,
    chains,
    projectId,
  }),
  provider,
});

// Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiClient, chains);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['app/initSDK/fulfilled', 'app/initSDK/rejected'],
        ignoredPaths: ['app.iExecDataProtector', 'api.mutations'],
      },
    }).concat(api.middleware),
});

//update app state on account change & network change
watchAccount((account) => {
  if (account.address) {
    store.dispatch(initSDK());
  }
});

watchNetwork((network) => {
  if (network.chain) {
    store.dispatch(initSDK());
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
