import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI } from "../../../scripts/constant";


interface sendParamsType {
    functionName?: string;
    args?: Array<any>;
    enabled?: boolean
}


const useSendUniswap = ({functionName, args, enabled}:sendParamsType) => {

    const { config } = usePrepareContractWrite({
        address: UNISWAP_ROUTER_ADDRESS,
        abi: UNISWAP_ROUTER_ABI,
        functionName,
        args,
        enabled
    })

    const { data, isLoading, write } = useContractWrite(config)

    return { data, isLoading, write };
}

export default useSendUniswap;