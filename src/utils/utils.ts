import { DataSchema } from '@iexec/dataprotector';

export const isDataSchemaHasKey = (
  dataSchema: DataSchema,
  key: string
): boolean => {
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
      isDataSchemaHasKey(value as DataSchema, key)
    ) {
      return true;
    }
  }

  return false;
};

export const getShortAddress = (address: string) => {
  const getShortAddress = address.slice(0, 6) + '...' + address.slice(-4);
  return getShortAddress;
};

export const createArrayBufferFromFile = async (
  file?: File
): Promise<ArrayBuffer> => {
  const fileReader = new FileReader();
  if (file) {
    return new Promise((resolve, reject) => {
      fileReader.onerror = () => {
        fileReader.abort();
        reject(new DOMException('Error parsing input file.'));
      };
      fileReader.onload = () => {
        resolve(fileReader.result as ArrayBuffer);
      };
      fileReader.readAsArrayBuffer(file);
    });
  } else {
    return Promise.reject(new Error('No file selected'));
  }
};
