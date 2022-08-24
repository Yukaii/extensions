import { ActionPanel, List, useNavigation, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import { getTotalBalance, TotalBalance } from "../api";
import { AssetsView } from "./AssetsView";

type BalanceViewProps = {
  address: string;
};

export function BalanceView(props: BalanceViewProps) {
  const [balance, setBalance] = useState<TotalBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.address) {
      getTotalBalance(props.address).then((data) => {
        setBalance(data);

        setIsLoading(false);
      });
    }
  }, []);

  const { push } = useNavigation();

  return (
    <List navigationTitle={`Account Balance of ${props.address}`} isLoading={isLoading}>
      {balance && (
        <>
          <List.Section title="Total">
            <List.Item
              key="1"
              title="Total Balance"
              accessories={[
                {
                  text: `$${balance.total_usd_value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
                },
              ]}
            />
          </List.Section>

          <List.Section title="Chain">
            {balance.chain_list
              .filter((chain) => chain.usd_value > 0)
              .map((chain) => {
                return (
                  <List.Item
                    key={chain.id}
                    title={chain.name}
                    icon={{
                      source: chain.logo_url,
                    }}
                    actions={
                      <ActionPanel>
                        <Action
                          title={`Show Protocols on ${chain.name}`}
                          onAction={() => {
                            push(<AssetsView address={props.address} chainId={chain.id} chainName={chain.name} />);
                          }}
                        />
                      </ActionPanel>
                    }
                    accessories={[
                      {
                        text: `$${chain.usd_value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
                      },
                    ]}
                  />
                );
              })}
          </List.Section>
        </>
      )}
    </List>
  );
}
