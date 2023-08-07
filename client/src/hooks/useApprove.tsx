import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { ERC20_TOKEN_ABI } from "../../../scripts/constant";

interface approveType {
    args: Array<any>;
    address: `0x${string}`;
}

const useApprove = ({args, address}:approveType) => {

    const { config } = usePrepareContractWrite({
        address,
        abi: ERC20_TOKEN_ABI,
        functionName: "approve",
        args
    })
    const { data, isLoading, write} = useContractWrite(config);
    return { data, isLoading, write};
}

export default useApprove