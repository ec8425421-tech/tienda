export default function Home() {
  return (
    <main>
      <header>
        <h1>🌱 Tienda de Plantas</h1>

        <nav>
          <a href="/">Inicio</a>
          <a href="/catalogo">Catálogo</a>
          <a href="/carrito">🛒 Carrito</a>
          <a href="/login">Iniciar sesión</a>
        </nav>
      </header>

      <section>
        <h2>Bienvenido</h2>
        <p>Tu tienda de plantas</p>
      </section>

      <section>
        <h2>Catálogo</h2>

        <div>
          <p>🌿 Plantas</p>
          <p>🥕 Hortalizas</p>
          <p>🌳 Árboles</p>
          <p>🌸 Ornamentales</p>
        </div>
      </section>

      <section>
        <h2>Productos</h2>
        <p>El catálogo estará disponible próximamente.</p>
      </section>

      <footer>
        <p>© Tienda de Plantas</p>
      </footer>
    </main>
  );
}