const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// ========================================
// Obtener todas las categorías
// ========================================
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        id,
        nombre,
        descripcion,
        activa
      FROM categorias
      WHERE activa = TRUE
      ORDER BY id ASC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(
      "Error obteniendo categorías:",
      error
    );

    res.status(500).json({
      error: "No se pudieron obtener las categorías",
    });
  }
});

// ========================================
// Crear categoría
// ========================================
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
    } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        error:
          "El nombre de la categoría es obligatorio",
      });
    }

    const nombreLimpio = nombre.trim();

    // Comprobar si ya existe
    const categoriaExistente = await pool.query(
      `
      SELECT id
      FROM categorias
      WHERE LOWER(nombre) = LOWER($1)
      `,
      [nombreLimpio]
    );

    if (categoriaExistente.rows.length > 0) {
      return res.status(400).json({
        error: "La categoría ya existe",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO categorias
      (
        nombre,
        descripcion,
        activa
      )
      VALUES ($1, $2, TRUE)
      RETURNING
        id,
        nombre,
        descripcion,
        activa
      `,
      [
        nombreLimpio,
        descripcion || "",
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(
      "Error creando categoría:",
      error
    );

    res.status(500).json({
      error: "No se pudo crear la categoría",
    });
  }
});

// ========================================
// Eliminar categoría
// ========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Comprobar si existe
    const categoria = await pool.query(
      `
      SELECT id, nombre
      FROM categorias
      WHERE id = $1
      `,
      [id]
    );

    if (categoria.rows.length === 0) {
      return res.status(404).json({
        error: "Categoría no encontrada",
      });
    }

    // Comprobar si tiene productos
    const productos = await pool.query(
      `
      SELECT COUNT(*)::int AS cantidad
      FROM productos
      WHERE categoria_id = $1
      `,
      [id]
    );

    if (productos.rows[0].cantidad > 0) {
      return res.status(400).json({
        error:
          "No se puede eliminar la categoría porque tiene productos asociados",
      });
    }

    const resultado = await pool.query(
      `
      UPDATE categorias
      SET activa = FALSE
      WHERE id = $1
      RETURNING
        id,
        nombre,
        descripcion,
        activa
      `,
      [id]
    );

    res.json({
      mensaje: "Categoría eliminada correctamente",
      categoria: resultado.rows[0],
    });
  } catch (error) {
    console.error(
      "Error eliminando categoría:",
      error
    );

    res.status(500).json({
      error: "No se pudo eliminar la categoría",
    });
  }
});

module.exports = router;