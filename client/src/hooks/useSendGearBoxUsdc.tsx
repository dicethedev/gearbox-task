import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { GEARBOX_ABI, GEARBOX_PROTOCOL_ADDRESS } from '../../../scripts/constant';

export interface sendParamsType {
    functionName: string;
    args?: Array<any>;
}

const useSendGearBoxUsdc = ({functionName, args}: sendParamsType) => {
    
    const { config } = usePrepareContractWrite({
        address: GEARBOX_PROTOCOL_ADDRESS,
        abi: GEARBOX_ABI,
        functionName,
        args
    })

    const { data, isLoading, write} = useContractWrite(config);

    return { data, isLoading, write };
}

export default useSendGearBoxUsdc;