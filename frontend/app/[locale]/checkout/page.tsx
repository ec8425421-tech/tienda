"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter, useParams } from "next/navigation";

export default function Checkout() {
  const {
    cart,
    total,
    removeFromCart,
  } = useCart();

  const router = useRouter();
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  // ========================================
  // Datos del cliente
  // ========================================

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  // ========================================
  // Dirección
  // ========================================

  const [calle, setCalle] = useState("");
  const [colonia, setColonia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estadoEntrega, setEstadoEntrega] =
    useState("");
  const [codigoPostal, setCodigoPostal] =
    useState("");
  const [referencias, setReferencias] =
    useState("");

  // ========================================
  // Método de pago
  // ========================================

  const [metodoPago, setMetodoPago] =
    useState("efectivo");

  // ========================================
  // Tarjeta
  // ========================================

  const [titularTarjeta, setTitularTarjeta] =
    useState("");

  const [numeroTarjeta, setNumeroTarjeta] =
    useState("");

  const [fechaExpiracion, setFechaExpiracion] =
    useState("");

  const [cvv, setCvv] = useState("");

  // ========================================
  // Transferencia
  // ========================================

  const [
    referenciaTransferencia,
    setReferenciaTransferencia,
  ] = useState("");

  // ========================================
  // Estado
  // ========================================

  const [guardando, setGuardando] =
    useState(false);

  // ========================================
  // Carrito vacío
  // ========================================

  if (cart.length === 0) {
    return (
      <main>
        <section className="cart-empty">
          <h1>
            {locale === "en"
              ? "Your cart is empty"
              : "Tu carrito está vacío"}
          </h1>

          <p>
            {locale === "en"
              ? "Add products before continuing with your purchase."
              : "Agrega productos antes de continuar con la compra."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/${locale}/catalogo`
              )
            }
          >
            {locale === "en"
              ? "Go to catalog"
              : "Ir al catálogo"}
          </button>
        </section>
      </main>
    );
  }

  // ========================================
  // Formatear tarjeta
  // ========================================

  function formatearTarjeta(
    valor: string
  ) {
    const numeros = valor
      .replace(/\D/g, "")
      .slice(0, 16);

    return numeros
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  // ========================================
  // Confirmar pedido
  // ========================================

  async function confirmarPedido() {
    // ======================================
    // Cliente
    // ======================================

    if (!nombre.trim()) {
      alert(
        locale === "en"
          ? "Enter your name."
          : "Escribe tu nombre."
      );
      return;
    }

    if (!email.trim()) {
      alert(
        locale === "en"
          ? "Enter your email."
          : "Escribe tu correo electrónico."
      );
      return;
    }

    if (!telefono.trim()) {
      alert(
        locale === "en"
          ? "Enter your phone number."
          : "Escribe tu teléfono."
      );
      return;
    }

    // ======================================
    // Dirección
    // ======================================

    if (!calle.trim()) {
      alert(
        locale === "en"
          ? "Enter your street and number."
          : "Escribe la calle y número."
      );
      return;
    }

    if (!colonia.trim()) {
      alert(
        locale === "en"
          ? "Enter your neighborhood."
          : "Escribe la colonia."
      );
      return;
    }

    if (!ciudad.trim()) {
      alert(
        locale === "en"
          ? "Enter your city."
          : "Escribe la ciudad."
      );
      return;
    }

    if (!estadoEntrega.trim()) {
      alert(
        locale === "en"
          ? "Enter your state."
          : "Escribe el estado."
      );
      return;
    }

    if (!codigoPostal.trim()) {
      alert(
        locale === "en"
          ? "Enter your postal code."
          : "Escribe el código postal."
      );
      return;
    }

    // ======================================
    // Tarjeta
    // ======================================

    if (metodoPago === "tarjeta") {
      const numeroLimpio =
        numeroTarjeta.replace(/\s/g, "");

      if (!titularTarjeta.trim()) {
        alert(
          locale === "en"
            ? "Enter the cardholder name."
            : "Escribe el nombre del titular de la tarjeta."
        );
        return;
      }

      if (numeroLimpio.length < 16) {
        alert(
          locale === "en"
            ? "Enter a valid card number."
            : "Escribe un número de tarjeta válido."
        );
        return;
      }

      if (!fechaExpiracion.trim()) {
        alert(
          locale === "en"
            ? "Enter the expiration date."
            : "Escribe la fecha de expiración."
        );
        return;
      }

      if (!cvv.trim() || cvv.length < 3) {
        alert(
          locale === "en"
            ? "Enter a valid CVV."
            : "Escribe un CVV válido."
        );
        return;
      }
    }

    // ======================================
    // Transferencia
    // ======================================

    if (metodoPago === "transferencia") {
      if (!referenciaTransferencia.trim()) {
        alert(
          locale === "en"
            ? "Enter the transfer reference."
            : "Escribe la referencia de la transferencia."
        );
        return;
      }
    }

    try {
      setGuardando(true);

      // ====================================
      // Token
      // ====================================

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          locale === "en"
            ? "You must sign in to place an order."
            : "Debes iniciar sesión para realizar tu pedido."
        );

        router.push(`/${locale}/login`);
        return;
      }

      // ====================================
      // Crear pedido
      // ====================================

      const respuesta = await fetch(
        "http://localhost:4000/api/pedidos",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            nombre_cliente: nombre,
            email_cliente: email,
            telefono_cliente: telefono,

            calle,
            colonia,
            ciudad,
            estado_entrega:
              estadoEntrega,
            codigo_postal:
              codigoPostal,
            referencias,

            metodo_pago: metodoPago,

            productos: cart.map(
              (item) => ({
                id: item.id,
                cantidad: item.quantity,
              })
            ),
          }),
        }
      );

      const datos =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            (locale === "en"
              ? "The order could not be created."
              : "No se pudo crear el pedido.")
        );
      }

      // ====================================
      // Guardar pedido confirmado
      // ====================================

      sessionStorage.setItem(
        "pedidoConfirmado",
        JSON.stringify({
          id: datos.pedido.id,

          nombre:
            datos.pedido.nombre_cliente,

          total:
            datos.pedido.total,

          metodoPago:
            datos.pedido.metodo_pago,

          referenciaTransferencia:
            metodoPago ===
            "transferencia"
              ? referenciaTransferencia
              : null,

          tarjetaUltimos4:
            metodoPago === "tarjeta"
              ? numeroTarjeta
                  .replace(/\s/g, "")
                  .slice(-4)
              : null,
        })
      );

      // ====================================
      // Vaciar carrito
      // ====================================

      cart.forEach((item) => {
        removeFromCart(item.id);
      });

      // ====================================
      // Ir a confirmación
      // ====================================

      router.push(
        `/${locale}/pedido-confirmado`
      );
    } catch (error) {
      console.error(
        "Error creando pedido:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : locale === "en"
          ? "The order could not be created."
          : "No se pudo crear el pedido."
      );
    } finally {
      setGuardando(false);
    }
  }

  // ========================================
  // Pantalla
  // ========================================

  return (
    <main>
      <section className="checkout-header">
        <h1>
          {locale === "en"
            ? "Checkout"
            : "Finalizar compra"}
        </h1>

        <p>
          {locale === "en"
            ? "Complete your information to place your order."
            : "Completa tus datos para realizar tu pedido."}
        </p>
      </section>

      <section className="checkout-container">

        {/* ==================================
            FORMULARIO
        ================================== */}

        <div className="checkout-form">

          <h2>
            {locale === "en"
              ? "Customer information"
              : "Datos del cliente"}
          </h2>

          <div>
            <label htmlFor="nombre">
              {locale === "en"
                ? "Full name"
                : "Nombre completo"}
            </label>

            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(event) =>
                setNombre(
                  event.target.value
                )
              }
              placeholder={
                locale === "en"
                  ? "Your name"
                  : "Tu nombre"
              }
              disabled={guardando}
            />
          </div>

          <div>
            <label htmlFor="email">
              {locale === "en"
                ? "Email"
                : "Correo electrónico"}
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="correo@ejemplo.com"
              disabled={guardando}
            />
          </div>

          <div>
            <label htmlFor="telefono">
              {locale === "en"
                ? "Phone"
                : "Teléfono"}
            </label>

            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(event) =>
                setTelefono(
                  event.target.value
                )
              }
              placeholder={
                locale === "en"
                  ? "Your phone number"
                  : "Tu teléfono"
              }
              disabled={guardando}
            />
          </div>

          {/* ==================================
              DIRECCIÓN
          ================================== */}

          <h2>
            {locale === "en"
              ? "Delivery address"
              : "Dirección de entrega"}
          </h2>

          <div>
            <label htmlFor="calle">
              {locale === "en"
                ? "Street and number"
                : "Calle y número"}
            </label>

            <input
              id="calle"
              type="text"
              value={calle}
              onChange={(event) =>
                setCalle(
                  event.target.value
                )
              }
              placeholder={
                locale === "en"
                  ? "Example: Reforma Avenue 123"
                  : "Ej. Av. Reforma 123"
              }
              disabled={guardando}
            />
          </div>

          <div>
            <label htmlFor="colonia">
              {locale === "en"
                ? "Neighborhood"
                : "Colonia"}
            </label>

            <input
              id="colonia"
              type="text"
              value={colonia}
              onChange={(event) =>
                setColonia(
                  event.target.value
                )
              }
              placeholder={
                locale === "en"
                  ? "Example: Downtown"
                  : "Ej. Centro"
              }
              disabled={guardando}
            />
          </div>

          <div>
            <label htmlFor="ciudad">
              {locale === "en"
                ? "City"
                : "Ciudad"}
            </label>

            <input
              id="ciudad"
              type="text"
              value={ciudad}
              onChange={(event) =>
                setCiudad(
                  event.target.value
                )
              }
              placeholder={
                locale === "en"
                  ? "Example: Puebla"
                  : "Ej. Puebla"
              }
              disabled={guardando}
            />
          </div>

          <div>
            <label htmlFor="estadoEntrega">
              {locale === "en"
                ? "State"
                : "Estado"}
            </label>

            <input
              id="estadoEntrega"
              type="text"
              value={estadoEntrega}
              onChange={(event) =>
                setEstadoEntrega(
                  event.target.value
                )
              }
              placeholder={
                locale === "en"
                  ? "Example: Puebla"
                  : "Ej. Puebla"
              }
              disabled={guardando}
            />
          </div>

          <div>
            <label htmlFor="codigoPostal">
              {locale === "en"
                ? "Postal code"
                : "Código postal"}
            </label>

            <input
              id="codigoPostal"
              type="text"
              value={codigoPostal}
              onChange={(event) =>
                setCodigoPostal(
                  event.target.value
                )
              }
              placeholder="72000"
              disabled={guardando}
            />
          </div>

          <div>
            <label htmlFor="referencias">
              {locale === "en"
                ? "References"
                : "Referencias"}
            </label>

            <textarea
              id="referencias"
              value={referencias}
              onChange={(event) =>
                setReferencias(
                  event.target.value
                )
              }
              placeholder={
                locale === "en"
                  ? "Example: White house next to the pharmacy"
                  : "Ej. Casa blanca junto a la farmacia"
              }
              disabled={guardando}
            />
          </div>

          {/* ==================================
              PAGO
          ================================== */}

          <h2>
            {locale === "en"
              ? "Payment method"
              : "Método de pago"}
          </h2>

          <div>
            <label>
              <input
                type="radio"
                name="metodoPago"
                value="efectivo"
                checked={
                  metodoPago ===
                  "efectivo"
                }
                onChange={(event) =>
                  setMetodoPago(
                    event.target.value
                  )
                }
                disabled={guardando}
              />

              {" "}
              {locale === "en"
                ? "Cash"
                : "Efectivo"}
            </label>
          </div>

          <div>
            <label>
              <input
                type="radio"
                name="metodoPago"
                value="tarjeta"
                checked={
                  metodoPago ===
                  "tarjeta"
                }
                onChange={(event) =>
                  setMetodoPago(
                    event.target.value
                  )
                }
                disabled={guardando}
              />

              {" "}
              {locale === "en"
                ? "Card"
                : "Tarjeta"}
            </label>
          </div>

          <div>
            <label>
              <input
                type="radio"
                name="metodoPago"
                value="transferencia"
                checked={
                  metodoPago ===
                  "transferencia"
                }
                onChange={(event) =>
                  setMetodoPago(
                    event.target.value
                  )
                }
                disabled={guardando}
              />

              {" "}
              {locale === "en"
                ? "Bank transfer"
                : "Transferencia bancaria"}
            </label>
          </div>

          {/* ==================================
              TARJETA
          ================================== */}

          {metodoPago === "tarjeta" && (
            <div className="checkout-payment">

              <h3>
                {locale === "en"
                  ? "Card information"
                  : "Datos de la tarjeta"}
              </h3>

              <p>
                {locale === "en"
                  ? "For security, these details are not stored in our database."
                  : "Por seguridad, estos datos no se guardan en nuestra base de datos."}
              </p>

              <div>
                <label htmlFor="titularTarjeta">
                  {locale === "en"
                    ? "Cardholder name"
                    : "Titular de la tarjeta"}
                </label>

                <input
                  id="titularTarjeta"
                  type="text"
                  value={titularTarjeta}
                  onChange={(event) =>
                    setTitularTarjeta(
                      event.target.value
                    )
                  }
                  placeholder={
                    locale === "en"
                      ? "Cardholder name"
                      : "Nombre del titular"
                  }
                  disabled={guardando}
                />
              </div>

              <div>
                <label htmlFor="numeroTarjeta">
                  {locale === "en"
                    ? "Card number"
                    : "Número de tarjeta"}
                </label>

                <input
                  id="numeroTarjeta"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={numeroTarjeta}
                  onChange={(event) =>
                    setNumeroTarjeta(
                      formatearTarjeta(
                        event.target.value
                      )
                    )
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  disabled={guardando}
                />
              </div>

              <div>
                <label htmlFor="fechaExpiracion">
                  {locale === "en"
                    ? "Expiration date"
                    : "Fecha de expiración"}
                </label>

                <input
                  id="fechaExpiracion"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={fechaExpiracion}
                  onChange={(event) =>
                    setFechaExpiracion(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4)
                    )
                  }
                  placeholder="MM/AA"
                  maxLength={4}
                  disabled={guardando}
                />
              </div>

              <div>
                <label htmlFor="cvv">
                  CVV
                </label>

                <input
                  id="cvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={cvv}
                  onChange={(event) =>
                    setCvv(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4)
                    )
                  }
                  placeholder="123"
                  maxLength={4}
                  disabled={guardando}
                />
              </div>

              <p>
                ⚠️{" "}
                {locale === "en"
                  ? "This section only prepares the payment information. It does not charge the card."
                  : "Actualmente esta sección solamente prepara los datos para el pago. Todavía no realiza un cargo real a la tarjeta."}
              </p>
            </div>
          )}

          {/* ==================================
              TRANSFERENCIA
          ================================== */}

          {metodoPago ===
            "transferencia" && (
            <div className="checkout-payment">

              <h3>
                {locale === "en"
                  ? "Bank transfer"
                  : "Transferencia bancaria"}
              </h3>

              <p>
                {locale === "en"
                  ? "Make your transfer using the following information:"
                  : "Realiza tu transferencia a los siguientes datos:"}
              </p>

              <div>
                <p>
                  <strong>
                    {locale === "en"
                      ? "Bank:"
                      : "Banco:"}
                  </strong>{" "}
                  PENDIENTE
                </p>

                <p>
                  <strong>
                    {locale === "en"
                      ? "Account holder:"
                      : "Titular:"}
                  </strong>{" "}
                  Tienda Teya
                </p>

                <p>
                  <strong>
                    {locale === "en"
                      ? "Account:"
                      : "Cuenta:"}
                  </strong>{" "}
                  PENDIENTE
                </p>

                <p>
                  <strong>
                    CLABE:
                  </strong>{" "}
                  PENDIENTE
                </p>
              </div>

              <div>
                <label htmlFor="referenciaTransferencia">
                  {locale === "en"
                    ? "Transfer reference"
                    : "Referencia de transferencia"}
                </label>

                <input
                  id="referenciaTransferencia"
                  type="text"
                  value={
                    referenciaTransferencia
                  }
                  onChange={(event) =>
                    setReferenciaTransferencia(
                      event.target.value
                    )
                  }
                  placeholder={
                    locale === "en"
                      ? "Transfer number or reference"
                      : "Número o referencia de transferencia"
                  }
                  disabled={guardando}
                />
              </div>

              <p>
                {locale === "en"
                  ? "Your order will be registered with bank transfer as the payment method."
                  : "Tu pedido quedará registrado con método de pago por transferencia."}
              </p>
            </div>
          )}
        </div>

        {/* ==================================
            RESUMEN
        ================================== */}

        <div className="checkout-summary">

          <h2>
            {locale === "en"
              ? "Order summary"
              : "Resumen del pedido"}
          </h2>

          {cart.map((item) => (
            <div
              key={item.id}
              className="checkout-item"
            >
              <p>
                {item.name} ×{" "}
                {item.quantity}
              </p>

              <p>
                $
                {(
                  item.price *
                  item.quantity
                ).toFixed(2)}
              </p>
            </div>
          ))}

          <hr />

          <h2>
            {locale === "en"
              ? "Total"
              : "Total"}
            : ${total.toFixed(2)}
          </h2>

          <button
            type="button"
            onClick={
              confirmarPedido
            }
            disabled={guardando}
          >
            {guardando
              ? locale === "en"
                ? "Saving order..."
                : "Guardando pedido..."
              : locale === "en"
              ? "Confirm order"
              : "Confirmar pedido"}
          </button>
        </div>
      </section>
    </main>
  );
}