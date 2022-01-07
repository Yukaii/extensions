import { Detail } from "@raycast/api";

export function Summary({ title = "", summary = "" }) {
  const markdown = `# ${title}
  
${summary}  
`;

  return <Detail markdown={markdown} />;
}
