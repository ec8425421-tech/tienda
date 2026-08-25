const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// ========================================
// OBTENER HISTORIAS ACTIVAS
// ========================================
//
// Solo devuelve historias que:
// - estén activas
// - todavía no hayan expirado
//
// Las historias duran 24 horas.
//

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        id,
        titulo,
        descripcion,
        imagen,
        video,
        creado_en,
        expira_en,
        activo
      FROM historias
      WHERE activo = TRUE
        AND expira_en > CURRENT_TIMESTAMP
      ORDER BY creado_en DESC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(
      "Error obteniendo historias:",
      error
    );

    res.status(500).json({
      error: "No se pudieron obtener las historias",
    });
  }
});


// ========================================
// OBTENER UNA HISTORIA POR ID
// ========================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT
        id,
        titulo,
        descripcion,
        imagen,
        video,
        creado_en,
        expira_en,
        activo
      FROM historias
      WHERE id = $1
        AND activo = TRUE
        AND expira_en > CURRENT_TIMESTAMP
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error:
          "Historia no encontrada o expirada",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(
      "Error obteniendo historia:",
      error
    );

    res.status(500).json({
      error:
        "No se pudo obtener la historia",
    });
  }
});


// ========================================
// CREAR HISTORIA
// ========================================
//
// La historia dura automáticamente 24 horas.
//
// El frontend puede enviar:
//
// {
//   titulo: "Nueva planta disponible",
//   descripcion: "Ya disponible en nuestra tienda",
//   imagen: "https://...",
//   video: ""
// }
//
// Debe existir al menos:
// - imagen
// - o video
//

router.post("/", async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      imagen,
      video,
    } = req.body;

    // ========================================
    // VALIDAR CONTENIDO
    // ========================================

    if (!imagen && !video) {
      return res.status(400).json({
        error:
          "La historia debe tener una imagen o un video",
      });
    }

    // ========================================
    // CREAR FECHAS
    // ========================================

    const creadoEn = new Date();

    const expiraEn = new Date(
      creadoEn.getTime() +
        24 * 60 * 60 * 1000
    );

    // ========================================
    // INSERTAR HISTORIA
    // ========================================

    const resultado = await pool.query(
      `
      INSERT INTO historias
      (
        titulo,
        descripcion,
        imagen,
        video,
        creado_en,
        expira_en,
        activo
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, TRUE)
      RETURNING
        id,
        titulo,
        descripcion,
        imagen,
        video,
        creado_en,
        expira_en,
        activo
      `,
      [
        titulo || "",
        descripcion || "",
        imagen || "",
        video || "",
        creadoEn,
        expiraEn,
      ]
    );

    res.status(201).json(
      resultado.rows[0]
    );
  } catch (error) {
    console.error(
      "Error creando historia:",
      error
    );

    res.status(500).json({
      error:
        "No se pudo crear la historia",
    });
  }
});


// ========================================
// LIMPIAR HISTORIAS EXPIRADAS
// ========================================
//
// IMPORTANTE:
// Esta ruta está ANTES de /:id
// para evitar que Express interprete
// "limpiar" como si fuera un ID.
//

router.delete(
  "/limpiar/expiradas",
  async (req, res) => {
    try {
      const resultado = await pool.query(`
        DELETE FROM historias
        WHERE expira_en <= CURRENT_TIMESTAMP
        RETURNING id
      `);

      res.json({
        mensaje:
          "Historias expiradas eliminadas correctamente",

        eliminadas:
          resultado.rowCount,
      });
    } catch (error) {
      console.error(
        "Error limpiando historias expiradas:",
        error
      );

      res.status(500).json({
        error:
          "No se pudieron limpiar las historias expiradas",
      });
    }
  }
);


// ========================================
// DESACTIVAR HISTORIA
// ========================================

router.put(
  "/:id/desactivar",
  async (req, res) => {
    try {
      const { id } = req.params;

      const resultado = await pool.query(
        `
        UPDATE historias
        SET activo = FALSE
        WHERE id = $1
        RETURNING
          id,
          titulo,
          descripcion,
          imagen,
          video,
          creado_en,
          expira_en,
          activo
        `,
        [id]
      );

      if (resultado.rows.length === 0) {
        return res.status(404).json({
          error:
            "Historia no encontrada",
        });
      }

      res.json({
        mensaje:
          "Historia desactivada correctamente",

        historia:
          resultado.rows[0],
      });
    } catch (error) {
      console.error(
        "Error desactivando historia:",
        error
      );

      res.status(500).json({
        error:
          "No se pudo desactivar la historia",
      });
    }
  }
);


// ========================================
// ELIMINAR HISTORIA
// ========================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      DELETE FROM historias
      WHERE id = $1
      RETURNING
        id,
        titulo,
        descripcion,
        imagen,
        video,
        creado_en,
        expira_en,
        activo
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error:
          "Historia no encontrada",
      });
    }

    res.json({
      mensaje:
        "Historia eliminada correctamente",

      historia:
        resultado.rows[0],
    });
  } catch (error) {
    console.error(
      "Error eliminando historia:",
      error
    );

    res.status(500).json({
      error:
        "No se pudo eliminar la historia",
    });
  }
});


module.exports = router;