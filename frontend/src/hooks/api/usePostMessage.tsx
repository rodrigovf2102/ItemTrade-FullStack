import useAsync from "../useAsync";
import * as messagesApi from "../../services/messageApi";
import { Message, MessagePost, MessageText } from "../../protocols";
import useToken from "../useToken";

export default function usePostMessage() {
  const token = useToken();
  const {
    loading: postMessageLoading,
    error: postMessageError,
    act: postMessage
  } = useAsync((data : MessagePost) => messagesApi.postMessage(data, token), false);

  return {
    postMessageLoading,
    postMessageError,
    postMessage
  } as unknown as UseMessages;
}

type UseMessages = {
  postMessageLoading: boolean,
  postMessageError: any,
  postMessage(messagePost : MessagePost, token : string) : Promise<Message>
}
