"use client"; // Home components must be Client components

import React, {useState} from 'react';
import TakeOutLiquidity from '@/components/TakeOutLiquidity';
import SwapTokens from '@/components/SwapTokens';
import AddLiquidity from '@/components/AddLiquidity';
import { containerStyle, connectButtonStyle } from '@/constants/style';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function homeUI({ pipelineData }: any) { 

    const [currentStep, setCurrentStep] = useState<number>(1);

    const handleNextStep = () => {
      setCurrentStep((prevStep) => prevStep + 1);
    };
    
    const handlePrevStep = () => {
      setCurrentStep((prevStep) => prevStep - 1);
    };

    const renderStep = () => {
      switch (currentStep) {
         case 1:
           return <TakeOutLiquidity onNext={handleNextStep} />;
         case 2:
           return <SwapTokens onNext={handleNextStep} onPrev={handlePrevStep} />;
         case 3:
           return <AddLiquidity onPrev={handlePrevStep} />;
         default:
           return null;
        }
      };

    return (
       <div>
      <div style={connectButtonStyle}> <ConnectButton /> </div>
        <div style={containerStyle}>
          <h1>Steps {currentStep}</h1>
           {renderStep()}
        </div>
      </div>
    )
}


