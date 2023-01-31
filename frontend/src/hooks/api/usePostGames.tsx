import useAsync from "../useAsync";
import * as gamesApi from "../../services/gamesApi";
import { Game, GameWithoutId } from "../../protocols";

export default function usePostGame() {
  const {
    loading: postGameLoading,
    error: postGameError,
    act: postGame
  } = useAsync(gamesApi.postGame, false);

  return {
    postGameLoading,
    postGameError,
    postGame
  } as unknown as UseGames;
}

type UseGames = {
  postGameLoading: boolean,
  postGameError: any,
  postGame(game : GameWithoutId, token : string) : Promise<Game>
}
