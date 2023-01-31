import useAsync from "../useAsync";
import * as itemsApi from "../../services/itemsApi";
import { Item, ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName } from "../../protocols";

export default function usePostItem() {
  const {
    loading: postItemLoading,
    error: postItemError,
    act: postItem
  } = useAsync(itemsApi.postItem, false);

  return {
    postItemLoading,
    postItemError,
    postItem
  } as unknown as UseItems;
}

type UseItems = {
  postItemLoading: boolean,
  postItemError: any,
  postItem(Item : ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName, token : string) : Promise<Item>
}
