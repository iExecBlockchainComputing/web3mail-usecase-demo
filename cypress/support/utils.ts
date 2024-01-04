import { Wallet } from 'ethers';

export const getRandomString = (length: number = 10) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

export const getRandomAddress = () =>
  Wallet.createRandom().address.toLowerCase();
