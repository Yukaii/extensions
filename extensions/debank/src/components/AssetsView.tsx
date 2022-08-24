import { Icon, List } from "@raycast/api";
import { ChainId, ComplexProtocol, Token } from "@yukaii/debank-types";
import { useEffect, useState } from "react";
import { getComplexProtocolList, getTokenList } from "../api";

export function formatTokenList(tokens?: Token[]) {
  return (
    tokens
      ?.map(
        (token) => `${token.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${token.optimized_symbol}`
      )
      .join(", ") || ""
  );
}

export function protocolNetValueSum(protocol: ComplexProtocol) {
  return protocol.portfolio_item_list.reduce((acc, item) => acc + item.stats.net_usd_value, 0);
}

export type AssetsViewProps = {
  address: string;
  chainId: ChainId;
  chainName: string;
};

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
