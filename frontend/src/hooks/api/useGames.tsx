import useAsync from "../useAsync";
import * as gamesApi from "../../services/gamesApi";
import { Game } from "../../protocols";

export default function useGames() {
  const {
    data: games,
    loading: gamesLoading,
    error: gamesError,
    act: getGames
  } = useAsync(gamesApi.getGames);

  return {
    games,
    gamesLoading,
    gamesError,
    getGames
  } as unknown as UseGames;
}

type UseGames = {
  games: Game[],
  gamesLoading: boolean,
  gamesError: any,
  getGames(filter: string) : Promise<Game[]>
}
