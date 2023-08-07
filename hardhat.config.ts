import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",

  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: "https://mainnet.infura.io/v3/b282b364c8bc4347a14d8dcd53de02ce",
      }
    },
  }
};

export default config;