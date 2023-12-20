import {
  Wallet,
  JsonRpcProvider,
  Provider,
  Signer,
  getAddress,
  getBytes,
  toQuantity,
} from 'ethers';

const PROVIDERS_MAP = {
  134: new JsonRpcProvider('https://bellecour.iex.ec', {
    name: 'bellecour',
    chainId: 134,
  }),
};

export const WALLET_MAP = {
  TEST: {
    wallet: new Wallet(
      '0x564a9db84969c8159f7aa3d5393c5ecd014fce6a375842a45b12af6677b12407'
    ),
    provider: PROVIDERS_MAP[134],
    name: 'Test wallet',
    rdns: 'io.metamask',
    uuid: '5889de0c-c4a0-4699-ad74-64533b22c2e4',
  },
  RANDOM: {
    wallet: Wallet.createRandom(),
    provider: PROVIDERS_MAP[134],
    name: 'Random wallet',
    rdns: 'com.example',
    uuid: 'f408dd08-c293-47c8-90a1-d37e69f3411d',
  },
};

class Eip1193Bridge {
  readonly signer: Signer;
  readonly provider: Provider;

  constructor(signer: Signer, provider: Provider) {
    this.provider = provider;
    this.signer = signer;
  }

  request(request: { method: string; params?: Array<any> }): Promise<any> {
    return this.send(request.method, request.params || []);
  }

  async send(method: string, params: Array<any>): Promise<any> {
    function throwUnsupported(message: string): never {
      throw Error(`Unsupported operation: ${message}`);
    }
    switch (method) {
      case 'eth_gasPrice': {
        const result = await this.provider.getFeeData();
        return result.gasPrice && toQuantity(result.gasPrice);
      }
      case 'eth_accounts': {
        const result = [];
        if (this.signer) {
          const address = await this.signer.getAddress();
          result.push(address);
        }
        return result;
      }
      case 'eth_blockNumber': {
        return await this.provider.getBlockNumber();
      }
      case 'eth_chainId': {
        const result = await this.provider.getNetwork();
        return toQuantity(result.chainId);
      }
      case 'eth_getBalance': {
        const result = await this.provider.getBalance(params[0], params[1]);
        return toQuantity(result);
      }
      case 'eth_getStorageAt': {
        return this.provider.getStorage(params[0], params[1], params[2]);
      }
      case 'eth_getTransactionCount': {
        const result = await this.provider.getTransactionCount(
          params[0],
          params[1]
        );
        return toQuantity(result);
      }
      case 'eth_getBlockTransactionCountByHash':
      case 'eth_getBlockTransactionCountByNumber': {
        const result = await this.provider.getBlock(params[0]);
        return result && toQuantity(result.transactions.length);
      }
      case 'eth_getCode': {
        const result = await this.provider.getCode(params[0], params[1]);
        return result;
      }
      case 'eth_sendRawTransaction': {
        if (!this.provider.sendTransaction) {
          throwUnsupported('eth_sendRawTransaction');
        }
        return await this.provider.sendTransaction(params[0]);
      }
      case 'eth_call': {
        return await this.provider.call(params[0]);
      }
      case 'eth_estimateGas': {
        if (params[1] && params[1] !== 'latest') {
          throwUnsupported('estimateGas does not support blockTag');
        }
        const result = await this.provider.estimateGas(params[0]);
        return toQuantity(result);
      }
      case 'eth_getBlockByHash':
      case 'eth_getBlockByNumber': {
        return await this.provider.getBlock(params[0]);
      }
      case 'eth_getTransactionByHash': {
        return await this.provider.getTransaction(params[0]);
      }
      case 'eth_getTransactionReceipt': {
        return await this.provider.getTransactionReceipt(params[0]);
      }
      case 'eth_sign': {
        if (!this.signer) {
          return throwUnsupported('eth_sign requires an account');
        }
        const address = await this.signer.getAddress();
        if (address !== getAddress(params[0])) {
          throw Error(`account mismatch or account not found ${params[0]}`);
        }
        return this.signer.signMessage(getBytes(params[1]));
      }

      case 'eth_sendTransaction': {
        if (!this.signer) {
          return throwUnsupported('eth_sendTransaction requires an account');
        }
        const tx = await this.signer.sendTransaction(params[0]);
        return tx.hash;
      }
      case 'personal_sign': {
        return this.signer.signMessage(getBytes(params[0]));
      }
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4': {
        const typedData = JSON.parse(params[1]);
        const { EIP712Domain, ...types } = typedData.types;
        const { message, domain } = typedData;
        return await this.signer.signTypedData(domain, types, message);
      }
      case 'eth_getUncleCountByBlockHash':
      case 'eth_getUncleCountByBlockNumber':
      case 'eth_getTransactionByBlockHashAndIndex':
      case 'eth_getTransactionByBlockNumberAndIndex':
      case 'eth_getUncleByBlockHashAndIndex':
      case 'eth_getUncleByBlockNumberAndIndex':
      case 'eth_newFilter':
      case 'eth_newBlockFilter':
      case 'eth_newPendingTransactionFilter':
      case 'eth_uninstallFilter':
      case 'eth_getFilterChanges':
      case 'eth_getFilterLogs':
      case 'eth_getLogs':
        break;
    }
    return throwUnsupported(`unsupported method: ${method}`);
  }
}

