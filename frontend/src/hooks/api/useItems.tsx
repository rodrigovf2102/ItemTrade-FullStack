import useAsync from "../useAsync";
import * as itemsApi from "../../services/itemsApi";
import { ItemWithGameServerEnroll } from "../../protocols";

export default function useItems() {
  const {
    data: items,
    loading: itemsLoading,
    error: itemsError,
    act: getItems
  } = useAsync(itemsApi.getItems, false);

  return {
    items,
    itemsLoading,
    itemsError,
    getItems
  } as unknown as UseItems;
}

type UseItems = {
  items: ItemWithGameServerEnroll[],
  itemsLoading: boolean,
  itemsError: any,
  getItems(serverId: number, type: string, filter: string, itemId:string) : Promise<ItemWithGameServerEnroll[]>
}
