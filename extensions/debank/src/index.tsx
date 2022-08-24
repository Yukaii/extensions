import { ActionPanel, Color, confirmAlert, Icon, List, useNavigation, Action, Alert } from "@raycast/api";
import { useMemo, useState } from "react";
import { AddFavoriteAddressForm } from "./components/AddFavoriteAddressForm";
import { BalanceView } from "./components/BalanceView";
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
