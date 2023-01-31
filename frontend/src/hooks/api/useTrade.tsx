import useAsync from "../useAsync";
import * as tradeApi from "../../services/tradesApi";
import { TradeWithEnrollsItem } from "../../protocols";
import useToken from "../useToken";

export default function useTrade() {
  const token = useToken();

  const {
    data: trade,
    loading: tradeLoading,
    error: tradeError,
    act: getTrade
  } = useAsync((data : number) => tradeApi.getTrade(data, token), false);

  return {
    trade,
    tradeLoading,
    tradeError,
    getTrade
  } as unknown as UseTrade;
}

type UseTrade = {
  trade: TradeWithEnrollsItem,
  tradeLoading: boolean,
  tradeError: any,
  getTrade(tradeId : number, token: string) : Promise<TradeWithEnrollsItem>
}
