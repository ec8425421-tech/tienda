import Link from "next/link";

export default function Temporada() {
  return (
    <main>
      <section className="apartado-page">
        <h1>Productos de temporada</h1>

        <div className="apartado-imagen">
          <img
            src="/images/temporada.jpg"
            alt="Productos de temporada"
          />
        </div>

        <div className="apartado-contenido">
          <h2>Productos disponibles por temporada</h2>

          <p>
            Descubre productos seleccionados
            especialmente para cada temporada
            del año.
          </p>

          <p>
            Consulta nuestras opciones disponibles
            y encuentra productos ideales para cada
            época.
          </p>
        </div>

        <div className="apartado-botones">
          <Link href="/catalogo">
            Ver catálogo
          </Link>

          <Link href="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}