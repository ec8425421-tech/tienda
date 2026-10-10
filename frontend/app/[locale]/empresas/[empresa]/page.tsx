
import Link from "next/link";
import { notFound } from "next/navigation";
import { empresas } from "../../../context/data/empresas";

type EmpresaPageProps = {
  params: Promise<{
    locale: string;
    empresa: string;
  }>;
};

export default async function EmpresaPage({
  params,
}: EmpresaPageProps) {
  const { locale, empresa } = await params;

  const datosEmpresa = empresas.find(
    (item) => item.id.toLowerCase() === empresa.toLowerCase()
  );

  if (!datosEmpresa) {
    notFound();
  }

  return (
    <main className="empresa-pagina">
      {/* NAVEGACIÓN */}
      <nav className="empresa-navegacion">
        <Link
          href={`/${locale}`}
          className="empresa-boton-inicio"
        >
          🏠 {locale === "en" ? "Back to home" : "Volver al inicio"}
        </Link>
      </nav>

      {/* PRESENTACIÓN DE LA EMPRESA */}
      <section className="empresa-presentacion">
        <div className="empresa-menu-contenedor">
          <img
            src={datosEmpresa.imagenMenu}
            alt={`Menú de ${datosEmpresa.nombre}`}
            className="empresa-menu-imagen"
          />
        </div>

        <div className="empresa-informacion">
          <h1>{datosEmpresa.nombre}</h1>

          <p>{datosEmpresa.descripcion}</p>

          <Link
            href={`/${locale}/empresas/${datosEmpresa.id.toLowerCase()}/catalogo`}
            className="empresa-boton-catalogo"
          >
            {locale === "en" ? "View products" : "Ver productos"}
          </Link>
        </div>
      </section>
    </main>
  );
}