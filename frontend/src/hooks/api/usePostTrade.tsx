import useAsync from "../useAsync";
import * as tradesApi from "../../services/tradesApi";
import { TradePost, Trade } from "../../protocols";
import useToken from "../useToken";

export default function usePostTrade() {
  const token = useToken();

  const {
    loading: postTradeLoading,
    error: postTradeError,
    act: postTrade
  } = useAsync((data : TradePost) => tradesApi.postTrade(data, token), false);

  return {
    postTradeLoading,
    postTradeError,
    postTrade
  } as unknown as UseTrades;
}

type UseTrades = {
  postTradeLoading: boolean,
  postTradeError: any,
  postTrade(Trade : TradePost, token : string) : Promise<Trade>
}
