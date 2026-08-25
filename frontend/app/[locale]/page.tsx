"use client";

import { useTranslations } from "next-intl";

import CategoryCard from "../components/CategoryCard";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <>
      <section className="hero">
        <h1>{t("welcome")}</h1>

        <p>{t("description")}</p>
      </section>

      <section className="categorias">
        <h2>{t("sections")}</h2>

        <div className="grid">
          <CategoryCard
            name={t("crops")}
            icon="🌿"
            href="/cultivos"
          />

          <CategoryCard
            name={t("fertilizersSeeds")}
            icon="🌱"
            href="/fertilizantes-semillas"
          />

          <CategoryCard
            name={t("season")}
            icon="🌸"
            href="/temporada"
          />
        </div>
      </section>
    </>
  );
}