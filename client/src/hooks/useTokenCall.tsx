import { useContractRead } from "wagmi";
import { ERC20_TOKEN_ABI } from "../../../scripts/constant";

interface sendParamsType {
    functionName: string;
    args?: Array<any>;
    watch?: boolean;
    address: `0x${string}`;
}

const useTokenCall = ({functionName, args, watch, address}: sendParamsType) => {

    const data = useContractRead({
        address,
        abi: ERC20_TOKEN_ABI,
        functionName,
        args,
        watch,
        onError: (err) => {
            console.log({err})
        }
    })

    return data;
}


export default useTokenCall;