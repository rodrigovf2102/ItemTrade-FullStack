import useAsync from "../useAsync";
import * as tradesApi from "../../services/tradesApi";
import { Trade } from "../../protocols";
import useToken from "../useToken";

export default function useUpdateTradeStatus() {
  const token = useToken();

  const {
    loading: updateTradeStatusLoading,
    error: updateTradeStatusError,
    act: updateTradeStatus
  } = useAsync((data : number) => tradesApi.updateTradeStatus(data, token), false);

  return {
    updateTradeStatusLoading,
    updateTradeStatusError,
    updateTradeStatus
  } as unknown as UpdateTradeStatus;
}

type UpdateTradeStatus = {
  updateTradeStatusLoading: boolean,
  updateTradeStatusError: any,
  updateTradeStatus(tradeId : number, token : string) : Promise<Trade>
}
