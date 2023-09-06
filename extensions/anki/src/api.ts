import { usePromise } from "@raycast/utils";
import fetch from "cross-fetch";
import { invoke } from "./anki-connect";

// API: GET root for health check
export const useHealthCheck = () => {
  return usePromise(async () => {
    const response = await fetch(`http://127.0.0.1:8765`);
    const text = await response.text();
    return text.includes("AnkiConnect");
  });
};

export const useDeckNamesAndIds = () => {
  return usePromise(async () => {
    return invoke({
      version: 6,
      action: "deckNamesAndIds",
      request: void 0,
    });
  });
};

export const useGetDeckStats = (decks: string[]) => {
  return usePromise(
    async () => {
      return invoke({
        version: 6,
        action: "getDeckStats",
        request: {
          decks,
        },
      });
    },
    [],
    {
      execute: decks.length > 0,
    }
  );
};

export const useFindCards = (deckName: string, query = "") => {
  return usePromise(() =>
    invoke({
      action: "findCards",
      request: {
        query: `deck:"${deckName}" ${query}`,
      },
      version: 6,
    })
  );
};

export const useCardsInfo = (cardIds: number[]) => {
  return usePromise(
    () =>
      invoke({
        action: "cardsInfo",
        request: {
          cards: cardIds,
        },
        version: 6,
      }),
    [],
    {
      execute: cardIds.length > 0,
    }
  );
};
