
"use client";

import { useLocale, useTranslations } from "next-intl";
import CategoryCard from "../components/CategoryCard";

export default function Home() {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <h1>{t("welcome")}</h1>
        <p>{t("description")}</p>
      </section>

      {/* PROMOCIONES */}
      <section className="promociones">
        <h2>Promociones</h2>

        <div className="grid">
          <CategoryCard
            name="Promoción 1"
            image="/promociones/promocion1.jpg"
            href={`/${locale}/promociones/promocion1`}
          />

          <CategoryCard
            name="Promoción 2"
            image="/promociones/promocion2.jpg"
            href={`/${locale}/promociones/promocion2`}
          />

          <CategoryCard
            name="Promoción 3"
            image="/promociones/promocion3.jpg"
            href={`/${locale}/promociones/promocion3`}
          />
        </div>
      </section>

      {/* EMPRESAS */}
      <section className="categorias">
        <h2>Empresas</h2>

        <div className="grid">
          <CategoryCard
            name="Awhi"
            image="/empresas/Awhi.png"
            href={`/${locale}/empresas/awhi`}
          />

          <CategoryCard
            name="Dona y Maria cocina natural"
            image="/empresas/Dona y Maria cocina natural.jpg"
            href={`/${locale}/empresas/dona-y-maria`}
          />

          <CategoryCard
            name="Fidelina"
            image="/empresas/Fidelina.jpg"
            href={`/${locale}/empresas/fidelina`}
          />

          <CategoryCard
            name="Wilma"
            image="/empresas/Wilma.jpg"
            href={`/${locale}/empresas/wilma`}
          />

          <CategoryCard
            name="Empresa 5"
            image="/empresas/empresa5.jpg"
            href={`/${locale}/empresas/empresa-5`}
          />

          <CategoryCard
            name="Empresa 6"
            image="/empresas/empresa6.jpg"
            href={`/${locale}/empresas/empresa-6`}
          />

          <CategoryCard
            name="Empresa 7"
            image="/empresas/empresa7.jpg"
            href={`/${locale}/empresas/empresa-7`}
          />
        </div>
      </section>
    </>
  );
}