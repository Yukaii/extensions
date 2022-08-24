import { ActionPanel, Form, Action } from "@raycast/api";

type AddFavoriteAddressFormProps = {
  address: string;
  onSubmit: (values: any) => void;
};

export function AddFavoriteAddressForm(props: AddFavoriteAddressFormProps) {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add to Favorites" onSubmit={props.onSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Address" id="address" defaultValue={props.address} />
      <Form.TextField title="Identifier" id="identifier" />
    </Form>
  );
}
