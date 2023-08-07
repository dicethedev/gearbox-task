"use client"; // Error components must be Client components

import React from 'react';
import { useEffect } from "react";
import error_occurred from "@/assets/json/error_occurred.json";
import Lottie from "lottie-react";
import { containerStyle, h1Style, h3Style, centerStyle } from '@/constants/style';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  
    useEffect(() => {
      // Log the error to an error reporting service
      console.error(error);
    }, [error]);


    return (
      <div style={containerStyle}>
        <Lottie style={{ width: "250px", height: "250px" }} animationData={error_occurred} loop={false} autoplay />
        <h1 style={h1Style}>Something went wrong!</h1>
        <h3 style={h3Style}>Please reload the page.</h3>
        <button
          style={centerStyle}
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Reload
        </button>
      </div>
    );
  }