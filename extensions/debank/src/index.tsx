import { ActionPanel, Color, confirmAlert, Form, Icon, List, useNavigation, Action, Alert } from "@raycast/api";
import { ChainId, ComplexProtocol, Token } from "@yukaii/debank-types";
import { useEffect, useMemo, useState } from "react";
import { getComplexProtocolList, getTokenList, getTotalBalance, TotalBalance } from "./api";
import useFavoriteAddresses from "./utils/useFavoriteAddresses";

export default function Command() {
  const [address, setAddress] = useState("");
  const onChange = (value: string) => setAddress(value);
  const { push } = useNavigation();

  const title = useMemo(() => {
    if (!address) {
      return "Enter Wallet Address";
    } else {
      return "Press Enter to Search";
    }
  }, [address]);

  const { loading, favoriteAddresses, addFavoriteAddress, removeFavoriteAddress } = useFavoriteAddresses();
  const { pop } = useNavigation();

  const defaultItem = (
    <List.Item
      title={title}
      actions={
        address ? (
          <ActionPanel>
            <Action
              title={`Show Balance`}
              icon={Icon.Binoculars}
              onAction={() => {
                push(<BalanceView address={address} />);
              }}
            />
            <Action.OpenInBrowser url={`https://debank.com/profile/${address}`} title="Open on DeBank" />
            {!favoriteAddresses.find((add) => address && add.address === address) && (
              <Action
                title={`Add to Favorites`}
                icon={Icon.Star}
                shortcut={{ modifiers: ["cmd", "shift"], key: "f" }}
                onAction={() => {
                  push(
                    <AddFavoriteAddressForm
                      address={address}
                      onSubmit={({ address, identifier }) => {
                        addFavoriteAddress(address, identifier);
                        pop();
                      }}
                    />
                  );
                }}
              />
            )}
          </ActionPanel>
        ) : null
      }
    />
  );

  return (
    <List onSearchTextChange={onChange}>
      {loading || favoriteAddresses.length === 0 ? (
        defaultItem
      ) : (
        <>
          <List.Section title="Favorites">
            {favoriteAddresses.map((address) => (
              <List.Item
                key={address.address}
                title={address.identifier || address.address}
                icon={{
                  source: Icon.Star,
                  tintColor: Color.Yellow,
                }}
                actions={
                  <ActionPanel>
                    <Action
                      title={`Show Balance`}
                      icon={Icon.Binoculars}
                      onAction={() => {
                        push(<BalanceView address={address.address} />);
                      }}
                    />
                    <Action.OpenInBrowser
                      url={`https://debank.com/profile/${address.address}`}
                      title="Open on DeBank"
                    />
                    <Action
                      title={`Remove from Favorites`}
                      icon={Icon.Star}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "f" }}
                      onAction={async () => {
                        confirmAlert({
                          title: "Confirm Removal",
                          message: `Are you sure you want to remove "${
                            address.identifier || address.address
                          }" from your favorites?`,
                          primaryAction: {
                            title: "Remove",
                            style: Alert.ActionStyle.Destructive,
                            onAction: () => removeFavoriteAddress(address.address),
                          },
                        });
                      }}
                    />
                  </ActionPanel>
                }
                accessories={[
                  {
                    text: !address.identifier ? "" : address.address,
                  },
                ]}
              />
            ))}
          </List.Section>

          <List.Section title="Search for Address">{defaultItem}</List.Section>
        </>
      )}
    </List>
  );
}

type AddFavoriteAddressFormProps = {
  address: string;
  onSubmit: (values: any) => void;
};

function AddFavoriteAddressForm(props: AddFavoriteAddressFormProps) {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add to Favorites" onSubmit={props.onSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Address" id="address" defaultValue={props.address} />
      <Form.TextField title="Identifier" id="identifier" />
    </Form>
  );
}

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

type AssetsViewProps = {
  address: string;
  chainId: ChainId;
  chainName: string;
};

function formatTokenList(tokens?: Token[]) {
  return (
    tokens
      ?.map(
        (token) => `${token.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${token.optimized_symbol}`
      )
      .join(", ") || ""
  );
}

function protocolNetValueSum(protocol: ComplexProtocol) {
  return protocol.portfolio_item_list.reduce((acc, item) => acc + item.stats.net_usd_value, 0);
}

export function AssetsView(props: AssetsViewProps) {
  const [protocols, setProtocols] = useState<ComplexProtocol[] | null>(null);
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.address && props.chainId) {
      getTokenList(props.address, props.chainId).then((data) => {
        setTokens(data);

        setIsLoading(false);
      });

      getComplexProtocolList(props.address, props.chainId).then((data) => {
        setProtocols(data);

        setIsLoading(false);
      });
    }
  }, []);

  const hasProtocolsOrTokens = (protocols && protocols?.length > 0) || (tokens && tokens?.length > 0);

  return (
    <List navigationTitle={`${props.chainName}`} isLoading={isLoading}>
      {!hasProtocolsOrTokens && !isLoading && <List.Item key="1" title="No Tokens or Protocols" />}

      <List.Section title="Tokens">
        {tokens
          ?.sort((a, b) => b.price * b.amount - a.price * a.amount)
          .map((token) => (
            <List.Item
              key={token.id}
              title={token.display_symbol || token.optimized_symbol}
              subtitle={`$${token.price?.toString() || 0} * ${token.amount.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}`}
              icon={token.logo_url ? { source: token.logo_url } : undefined}
              accessories={[
                {
                  text: `$${((token.price || 0) * token.amount).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}`,
                },
              ]}
            />
          ))}
      </List.Section>

      {protocols &&
        protocols
          .sort((a, b) => protocolNetValueSum(b) - protocolNetValueSum(a))
          .map((protocol) => {
            return (
              <List.Section
                title={`${protocol.name} ($${protocolNetValueSum(protocol).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })})`}
                key={protocol.id}
              >
                {protocol.portfolio_item_list
                  .sort((a, b) => b.stats.net_usd_value - a.stats.net_usd_value)
                  .map((item, index) => {
                    const balance = formatTokenList(item.detail.supply_token_list);
                    const rewarded = formatTokenList(item.detail.reward_token_list);

                    return (
                      <List.Item
                        icon={
                          protocol.logo_url
                            ? {
                                source: protocol.logo_url,
                              }
                            : Icon.QuestionMark
                        }
                        key={`${protocol.id}-${item.name}-${index}`}
                        title={item.name}
                        subtitle={`${balance}${rewarded && ` | (${rewarded})`}`}
                        accessories={[
                          {
                            text: `$${item.stats.net_usd_value.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                            })}`,
                          },
                        ]}
                      />
                    );
                  })}
              </List.Section>
            );
          })}
    </List>
  );
}
