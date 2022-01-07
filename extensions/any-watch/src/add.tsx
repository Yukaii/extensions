import { useNavigation } from "@raycast/api";
import { EndpointForm } from "./components/EndpointForm";
import useEndpoints from "./endpoint/useEndpoints";
import { Endpoint } from "./types";

export default function Command() {
  const { addEndpoint } = useEndpoints();
  const { pop } = useNavigation();

  const handleSubmit = (values: Endpoint) => {
    // TODO: Validate form
    addEndpoint(values);

    pop();
  };

  return <EndpointForm handleSubmit={handleSubmit} submitTitle="Add Endpoint" />;
}
