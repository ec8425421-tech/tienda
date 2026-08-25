import Link from "next/link";

export default function FertilizantesSemillas() {
  return (
    <main>
      <section className="apartado-page">
        <h1>Fertilizantes y semillas</h1>

        <div className="apartado-imagen">
          <img
            src="/images/fertilizantes-semillas.jpg"
            alt="Fertilizantes y semillas"
          />
        </div>

        <div className="apartado-contenido">
          <h2>Todo para comenzar y cuidar tus cultivos</h2>

          <p>
            Encuentra semillas y productos
            destinados a proporcionar los
            nutrientes necesarios para el
            crecimiento de tus plantas.
          </p>

          <p>
            Contamos con diferentes opciones
            para ayudarte a mantener tus cultivos
            fuertes y saludables.
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