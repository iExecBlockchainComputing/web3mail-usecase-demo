/**
 * Updates cy.visit() to include an injected window.ethereum provider.
 */

import { Eip1193Bridge } from '@ethersproject/experimental';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { BigNumber, utils } from 'ethers';

const TEST_PRIVATE_KEY =
  '0x564a9db84969c8159f7aa3d5393c5ecd014fce6a375842a45b12af6677b12407';
export const TEST_ADDRESS = new Wallet(TEST_PRIVATE_KEY).address;

export const toShortAddress = (address: string) =>
  `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

export const PROVIDERS_MAP = {
  134: new JsonRpcProvider('https://bellecour.iex.ec', {
    name: 'bellecour',
    chainId: 134,
  }),
};

export const wallet = new Wallet(TEST_PRIVATE_KEY);

export class MetaMaskMock extends Eip1193Bridge {
  constructor(signer: Wallet, provider: JsonRpcProvider) {
    super(signer, provider);
    this.eth_chainId = BigNumber.from(provider._network.chainId).toHexString();
  }
  private eth_chainId: string;

  isMetaMask = true;
  async sendAsync(...args: any[]) {
    console.debug('sendAsync called', ...args);
    return this.send(...args);
  }
  async send(...args: any[]) {
    console.debug('send called', ...args);
    const isCallbackForm =
      typeof args[0] === 'object' && typeof args[1] === 'function';
    let callback: (arg0: { result: any }, arg1: null | undefined) => void;
    let method;
    let params;
    if (isCallbackForm) {
      callback = args[1];
      method = args[0].method;
      params = args[0].params;
    } else {
      method = args[0];
      params = args[1];
    }
    let rpcPromise;
    switch (method) {
      case 'eth_requestAccounts':
      case 'eth_accounts':
        rpcPromise = Promise.resolve([TEST_ADDRESS]);
        break;
      case 'eth_chainId':
        rpcPromise = Promise.resolve(this.eth_chainId);
        break;
      case 'personal_sign':
        rpcPromise = this.signer.signMessage(utils.arrayify(params[0]));
        break;
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4':
        rpcPromise = (async () => {
          const typedData = JSON.parse(params[1]);
          const { EIP712Domain, ...types } = typedData.types;
          const { message, domain } = typedData;
          return await this.signer._signTypedData(domain, types, message);
        })();
        break;
      case 'eth_call':
        rpcPromise = this.provider.call(params[0]);
        break;
      case 'eth_sendTransaction':
        rpcPromise = (async () => {
          const { gas, ...gasStripped } = params[0];
          const transaction = await this.signer
            .connect(this.provider)
            .sendTransaction(gasStripped);
          const result = transaction.hash;
          return result;
        })();
        break;
      default:
        rpcPromise = super.send(method, params);
        break;
    }

    return rpcPromise
      .then((result: any) => {
        if (typeof callback === 'function') {
          callback({ result }, null);
        } else {
          return result;
        }
      })
      .catch((error: any) => {
        if (typeof callback === 'function') {
          callback(error, null);
        } else {
          throw error;
        }
      });
  }
}
