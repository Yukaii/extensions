import { ActionPanel, ActionPanelItem, Icon, List, useNavigation } from "@raycast/api";
import useEndpoints from "./endpoint/useEndpoints";
import moment from "moment";
import AddCommand from "./add";
import usePeriodically from "./utils/usePeriodically";
import { shouldUpdateEndpoint } from "./endpoint/utils";
import { Summary } from "./components/Summary";

export default function Command() {
  const { endpoints, isLoading, triggerEndpointRender, removeEndpoint } = useEndpoints();
  const { push } = useNavigation();

  usePeriodically(() => {
    endpoints.forEach((endpoint) => {
      if (shouldUpdateEndpoint(endpoint)) {
        triggerEndpointRender(endpoint);
      }
    });
  }, 60 * 1000);

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Filter by title...">
      {endpoints.map((endpoint, index) => {
        // Initialize for the first time
        if (shouldUpdateEndpoint(endpoint)) {
          triggerEndpointRender(endpoint);
        }

        const subtitle = endpoint.lastFetchedAt ? `updated ${moment(endpoint.lastFetchedAt).fromNow()}` : "";

        return (
          <List.Item
            title={endpoint.title}
            subtitle={subtitle}
            accessoryTitle={endpoint.renderedResults?.status || ""}
            key={index}
            actions={
              <ActionPanel>
                <ActionPanelItem
                  icon={Icon.LevelMeter}
                  title="View Summary"
                  onAction={() =>
                    push(<Summary title={endpoint.title} summary={endpoint.renderedResults?.summary || ""} />)
                  }
                />
                <ActionPanelItem title="Remove Endpoint" onAction={() => removeEndpoint(endpoint)} icon={Icon.Trash} />
              </ActionPanel>
            }
          />
        );
      })}

      {!isLoading && endpoints.length === 0 && (
        <List.Item
          title="Add New Endpoint"
          actions={
            <ActionPanel>
              <ActionPanelItem title="Open Form" onAction={() => push(<AddCommand />)} />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}
