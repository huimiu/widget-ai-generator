/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

// Import polyfills for fetch required by msgraph-sdk-javascript.
import "isomorphic-fetch";

import { Context, HttpRequest } from "@azure/functions";
import {
  ApiKeyLocation,
  ApiKeyProvider,
  AxiosInstance,
  OnBehalfOfCredentialAuthConfig,
  OnBehalfOfUserCredential,
  createApiClient,
} from "@microsoft/teamsfx";

import config from "../config";

// Define a Response interface with a status number and a body object that can contain any key-value pairs.
interface Response {
  status: number;
  body: { [key: string]: any };
}

// Define a TeamsfxContext type as an object that can contain any key-value pairs.
type TeamsfxContext = { [key: string]: any };

// Define an enum called FilesType with four possible values for different types of Microsoft Office files.
enum FilesType {
  WORD = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  EXCEL = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  PPT = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  VISIO = "application/vnd.ms-visio.drawing",
}

/**
 * This function handles requests from teamsfx client.
 * The HTTP request should contain an SSO token queried from Teams in the header.
 * Before trigger this function, teamsfx binding would process the SSO token and generate teamsfx configuration.
 *
 * This function initializes the teamsfx SDK with the configuration and calls these APIs:
 * - new OnBehalfOfUserCredential(accessToken, oboAuthConfig) - Construct OnBehalfOfUserCredential instance with the received SSO token and initialized configuration.
 * - getUserInfo() - Get the user's information from the received SSO token.
 * - createMicrosoftGraphClientWithCredential() - Get a graph client to access user's Microsoft 365 data.
 *
 * The response contains multiple message blocks constructed into a JSON object, including:
 * - An echo of the request body.
 * - The display name encoded in the SSO token.
 * - Current user's Microsoft 365 profile if the user has consented.
 *
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 * @param {teamsfxContext} TeamsfxContext - The context generated by teamsfx binding.
 */

/**
 * This function is the entry point for the Azure Function.
 * It handles HTTP requests from the Teams client and calls the appropriate function based on the request parameters.
 *
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 * @param {teamsfxContext} TeamsfxContext - The context generated by teamsfx binding.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response.
 */
export default async function run(
  context: Context,
  req: HttpRequest,
  teamsfxContext: TeamsfxContext
): Promise<Response> {
  context.log("HTTP trigger function processed a request.");

  // Initialize response.
  const res: Response = {
    status: 200,
    body: {},
  };

  // Put an echo into response body.
  res.body.receivedHTTPRequestBody = req.body || "";

  // Prepare access token.
  const accessToken: string = teamsfxContext["AccessToken"];
  if (!accessToken) {
    return {
      status: 400,
      body: {
        error: "No access token was found in request header.",
      },
    };
  }

  // Set up the configuration for the OnBehalfOfUserCredential.
  const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
    authorityHost: config.authorityHost,
    clientId: config.clientId,
    tenantId: config.tenantId,
    clientSecret: config.clientSecret,
  };

  let oboCredential: OnBehalfOfUserCredential;
  try {
    // Construct the OnBehalfOfUserCredential using the access token and configuration.
    oboCredential = new OnBehalfOfUserCredential(accessToken, oboAuthConfig);
  } catch (e) {
    context.log.error(e);
    return {
      status: 500,
      body: {
        error:
          "Failed to construct OnBehalfOfUserCredential using your accessToken. " +
          "Ensure your function app is configured with the right Azure AD App registration.",
      },
    };
  }

  // Get the graphType, method, and request data from the HTTP request.
  const graphType = req.query["graphType"];
  const method = req.method;
  const reqData = req.body;

  try {
    // Call the appropriate function based on the graphType and method.
    const result = await handleRequest(
      oboCredential,
      graphType,
      method,
      reqData
    );
    res.body = { ...res.body, ...result };
  } catch (e) {
    context.log.error(e);
    return {
      status: 500,
      body: {
        error: "Failed to process request.",
      },
    };
  }

  return res;
}

/**
 * Handles the request based on the given graphType and method.
 *
 * @param {OnBehalfOfUserCredential} oboCredential - The on-behalf-of user credential.
 * @param {string} graphType - The type of graph to query (e.g. "calendar", "task").
 * @param {string} method - The HTTP method to use (e.g. "GET", "POST").
 * @param {any} reqData - The request data to use (if applicable).
 * @returns {Promise<any>} - A promise that resolves with the result of the request.
 */
async function handleRequest(
  oboCredential: OnBehalfOfUserCredential,
  graphType: string,
  method: string,
  reqData: any
): Promise<any> {
  // Switch statement to handle different graphType and method combinations
  switch (`${graphType}:${method}`) {    
    // If graphType is "generate" and method is "POST"
    case "generate:POST": {
      // Call getChatMessages function to get chat messages
      const generated = await callOAI(reqData.question);
      return { generated: generated };
    }
    // If no matching graphType and method combination is found
    default: {
      throw new Error(`Invalid graphType (${graphType}) or method (${method})`);
    }
  }
}


