import { DataSchema } from '@iexec/dataprotector';
import { TimeStamp } from '@iexec/web3mail';

export const isKeyInDataSchema = (
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
      isKeyInDataSchema(value as DataSchema, key)
    ) {
      return true;
    }
  }

  return false;
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

// from TimeStamp => 2023-06-23T17:46:37.212Z
export const getLocalDateFromTimeStamp = (
  timestamp: TimeStamp | number
): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

export const getLocalDateFromBlockchainTimestamp = (
  timestamp: number
): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
};
