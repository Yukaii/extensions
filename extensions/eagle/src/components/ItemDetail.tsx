import { Action, ActionPanel, Detail } from "@raycast/api";
import { useMemo } from "react";
import { useThumbnail } from "../utils/query";
import { Item } from "../@types/eagle";
import { ItemListByTag } from "./ItemListByTag";

export function ItemDetail({ item }: { item: Item }) {
  const { data: thumbnail } = useThumbnail(item.id);

  const lastModifiedAt = useMemo(() => {
    const date = new Date(item.modificationTime);

    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }, [item]);

  const annotation = useMemo(() => {
    if (item.annotation) {
      return item.annotation.replaceAll("<br>", "\n");
    }

    return "";
  }, [item]);

  const markdown = useMemo(() => {
    if (item.name && thumbnail) {
      return `# ${item.name}

![](${thumbnail})`;
    } else if (item.name) {
      return `# ${item.name}`;
    } else {
      return "";
    }
  }, [item, thumbnail]);

  return (
    <Detail
      navigationTitle={item.name}
      markdown={markdown}
      isLoading={!thumbnail}
      actions={
        <ActionPanel>
          {item?.tags.length > 0 && (
            <ActionPanel.Submenu title="Search by Tags...">
              {item.tags.map((tag, index) => (
                <Action.Push key={index} title={tag} target={<ItemListByTag tag={tag} />} />
              ))}
            </ActionPanel.Submenu>
          )}
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          {(item.palettes?.length || -1) > 0 ? (
            <Detail.Metadata.TagList title="Palettes">
              {item.palettes!.slice(0, 6).map((palette, index) => {
                const color = `#${palette.color.map((c) => c.toString(16)).join("")}`;
                const ratio = palette.ratio > 1 ? palette.ratio.toFixed(0) : palette.ratio.toFixed(1);

                return <Detail.Metadata.TagList.Item text={`▆▆ (${ratio}%)`} color={color} key={index} />;
              })}
            </Detail.Metadata.TagList>
          ) : null}

          <Detail.Metadata.Label title="ID" text={item.id} />
          <Detail.Metadata.Label title="Name" text={item.name} />

          {item.annotation ? <Detail.Metadata.Label title="Annotation" text={annotation} /> : null}

          {item.tags && item.tags.length > 0 && (
            <Detail.Metadata.TagList title="Tags">
              {item.tags.map((tag, index) => (
                <Detail.Metadata.TagList.Item text={tag} key={index} />
              ))}
            </Detail.Metadata.TagList>
          )}

          <Detail.Metadata.Separator />

          <Detail.Metadata.Label title="Ext" text={item.ext} />
          <Detail.Metadata.Label title="Dimension" text={`${item.width} x ${item.height}`} />
          <Detail.Metadata.Label title="Last Modified" text={lastModifiedAt} />
          <Detail.Metadata.Link title="URL" target={item.url} text={item.url} />
        </Detail.Metadata>
      }
    />
  );
}
