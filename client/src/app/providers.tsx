'use client';

import React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, hardhat } from "viem/chains";
import { publicProvider } from "wagmi/providers/public"

const { chains, publicClient } = configureChains(
  [
    mainnet,
    hardhat
  ],
  [
    publicProvider()
  ]
);

const projectId = "91123e3eafe4c736a115f6e3f6484a47";

const { connectors } = getDefaultWallets({
    appName: "Gearbox Task",
    projectId: projectId,
    chains
  })
  
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })
  

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}