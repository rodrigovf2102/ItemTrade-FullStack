import useAsync from "../useAsync";
import * as serversApi from "../../services/serversApi";
import { Server, ServerNoIdName } from "../../protocols";

export default function usePostServer() {
  const {
    loading: postServerLoading,
    error: postServerError,
    act: postServer
  } = useAsync(serversApi.postServer, false);

  return {
    postServerLoading,
    postServerError,
    postServer
  } as unknown as Useservers;
}

type Useservers = {
  postServerLoading: boolean,
  postServerError: any,
  postServer(server : ServerNoIdName, token : string) : Promise<Server>
}
