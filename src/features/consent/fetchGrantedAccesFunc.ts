import { getAccount } from '@wagmi/core';
import { IExecDataProtector, GrantedAccess } from '@iexec/dataprotector';

const fetchGrantedAccesFunc = async (
  protectedData: string
): Promise<GrantedAccess[]> => {
  const dataProtector = new IExecDataProtector(window.ethereum);
  const grantedAccessArray: GrantedAccess[] =
    await dataProtector.fetchGrantedAccess({
      protectedData,
    });
  return grantedAccessArray;
};

export default fetchGrantedAccesFunc;
