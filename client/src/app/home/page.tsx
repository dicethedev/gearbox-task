import React from "react";
import HomeUI from './homeUI'

export const metadata = {
  title: "Home",
};

export default async function Home() {
  return <HomeUI pipelineData={null} />;
}
