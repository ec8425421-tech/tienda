const express = require("express");
const pool = require("../config/db");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// ========================================
// Crear un pedido
// ========================================
router.post("/", verificarToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      nombre_cliente,
      email_cliente,
      telefono_cliente,
      calle,
      colonia,
      ciudad,
      estado_entrega,
      codigo_postal,
      referencias,
      metodo_pago,
      productos,
    } = req.body;

    const usuario_id = req.usuario.id;

    // ========================================
    // Validar datos básicos
    // ========================================

    if (
      !nombre_cliente ||
      !productos ||
      !Array.isArray(productos) ||
      productos.length === 0
    ) {
      return res.status(400).json({
        error:
          "El nombre del cliente y los productos son obligatorios",
      });
    }

    // ========================================
    // Validar dirección
    // ========================================

    if (
      !calle ||
      !colonia ||
      !ciudad ||
      !estado_entrega ||
      !codigo_postal
    ) {
      return res.status(400).json({
        error:
          "La dirección de entrega es obligatoria",
      });
    }

    // ========================================
    // Métodos de pago permitidos
    // ========================================

    const metodosPagoPermitidos = [
      "efectivo",
      "tarjeta",
      "transferencia",
    ];

    if (
      !metodo_pago ||
      !metodosPagoPermitidos.includes(
        metodo_pago
      )
    ) {
      return res.status(400).json({
        error:
          "Método de pago inválido. Usa: efectivo, tarjeta o transferencia.",
      });
    }

    await client.query("BEGIN");

    let total = 0;
    const detalles = [];

    // ========================================
    // Comprobar productos y calcular total
    // ========================================

    for (const producto of productos) {
      const resultado = await client.query(
        `
        SELECT
          id,
          nombre,
          precio,
          stock
        FROM productos
        WHERE id = $1
          AND activo = true
        `,
        [producto.id]
      );

      if (resultado.rows.length === 0) {
        throw new Error(
          `Producto con ID ${producto.id} no encontrado`
        );
      }

      const productoBD = resultado.rows[0];

      const cantidad = Number(
        producto.cantidad
      );

      if (
        !Number.isInteger(cantidad) ||
        cantidad <= 0
      ) {
        throw new Error(
          `Cantidad inválida para ${productoBD.nombre}`
        );
      }

      if (productoBD.stock < cantidad) {
        throw new Error(
          `No hay suficiente stock de ${productoBD.nombre}`
        );
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
    // Crear pedido
    // ========================================

    const pedidoResultado =
      await client.query(
        `
        INSERT INTO pedidos
        (
          usuario_id,
          nombre_cliente,
          email_cliente,
          telefono_cliente,
          calle,
          colonia,
          ciudad,
          estado_entrega,
          codigo_postal,
          referencias,
          total,
          metodo_pago
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12
        )
        RETURNING *
        `,
        [
          usuario_id,
          nombre_cliente,
          email_cliente || null,
          telefono_cliente || null,
          calle,
          colonia,
          ciudad,
          estado_entrega,
          codigo_postal,
          referencias || null,
          total,
          metodo_pago,
        ]
      );

    const pedido =
      pedidoResultado.rows[0];

    // ========================================
    // Guardar detalles y actualizar stock
    // ========================================

    for (const detalle of detalles) {
      await client.query(
        `
        INSERT INTO pedido_detalles
        (
          pedido_id,
          producto_id,
          nombre_producto,
          precio,
          cantidad,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          pedido.id,
          detalle.id,
          detalle.nombre,
          detalle.precio,
          detalle.cantidad,
          detalle.subtotal,
        ]
      );

      await client.query(
        `
        UPDATE productos
        SET stock = stock - $1
        WHERE id = $2
        `,
        [
          detalle.cantidad,
          detalle.id,
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      mensaje:
        "Pedido creado correctamente",
      pedido,
      detalles,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Error creando pedido:",
      error
    );

    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "No se pudo crear el pedido",
    });
  } finally {
    client.release();
  }
});

// ========================================
// Obtener todos los pedidos
// ADMIN
// ========================================
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        id,
        usuario_id,
        nombre_cliente,
        email_cliente,
        telefono_cliente,
        calle,
        colonia,
        ciudad,
        estado_entrega,
        codigo_postal,
        referencias,
        total,
        metodo_pago,
        estado,
        created_at
      FROM pedidos
      ORDER BY id DESC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(
      "Error obteniendo pedidos:",
      error
    );

    res.status(500).json({
      error:
        "No se pudieron obtener los pedidos",
    });
  }
});

// ========================================
// Mis pedidos
// ========================================
router.get(
  "/mis-pedidos",
  verificarToken,
  async (req, res) => {
    try {
      const usuario_id = req.usuario.id;

      const resultado = await pool.query(
        `
        SELECT
          id,
          usuario_id,
          nombre_cliente,
          email_cliente,
          telefono_cliente,
          calle,
          colonia,
          ciudad,
          estado_entrega,
          codigo_postal,
          referencias,
          total,
          metodo_pago,
          estado,
          created_at
        FROM pedidos
        WHERE usuario_id = $1
        ORDER BY id DESC
        `,
        [usuario_id]
      );

      res.json(resultado.rows);
    } catch (error) {
      console.error(
        "Error obteniendo mis pedidos:",
        error
      );

      res.status(500).json({
        error:
          "No se pudieron obtener tus pedidos",
      });
    }
  }
);

// ========================================
// Cancelar mi pedido
// ========================================
router.put(
  "/:id/cancelar",
  verificarToken,
  async (req, res) => {
    const client = await pool.connect();

    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;

      await client.query("BEGIN");

      // ========================================
      // Buscar pedido del usuario
      // ========================================

      const pedidoResultado =
        await client.query(
          `
          SELECT
            id,
            usuario_id,
            estado
          FROM pedidos
          WHERE id = $1
            AND usuario_id = $2
          FOR UPDATE
          `,
          [id, usuario_id]
        );

      if (
        pedidoResultado.rows.length === 0
      ) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          error:
            "Pedido no encontrado o no pertenece a tu cuenta",
        });
      }

      const pedido =
        pedidoResultado.rows[0];

      // ========================================
      // Comprobar estado
      // ========================================

      if (
        pedido.estado !== "pendiente" &&
        pedido.estado !== "confirmado"
      ) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          error:
            "Este pedido ya no se puede cancelar",
        });
      }

      // ========================================
      // Obtener productos
      // ========================================

      const detallesResultado =
        await client.query(
          `
          SELECT
            producto_id,
            cantidad
          FROM pedido_detalles
          WHERE pedido_id = $1
          `,
          [id]
        );

      // ========================================
      // Restaurar stock
      // ========================================

      for (
        const detalle
        of detallesResultado.rows
      ) {
        const stockResultado =
          await client.query(
            `
            UPDATE productos
            SET stock = stock + $1
            WHERE id = $2
            RETURNING id, stock
            `,
            [
              detalle.cantidad,
              detalle.producto_id,
            ]
          );

        if (
          stockResultado.rows.length === 0
        ) {
          throw new Error(
            `No se pudo restaurar el stock del producto ${detalle.producto_id}`
          );
        }
      }

      // ========================================
      // Cambiar estado a cancelado
      // ========================================

      const resultado =
        await client.query(
          `
          UPDATE pedidos
          SET estado = 'cancelado'
          WHERE id = $1
            AND usuario_id = $2
            AND estado IN ('pendiente', 'confirmado')
          RETURNING *
          `,
          [id, usuario_id]
        );

      if (resultado.rows.length === 0) {
        throw new Error(
          "El pedido ya no puede ser cancelado"
        );
      }

      await client.query("COMMIT");

      res.json({
        mensaje:
          "Pedido cancelado correctamente. El stock fue restaurado.",
        pedido:
          resultado.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");

      console.error(
        "Error cancelando pedido:",
        error
      );

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "No se pudo cancelar el pedido",
      });
    } finally {
      client.release();
    }
  }
);

// ========================================
// Obtener un pedido por ID
// ========================================
// SEGURIDAD:
// Cliente -> solamente puede ver sus pedidos
// Admin -> puede ver cualquier pedido
// ========================================
router.get(
  "/:id",
  verificarToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const usuario_id = req.usuario.id;

      // ========================================
      // Determinar si el usuario es admin
      // ========================================

      const esAdmin =
        req.usuario.rol === "admin" ||
        req.usuario.role === "admin";

      // ========================================
      // Obtener pedido
      // ========================================

      let pedidoResultado;

      if (esAdmin) {
        // ======================================
        // ADMIN
        // Puede consultar cualquier pedido
        // ======================================

        pedidoResultado =
          await pool.query(
            `
            SELECT
              id,
              usuario_id,
              nombre_cliente,
              email_cliente,
              telefono_cliente,
              calle,
              colonia,
              ciudad,
              estado_entrega,
              codigo_postal,
              referencias,
              total,
              metodo_pago,
              estado,
              created_at
            FROM pedidos
            WHERE id = $1
            `,
            [id]
          );
      } else {
        // ======================================
        // CLIENTE
        // Solo puede consultar SU pedido
        // ======================================

        pedidoResultado =
          await pool.query(
            `
            SELECT
              id,
              usuario_id,
              nombre_cliente,
              email_cliente,
              telefono_cliente,
              calle,
              colonia,
              ciudad,
              estado_entrega,
              codigo_postal,
              referencias,
              total,
              metodo_pago,
              estado,
              created_at
            FROM pedidos
            WHERE id = $1
              AND usuario_id = $2
            `,
            [id, usuario_id]
          );
      }

      // ========================================
      // Pedido no encontrado
      // ========================================

      if (
        pedidoResultado.rows.length === 0
      ) {
        return res.status(404).json({
          error:
            "Pedido no encontrado o no tienes permiso para verlo",
        });
      }

      // ========================================
      // Obtener detalles
      // ========================================

      const detallesResultado =
        await pool.query(
          `
          SELECT
            id,
            producto_id,
            nombre_producto,
            precio,
            cantidad,
            subtotal
          FROM pedido_detalles
          WHERE pedido_id = $1
          ORDER BY id ASC
          `,
          [id]
        );

      // ========================================
      // Respuesta
      // ========================================

      res.json({
        pedido:
          pedidoResultado.rows[0],
        detalles:
          detallesResultado.rows,
      });
    } catch (error) {
      console.error(
        "Error obteniendo pedido:",
        error
      );

      res.status(500).json({
        error:
          "No se pudo obtener el pedido",
      });
    }
  }
);

// ========================================
// Cambiar estado del pedido
// ADMIN
// ========================================
router.put(
  "/:id/estado",
  async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const estadosPermitidos = [
        "pendiente",
        "confirmado",
        "enviado",
        "entregado",
        "cancelado",
      ];

      if (
        !estado ||
        !estadosPermitidos.includes(
          estado
        )
      ) {
        return res.status(400).json({
          error:
            "Estado inválido. Usa: pendiente, confirmado, enviado, entregado o cancelado.",
        });
      }

      const resultado =
        await pool.query(
          `
          UPDATE pedidos
          SET estado = $1
          WHERE id = $2
          RETURNING *
          `,
          [estado, id]
        );

      if (resultado.rows.length === 0) {
        return res.status(404).json({
          error:
            "Pedido no encontrado",
        });
      }

      res.json({
        mensaje:
          "Estado del pedido actualizado correctamente",
        pedido: resultado.rows[0],
      });
    } catch (error) {
      console.error(
        "Error actualizando estado del pedido:",
        error
      );

      res.status(500).json({
        error:
          "No se pudo actualizar el estado del pedido",
      });
    }
  }
);

module.exports = router;