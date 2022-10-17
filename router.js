const express = require("express");
const router = express.Router();
const path = require('path');

// const maintenance = false;

// if(maintenance) {
//   router.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/maintenance.html'));
//   });
//   router.get("/*", (req, res) => {
//     res.redirect('/');
//   });
// }else{
  
// }

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
router.get("/legal/cookies", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/politicas/cookies.html'));
});
router.get("/legal/privacidad", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/politicas/privacidad.html'));
});
router.get("/legal/terminos-y-condiciones", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/politicas/terminos-y-condiciones.html'));
});
router.get("/unsuscribe", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/unsuscribe.html'));
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

// MIDDLEWARES
const { requireSignin } = require('./controllers/middleware');

///////////////////////////////////////////
///////////// WEB controllers /////////////
///////////////////////////////////////////
const { getNewsletter, joinNewsletter, removeNewsletter } = require("./controllers/web/newsletter");
router.get("/api/admin/newsletter", requireSignin, getNewsletter); //ONLY ADMIN
router.post("/api/newsletter", joinNewsletter);
router.delete("/api/newsletter", removeNewsletter);

const { getDestinosWeb } = require("./controllers/web/destinos");
router.get('api/destinos', getDestinosWeb);
//No admin crud --> Only modifying through the json archive manually

// ADMIN CRUD USUARIOS
const { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios } = require("./controllers/web/usuarios");
router.get("/api/admin/usuarios", requireSignin, getUsuarios);
router.post("/api/admin/usuarios", requireSignin, postUsuarios);
router.put("/api/admin/usuarios", requireSignin, putUsuarios); 
router.delete("/api/admin/usuarios", requireSignin, deleteUsuarios);

// ADMIN CRUD MENSAJES
const { getMensajes, postMensajes, deleteMensajes } = require("./controllers/web/mensajes");
router.get("/api/admin/mensajes", requireSignin, getMensajes);
router.post("/api/admin/mensajes", requireSignin, postMensajes);
//PUT mensajes not necessary
router.delete("/api/admin/mensajes", requireSignin, deleteMensajes);

// ADMIN CRUD VIAJES
const { getViajes, postViajes, putViajes, deleteViajes } = require("./controllers/web/viajes");
router.get("/api/admin/viajes", requireSignin, getViajes);
router.post("/api/admin/viajes", requireSignin, postViajes);
router.put("/api/admin/viajes", requireSignin, putViajes);
router.delete("/api/admin/viajes", requireSignin, deleteViajes);

// // ADMIN CRUD COMUNIDADES
// const { getComunidades, postComunidades, putComunidades, deleteComunidades } = require("./controllers/web/comunidades");
// router.get("/api/admin/comunidades", requireSignin, getComunidades);
// router.post("/api/admin/comunidades", requireSignin, postComunidades);
// router.put("/api/admin/comunidades", requireSignin, putComunidades);
// router.delete("/api/admin/comunidades", requireSignin, deleteComunidades);

// // ADMIN CRUD UNIVERSIDADES
// const { getUniversidades, postUniversidades, putUniversidades, deleteUniversidades } = require("./controllers/web/universidades");
// router.get("/api/admin/universidades", requireSignin, getUniversidades);
// router.post("/api/admin/universidades", requireSignin, postUniversidades);
// router.put("/api/admin/universidades", requireSignin, putUniversidades);
// router.delete("/api/admin/universidades", requireSignin, deleteUniversidades);

// // ADMIN CRUD CAMPUS
// const { getCampus, postCampus, putCampus, deleteCampus } = require("./controllers/web/campus");
// router.get("/api/admin/campus", requireSignin, getCampus);
// router.post("/api/admin/campus", requireSignin, postCampus);
// router.put("/api/admin/campus", requireSignin, putCampus);
// router.delete("/api/admin/campus", requireSignin, deleteCampus);


///////////////////////////////////////////
//////////// APP controllers //////////////
///////////////////////////////////////////
// AUTH
const { signup, signin, forgotPassword, resetPassword } = require("./controllers/auth");
router.post("/api/signup", signup);
router.post("/api/signin", signin);
router.post("/api/forgot-password", forgotPassword);
router.post("/api/reset-password", resetPassword);

// FILES
const { upload_file, getFiles, getFile, updateRrss } = require("./controllers/app/files");
router.post("/api/upload-image", requireSignin, upload_file);
router.get("/files", requireSignin, getFiles);
router.get("/file/:name", requireSignin, getFile);
router.put("/api/rrss/:id", requireSignin, updateRrss);

// USUARIOS
const { obtenerUsuario, modificarUsuario, borrarUsuario } = require("./controllers/app/usuarios");
router.get("/api/usuarios/:id", requireSignin, obtenerUsuario);
router.put("/api/usuarios/:id", requireSignin, modificarUsuario);
router.delete("/api/usuarios/:id", requireSignin, borrarUsuario);

// MENSAJES
const { publicarMensaje } = require("./controllers/app/mensajes");
router.post("/api/mensajes", requireSignin, publicarMensaje);

// VIAJES
const { obtenerViajes, publicarViajes, modificarViajes, borrarViajes } = require("./controllers/app/viajes");
router.get("/api/viajes", requireSignin, obtenerViajes);
router.post("/api/viajes", requireSignin, publicarViajes);
router.put("/api/viajes/:id", requireSignin, modificarViajes);
router.delete("/api/viajes/:id", requireSignin, borrarViajes);

// DESTINOS
const { obtenerDestinos } = require("./controllers/app/destinos");
router.get("/api/destinos", requireSignin, obtenerDestinos);

// RESERVAS
const { obtenerReservas } = require("./controllers/app/reservas");
router.get("/api/reservas", requireSignin, obtenerReservas);



// ERROR HANDLING
// 404 error
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/404.html'));
});

module.exports = router;