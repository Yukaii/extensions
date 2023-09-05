import { ActionPanel, Detail, List, Action } from "@raycast/api";
// import { ActionNames, invoke } from "@autoanki/anki-connect";
import { usePromise } from "@raycast/utils";
import { useHealthCheck, useDeckNamesAndIds } from "./api";
import { invoke, ActionNames } from './anki-connect'

const Cards = ({ deckName, deckId }: { deckName: string, deckId: number }) => {
  console.log(deckName, deckId);
  invoke({
    action: "getNumCardsReviewedToday" as ActionNames,
    request: {
      // query: `deckId:${deckId}`,
    } as any,
    version: 6,
  }).then(console.log);

  return <Detail markdown={`## ${deckName}`} />;
};

const ShowIf = ({ condition, children }: { condition: boolean | any; children: JSX.Element }) => {
  return condition ? children : null;
};

const DeckList = () => {
  const { data: deckNamesAndIds = {}, isLoading } = useDeckNamesAndIds();

  return (
    <List isLoading={isLoading}>
      {Object.entries(deckNamesAndIds).map(([deckName, deckId]) => (
        <List.Item
          key={deckName}
          title={deckName}
          actions={
            <ActionPanel>
              <Action.Push target={<Cards deckName={deckName} deckId={deckId} />} title="Show Cards" />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};

export default function Command() {
  // const { data: deckNamesAndIds = {}, isLoading } = usePromise(() =>
  //   invoke({
  //     action: "deckNamesAndIds",
  //     request: {} as unknown as void,
  //     // request: null,
  //     version: 6,
  //   })
  // );

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
