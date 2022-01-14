import { ActionPanel, ActionPanelItem, Icon, List, showToast, ToastStyle, useNavigation } from "@raycast/api";
import useEndpoints from "./endpoint/useEndpoints";
import moment from "moment";
import AddCommand from "./add";
import usePeriodically from "./utils/usePeriodically";
import { buildEndpoint, shouldUpdateEndpoint, validateEndpointFormValues } from "./endpoint/utils";
import { Summary } from "./components/Summary";
import { EndpointForm } from "./components/EndpointForm";
import { RawEndpointInput } from "./types";

export default function Command() {
  const { endpoints, isLoading, triggerEndpointRender, removeEndpoint, updateEndpoint, refreshEndpoints } =
    useEndpoints();
  const { push, pop } = useNavigation();

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
            icon={endpoint.icon}
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
                <ActionPanelItem
                  icon={Icon.Pencil}
                  title="Edit Endpoint"
                  onAction={() => {
                    const handleUpdate = (values: RawEndpointInput) => {
                      const error = validateEndpointFormValues(values);
                      if (error) {
                        showToast(ToastStyle.Failure, error);
                        return;
                      }

                      const _endpoint = {
                        ...buildEndpoint(values),
                        id: endpoint.id,
                      };

                      updateEndpoint(_endpoint);

                      pop();

                      refreshEndpoints();
                    };

                    push(
                      <EndpointForm endpoint={endpoint} submitTitle="Update Endpoint" handleSubmit={handleUpdate} />
                    );
                  }}
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
