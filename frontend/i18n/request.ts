import { getRequestConfig } from "next-intl/server";

const locales = ["es", "en"];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = locales.includes(requested ?? "")
    ? requested
    : "es";

  const messages = (
    await import(`../messages/${locale}.json`)
  ).default;

  return {
    locale,
    messages,
  };
});