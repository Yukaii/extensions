import { showToast, ToastStyle, useNavigation } from "@raycast/api";
import { EndpointForm } from "./components/EndpointForm";
import useEndpoints from "./endpoint/useEndpoints";
import { buildEndpoint, validateEndpointFormValues } from "./endpoint/utils";
import { RawEndpointInput } from "./types";

export default function Command() {
  const { addEndpoint } = useEndpoints();
  const { pop } = useNavigation();

  const handleSubmit = (values: RawEndpointInput) => {
    const error = validateEndpointFormValues(values);
    if (error) {
      showToast(ToastStyle.Failure, error);
      return;
    }

    const endpoint = buildEndpoint(values);

    addEndpoint(endpoint);

    pop();
  };

  return <EndpointForm handleSubmit={handleSubmit} submitTitle="Add Endpoint" />;
}
