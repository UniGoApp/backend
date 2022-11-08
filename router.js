const express = require("express");
const router = express.Router();
const path = require('path');
const multer  = require('multer');
const upload = multer();

// SERVER OPTIONS
const maintenance = true;

// STATIC RESOURCES
router.get("/", (req, res) => {
  maintenance ? res.sendFile(path.join(__dirname, '/public/maintenance.html')) : res.sendFile(path.join(__dirname, '/public/main.html'));
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
// 401 error
router.get("/401", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/401.html'));
});

// MIDDLEWARES
const { requireSignin } = require('./controllers/middleware');

///////////////////////////////////////////
///////////// WEB controllers /////////////
///////////////////////////////////////////
// ADMIN SENDGRID MAIL
const { getEmails, addEmail, removeEmail, sendEmails, answerEmail } = require("./controllers/web/mailing");
router.get("/api/admin/email", requireSignin, getEmails);
router.post("/api/mail/inbound", upload.any(), addEmail); //From SendGrid
router.delete("/api/admin/email", requireSignin, removeEmail);
// API to answer emails (AWS SES):
router.post("/api/mail/send", sendEmails);

// ADMIN CRUD NEWSLETTER
const { getNewsletter, joinNewsletter, removeNewsletter, updateNewsletter } = require("./controllers/web/newsletter");
router.get("/api/admin/newsletter", requireSignin, getNewsletter);
router.post("/api/newsletter", joinNewsletter);
router.delete("/api/newsletter", removeNewsletter);
router.put('/api/admin/newsletter', requireSignin, updateNewsletter);

// ADMIN CRUD DESTINOS
const { getDestinosWeb, updateDestinos } = require("./controllers/web/destinos");
router.get('/api/destinos', getDestinosWeb); //Not singin required for web use
router.put('/api/admin/destinos', requireSignin, updateDestinos);
//No admin crud --> Only modifying through the json archive manually

// ADMIN CRUD USUARIOS
const { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios } = require("./controllers/web/usuarios");
router.get("/api/admin/usuarios", requireSignin, getUsuarios);
router.post("/api/admin/usuarios", requireSignin, postUsuarios);
router.put("/api/admin/usuarios", requireSignin, putUsuarios); 
router.delete("/api/admin/usuarios", requireSignin, deleteUsuarios);

// ADMIN CRUD VIAJES
const { getViajes, postViajes, putViajes, deleteViajes } = require("./controllers/web/viajes");
router.get("/api/admin/viajes", requireSignin, getViajes);
router.post("/api/admin/viajes", requireSignin, postViajes);
router.put("/api/admin/viajes", requireSignin, putViajes);
router.delete("/api/admin/viajes", requireSignin, deleteViajes);

// ADMIN CRUD RESERVAS
const { getReservas, postReservas, deleteReservas } = require("./controllers/web/reservas");
router.get("/api/admin/reservas", requireSignin, getReservas);
router.post("/api/admin/reservas", requireSignin, postReservas);
router.delete("/api/admin/reservas", requireSignin, deleteReservas);

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
const { upload_file, getFile, updateRrss } = require("./controllers/app/files");
router.post("/api/upload-image", requireSignin, upload_file);
router.get("/file/:name", requireSignin, getFile);
router.put("/api/rrss/:id", requireSignin, updateRrss);

// USUARIOS
const { obtenerUsuario, modificarUsuario, borrarUsuario } = require("./controllers/app/usuarios");
router.get("/api/usuarios/:id", requireSignin, obtenerUsuario);
router.put("/api/usuarios/:id", requireSignin, modificarUsuario);
router.delete("/api/usuarios/:id", requireSignin, borrarUsuario);

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