export class Eip1193Provider extends Eip1193Bridge {
  constructor(signer: Signer, provider: JsonRpcProvider) {
    super(signer.connect(provider), provider);
  }

  isMetaMask = true;

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

    let rpcPromise: Promise<any>;
    if (method === 'eth_requestAccounts') {
      // mock user accept unlock
      rpcPromise = super.send('eth_accounts', params);
    } else {
      rpcPromise = super.send(method, params);
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

export const addEip6963ProvidersToWindow = (win: Cypress.AUTWindow) => {
  win.addEventListener('eip6963:requestProvider', () => {
    Object.values(WALLET_MAP).forEach(
      ({ wallet, name, uuid, rdns, provider }) => {
        win.dispatchEvent(
          new CustomEvent('eip6963:announceProvider', {
            detail: Object.freeze({
              info: {
                uuid,
                name,
                rdns,
                icon: 'data:image/svg+xml,%3Csvg%20fill%3D%22none%22%20height%3D%2233%22%20viewBox%3D%220%200%2035%2033%22%20width%3D%2235%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%22.25%22%3E%3Cpath%20d%3D%22m32.9582%201-13.1341%209.7183%202.4424-5.72731z%22%20fill%3D%22%23e1d526%22%20stroke%3D%22%23e1d526%22%2F%3E%3Cg%20fill%3D%22%23e2d525%22%20stroke%3D%22%23e2d525%22%3E%3Cpath%20d%3D%22m2.66296%201%2013.01714%209.809-2.3254-5.81802z%22%2F%3E%3Cpath%20d%3D%22m28.2295%2023.5335-3.4947%205.3386%207.4829%202.0603%202.1436-7.2823z%22%2F%3E%3Cpath%20d%3D%22m1.27281%2023.6501%202.13055%207.2823%207.46994-2.0603-3.48166-5.3386z%22%2F%3E%3Cpath%20d%3D%22m10.4706%2014.5149-2.0786%203.1358%207.405.3369-.2469-7.969z%22%2F%3E%3Cpath%20d%3D%22m25.1505%2014.5149-5.1575-4.58704-.1688%208.05974%207.4049-.3369z%22%2F%3E%3Cpath%20d%3D%22m10.8733%2028.8721%204.4819-2.1639-3.8583-3.0062z%22%2F%3E%3Cpath%20d%3D%22m20.2659%2026.7082%204.4689%202.1639-.6105-5.1701z%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22m24.7348%2028.8721-4.469-2.1639.3638%202.9025-.039%201.231z%22%20fill%3D%22%23d5bfb2%22%20stroke%3D%22%23d5bfb2%22%2F%3E%3Cpath%20d%3D%22m10.8732%2028.8721%204.1572%201.9696-.026-1.231.3508-2.9025z%22%20fill%3D%22%23d5bfb2%22%20stroke%3D%22%23d5bfb2%22%2F%3E%3Cpath%20d%3D%22m15.1084%2021.7842-3.7155-1.0884%202.6243-1.2051z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%2F%3E%3Cpath%20d%3D%22m20.5126%2021.7842%201.0913-2.2935%202.6372%201.2051z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%2F%3E%3Cpath%20d%3D%22m10.8733%2028.8721.6495-5.3386-4.13117.1167z%22%20fill%3D%22%23ccb428%22%20stroke%3D%22%23ccb428%22%2F%3E%3Cpath%20d%3D%22m24.0982%2023.5335.6366%205.3386%203.4946-5.2219z%22%20fill%3D%22%23ccb428%22%20stroke%3D%22%23ccb428%22%2F%3E%3Cpath%20d%3D%22m27.2291%2017.6507-7.405.3369.6885%203.7966%201.0913-2.2935%202.6372%201.2051z%22%20fill%3D%22%23ccb428%22%20stroke%3D%22%23ccb428%22%2F%3E%3Cpath%20d%3D%22m11.3929%2020.6958%202.6242-1.2051%201.0913%202.2935.6885-3.7966-7.40495-.3369z%22%20fill%3D%22%23ccb428%22%20stroke%3D%22%23ccb428%22%2F%3E%3Cpath%20d%3D%22m8.392%2017.6507%203.1049%206.0513-.1039-3.0062z%22%20fill%3D%22%23e2d425%22%20stroke%3D%22%23e2d425%22%2F%3E%3Cpath%20d%3D%22m24.2412%2020.6958-.1169%203.0062%203.1049-6.0513z%22%20fill%3D%22%23e2d425%22%20stroke%3D%22%23e2d425%22%2F%3E%3Cpath%20d%3D%22m15.797%2017.9876-.6886%203.7967.8704%204.4833.1949-5.9087z%22%20fill%3D%22%23e2d425%22%20stroke%3D%22%23e2d425%22%2F%3E%3Cpath%20d%3D%22m19.8242%2017.9876-.3638%202.3584.1819%205.9216.8704-4.4833z%22%20fill%3D%22%23e2d425%22%20stroke%3D%22%23e2d425%22%2F%3E%3Cpath%20d%3D%22m20.5127%2021.7842-.8704%204.4834.6236.4406%203.8584-3.0062.1169-3.0062z%22%20fill%3D%22%23f5ef1f%22%20stroke%3D%22%23f5ef1f%22%2F%3E%3Cpath%20d%3D%22m11.3929%2020.6958.104%203.0062%203.8583%203.0062.6236-.4406-.8704-4.4834z%22%20fill%3D%22%23f5ef1f%22%20stroke%3D%22%23f5ef1f%22%2F%3E%3Cpath%20d%3D%22m20.5906%2030.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026%201.231-4.1572-1.9696%201.4551%201.1921%202.9489%202.0344h5.0536l2.962-2.0344%201.442-1.1921z%22%20fill%3D%22%23c0be9d%22%20stroke%3D%22%23c0be9d%22%2F%3E%3Cpath%20d%3D%22m20.2659%2026.7082-.6236-.4406h-3.6635l-.6236.4406-.3508%202.9025.3248-.2851h4.9626l.3378.2851z%22%20fill%3D%22%23161616%22%20stroke%3D%22%23161616%22%2F%3E%3Cpath%20d%3D%22m33.5168%2011.3532%201.1043-5.36447-1.6629-4.98873-12.6923%209.3944%204.8846%204.1205%206.8983%202.0085%201.52-1.7752-.6626-.4795%201.0523-.9588-.8054-.622%201.0523-.8034z%22%20fill%3D%22%23766c1a%22%20stroke%3D%22%23766c1a%22%2F%3E%3Cpath%20d%3D%22m1%205.98873%201.11724%205.36447-.71451.5313%201.06527.8034-.80545.622%201.05228.9588-.66255.4795%201.51997%201.7752%206.89835-2.0085%204.8846-4.1205-12.69233-9.3944z%22%20fill%3D%22%23766c1a%22%20stroke%3D%22%23766c1a%22%2F%3E%3Cpath%20d%3D%22m32.0489%2016.5234-6.8983-2.0085%202.0786%203.1358-3.1049%206.0513%204.1052-.0519h6.1318z%22%20fill%3D%22%23f5ef1f%22%20stroke%3D%22%23f5ef1f%22%2F%3E%3Cpath%20d%3D%22m10.4705%2014.5149-6.89828%202.0085-2.29944%207.1267h6.11883l4.10519.0519-3.10487-6.0513z%22%20fill%3D%22%23f5ef1f%22%20stroke%3D%22%23f5ef1f%22%2F%3E%3Cpath%20d%3D%22m19.8241%2017.9876.4417-7.5932%202.0007-5.4034h-8.9119l2.0006%205.4034.4417%207.5932.1689%202.3842.013%205.8958h3.6635l.013-5.8958z%22%20fill%3D%22%23f5ef1f%22%20stroke%3D%22%23f5ef1f%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',
              },
              provider: new Eip1193Provider(wallet, provider),
            }),
          })
        );
      }
    );
  });
};
