const express = require("express");
const Stripe = require("stripe");
const pool = require("../config/db");
const verificarToken = require("../middleware/auth");

const router = express.Router();

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

// ========================================
// Crear sesión de pago con Stripe
// ========================================

router.post(
  "/crear-checkout",
  verificarToken,
  async (req, res) => {
    try {
      const {
        productos,
        nombre_cliente,
        email_cliente,
        telefono_cliente,
        calle,
        colonia,
        ciudad,
        estado_entrega,
        codigo_postal,
        referencias,
      } = req.body;

      // ========================================
      // Validar productos
      // ========================================

      if (
        !Array.isArray(productos) ||
        productos.length === 0
      ) {
        return res.status(400).json({
          error:
            "Debes incluir al menos un producto.",
        });
      }

      // ========================================
      // Validar datos básicos
      // ========================================

      if (
        !nombre_cliente ||
        !email_cliente ||
        !telefono_cliente
      ) {
        return res.status(400).json({
          error:
            "Los datos del cliente son obligatorios.",
        });
      }

      if (
        !calle ||
        !colonia ||
        !ciudad ||
        !estado_entrega ||
        !codigo_postal
      ) {
        return res.status(400).json({
          error:
            "La dirección de entrega es obligatoria.",
        });
      }

      // ========================================
      // Obtener productos reales de BD
      // ========================================

      const detalles = [];
      let total = 0;

      for (const producto of productos) {
        const cantidad = Number(
          producto.cantidad
        );

        if (
          !Number.isInteger(cantidad) ||
          cantidad <= 0
        ) {
          return res.status(400).json({
            error:
              "Cantidad de producto inválida.",
          });
        }

        const resultado =
          await pool.query(
            `
            SELECT
              id,
              nombre,
              descripcion,
              precio,
              stock
            FROM productos
            WHERE id = $1
              AND activo = true
            `,
            [producto.id]
          );

        if (
          resultado.rows.length === 0
        ) {
          return res.status(404).json({
            error:
              `Producto ${producto.id} no encontrado.`,
          });
        }

        const productoBD =
          resultado.rows[0];

        if (
          productoBD.stock < cantidad
        ) {
          return res.status(400).json({
            error:
              `No hay suficiente stock de ${productoBD.nombre}.`,
          });
        }

        const precio = Number(
          productoBD.precio
        );

        const subtotal =
          precio * cantidad;

        total += subtotal;

        detalles.push({
          id: productoBD.id,
          nombre: productoBD.nombre,
          precio,
          cantidad,
          subtotal,
        });
      }

      // ========================================
      // Crear sesión de Stripe
      // ========================================

      const session =
        await stripe.checkout.sessions.create(
          {
            mode: "payment",

            payment_method_types: [
              "card",
            ],

            customer_email:
              email_cliente,

            line_items:
              detalles.map((detalle) => ({
                price_data: {
                  currency: "mxn",

                  product_data: {
                    name:
                      detalle.nombre,
                  },

                  unit_amount:
                    Math.round(
                      detalle.precio * 100
                    ),
                },

                quantity:
                  detalle.cantidad,
              })),

            metadata: {
              usuario_id: String(
                req.usuario.id
              ),
            },

            success_url:
              `${process.env.FRONTEND_URL}/pedido-confirmado?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
              `${process.env.FRONTEND_URL}/checkout`,
          }
        );

      // ========================================
      // Respuesta
      // ========================================

      res.json({
        mensaje:
          "Sesión de pago creada correctamente.",

        url: session.url,

        session_id:
          session.id,
      });
    } catch (error) {
      console.error(
        "Error creando sesión de Stripe:",
        error
      );

      res.status(500).json({
        error:
          "No se pudo crear el pago.",
      });
    }
  }
);

module.exports = router;