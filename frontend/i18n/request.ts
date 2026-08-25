import { getRequestConfig } from "next-intl/server";

const locales = ["es", "en"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale =
    requested && locales.includes(requested as (typeof locales)[number])
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