import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { useHealthCheck, useDeckNamesAndIds, useFindCards, useGetDeckStats } from "./api";

const Cards = ({ deckName, query }: { deckName: string; query?: string }) => {
  const { data: cardIds = [] } = useFindCards(deckName, query);

  return (
    <Detail
      markdown={`## ${deckName}
${cardIds.length} cards found

${cardIds.map((cardId) => `- ${cardId}`).join("\n")}

`}
    />
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
                icon: '📥',
                text: String(deckStat?.new_count || 0),
                tooltip: 'New',
              },
              {
                icon: '📚',
                text: String(deckStat?.learn_count || 0),
                tooltip: 'Learn',
              },
              {
                icon: '🔁',
                text: String(deckStat?.review_count || 0),
                tooltip: 'Review',
              },
            ]}
            actions={
              <ActionPanel>
                <Action.Push target={<Cards deckName={deckName} />} title="Show Cards" />
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
