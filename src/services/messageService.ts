import { callFunction } from "./callFunction";

/**
 * Retrieves calendar events from the Graph API.
 * @returns An array of CalendarModel objects representing the events.
 */
export async function getMessages(): Promise<any> {
  try {
    const respData = await callFunction("GET", "callGraph", { graphType: "messages" });
    return respData["messagesResult"];
  } catch (e) {
    console.log(e);
    throw e;
  }
}
