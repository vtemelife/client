import queryString from "query-string";

import ruJson from "./locale/ru.json";
import { getLocale } from "utils";

const messages = {
  ru: ruJson
} as any;

/**
 * Translation
 * @param {string}
 */
export function _(str: string, values: any = {}) {
  const getParams = { ...queryString.parse(window.location.search) };
  const newLocale = getParams.locale as any;
  if (newLocale && localStorage.getItem("locale") !== newLocale) {
    localStorage.setItem("locale", newLocale);
  }

  const locale = getLocale();

  if (!messages[locale]) {
    return str;
  }
  if (!messages[locale][str]) {
    return str;
  }
  return messages[locale][str].translate || str;
}
