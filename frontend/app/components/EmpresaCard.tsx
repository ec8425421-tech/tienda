
import type { Empresa } from "../context/data/empresas";

type Props = {
  empresa: Empresa;
  href?: string;
};

export default function EmpresaCard({ empresa, href }: Props) {
  const contenido = (
    <>
      <div className="empresa-card-imagen">
        <img
          src={empresa.imagenMenu}
          alt={`Imagen de ${empresa.nombre}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement?.classList.add(
              "empresa-card-imagen-vacia"
            );
          }}
        />
        <span className="empresa-card-etiqueta">EMPRENDIMIENTO</span>
      </div>

      <div className="empresa-card-contenido">
        <h3>{empresa.nombre}</h3>
        <p>{empresa.descripcion}</p>
        <span className="empresa-card-enlace">
          Explorar catálogo <span aria-hidden="true">→</span>
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <a className="empresa-card" href={href}>
        {contenido}
      </a>
    );
  }

  return <article className="empresa-card">{contenido}</article>;
}