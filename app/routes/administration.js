const express = require("express");
const router = express.Router();
const path = require('path');
const { requireSignin } = require('../middleware/middleware');

// AUTH
const { signinAdmin, forgotPasswordAdmin, resetPasswordAdmin, changePasswordAdmin } = require("../controllers/admin/login");
router.post("/signin", signinAdmin);
router.post("/forgot-password", forgotPasswordAdmin);
router.post("/reset-password", resetPasswordAdmin);
router.put("/change-password/:id", requireSignin, changePasswordAdmin);

// NEWSLETTER
const { getNewsletter, updateNewsletter } = require("../controllers/admin/newsletter");
// admin
router.get("/newsletter", requireSignin, getNewsletter);
router.put('/newsletter', requireSignin, updateNewsletter);

// ADMIN MAIL TEMPLATES
const { listTemplates, getTemplate, postTemplate, deleteTemplate } = require("../controllers/admin/AWStemplates");
router.get("/templates", requireSignin, listTemplates);
router.get("/templates/:name", requireSignin, getTemplate);
router.post("/templates", requireSignin, postTemplate);
router.delete("/templates/:id", requireSignin, deleteTemplate);

// ADMIN MAIL CRUD
const { getEmails, getEmail, deleteEmail, responderEmail } = require("../controllers/admin/AWSmails");
router.get("/emails", requireSignin, getEmails);
router.get("/email/:id", requireSignin, getEmail);
router.delete("/email/:id", requireSignin, deleteEmail);
router.post("/responderEmail", requireSignin, responderEmail);

// ADMIN CRUD DESTINOS (web y archivos)
const { getCampus, postCampus, updateCampus, deleteCampus } = require("../controllers/admin/campus");
router.get('/campus', requireSignin, getCampus);
router.post('/campus', requireSignin, postCampus);
router.put('/campus/:id', requireSignin, updateCampus);
router.delete('/campus/:id', requireSignin, deleteCampus);

// ADMIN CRUD LOGINS
const { getLoginsWeb, updateLogins } = require("../controllers/admin/loginFailure");
router.get('/logins', requireSignin, getLoginsWeb);
router.put('/logins', requireSignin, updateLogins);

// ADMIN CRUD USUARIOS
const { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios, borrarImagenUsuario } = require("../controllers/admin/usuarios");
router.get("/usuarios", requireSignin, getUsuarios);
router.post("/usuarios", requireSignin, postUsuarios);
router.put("/usuarios/:id", requireSignin, putUsuarios);
router.put("/usuarios_img/:id", requireSignin, borrarImagenUsuario);
router.delete("/usuarios/:id", requireSignin, deleteUsuarios);

// ADMIN CRUD REPORTS
const { getReports, postReports, putReports, deleteReports } = require("../controllers/admin/reportes");
router.get("/reportes", requireSignin, getReports);
router.post("/reportes", requireSignin, postReports);
router.put("/reportes/:id", requireSignin, putReports);
router.delete("/reportes/:id", requireSignin, deleteReports);

// ADMIN CRUD VIAJES
const { getViajes, postViajes, putViajes, deleteViajes } = require("../controllers/admin/viajes");
router.get("/viajes", requireSignin, getViajes);
router.post("/viajes", requireSignin, postViajes);
router.put("/viajes/:id", requireSignin, putViajes);
router.delete("/viajes/:id", requireSignin, deleteViajes);

// ADMIN CRUD RESERVAS
const { getReservas, putReservas, postReservas, deleteReservas } = require("../controllers/admin/reservas");
router.get("/reservas", requireSignin, getReservas);
router.put("/reservas/:id", requireSignin, putReservas);
router.post("/reservas", requireSignin, postReservas);
router.delete("/reservas/:id", requireSignin, deleteReservas);

// ADMIN CRUD IMAGENES
const { getUnisImg, getUsersImg } = require("../controllers/admin/imagenes");
router.get("/uni-imgs", requireSignin, getUnisImg);
router.get("/user-imgs", requireSignin, getUsersImg);

// ERROR HANDLING
// 404 error
router.get("*", (req, res) => {
  res.json({error: true, info: 'Esta ruta no existe.', data:''});
});

module.exports = router;