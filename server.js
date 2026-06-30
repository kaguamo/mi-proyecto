const express = require("express");
const mongoose = require("mongoose");

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Permitir peticiones desde Live Server
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ======================
// CONEXIÓN A MONGODB
// ======================
mongoose.connect("mongodb://127.0.0.1:27017/formulario")
.then(() => {
    console.log("✅ MongoDB conectado correctamente");
})
.catch((err) => {
    console.log("❌ Error de conexión:", err);
});

// ======================
// ESQUEMA
// ======================
const contactoSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    correo: {
        type: String,
        required: true,
        trim: true
    },

    mensaje: {
        type: String,
        required: true,
        trim: true
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

// ======================
// MODELO
// ======================
const Contacto = mongoose.model(
    "Contacto",
    contactoSchema,
    "contactos"
);

// ======================
// GUARDAR CONTACTO
// ======================
app.post("/guardar", async (req, res) => {

    try {

        console.log("================================");
        console.log("Datos recibidos:");
        console.log(req.body);
        console.log("================================");

        const { nombre, correo, mensaje } = req.body;

        if (!nombre || !correo || !mensaje) {

            return res.status(400).send("Todos los campos son obligatorios.");

        }

        const nuevoContacto = new Contacto({

            nombre,
            correo,
            mensaje

        });

        await nuevoContacto.save();

        res.status(200).send("Datos enviados correctamente.");

    } catch (error) {

        console.error(error);

        res.status(500).send("Error al guardar los datos.");

    }

});

// ======================
// VER CONTACTOS
// ======================
app.get("/contactos", async (req, res) => {

    try {

        const contactos = await Contacto.find().sort({
            fecha: -1
        });

        res.json(contactos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "No fue posible obtener los contactos."
        });

    }

});

// ======================
// PRUEBA
// ======================
app.get("/", (req, res) => {

    res.send("Servidor funcionando correctamente.");

});

// ======================
// INICIAR SERVIDOR
// ======================
const PORT = 3000;

app.listen(PORT, () => {

    console.log("");
    console.log("=====================================");
    console.log("🚀 Servidor iniciado correctamente");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("=====================================");

});