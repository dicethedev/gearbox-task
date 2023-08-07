import { ethers } from "hardhat";
import { IMPERSONATED_ADDRESS, 
     USDC_ADDRESS, 
     ERC20_TOKEN_ABI,
     GEARBOX_ABI,
     GEARBOX_PROTOCOL_ADDRESS,
     DIESEL_TOKEN_ADDRESS,
     DIESEL_ABI
} from "./constant";
// const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function main() {
     const impersonatedSigner = await ethers.getImpersonatedSigner(IMPERSONATED_ADDRESS)
     const interactor = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
     const interactorSigner = await ethers.getSigner(interactor);
     
     // get contract
     const USDC = await ethers.getContractAt(ERC20_TOKEN_ABI, USDC_ADDRESS, impersonatedSigner);
     const USDC_INT = await ethers.getContractAt(ERC20_TOKEN_ABI, USDC_ADDRESS, interactorSigner);
     const GEARBOX_PROTOCOL_IA = await ethers.getContractAt(GEARBOX_ABI, GEARBOX_PROTOCOL_ADDRESS, impersonatedSigner);
     const GEARBOX_PROTOCOL_INT = await ethers.getContractAt(GEARBOX_ABI, GEARBOX_PROTOCOL_ADDRESS, interactorSigner)
     const DIESEL = await ethers.getContractAt(DIESEL_ABI, DIESEL_TOKEN_ADDRESS, impersonatedSigner);


     // contract interaction
     // transfer usdc to interactor account before whole processes

     const diesel_bal_IA = await DIESEL.balanceOf(IMPERSONATED_ADDRESS);
     console.log(`IA diesel balance: ${diesel_bal_IA}`);

     await GEARBOX_PROTOCOL_IA.removeLiquidity(diesel_bal_IA, interactor);

     const usdc_bal = await USDC.balanceOf(IMPERSONATED_ADDRESS);
     const usdc_bal_int = await USDC.balanceOf(interactor);
     

     console.log(`Impersonated account (IA) usdc balance before transfer ${usdc_bal} and interactor balance before transfer: ${usdc_bal_int}`);

     await USDC.transfer(interactor, usdc_bal);

     const usdc_bal_after = await USDC.balanceOf(IMPERSONATED_ADDRESS);
     const uscd_bal_interactor = await USDC.balanceOf(interactor);

     console.log(`IA usdc balance after transfer: ${usdc_bal_after} and interactor balance after transfer: ${uscd_bal_interactor}`);

     // interactor add liquidity and check diesel given in return
     await USDC_INT.approve(GEARBOX_PROTOCOL_ADDRESS, uscd_bal_interactor);
     await GEARBOX_PROTOCOL_INT.addLiquidity(uscd_bal_interactor, interactor, 0);

     const diesel_bal = await DIESEL.balanceOf(interactor)
     console.log(`Balance of diesel after adding liquidity: ${diesel_bal}`);
     
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });