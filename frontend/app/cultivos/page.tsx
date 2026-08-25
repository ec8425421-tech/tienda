import Link from "next/link";

export default function Cultivos() {
  return (
    <main>
      <section className="apartado-page">
        <h1>Cultivos</h1>

        <div className="apartado-imagen">
          <img
            src="/images/cultivos.jpg"
            alt="Cultivos"
          />
        </div>

        <div className="apartado-contenido">
          <h2>Productos para cultivos</h2>

          <p>
            Encuentra productos destinados al
            cultivo y cuidado de diferentes
            plantas y hortalizas.
          </p>

          <p>
            Aquí podrás encontrar opciones para
            iniciar, mantener y mejorar tus
            cultivos.
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