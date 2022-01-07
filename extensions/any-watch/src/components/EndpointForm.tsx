import { ActionPanel, Form, Icon, SubmitFormAction } from "@raycast/api";

type SubmitFunction = (input: any) => void;

interface EndpointFormProps {
  handleSubmit: SubmitFunction;
  submitTitle: string;
}

export function EndpointForm({ submitTitle, handleSubmit }: EndpointFormProps) {
  return (
    <Form
      submitTitle={submitTitle}
      actions={
        <ActionPanel>
          <SubmitFormAction title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="icon" title="Icon">
        {Object.entries(Icon).map(([key, value]) => {
          return <Form.DropdownItem title={key} value={value} icon={value} />;
        })}
      </Form.Dropdown>

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
