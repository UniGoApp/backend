const express = require("express");
const router = express.Router();
const path = require('path');
// SERVER OPTIONS
const maintenance = false;

// STATIC RESOURCES
router.get("/", (req, res) => {
  maintenance ? res.sendFile(path.join(__dirname, '../../public/maintenance.html')) : res.sendFile(path.join(__dirname, '../../public/main.html'));
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
// 401 error
router.get("/401", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/401.html'));
});

// AUTH
const { signinAdmin, forgotPasswordAdmin, resetPasswordAdmin } = require("../controllers/admin/login");
router.post("/signin", signinAdmin);
router.post("/forgot-password", forgotPasswordAdmin);
router.post("/reset-password", resetPasswordAdmin);

// CONFIRM-EMAIL
const { confirmEmail } = require("../controllers/web/email");
router.get("/confirm-email/:email", confirmEmail);

// NEWSLETTER
const { joinNewsletter, removeNewsletter } = require("../controllers/web/newsletter");
router.post("/newsletter", joinNewsletter);
router.delete("/newsletter", removeNewsletter);

// DESTINOS
const { getUniversidades } = require("../controllers/web/campus");
router.get('/universidades', getUniversidades);

// ERROR HANDLING
// 404 error
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/404.html'));
});

module.exports = router;