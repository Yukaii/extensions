import { List } from "@raycast/api";
import { useItemList } from "../utils/query";
import EagleItem from "./EagleItem";
import { showEagleNotOpenToast } from "../utils/error";

export function ItemListByTag({ tag }: { tag: string }) {
  const { isLoading, data: items, error } = useItemList({ tags: [tag] });

  if (error?.code === "ECONNREFUSED") {
    showEagleNotOpenToast();
  } else if (error) {
    console.error(error);
  }

  return (
    <List isShowingDetail isLoading={isLoading} navigationTitle={`Items with tag "${tag}"`}>
      {items.map((item) => (
        <EagleItem key={item.id} item={item} />
      ))}
    </List>
  );
}
