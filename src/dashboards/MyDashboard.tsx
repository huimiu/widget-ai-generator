import "../styles/MyDashboard.css";

import { Button, Input } from "@fluentui/react-components";
import { BaseDashboard } from "@microsoft/teamsfx-react";

import { generate } from "../services/generate";
import { CodeCard } from "../widgets/CodeCard";

interface CodeBlock {
  name: string;
  code: string;
}

interface MyDashboardState {
  codeContents: CodeBlock[];
}

export default class MyDashboard extends BaseDashboard<any, MyDashboardState> {
  override layout(): JSX.Element | undefined {
    return (
      <>
        <div className="ask-style">
          <div>
            <Input placeholder="Search" />
            <Button onClick={() => this.askAI()}>ASK</Button>
          </div>
        </div>
        {this.state.codeContents &&
          this.state.codeContents.map((codeBlock) => {
            return <CodeCard content={codeBlock} />;
          })}
      </>
    );
  }

  override styling(): string {
    return this.state.isMobile === true ? "dashboard-mobile" : "dashboard";
  }

  private async askAI() {
    const resp = await generate("Implement a widget only display a string of Hello world");
    this.setState({
      codeContents: resp,
    });
  }
}
