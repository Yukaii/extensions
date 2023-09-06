export type CardId = number;

export type CardInfo = {
  answer: string;
  question: string;
  deckName: string;
  modelName: string;
  fieldOrder: number;
  fields: Fields;
  css: string;
  cardId: number;
  interval: number;
  note: number;
  ord: number;
  type: number;
  queue: number;
  due: number;
  reps: number;
  lapses: number;
  left: number;
  mod: number;
};

type Fields = {
  [key: string]: Field;
};

type Field = {
  value: string;
  order: number;
};

export type ActionsToPayloadMap = {
  findCards: {
    6: {
      request: {
        query: string;
      };
      response: CardId[];
    };
  };
  getEaseFactors: {
    6: {
      request: {
        cards: CardId[];
      };
      response: number[];
    };
  };
  setEaseFactors: {
    6: {
      request: {
        cards: CardId[];
        easeFactors: number[];
      };
      response: boolean[];
    };
  };
  suspend: {
    6: {
      request: {
        cards: CardId[];
      };
      response: boolean;
    };
  };
  unsuspend: {
    6: {
      request: {
        cards: CardId[];
      };
      response: boolean;
    };
  };

  cardsInfo: {
    6: {
      request: {
        cards: CardId[];
      };
      response: CardInfo[];
    };
  };
};
