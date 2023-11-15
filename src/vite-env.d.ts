/// <reference types="vite/client" />
interface Window {
  ethereum: any;
}

interface ImportMetaEnv {
  readonly WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_COMMIT_HASH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
