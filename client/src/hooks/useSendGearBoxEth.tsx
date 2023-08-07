import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { GEARBOX_ABI, GEARBOX_ETH_POOL } from '../../../scripts/constant';

export interface sendParamsType {
    functionName: string;
    args?: Array<any>;
    enabled?: boolean
}

const useSendGearBoxEth = ({functionName, args, enabled }: sendParamsType) => {
    
    const { config } = usePrepareContractWrite({
        address: GEARBOX_ETH_POOL,
        abi: GEARBOX_ABI,
        functionName,
        args,
        enabled
    })

    const { data, isLoading, write} = useContractWrite(config);

    return { data, isLoading, write };
}

export default useSendGearBoxEth;