import { List } from "@raycast/api";
import useEndpoints from "./endpoint/useEndpoints";

export default function Command() {
  const { endpoints, isLoading, triggerEndpointRender } = useEndpoints();

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Filter by title...">
      {endpoints.map((endpoint, index) => {
        // Initialize for the first time
        if (!endpoint.renderedResults) {
          triggerEndpointRender(endpoint);
        }

        return (
          <List.Item
            title={endpoint.title}
            subtitle={endpoint.renderedResults?.subTitle || ""}
            accessoryTitle={endpoint.renderedResults?.accessoryTitle || ""}
            key={index}
          />
        );
      })}

      {!isLoading && endpoints.length === 0 && <List.Item title="Add New Endpoint" />}
    </List>
  );
}
