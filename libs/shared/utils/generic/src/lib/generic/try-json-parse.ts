export function tryJSONParse<T>(json: string): T | undefined {
  try {
    return JSON.parse(json);
  } catch (err) {
    return undefined;
  }
}
