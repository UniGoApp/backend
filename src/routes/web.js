const express = require("express");
const router = express.Router();
const path = require('path');
// SERVER OPTIONS
const maintenance = false;

// STATIC RESOURCES
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, maintenance ? '../../public/maintenance.html' : '../../public/main.html'));
});
router.get("/legal/cookies", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/politicas/cookies.html'));
});
router.get("/legal/privacidad", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/politicas/privacidad.html'));
});
router.get("/legal/terminos-y-condiciones", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/politicas/terminos-y-condiciones.html'));
});
router.get("/unsuscribe", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/unsuscribe.html'));
});
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/login.html'));
});
router.get("/privado", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin.html'));
});
// ERRORS
router.get("/401", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/401.html'));
});
router.get("/403", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/403.html'));
});
router.get("/404", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/404.html'));
});

// ENDPOINTS
// AUTH
const { signinAdmin, forgotPasswordAdmin, resetPasswordAdmin } = require("../controllers/admin/login");
router.post("/web-api/signin", signinAdmin);
router.post("/web-api/forgot-password", forgotPasswordAdmin);
router.post("/web-api/reset-password", resetPasswordAdmin);

// CONFIRM-EMAIL
const { confirmEmail } = require("../controllers/web/email");
router.get("/web-api/confirm-email/:email", confirmEmail);

// NEWSLETTER
const { joinNewsletter, removeNewsletter } = require("../controllers/web/newsletter");
router.post("/web-api/newsletter", joinNewsletter);
router.delete("/web-api/newsletter", removeNewsletter);

// DESTINOS
const { getUniversidades } = require("../controllers/web/campus");
router.get('/web-api/universidades', getUniversidades);

// ERROR HANDLING
router.all("/web-api/*", (req, res) => {
  res.status(404).json({error: true, info: 'Esta ruta no existe', data: ''});
});
router.all("*", (req, res) => {
  res.redirect('/404');
});

module.exports = router;