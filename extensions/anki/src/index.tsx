import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { useHealthCheck, useDeckNamesAndIds, useFindCards, useGetDeckStats, useCardsInfo } from "./api";

const TodayCards = ({ deckName, query }: { deckName: string; query?: string }) => {
  const { data: cardIds = [] } = useFindCards(deckName, query);

  const { data: cardsInfo = [] } = useCardsInfo(cardIds);

  return (
    <List isLoading={!cardsInfo}>
      {cardsInfo.map((cardInfo) => {
        console.log(cardInfo.answer);
        return <List.Item key={cardInfo.note} title={cardInfo.question} />;
      })}
    </List>
  );
};

const ShowIf = ({ condition, children }: { condition: boolean | any; children: JSX.Element }) => {
  return condition ? children : null;
};

const DeckList = () => {
  const { data: deckNamesAndIds = {}, isLoading } = useDeckNamesAndIds();
  const { data: deckStats = {}, isLoading: isDeckStatsLoading } = useGetDeckStats(Object.keys(deckNamesAndIds));

  return (
    <List isLoading={isLoading || isDeckStatsLoading} navigationTitle="Decks">
      {Object.entries(deckNamesAndIds).map(([deckName, deckId]) => {
        const deckStat = deckStats[deckId];

        return (
          <List.Item
            key={deckName}
            title={deckName}
            accessories={[
              {
                icon: "📥",
                text: String(deckStat?.new_count || 0),
                tooltip: "New",
              },
              {
                icon: "📚",
                text: String(deckStat?.learn_count || 0),
                tooltip: "Learning",
              },
              {
                icon: "🔁",
                text: String(deckStat?.review_count || 0),
                tooltip: "To Review",
              },
            ]}
            actions={
              <ActionPanel>
                <Action.Push target={<TodayCards deckName={deckName} query="is:due" />} title="Show Due Cards" />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
};

export default function Command() {
  const { data: healthCheck } = useHealthCheck();

  return (
    <>
      <ShowIf condition={healthCheck}>
        <DeckList />
      </ShowIf>

      <ShowIf condition={!healthCheck}>
        <Detail markdown={`## AnkiConnect is not running`} />
      </ShowIf>
    </>
  );
}
