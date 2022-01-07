import { ActionPanel, Form, SubmitFormAction, useNavigation } from "@raycast/api";
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

  return (
    <Form
      submitTitle="Add Endpoint"
      actions={
        <ActionPanel>
          <SubmitFormAction title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Endpoint title" id="title" placeholder="ETH Gas Price" />
      <Form.TextField title="Endpoint URL" id="url" placeholder="https://ethgasstation.info/json/ethgasAPI.json" />

      <Form.TextField title="value format" id="status" placeholder="Average {{ .average }} Gwei" />

      <Form.Dropdown id="refreshInterval" title="Refresh Interval">
        <Form.DropdownItem title="1 min" value="1" />
        <Form.DropdownItem title="3 min" value="3" />
        <Form.DropdownItem title="5 min" value="5" />
        <Form.DropdownItem title="10 min" value="10" />
        <Form.DropdownItem title="30 min" value="30" />
        <Form.DropdownItem title="60 min" value="60" />
      </Form.Dropdown>

      <Form.TextArea id="summary" title="More Detailed text you want to rendered" />
    </Form>
  );
}
