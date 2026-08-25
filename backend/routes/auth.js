const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const verificarToken = require("../middleware/auth");

const router = express.Router();
// ========================================
// Registrar usuario
// ========================================
router.post("/registro", async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
    } = req.body;

    // ========================================
    // Validar datos
    // ========================================

    if (
      !nombre ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        error:
          "El nombre, correo y contraseña son obligatorios",
      });
    }

    const nombreLimpio = nombre.trim();
    const emailLimpio =
      email.trim().toLowerCase();

    if (nombreLimpio.length < 2) {
      return res.status(400).json({
        error:
          "El nombre debe tener al menos 2 caracteres",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error:
          "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // ========================================
    // Comprobar si ya existe
    // ========================================

    const usuarioExistente =
      await pool.query(
        `
        SELECT id
        FROM usuarios
        WHERE email = $1
        `,
        [emailLimpio]
      );

    if (
      usuarioExistente.rows.length > 0
    ) {
      return res.status(409).json({
        error:
          "Ya existe una cuenta con ese correo electrónico",
      });
    }

    // ========================================
    // Encriptar contraseña
    // ========================================

    const passwordEncriptada =
      await bcrypt.hash(password, 10);

    // ========================================
    // Crear usuario
    // ========================================

    const resultado =
      await pool.query(
        `
        INSERT INTO usuarios
        (
          nombre,
          email,
          password,
          rol,
          activo
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          nombre,
          email,
          rol,
          activo,
          created_at
        `,
        [
          nombreLimpio,
          emailLimpio,
          passwordEncriptada,
          "usuario",
          true,
        ]
      );

    const usuario =
      resultado.rows[0];

    // ========================================
    // Crear token
    // ========================================

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    // ========================================
    // Respuesta
    // ========================================

    res.status(201).json({
      mensaje:
        "Cuenta creada correctamente",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(
      "Error registrando usuario:",
      error
    );

    res.status(500).json({
      error:
        "No se pudo crear la cuenta",
    });
  }
});

// ========================================
// Iniciar sesión
// ========================================
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error:
          "El correo y la contraseña son obligatorios",
      });
    }

    const emailLimpio =
      email.trim().toLowerCase();

    const resultado =
      await pool.query(
        `
        SELECT
          id,
          nombre,
          email,
          password,
          rol,
          activo
        FROM usuarios
        WHERE email = $1
        `,
        [emailLimpio]
      );

    if (
      resultado.rows.length === 0
    ) {
      return res.status(401).json({
        error:
          "Correo o contraseña incorrectos",
      });
    }

    const usuario =
      resultado.rows[0];

    if (!usuario.activo) {
      return res.status(403).json({
        error:
          "El usuario está desactivado",
      });
    }

    const passwordCorrecta =
      await bcrypt.compare(
        password,
        usuario.password
      );

    if (!passwordCorrecta) {
      return res.status(401).json({
        error:
          "Correo o contraseña incorrectos",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res.json({
      mensaje:
        "Inicio de sesión correcto",

      token,

      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(
      "Error en login:",
      error
    );

    res.status(500).json({
      error:
        "No se pudo iniciar sesión",
    });
  }
});
// ========================================
// Obtener perfil del usuario
// ========================================
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const resultado = await pool.query(
      `
      SELECT
        id,
        nombre,
        email,
        rol,
        activo,
        created_at
      FROM usuarios
      WHERE id = $1
      `,
      [req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    res.json({
      usuario: resultado.rows[0],
    });
  } catch (error) {
    console.error(
      "Error obteniendo perfil:",
      error
    );

    res.status(500).json({
      error: "No se pudo obtener el perfil",
    });
  }
});

// ========================================
// Actualizar perfil del usuario
// ========================================
router.put("/perfil", verificarToken, async (req, res) => {
  try {
    const { nombre, email } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        error: "El nombre es obligatorio",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        error: "El correo electrónico es obligatorio",
      });
    }

    const emailNormalizado =
      email.trim().toLowerCase();

    const usuarioExistente =
      await pool.query(
        `
        SELECT id
        FROM usuarios
        WHERE email = $1
          AND id <> $2
        `,
        [
          emailNormalizado,
          req.usuario.id,
        ]
      );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        error:
          "Ese correo electrónico ya está registrado",
      });
    }

    const resultado =
      await pool.query(
        `
        UPDATE usuarios
        SET
          nombre = $1,
          email = $2
        WHERE id = $3
        RETURNING
          id,
          nombre,
          email,
          rol,
          activo,
          created_at
        `,
        [
          nombre.trim(),
          emailNormalizado,
          req.usuario.id,
        ]
      );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    res.json({
      mensaje:
        "Perfil actualizado correctamente",
      usuario: resultado.rows[0],
    });
  } catch (error) {
    console.error(
      "Error actualizando perfil:",
      error
    );

    res.status(500).json({
      error:
        "No se pudo actualizar el perfil",
    });
  }
});

// ========================================
// Cambiar contraseña
// ========================================
router.put(
  "/cambiar-password",
  verificarToken,
  async (req, res) => {
    try {
      const {
        passwordActual,
        passwordNueva,
      } = req.body;

      // ========================================
      // Validar datos
      // ========================================

      if (
        !passwordActual ||
        !passwordNueva
      ) {
        return res.status(400).json({
          error:
            "La contraseña actual y la nueva contraseña son obligatorias",
        });
      }

      // ========================================
      // Validar longitud
      // ========================================

      if (passwordNueva.length < 6) {
        return res.status(400).json({
          error:
            "La nueva contraseña debe tener al menos 6 caracteres",
        });
      }

      // ========================================
      // Obtener contraseña actual
      // ========================================

      const resultado =
        await pool.query(
          `
          SELECT
            id,
            password
          FROM usuarios
          WHERE id = $1
          `,
          [req.usuario.id]
        );

      if (resultado.rows.length === 0) {
        return res.status(404).json({
          error:
            "Usuario no encontrado",
        });
      }

      const usuario =
        resultado.rows[0];

      // ========================================
      // Comprobar contraseña actual
      // ========================================

      const passwordCorrecta =
        await bcrypt.compare(
          passwordActual,
          usuario.password
        );

      if (!passwordCorrecta) {
        return res.status(401).json({
          error:
            "La contraseña actual es incorrecta",
        });
      }

      // ========================================
      // Evitar misma contraseña
      // ========================================

      const mismaPassword =
        await bcrypt.compare(
          passwordNueva,
          usuario.password
        );

      if (mismaPassword) {
        return res.status(400).json({
          error:
            "La nueva contraseña debe ser diferente a la actual",
        });
      }

      // ========================================
      // Encriptar nueva contraseña
      // ========================================

      const passwordEncriptada =
        await bcrypt.hash(
          passwordNueva,
          10
        );

      // ========================================
      // Actualizar contraseña
      // ========================================

      await pool.query(
        `
        UPDATE usuarios
        SET password = $1
        WHERE id = $2
        `,
        [
          passwordEncriptada,
          req.usuario.id,
        ]
      );

      // ========================================
      // Respuesta
      // ========================================

      res.json({
        mensaje:
          "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.error(
        "Error cambiando contraseña:",
        error
      );

      res.status(500).json({
        error:
          "No se pudo cambiar la contraseña",
      });
    }
  }
);
module.exports = router;