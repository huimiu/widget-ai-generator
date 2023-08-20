import "../styles/MyDashboard.css";

import {
  CopilotProvider,
  LatencyCancel,
  LatencyLoader,
  LatencyWrapper,
} from "@fluentai/react-copilot";
import { Button, Input } from "@fluentui/react-components";
import { Send20Regular } from "@fluentui/react-icons";
import { BaseDashboard } from "@microsoft/teamsfx-react";

import { completion } from "../services/completion";
import { CodeCard } from "../widgets/CodeCard";

interface CodeBlock {
  name: string;
  code: string;
}

interface MyDashboardState {
  codeContents: CodeBlock[];
  onloading: boolean;
  inputValue: string;
}

export default class MyDashboard extends BaseDashboard<any, MyDashboardState> {
  override layout(): JSX.Element | undefined {
    return (
      <>
        {this.state.onloading ? (
          <div className="generating-style">
            <CopilotProvider>
              <LatencyWrapper className="wrapper">
                <LatencyLoader header={"Generating widget files..."} />
                <LatencyCancel>Stop generating</LatencyCancel>
              </LatencyWrapper>
            </CopilotProvider>
          </div>
        ) : (
          <div className="ask-style">
            <div>
              <Input
                root="ask-input"
                size="large"
                placeholder="Describe the requirements for generating widget"
                value={this.state.inputValue}
                onChange={(e) => this.setState({ inputValue: e.target.value })}
              />
              <Button
                onClick={() => this.askAI()}
                size="large"
                icon={<Send20Regular />}
                title="Generate"
              />
            </div>
          </div>
        )}

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
    try {
      if (this.state.inputValue) {
        this.setState({ onloading: true, codeContents: [] });
        const resp = await completion(this.state.inputValue);
        this.setState({
          codeContents: resp,
          onloading: false,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ onloading: false });
    }
  }
}
