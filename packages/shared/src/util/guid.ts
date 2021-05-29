import { guid } from "../types/guid";

export function createGuid(length = 32): guid {
  const possibleLowerAlpha = "abcdefghijklmnopqrstuvwxyz";

  // always start with a lowercase alpha char
  let text = possibleLowerAlpha.charAt(
    Math.floor(Math.random() * possibleLowerAlpha.length)
  );

  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // start at 1, we already have 1 char from above
  for (let i = 1; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
