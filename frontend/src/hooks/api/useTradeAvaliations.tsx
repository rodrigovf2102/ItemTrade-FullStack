import useAsync from "../useAsync";
import * as tradeApi from "../../services/tradesApi";
import { TradeAvaliation } from "../../protocols";

export default function useTradeAvaliations() {
  const {
    data: tradeAvaliations,
    loading: tradeAvaliationsLoading,
    error: tradeAvaliationsError,
    act: getTradeAvaliations
  } = useAsync(tradeApi.getTradeAvaliations);

  return {
    tradeAvaliations,
    tradeAvaliationsLoading,
    tradeAvaliationsError,
    getTradeAvaliations
  } as unknown as UseTradeAvaliations;
}

type UseTradeAvaliations = {
  tradeAvaliations: TradeAvaliation[],
  tradeAvaliationsLoading: boolean,
  tradeAvaliationsError: any,
  getTradeAvaliations() : Promise<TradeAvaliation[]>
}
