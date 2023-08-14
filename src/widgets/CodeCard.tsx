import "highlight.js/styles/github.css";

import hljs from "highlight.js";

import { Button, Text } from "@fluentui/react-components";
import { ArrowDownload24Regular, Code24Regular, Copy24Regular } from "@fluentui/react-icons";
import { BaseWidget, IWidgetClassNames } from "@microsoft/teamsfx-react";
import "../styles/CodeCard.css";

export class CodeCard extends BaseWidget<any, any> {
  override header() {
    return (
      <div>
        <Code24Regular />
        <Text>{this.props.content.name}</Text>
        <div>
          <Button
            icon={<Copy24Regular />}
            appearance="transparent"
            onClick={() => this.props.copy(this.props.content.code)}
          />
          <Button icon={<ArrowDownload24Regular />} appearance="transparent" />
        </div>
      </div>
    );
  }

  override body() {
    return (
      <pre>
        <code>{this.props.content.code}</code>
      </pre>
    );
  }

  override styling(): IWidgetClassNames {
    return { root: "code-card-root", body: "code-card-body" };
  }

  async componentDidMount() {
    this.updateCodeSyntaxHighlighting();
  }

  componentDidUpdate() {
    this.updateCodeSyntaxHighlighting();
  }

  updateCodeSyntaxHighlighting = () => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block as HTMLElement);
    });
  };
}
