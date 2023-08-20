import { callFunction } from "./callFunction";

export async function completion(q: string): Promise<any[]> {
  try {
    const respData = await callFunction("POST", "callGraph", {}, { question: q });
    return JSON.parse(respData["completion"]);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
