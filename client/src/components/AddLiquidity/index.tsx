import React, { useState } from 'react';
import {
  fontStyle, 
  buttonPreviousStyle, 
  maxButtonStyle, 
  inputContainer, 
  inputStyle,
  centerContainer,
  buttonAddStyle
} from '@/constants/style';
import { useAccount, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import useSendGearBoxEth from '@/hooks/useSendGearBoxEth';
import { GEARBOX_ETH_POOL, WETH_ABI, WETH_ADDRESS } from '../../../../scripts/constant';
import useTokenCall from '@/hooks/useTokenCall';
import useApprove from '@/hooks/useApprove';

interface AddLiquidityProps {
  onPrev: () => void;
}

const AddLiquidity = ({ onPrev }: AddLiquidityProps) => {
  const [amount, setAmount] = useState<string>('0');
  const [completedStep, setCompletedStep] = useState<boolean>(false);

  const { address } = useAccount();

  const { data: balance } = useTokenCall({
    address: WETH_ADDRESS,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { data: readData } = useTokenCall({
    address: WETH_ADDRESS,
    functionName: 'allowance',
    args: [address, GEARBOX_ETH_POOL],
    watch: true,
  });

  const { data, isLoading, write } = useSendGearBoxEth({
    functionName: 'addLiquidity',
    args: [parseEther(amount), address, 0],
    enabled: Number(readData) >= Number(amount) * 1e18 && amount !== '0',
  });

  const { isLoading: waitLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
    onSuccess() {
      alert('Successfully added liquidity');
    },
    onError() {
      alert('Error adding liquidity');
    },
  });

  const { data: tokenData, isLoading: tokenLoading, write: tokenWrite } = useApprove({
    address: WETH_ADDRESS,
    args: [GEARBOX_ETH_POOL, parseEther(amount)],
  });

  const { isLoading: tokenWaitLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: tokenData?.hash,
    onSuccess() {
      write?.();
      setCompletedStep(true); // Mark this step as completed
    },
    onError(err) {
      alert(err);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      tokenWrite?.(); // Wait for token approval
      waitLoading; // Wait for transaction to be confirmed
      tokenWaitLoading; // Wait for token approval transaction to be confirmed

      // Once both approve and swap are completed, mark the step as completed
      if (tokenData?.hash && data?.hash) {
        setCompletedStep(true);
      }
    } catch (error) {
      console.error('Error while  Adding Liquidity:', error);
    }
  };

  return (
    <div>
      <p style={fontStyle}>Add Liquidity</p>
      <div style={centerContainer}>
        <div style={inputContainer}>
          <input
            style={inputStyle}
            value={amount}
            type="number"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            style={maxButtonStyle}
            onClick={() => setAmount((Number(balance) / 1e18).toString())}
          >
            Max
          </button>
        </div>

        <button 
          style={buttonAddStyle} 
          disabled={isLoading || waitLoading || tokenLoading || tokenWaitLoading} 
          onClick={handleSubmit}
          >
          {(isLoading || waitLoading || tokenLoading || tokenWaitLoading) ? 'Adding...' : 'Add Liquidity'}
        </button>
      </div>

      <button style={buttonPreviousStyle} onClick={onPrev}>Previous</button>

      {/* Display the button when step is completed */}
      {completedStep && <button>Step Completed</button>}
    </div>
  );
};

export default AddLiquidity;
