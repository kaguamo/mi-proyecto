const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/formulario")
.then(() => {
    console.log("Conectado a MongoDB");
})
.catch((err) => {
    console.error("Error de conexión:", err);
});

// Esquema de contactos
const contactoSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    producto: String,
    opinion: String,
    sugerencia: String,
    fecha: {
        type: Date,
        default: Date.now
    }
});

// Modelo que usa la colección "contactos"
const Contacto = mongoose.model(
    "Contacto",
    contactoSchema,
    "contactos"
);

// Guardar datos
app.post("/guardar", async (req, res) => {
    try {

        const nuevoContacto = new Contacto({
            nombre: req.body.nombre,
            email: req.body.email,
            producto: req.body.producto,
            opinion: req.body.opinion,
            sugerencia: req.body.sugerencia || ""
        });

        await nuevoContacto.save();

        res.send("Datos guardados correctamente en contactos");

    } catch (error) {

        console.error(error);
        res.status(500).send("Error al guardar los datos");

    }
});

// Ver todos los contactos
app.get("/contactos", async (req, res) => {
    try {

        const contactos = await Contacto.find().sort({ fecha: -1 });

        res.json(contactos);

    } catch (error) {

        console.error(error);
        res.status(500).send("Error al obtener los contactos");

    }
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});