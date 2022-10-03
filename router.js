const express = require("express");
const router = express.Router();
const path = require('path');

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/login.html'));
});
router.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/admin.html'));
});
// 301 error
router.get("/401", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/401.html'));
});

///////////////////////////////////////////
//////////// AUTH controllers /////////////
///////////////////////////////////////////
const { requireSignin, invalidToken } = require('./controllers/middleware');
const { signup, signin, forgotPassword, resetPassword } = require("./controllers/auth");

router.post("/api/signup", signup);
router.post("/api/signin", signin);
router.post("/api/forgot-password", forgotPassword);
router.post("/api/reset-password", resetPassword);


///////////////////////////////////////////
//////////// USERS controllers ////////////
///////////////////////////////////////////
//CRUD FILES
const { upload_file, getFiles, getFile, updateRrss } = require("./controllers/CRUD/USER/files");
router.post("/api/upload-image", requireSignin, upload_file);
router.get("/files", requireSignin, getFiles);
router.get("/file/:name", requireSignin, getFile);
router.put("/api/rrss/:id", requireSignin, updateRrss);

// CRUD USUARIOS
const { obtenerUsuario, modificarUsuario, borrarUsuario } = require("./controllers/CRUD/USER/usuarios");

router.get("/api/usuarios/:id", requireSignin, obtenerUsuario);
router.put("/api/usuarios/:id", requireSignin, modificarUsuario);
router.delete("/api/usuarios/:id", requireSignin, borrarUsuario);

// CRUD MENSAJES
const { publicarMensaje } = require("./controllers/CRUD/USER/mensajes");

router.post("/api/mensajes", requireSignin, publicarMensaje);

// CRUD VIAJES
const { obtenerViajes, publicarViajes, modificarViajes, borrarViajes } = require("./controllers/CRUD/USER/viajes");

router.get("/api/viajes", requireSignin, obtenerViajes);
router.post("/api/viajes", requireSignin, publicarViajes);
router.put("/api/viajes/:id", requireSignin, modificarViajes);
router.delete("/api/viajes/:id", requireSignin, borrarViajes);

// CRUD DESTINOS
const { obtenerDestinos } = require("./controllers/CRUD/USER/destinos");

router.get("/api/destinos", requireSignin, obtenerDestinos);

// CRUD RESERVAS
const { obtenerReservas } = require("./controllers/CRUD/USER/reservas");

router.get("/api/reservas", requireSignin, obtenerReservas);


///////////////////////////////////////////
//////////// ADMIN controllers ////////////
///////////////////////////////////////////

// CRUD USUARIOS
const { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios } = require("./controllers/CRUD/ADMIN/usuarios");

router.get("/api/admin/usuarios", requireSignin, getUsuarios);
router.post("/api/admin/usuarios", requireSignin, postUsuarios);
router.put("/api/admin/usuarios", requireSignin, putUsuarios); 
router.delete("/api/admin/usuarios", requireSignin, deleteUsuarios);

// CRUD MENSAJES
const { getMensajes, postMensajes, deleteMensajes } = require("./controllers/CRUD/ADMIN/mensajes");

router.get("/api/admin/mensajes", requireSignin, getMensajes);
router.post("/api/admin/mensajes", requireSignin, postMensajes);
//PUT mensajes not necessary
router.delete("/api/admin/mensajes", requireSignin, deleteMensajes);

// CRUD VIAJES
const { getViajes, postViajes, putViajes, deleteViajes } = require("./controllers/CRUD/ADMIN/viajes");

router.get("/api/admin/viajes", requireSignin, getViajes);
router.post("/api/admin/viajes", requireSignin, postViajes);
router.put("/api/admin/viajes", requireSignin, putViajes);
router.delete("/api/admin/viajes", requireSignin, deleteViajes);

// CRUD COMUNIDADES
const { getComunidades, postComunidades, putComunidades, deleteComunidades } = require("./controllers/CRUD/ADMIN/comunidades");

router.get("/api/admin/comunidades", requireSignin, getComunidades);
router.post("/api/admin/comunidades", requireSignin, postComunidades);
router.put("/api/admin/comunidades", requireSignin, putComunidades);
router.delete("/api/admin/comunidades", requireSignin, deleteComunidades);

// CRUD UNIVERSIDADES
const { getUniversidades, postUniversidades, putUniversidades, deleteUniversidades } = require("./controllers/CRUD/ADMIN/universidades");

router.get("/api/admin/universidades", requireSignin, getUniversidades);
router.post("/api/admin/universidades", requireSignin, postUniversidades);
router.put("/api/admin/universidades", requireSignin, putUniversidades);
router.delete("/api/admin/universidades", requireSignin, deleteUniversidades);

// CRUD CAMPUS
const { getCampus, postCampus, putCampus, deleteCampus } = require("./controllers/CRUD/ADMIN/campus");

router.get("/api/admin/campus", requireSignin, getCampus);
router.post("/api/admin/campus", requireSignin, postCampus);
router.put("/api/admin/campus", requireSignin, putCampus);
router.delete("/api/admin/campus", requireSignin, deleteCampus);

// ERROR HANDLING
// 404 error
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/404.html'));
});

module.exports = router;