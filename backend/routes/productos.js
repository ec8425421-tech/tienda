const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// ========================================
// Obtener todos los productos
// ========================================
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen,
        p.activo,
        c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c
        ON p.categoria_id = c.id
      ORDER BY p.id ASC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(
      "Error obteniendo productos:",
      error
    );

    res.status(500).json({
      error: "No se pudieron obtener los productos",
    });
  }
});

// ========================================
// Obtener un producto por ID
// ========================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen,
        p.activo,
        c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c
        ON p.categoria_id = c.id
      WHERE p.id = $1
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(
      "Error obteniendo producto:",
      error
    );

    res.status(500).json({
      error: "No se pudo obtener el producto",
    });
  }
});

// ========================================
// Crear producto
// ========================================
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categoria_id,
    } = req.body;

    if (!nombre || precio === undefined) {
      return res.status(400).json({
        error:
          "El nombre y el precio son obligatorios",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO productos
      (
        nombre,
        descripcion,
        precio,
        stock,
        imagen,
        categoria_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        nombre,
        descripcion || "",
        precio,
        stock || 0,
        imagen || "",
        categoria_id || null,
      ]
    );

    res.status(201).json(
      resultado.rows[0]
    );
  } catch (error) {
    console.error(
      "Error creando producto:",
      error
    );

    res.status(500).json({
      error: "No se pudo crear el producto",
    });
  }
});

// ========================================
// Actualizar solamente el stock
// ========================================
router.put("/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const nuevoStock = Number(stock);

    if (
      stock === undefined ||
      !Number.isInteger(nuevoStock) ||
      nuevoStock < 0
    ) {
      return res.status(400).json({
        error:
          "El stock debe ser un número entero mayor o igual a 0",
      });
    }

    const resultado = await pool.query(
      `
      UPDATE productos
      SET stock = $1
      WHERE id = $2
      RETURNING id, nombre, stock
      `,
      [nuevoStock, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(
      "Error actualizando stock:",
      error
    );

    res.status(500).json({
      error:
        "No se pudo actualizar el stock",
    });
  }
});

// ========================================
// Actualizar producto completo
// ========================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categoria_id,
      activo,
    } = req.body;

    const resultado = await pool.query(
      `
      UPDATE productos
      SET
        nombre = $1,
        descripcion = $2,
        precio = $3,
        stock = $4,
        imagen = $5,
        categoria_id = $6,
        activo = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        nombre,
        descripcion || "",
        precio,
        stock || 0,
        imagen || "",
        categoria_id || null,
        activo !== undefined
          ? activo
          : true,
        id,
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(
      resultado.rows[0]
    );
  } catch (error) {
    console.error(
      "Error actualizando producto:",
      error
    );

    res.status(500).json({
      error:
        "No se pudo actualizar el producto",
    });
  }
});

// ========================================
// Eliminar producto
// ========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      DELETE FROM productos
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json({
      mensaje:
        "Producto eliminado correctamente",
      producto: resultado.rows[0],
    });
  } catch (error) {
    console.error(
      "Error eliminando producto:",
      error
    );

    res.status(500).json({
      error:
        "No se pudo eliminar el producto",
    });
  }
});

module.exports = router;