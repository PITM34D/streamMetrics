const express = require("express");
const cors = require("cors"); // Importamos CORS, para que el front pueda llamar al back
require("dotenv").config(); // Para leer el archivo .env

const db = require("./src/config/db"); // Importa db.js

const app = express();

app.use(cors()); // middleware para permitir peticiones externas
app.use(express.json()); //middleware para que express entieenda json

// ENDPOINT de prueba para comprobar que el serv funciona
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

//ENDPONINT para obtrener todos los titulos
app.get("/titles", async (req, res)=> {
  try {
    const [rows] = await db.query("SELECT * FROM titles");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching titles"});
  }
});

//ENDPOINT para obtener tdos los eventos
app.get("/events", async (req, res) =>{
  try {
    const [rows] = await db.query("SELECT * FROM events");
    res.json(rows);
  } catch (error){
    console.error(error);
    res.status(500).json({ error: "Error fetching events"});
  }
});

//ENDPOINT para guardar eventos
app.post("/events", async (req, res) => {
  try {
    const { user_id, event_type, page, title_id } = req.body;//Lo que envia el cliente

    const [result] = await db.query(
      "INSERT INTO events (user_id, event_type, page, title_id) VALUES (?, ?, ?, ?)",//placeholders para evitar SQL injections
      [user_id, event_type, page, title_id]//guarda el evento en la bbdd
    );

    res.status(201).json({
      message: "Event created",
      id: result.insertId //id del evento creado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating event" });
  }
});

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
