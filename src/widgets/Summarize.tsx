import { BaseWidget } from "@microsoft/teamsfx-react";
import { getMessages } from "../services/messageService";

export class Summarize extends BaseWidget<any, any> {
  override async getData(): Promise<any> {
    return await getMessages();
  }

  public render() {
    return <div>Summarize</div>;
  }
}