async function callOAI(body: string) {
  try {
    const completionReq = {
      messages: [
        {
          content:
            "You are a seasoned front-end developer with expertise in using the Teams Toolkit to develop Teams Apps, and you are also proficient in UX design, you can write css to make the front end more beautiful and the interaction more humanized. Currently, there is a requirement to add a widget to a Dashboard Tab App, and your assistance is needed to complete this task. Your mission is to create elegant TypeScript (ts), TypeScript React (tsx), and CSS code that aligns with user needs, leveraging your expertise in developing Teams Dashboard Tab Apps.\n\n## Goal\nAnalyze and disassemble the user's needs, and provide the definition of widgets, css, and related models and services.\n\n## Definition\n\t- Widgets are components that can be added to a dashboard page to show different types of information or functionality. Widgets can be customized and arranged to create interactive and dynamic dashboard pages for various purposes.\n\t- The @microsoft/teamsfx-react package provides a BaseWidget class that simplifies the creation of a widget. Developers can customize the widget by overriding methods from BaseWidget, such as getData, header, body, footer, loading and styling methods.\n\n## Constrains\n\t- Ensure that the code is free of syntax and compilation errors.\n\t- Design and implement based on user input, do not ask other information.\n\t- Use class components in React to define the widget and the widget class needs to inherit the BaseWidget in @microsoft/teamsfx-react.\n\t- Use the Fluent UI V9 framework to implement the widget, use @fluentui/react-icons to show some icons if needed.\nDo not import components and icons that do not exist.",
          role: "system",
        },
        {
          content: "Implement a list widget.",
          role: "user",
        },
        {
          content:
            '[\n  {\n    "name": "ListWidget.tsx",\n    "code": "// ListWidget.tsx\\nimport \\"../styles/ListWidget.css\\";\\nimport { Button, Text } from \\"@fluentui/react-components\\";\\nimport { List28Filled, MoreHorizontal32Regular } from \\"@fluentui/react-icons\\";\\nimport { BaseWidget } from \\"@microsoft/teamsfx-react\\";\\nimport { ListModel } from \\"../models/listModel\\";\\nimport { getListData } from \\"../services/listService\\";\\ninterface IListWidgetState {\\n  data: ListModel[];\\n}\\nexport default class ListWidget extends BaseWidget<any, IListWidgetState> {\\n  async getData(): Promise<IListWidgetState> {\\n    return { data: getListData() };\\n  }\\n  header(): JSX.Element | undefined {\\n    return (\\n      <div>\\n        <List28Filled />\\n        <Text>Your List</Text>\\n        <Button icon={<MoreHorizontal32Regular />} appearance=\\"transparent\\" />\\n      </div>\\n    );\\n  }\\n  body(): JSX.Element | undefined {\\n    return (\\n      <div className=\\"list-body\\">\\n        {this.state.data?.map((t: ListModel) => {\\n          return (\\n            <div key={`${t.id}-div`}>\\n              <div className=\\"divider\\" />\\n              <Text className=\\"title\\">{t.title}</Text>\\n              <Text className=\\"content\\">{t.content}</Text>\\n            </div>\\n          );\\n        })}\\n      </div>\\n    );\\n  }\\n  footer(): JSX.Element | undefined {\\n    return <Button appearance=\\"primary\\">View Details</Button>;\\n  }\\n}"\n  },\n  {\n    "name": "ListWidget.css",\n    "code": ".list-body {\\n  display: grid;\\n  row-gap: var(--spacingVerticalS);\\n  align-content: start;\\n  min-width: 13.5rem;\\n}\\n.list-body div {\\n  display: grid;\\n}\\n.list-body .divider {\\n  margin: 0 -2rem 0.5rem;\\n  height: var(--strokeWidthThin);\\n  background: var(--colorNeutralStroke2);\\n}\\n.list-body .title {\\n  font-weight: var(--fontWeightSemibold);\\n}\\n.list-body .content {\\n  font-size: var(--fontSizeBase200);\\n}\\n.loading {\\n  display: grid;\\n  justify-content: center;\\n  height: 100%;\\n}\\n"\n  },\n  {\n    "name": "listModel.ts",\n    "code": "export interface ListModel {\\n  id: string;\\n  title: string;\\n  content: string;\\n}"\n  },\n  {\n    "name": "listService.ts",\n    "code": "import { ListModel } from \\"../models/listModel\\";\\n/**\\n * Retrive sample data\\n * @returns data for list widget\\n */\\nexport const getListData = (): ListModel[] => [\\n  {\\n    id: \\"id1\\",\\n    title: \\"Lorem ipsum\\",\\n    content: \\"Lorem ipsum dolor sit amet\\",\\n  },\\n  {\\n    id: \\"id2\\",\\n    title: \\"Lorem ipsum\\",\\n    content: \\"Lorem ipsum dolor sit amet\\",\\n  },\\n  {\\n    id: \\"id3\\",\\n    title: \\"Lorem ipsum\\",\\n    content: \\"Lorem ipsum dolor sit amet\\",\\n  },\\n];"\n  }\n]',
          role: "assistant",
        },
        {
          content: body,
          role: "user",
        },
      ],
    };

    const authProvider = new ApiKeyProvider(
      "api-key",
      process.env.TEAMSFX_API_OAI_API_KEY,
      ApiKeyLocation.Header
    );
    const apiClient: AxiosInstance = createApiClient(
      process.env.TEAMSFX_API_OAI_ENDPOINT,
      authProvider
    );
    const resp = await apiClient.post(
      "/chat/completions?api-version=2023-07-01-preview",
      completionReq
    );
    if (resp.status !== 200) {
      return {
        status: resp.status,
        body: resp.data,
      };
    }

    const response = resp.data.choices[0].message.content;
    return response;
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      body: e,
    };
  }
}
