const express = require("express");
const router = express.Router();
const path = require('path');

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
router.get("/privado", (req, res) => {
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
// AUTH
const { signinAdmin, forgotPasswordAdmin, resetPasswordAdmin } = require("./controllers/web/loginAdmin");
router.post("/api/admin/signin", signinAdmin);
router.post("/api/admin/forgot-password", forgotPasswordAdmin);
router.post("/api/admin/reset-password", resetPasswordAdmin);

// ADMIN MAIL TEMPLATES
const { listTemplates, getTemplate, postTemplate, deleteTemplate } = require("./controllers/web/AWStemplates");
router.get("/api/admin/templates", requireSignin, listTemplates);
router.get("/api/admin/templates/:name", requireSignin, getTemplate);
router.post("/api/admin/templates", requireSignin, postTemplate);
router.delete("/api/admin/templates/:id", requireSignin, deleteTemplate);

// ADMIN MAIL
const { getEmails, getEmail, deleteEmail, responderEmail } = require("./controllers/web/AWSmails");
// RECEIVING AND CRUD
router.get("/api/admin/emails", requireSignin, getEmails);
router.get("/api/admin/email/:id", requireSignin, getEmail);
router.delete("/api/admin/email/:id", requireSignin, deleteEmail);
// SEND
router.post("/api/admin/responderEmail", requireSignin, responderEmail);

// ADMIN CRUD NEWSLETTER (web y archivos)
const { getNewsletter, joinNewsletter, removeNewsletter, updateNewsletter } = require("./controllers/web/newsletter");
router.get("/api/admin/newsletter", requireSignin, getNewsletter);
router.post("/api/newsletter", joinNewsletter);
router.delete("/api/newsletter", removeNewsletter);
router.put('/api/admin/newsletter', requireSignin, updateNewsletter);

// ADMIN CRUD DESTINOS (web y archivos)
const { getDestinosWeb, updateDestinos } = require("./controllers/web/destinos");
router.get('/api/web/destinos', getDestinosWeb); //Not singin required for web use
router.put('/api/admin/destinos', requireSignin, updateDestinos);
//No admin crud --> Only modifying through the json archive manually

// ADMIN CRUD LOGINS
const { getLoginsWeb, updateLogins } = require("./controllers/web/loginFailure");
router.get('/api/admin/logins', requireSignin, getLoginsWeb);
router.put('/api/admin/logins', requireSignin, updateLogins);

// ADMIN CRUD USUARIOS
const { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios } = require("./controllers/web/usuarios");
router.get("/api/admin/usuarios", requireSignin, getUsuarios);
router.post("/api/admin/usuarios", requireSignin, postUsuarios);
router.put("/api/admin/usuarios/:id", requireSignin, putUsuarios); 
router.delete("/api/admin/usuarios/:id", requireSignin, deleteUsuarios);

// ADMIN CRUD VIAJES
const { getViajes, postViajes, putViajes, deleteViajes } = require("./controllers/web/viajes");
router.get("/api/admin/viajes", requireSignin, getViajes);
router.post("/api/admin/viajes", requireSignin, postViajes);
router.put("/api/admin/viajes/:id", requireSignin, putViajes);
router.delete("/api/admin/viajes/:id", requireSignin, deleteViajes);

// ADMIN CRUD RESERVAS
const { getReservas, postReservas, deleteReservas } = require("./controllers/web/reservas");
router.get("/api/admin/reservas", requireSignin, getReservas);
router.post("/api/admin/reservas", requireSignin, postReservas);
router.delete("/api/admin/reservas/:id", requireSignin, deleteReservas);


///////////////////////////////////////////
//////////// APP controllers //////////////
///////////////////////////////////////////
// AUTH
const { signup, signin, forgotPassword, resetPassword } = require("./controllers/app/auth");
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
const { obtenerViajes, misViajes, publicarViajes, modificarViajes, borrarViajes } = require("./controllers/app/viajes");
router.get("/api/viajes", requireSignin, obtenerViajes);
router.get("/api/misviajes", requireSignin, misViajes);
router.post("/api/viajes", requireSignin, publicarViajes);
router.put("/api/viajes/:id", requireSignin, modificarViajes);
router.delete("/api/viajes/:id", requireSignin, borrarViajes);

// DESTINOS
const { obtenerCampus } = require("./controllers/app/campus");
router.get("/api/campus", requireSignin, obtenerCampus);

// RESERVAS
const { obtenerReserva, obtenerReservas } = require("./controllers/app/reservas");
router.get("/api/reserva/:id", requireSignin, obtenerReserva);
router.get("/api/reservas", requireSignin, obtenerReservas);

// VALORACIONES
const { obtenerValoraciones } = require("./controllers/app/valoraciones");
router.get("/api/valoraciones", requireSignin, obtenerValoraciones);


///////////////////////////////////////////
/////////// OTHER controllers /////////////
///////////////////////////////////////////
// CONFIRM-EMAIL
const { confirmEmail } = require("./controllers/other/email");
router.get("/api/confirm-email/:email", confirmEmail);

// ERROR HANDLING
// 404 error
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/404.html'));
});

module.exports = router;