import useAsync from "../useAsync";
import * as messagesApi from "../../services/messageApi";
import { TradeMessage } from "../../protocols";
import useToken from "../useToken";

export default function useTradeMessages() {
  const token = useToken();
  const {
    data: tradeMessages,
    loading: tradeMessagesLoading,
    error: tradeMessagesError,
    act: getTradeMessages
  } = useAsync((data : number) => messagesApi.getTradeMessages(data, token), false);

  return {
    tradeMessages,
    tradeMessagesLoading,
    tradeMessagesError,
    getTradeMessages
  } as unknown as UseTradeMessages;
}

type UseTradeMessages = {
  tradeMessages: TradeMessage[],
  tradeMessagesLoading: boolean,
  tradeMessagesError: any,
  getTradeMessages(tradeId:number, token: string) : Promise<TradeMessage[]>
}
