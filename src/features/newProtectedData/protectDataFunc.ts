import { getAccount } from '@wagmi/core';
import { IExecDataProtector, DataSchema } from '@iexec/dataprotector';

const protectDataFunc = async (data: DataSchema, name: string) => {
  const result = getAccount();
  const provider = await result.connector?.getProvider();
  const dataProtector = new IExecDataProtector(provider);
  const { dataAddress } = await dataProtector.protectData({
    data,
    name,
  });
  return dataAddress;
};

export default protectDataFunc;
