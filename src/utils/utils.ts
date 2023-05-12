import { DataSchema } from '@iexec/dataprotector';

export const hasKey = (dataSchema: DataSchema, key: string): boolean => {
  if (!dataSchema) {
    return false;
  }

  if (key in dataSchema) {
    return true;
  }

  for (const value of Object.values(dataSchema)) {
    if (
      typeof value === 'object' &&
      value !== null &&
      hasKey(value as DataSchema, key)
    ) {
      return true;
    }
  }

  return false;
};

export const shortAddress = (address: string) => {
  return address.slice(0, 6) + '...' + address.slice(-4);
};
