import React, { useState, useEffect } from 'react'
import {
  fontStyle, 
  buttonNextStyle, 
  maxButtonStyle, 
  inputContainer, 
  inputStyle,
  centerContainer,
  buttonRemoveStyle
} from '@/constants/style'
import { useAccount, useWaitForTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import useSendGearBoxUsdc from '@/hooks/useSendGearBoxUsdc';
import { useContractRead } from 'wagmi';
import { DIESEL_ABI, DIESEL_TOKEN_ADDRESS } from '../../../../scripts/constant';

interface TakeOutLiquidityProps {
  onNext: () => void;
}

const TakeOutLiquidity = ({ onNext }: TakeOutLiquidityProps) => {

  const [amount, setAmount] = useState<string>('0');
  const [completedStep, setCompletedStep] = useState<boolean>(false);

  const { address } = useAccount()

  const {data, isLoading, write} = useSendGearBoxUsdc({
    functionName: "removeLiquidity",
    args: [
      parseUnits(amount, 6),
      address
    ]
  })

  const { isLoading:waitLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(){
      alert("Successfully removed liquidity")
    },
    
    onError(){
      alert("Error removing liquidity")
    }
  })

  const { data:balance }:any = useContractRead({
    address: DIESEL_TOKEN_ADDRESS,
    abi: DIESEL_ABI,
    functionName: "balanceOf",
    args: [
      address
    ],
    watch: true
  })

 
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      write?.(); // Wait for write
      waitLoading; // Wait for transaction to be confirmed
     
      // Once remove wait, mark the step as completed
      if (data?.hash) {
        setCompletedStep(true);
      }
    } catch (error) {
      console.error('Error while Removing Liquidity:', error);
    }
  };

  return (
    <div>
      <p style={fontStyle}>Take out Liquidity</p>
      <div style={centerContainer}>

      <div style={inputContainer}>
      <input style={inputStyle} value={amount} type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)}/>
      <button
        style={maxButtonStyle}
        onClick={() => setAmount((Number(balance)/1e6).toString())}
      >
        Max
      </button>
      </div>
 
      <button
        style={buttonRemoveStyle}
        disabled = {isLoading || waitLoading}
        onClick={handleSubmit}
        >
        {
          (isLoading || waitLoading) ? "Removing..." : 'Remove Liquidity'
        }
      </button>
      </div>

      <button style={buttonNextStyle} onClick={onNext}>Next</button>
        {/* Display the button when step is completed */}
        {completedStep && <button>Step Completed</button>}
    </div>
  )
}

export default TakeOutLiquidity