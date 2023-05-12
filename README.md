<p align="center">
  <a href="https://iex.ec/" rel="noopener" target="_blank"><img width="150" src="./src/assets/logo-readme.jpg" alt="iExec logo"/></a>
</p>

<h1 align="center">DataProtector</h1>

**DataProtector** offers developers methods to create apps that provide users with unparalleled ownership over their data.

Through DataProtector, users may allow apps to use their data without ever revealing the data itself. This revolutionary approach to data management relies on:

- end-to-end encryption backed by a secure hardware environment that prevents apps from accessing users’ unencrypted data
- smart contracts that manage apps’ rights to use users’ encrypted data.

DataProtector bundles 5 methods:

- protectData — that safeguards any type of data via end-to-end encryption and hardware security while recording data ownership on a smart contract to ensure verifiability and traceability
- grantUsage — that enables an app to use users’ data without ever revealing the data itself
- revokeUsage — that disables an app to use users’ data without ever disclosing it
- fetchProtectedData — that retrieves the data that has already been protected by DataProtector
- fetchGrantedUsage — that provides the list of the apps that are allowed to use existing protected data.

<div align="center">

**[Stable channel v1](https://iex.ec/)**

[![npm](https://img.shields.io/npm/v/@iexec/dataprotector)](https://www.npmjs.com/package/@iexec/dataprotector) [![license](https://img.shields.io/badge/license-Apache%202-blue)](/LICENSE)

</div>

## Installation

### DataProtector

DataProtector is available as an [npm package](https://www.npmjs.com/package/@iexec/dataprotector).

**npm:**

```sh
npm install @iexec/dataprotector
```

**yarn:**

```sh
yarn add @iexec/dataprotector
```

## Get started

[//]: # 'Add initialize code for getting started to use SDK'

## Documentation

[//]: # 'Add link to documentation gitbook when published'

- [DataProtector](#documentation)

## License

This project is licensed under the terms of the
[Apache 2.0](/LICENSE).


# Run the use case demo

This project is a simple React TypeScript application bootstrapped with [Vite](https://vitejs.dev/). Vite provides a faster and leaner development experience for modern web projects.

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.0 or later)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

## Quick start

First, clone the repository with the following command:

```bash
git clone https://github.com/iExecBlockchainComputing/dataprotector-useCaseDemo.git
```

Navigate to the project directory:

```bash
cd dataprotector-useCaseDemo
```

Install the dependencies:

```bash
yarn install
# or
npm install
```

Then, you can run the application in development mode:

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:5173) to view it in the browser. The page will automatically reload if you make changes to the code.

## Building for production

To build the application for production, use the following command:

```bash
yarn build
# or
npm run build
```

This will create a `dist` folder with the compiled assets ready for deployment.

## Learn More

You can learn more about Vite in the [Vite documentation](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://reactjs.org/).

For TypeScript, check out the [TypeScript handbook](https://www.typescriptlang.org/docs/).
