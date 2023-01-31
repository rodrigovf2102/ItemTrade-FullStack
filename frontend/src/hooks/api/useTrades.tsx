import useAsync from "../useAsync";
import * as tradeApi from "../../services/tradesApi";
import { TradeInfo, TradeWithEnrollsItem } from "../../protocols";
import useToken from "../useToken";

export default function useTrades() {
  const token = useToken();
  const {
    data: trades,
    loading: tradesLoading,
    error: tradesError,
    act: getTrades
  } = useAsync((data : TradeInfo) => tradeApi.getTrades(data, token), false);

  return {
    trades,
    tradesLoading,
    tradesError,
    getTrades
  } as unknown as UseTrades;
}

type UseTrades = {
  trades: TradeWithEnrollsItem[],
  tradesLoading: boolean,
  tradesError: any,
  getTrades(tradeInfo: TradeInfo, token: string) : Promise<TradeWithEnrollsItem[]>
}
