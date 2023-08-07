import { useState, useEffect } from 'react'
import {fontStyle, 
  buttonPreviousStyle, 
  maxButtonStyle, 
  inputContainer, 
  inputStyle,
  centerContainer,
  buttonAddStyle
} from '@/constants/style'
import { useAccount, useContractRead, useWaitForTransaction } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import useSendGearBoxEth from '@/hooks/useSendGearBoxEth';
import { GEARBOX_ETH_POOL, WETH_ABI, WETH_ADDRESS } from '../../../../scripts/constant';
import useTokenCall from '@/hooks/useTokenCall';
import useApprove from '@/hooks/useApprove';


interface AddLiquidityProps {
    onPrev: () => void;
}
  
const AddLiquidity = ({ onPrev }: AddLiquidityProps) => {

  const [amount, setAmount] = useState<string>("0");
  const [completedStep, setCompletedStep] = useState<boolean>(false);

  const { address } = useAccount()

  const { data:balance } = useTokenCall({
    address: WETH_ADDRESS,
    functionName: "balanceOf",
    args: [
      address
    ],
    watch: true
  })

  const { data:readData } = useTokenCall({
    address: WETH_ADDRESS,
    functionName: "allowance",
    args: [
      address,
      GEARBOX_ETH_POOL
    ],
    watch: true
  })

  const { data, isLoading, write } = useSendGearBoxEth({
    functionName: "addLiquidity",
    args: [
      parseEther(amount),
      address,
      0
    ],
    enabled: (Number(readData) >= (Number(amount) * 1e18) && amount != "0")
  })

  const { isLoading:waitLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
    onSuccess(){
      alert("Successfully added liquidity")
    },
    onError(){
      alert("Error adding liquidity")
    }
  })

  const { data:tokenData, isLoading:tokenLoading, write:tokenWrite} = useApprove({
    address: WETH_ADDRESS,
    args: [
      GEARBOX_ETH_POOL,
      parseEther(amount)
    ]
  })

  const { isLoading:tokenWaitLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: tokenData?.hash,
    onSuccess(){
      setTimeout(() => {
        //Add Liquidity transaction after successful approval
        write?.();
      }, 5000); // Wait for 5 seconds before calling the Add Liquidity function
    },
    onError(err) {
        alert(err)
    }
  })


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
    const savedCompletedStep = localStorage.getItem('addLiquidityCompletedStep');

    if (savedCompletedStep === 'true') {
      setCompletedStep(true);
    }
  }, []);

  useEffect(() => {
    if (completedStep) {
      localStorage.setItem('addLiquidityCompletedStep', 'true');
    }
  }, [completedStep]);

  return (
    <div>
      <p style={fontStyle}>Add Liquidity</p>
      <div style={centerContainer}>

      <div style={inputContainer}>
      <input style={inputStyle} value={amount} type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
      <button
        style={maxButtonStyle}
        onClick={() => setAmount((Number(balance)/1e18).toString())}
      >
        Max
      </button>
      </div>
 
      <button
        style={buttonAddStyle}
        disabled={isLoading || waitLoading || tokenLoading || tokenWaitLoading || completedStep}
        onClick={handleSubmit}
      >
        {
          (isLoading || waitLoading || tokenLoading || tokenWaitLoading) 
          ? "Adding..." 
          : completedStep
          ? 'Step Completed'
          : 'Add Liquidity'
        }
      </button>
      </div>

      <button style={buttonPreviousStyle} onClick={onPrev}>Previous</button>
    </div>
  )
}

export default AddLiquidity