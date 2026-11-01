import type { Root } from "mdast";

export const CALLOUT_TONES = ["note", "warning", "danger", "success"] as const;
export type CalloutTone = (typeof CALLOUT_TONES)[number];

const MARKER = /^\[!(note|warning|danger|success)\]\s*/;

/**
 * remark plugin: a top-level blockquote that starts with `[!tone]` becomes a
 * callout. The marker is removed from the text and the tone travels to the
 * rendered element as `data-tone`, where the `blockquote` component picks it
 * up (see components/legal/LegalMarkdown). Blockquotes without a marker are
 * left alone.
 *
 *   > [!warning] If no feedback is received within 7 business days…
 */
export default function remarkCallouts() {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (node.type !== "blockquote") continue;
      const paragraph = node.children[0];
      if (paragraph?.type !== "paragraph") continue;
      const text = paragraph.children[0];
      if (text?.type !== "text") continue;
      const match = MARKER.exec(text.value);
      if (!match) continue;

      text.value = text.value.slice(match[0].length);
      if (!text.value) paragraph.children.shift();
      node.data = {
        ...node.data,
        hProperties: { ...node.data?.hProperties, dataTone: match[1] },
      };
    }
  };
}
