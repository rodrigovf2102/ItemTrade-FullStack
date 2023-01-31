import useAsync from "../useAsync";
import * as serversApi from "../../services/serversApi";
import { Server, ServerWithGame } from "../../protocols";

export default function useServers() {
  const {
    data: servers,
    loading: serversLoading,
    error: serversError,
    act: getServers
  } = useAsync(serversApi.getServers, false);

  return {
    servers,
    serversLoading,
    serversError,
    getServers
  } as unknown as UseServers;
}

type UseServers = {
  servers: ServerWithGame[],
  serversLoading: boolean,
  serversError: any,
  getServers(gameId: number, filter: string) : Promise<ServerWithGame[]>
}
