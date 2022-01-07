import { ActionPanel, Form, SubmitFormAction } from "@raycast/api";
import useEndpoints from "./endpoint/useEndpoints";
import { Endpoint } from "./types";

export default function Command() {
  const { addEndpoint } = useEndpoints();

  const handleSubmit = (values: Endpoint) => {
    addEndpoint(values);
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
      <Form.TextField title="Endpoint title" id="title" />
      <Form.TextField title="Endpoint subtitle" id="subtitle" />
      <Form.TextField title="Endpoint URL" id="url" />

      <Form.TextField title="accessoryTitle" id="accessoryTitle" />
    </Form>
  );
}
