import { Button, Text } from "@fluentui/react-components";
import {
  ArrowDownload24Regular,
  Code24Regular,
  Copy24Regular,
} from "@fluentui/react-icons";
import { BaseWidget } from "@microsoft/teamsfx-react";

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
    return <div>{this.props.content.code}</div>;
  }
}
