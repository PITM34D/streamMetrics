const express = require("express");
const cors = require("cors"); // Importamos CORS, para que el front pueda llamar al back
require("dotenv").config(); // Para leer el archivo .env

const db = require("./src/config/db"); // Importa db.js

const app = express();

app.use(cors()); // middleware para permitir peticiones externas
app.use(express.json()); //middleware para que express entieenda json

//-----------------------------------------------------------------------------------

// ENDPOINT de prueba para comprobar que el serv funciona
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

//ENDPONINT para obtrener todos los titulos
app.get("/titles", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM titles");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching titles" });
  }
});

//ENDPOINT para obtener tdos los eventos
app.get("/events", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM events");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching events" });
  }
});

//ENDPOINT para guardar eventos
app.post("/events", async (req, res) => {
  try {
    const { user_id, event_type, page, title_id } = req.body; //Lo que envia el cliente

    const [result] = await db.query(
      "INSERT INTO events (user_id, event_type, page, title_id) VALUES (?, ?, ?, ?)", //placeholders para evitar SQL injections
      [user_id, event_type, page, title_id], //guarda el evento en la bbdd
    );

    res.status(201).json({
      message: "Event created",
      id: result.insertId, //id del evento creado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating event" });
  }
});

//ENDPOINT para agrupar eventos por tipo
app.get("/stats/events-by-type", async (req, res) => {
  //La ruta para las estadisticas
  try {
    const [rows] = await db.query(
      `SELECT event_type, COUNT(*) AS total
      FROM events
      GROUP BY event_type
      ORDER BY total DESC`,
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching event stats" });
  }
});

// ENDPOINT para agrupar eventos por día
app.get("/stats/events-by-day", async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT DATE_FORMAT(created_at, "%Y-%m-%d") AS date, COUNT(*) AS total FROM events GROUP BY DATE_FORMAT(created_at, "%Y-%m-%d") ORDER BY date ASC'
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching events by day:", error);
    res.status(500).json({
      error: "Error fetching events by day",
      details: error.message
    });
  }
});

// ENDPOINT para obtner las paginas con mas actividad
app.get("/stats/top-pages", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT page, COUNT(*) AS total
      FROM events
      WHERE page IS NOT NULL AND page <> ''
      GROUP BY page
      ORDER BY total DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching top pages" });
  }
});

// ENDPOINT para obtener los titulos con mas actividad
app.get("/stats/top-titles", async (req, res) => {
  try {
    const { from, to } = req.query;

    let query = `
      SELECT events.title_id, titles.name AS title, COUNT(*) AS total
      FROM events
      JOIN titles ON events.title_id = titles.id
      WHERE events.title_id IS NOT NULL
    `;

    const params = [];

    if (from) {
      query += ` AND DATE(events.created_at) >= ?`;
      params.push(from);
    }

    if (to) {
      query += ` AND DATE(events.created_at) <= ?`;
      params.push(to);
    }

    query += `
      GROUP BY events.title_id, titles.name
      ORDER BY total DESC
    `;

    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching top titles" });
  }
});

//--------------------------------------------------------------------------

// Comprobacion de cnexion a la bbdd
db.getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release(); // Liberamos la conexion para devolverla al pool
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

const PORT = process.env.PORT || 3000; // Definimos el puerto (o lo lee del .env o usa 3000)

// Arrancamos el serv y lo dejamos escuchando peticiones
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
