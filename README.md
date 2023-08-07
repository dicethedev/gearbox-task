## Folder Structure - CLIENT - i.e.... "Frontend Folder"

````
src/
├── app/
│   ├── home/
│   │   ├── homeUI       
│   │   ├── index.tsx  // Homepage 
│   ├── layout.tsx  // Home layout 
│   ├── page.tsx  // Page Home
├── error.tsx // error file that defines an error UI boundary for a route segment
├── favicon.ico // favicon file for the app
├── global.css // global css file for the app
├── layout.tsx // layout file for the whole app and the Providers file was 
├── page.tsx // page file for the app to redirect straight to home using the inbuilt next app router
├── providers.tsx // providers file for the app to handle the connect wallet button configuration
├── assets/ 
|   ├── json // json folder where all the json file animation is found
├── components/
│   ├── AddLiquidity/ 
|   |   ├── index.tsx  //add liquidity UI file is here
│   ├── SwapTokens/ 
|   |   ├── index.tsx  //Swap Tokens UI file is here
│   ├── TakeOutLiquidity/ 
|   |   ├── index.tsx  //take out liquidity UI file is here
├── constants/
│   ├── styles.ts/ css style for the whole css styling on the app
├── hooks/
│   ├── useApprove.tsx/ custom hook to approve token is here
│   ├── useSendGearBoxEth.tsx/ custom hook to send Gear box Ethereum interaction is here
│   ├── useSendGearBoxUsdc.tsx/ custom hook to send Gear box USDC interaction here
│   ├── useSendUniswap.tsx/ custom hook to send Uniswap interaction is here
│   ├── useTokenCall.tsx/ custom hook to call tokens with ERC20 token is here
│   │    
│   │   
│   └── ...
└── ...
```

## Folder Structure - HardHat Forking

scripts/
├── constant.ts/ constant contain all the contract address and abi use when forking from mainnet
├── forking/ forking file contain line of code that is performing the forking from mainnet  
hardhat.config.ts/ it contain the setup for running the forking from mainnet locally
│   │   
│   └── ...
└── ...

Install your node_modules by using before trying to run the script

```bash
yarn
# or
yarn install
```

```bash - to run the node locally on the terminal
yarn hardhat node
```

```bash - to run the hardhat scripts for the forking.ts file locally
yarn hardhat run scripts/forking.ts --network localhost
```

## Get the Frontend & MetaMask working with this project task 

Step 1:
After `yarn hardhat node` on your terminal. Go to metamask to import wallet l.e a new wallet, then copy Account #1: Private Key and input the private and import wallet.
 
 or

 you can copy any Account Private and import and test.

Step 2:
Go back and copy the URL for the JSON-RPC server, which is http://127.0.0.1:8545/, then manually add a network in Metamask. 

Adding Network manually
---
|-- Network name - Hardhat
|-- New RPC URL - The JSON-RPC link you copied should be pasted here - http://127.0.0.1:8545/
|-- Chain ID - 31337
!-- Currency Symbol - HardhatETH

Step3:

Add this tokens addresses to your new imported wallet on Metamask
---
|-- dUSDC - 0xc411dB5f5Eb3f7d552F9B8454B2D74097ccdE6E3
|-- USDC - 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 - Token Symbol - USDC | Token decimal - [6]
|-- WETH - 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 - Token Symbol - WETH | Token decimal - [18]

Step4:

Run the scripts i.e `forking.ts` to start the execution:
---
```bash
yarn 
# or
yarn install
```

```bash
yarn hardhat run scripts/forking.ts --network localhost
```

Step5: 

switch to another terminal and start the frontend to interact with the forking.ts script interaction
----
```bash
 cd client
```

```bash
yarn 
# or
yarn install
```

```bash
yarn dev
```

Step6: 

Interact with the Frontend and follow the steps by Taking out liquidity, swapping USDC to ETH 
and add liquidity to Gearbox ETH pool.

--------------------------------------------
Free to reach for questions..... Thank you!
--------------------------------------------


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
