import { useUserStore } from '@/stores/user.store.ts';
import { IExecWeb3mail } from '@iexec/web3mail';
import { Eip1193Provider } from 'ethers';
import { type Connector } from 'wagmi';

let web3mail: IExecWeb3mail | null = null;

export function cleanWeb3mailSDK() {
  web3mail = null;
}

export async function initWeb3mailSDK({
  connector,
}: {
  connector?: Connector;
}) {
  const provider = (await connector?.getProvider()) as Eip1193Provider;
  if (!provider) {
    cleanWeb3mailSDK();
    return;
  }

  web3mail = new IExecWeb3mail(provider);
}

export async function getWeb3mailClient(): Promise<{
  web3mail: IExecWeb3mail;
}> {
  if (!web3mail) {
    const connector = useUserStore.getState().connector;
    await initWeb3mailSDK({ connector });
  }
  if (!web3mail) {
    throw new Error('IExecWeb3mail is not initialized');
  }
  return { web3mail };
}
