/// <reference types="vite/client" />
interface Window {
  ethereum: any;
}

interface ImportMetaEnv {
  readonly WALLET_CONNECT_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __COMMIT_HASH__: string;
