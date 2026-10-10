
import Link from "next/link";
import { notFound } from "next/navigation";
import { menus } from "../../../../context/data/menus";
import { productosFidelina } from "../../../../context/data/productosFidelina";
import { productosWilma } from "../../../../context/data/productosWilma";
import BuscadorCatalogo from "./BuscadorCatalogo";

type Props = {
  params: Promise<{
    locale: string;
    empresa: string;
  }>;
};

export default async function CatalogoEmpresaPage({
  params,
}: Props) {
  const { locale, empresa } = await params;
  const empresaId = empresa.toLowerCase();

  const menu = menus.find(
    (item) => item.empresaId.toLowerCase() === empresaId
  );

  const nombres: Record<string, string> = {
    awhi: "Awhi",
    "dona-y-maria": "Doña y María Cocina Natural",
    fidelina: "Fidelina",
    wilma: "Wilma",
  };

  const nombre = nombres[empresaId];

  if (!nombre || (!menu && !["fidelina", "wilma"].includes(empresaId))) {
    notFound();
  }

  const esFidelina = empresaId === "fidelina";
  const esWilma = empresaId === "wilma";

  const productos = esFidelina
    ? productosFidelina
    : esWilma
      ? productosWilma
      : [];

  return (
    <main className="empresa-pagina">
    
<div className="empresa-navegacion">
  <Link
    href={`/${locale}`}
    className="empresa-boton-inicio"
  >
    🏠 {locale === "en" ? "Back to home" : "Volver al inicio"}
  </Link>

  <Link
    href={`/${locale}/empresas/${empresa}`}
    className="empresa-boton-catalogo"
  >
    ← {locale === "en" ? "Back to company" : "Volver a la empresa"}
  </Link>
</div>

      <section className="empresa-presentacion">
        <div className="empresa-informacion">
          <h1>
            {locale === "en"
              ? `${nombre} Catalog`
              : `Catálogo de ${nombre}`}
          </h1>

          <p>
            {locale === "en"
              ? "Discover this company's products."
              : "Conoce los productos disponibles de esta empresa."}
          </p>
        </div>
      </section>

      {menu?.tipo === "imagen" && (
        <section className="catalogo-menu">
          <h2>
            {locale === "en" ? "Product menu" : "Menú de productos"}
          </h2>

          <img
            src={menu.archivo}
            alt={`Menú de productos de ${nombre}`}
            className="catalogo-menu-imagen"
          />
        </section>
      )}

      {(esFidelina || esWilma) && (
        <section className="catalogo-productos">
          <h2>
            {locale === "en" ? "Products" : "Productos"}
          </h2>

          <p>
            {productos.length}{" "}
            {locale === "en"
              ? "products available"
              : "productos disponibles"}
          </p>

          <BuscadorCatalogo productos={productos} />
        </section>
      )}
    </main>
  );
}