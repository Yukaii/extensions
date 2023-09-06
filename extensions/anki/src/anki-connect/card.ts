export type CardId = number;

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
};
