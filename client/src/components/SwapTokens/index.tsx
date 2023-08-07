import React, { useState, useEffect } from 'react'
import { fontStyle, 
   inputContainer, 
   inputStyle, 
   maxButtonStyle, 
   buttonNextStyle,
   buttonPreviousStyle,
   buttonSwapStyle,
   centerContainer,
   selectStyle
} from '@/constants/style';
import { useAccount, useWaitForTransaction } from 'wagmi';
import useSendUniswap from '@/hooks/useSendUniswap';
import useApprove from '@/hooks/useApprove';
import { UNISWAP_ROUTER_ADDRESS, USDC_ADDRESS } from '../../../../scripts/constant';
import { parseUnits } from 'viem';
import useTokenCall from '@/hooks/useTokenCall';


interface SwapTokensProps {
  onPrev: () => void;
  onNext: () => void;
}

const SwapTokens = ({ onPrev, onNext }: SwapTokensProps) => {

  const getDate = new Date();
  const getEpoch = Math.round(getDate.getTime() / 1000)
  const deadline = getEpoch + (5 * 60);
  
  const [amount, setAmount] = useState<string>("0");
  const [completedStep, setCompletedStep] = useState<boolean>(false);
   
  const { address } = useAccount()

  const { data:readData } = useTokenCall({
    address: USDC_ADDRESS,
    functionName: "allowance",
    args: [
      address,
      UNISWAP_ROUTER_ADDRESS
    ],
    watch: true
  })

  const { data:balance }:any = useTokenCall({
    address: USDC_ADDRESS,
    functionName: "balanceOf",
    args: [
      address
    ],
    watch: true
  })

  const { data, isLoading, write} = useSendUniswap({
    functionName: "swapExactTokensForTokens",
    args: [
      parseUnits(amount, 6),
      0,
      //USDC ADDRESS && WETH ADDRESS
      ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"],
      address,
      deadline
    ],
    enabled: (Number(readData) >= (Number(amount) * 1e6) && amount != "0")
  })

  const { isLoading:waitLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
    onSuccess(){
      alert("swap successfully")
    },
    onError(err){
      alert(err)
    }
  });

  const { data:tokenData, isLoading:tokenLoading, write:tokenWrite } = useApprove({
    address: USDC_ADDRESS,
    args: [
      UNISWAP_ROUTER_ADDRESS,
      parseUnits(amount, 6)
    ]
  });

  const { isLoading:tokenWaitLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: tokenData?.hash,
    onSuccess(){
      setTimeout(() => {
        //swap transaction after successful approval
        write?.();
      }, 5000); // Wait for 5 seconds before calling the swap function
    },
    onError(err){
      alert(err)
    }
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      // Initiate token approval
      tokenWrite?.(); 
      setCompletedStep(true);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const savedCompletedStep = localStorage.getItem('swapTokensCompletedStep');

    if (savedCompletedStep === 'true') {
      setCompletedStep(true);
    }
  }, []);

  useEffect(() => {
    if (completedStep) {
      localStorage.setItem('swapTokensCompletedStep', 'true');
    }
  }, [completedStep]);


  return (
    <div>
      
      <p style={fontStyle}>Swap USDC for ETH</p>
       
      <div style={centerContainer}>

      <select style={selectStyle}>
        <option value="option1">Uniswap</option>
      </select>
      
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
        style={buttonSwapStyle}
        onClick={handleSubmit}
        disabled = {isLoading || waitLoading || tokenLoading || tokenWaitLoading || completedStep}
      >
        {
          (isLoading || waitLoading || tokenLoading || tokenWaitLoading) ? "Swapping..." : completedStep ? 'Step Completed' : 'Swap'
        }
      </button>
      </div>

     <button style={buttonPreviousStyle} onClick={onPrev}>Previous</button>
     <button style={buttonNextStyle} onClick={onNext} disabled={!completedStep}>
        Next
      </button>
    </div>
  )
}

export default SwapTokens