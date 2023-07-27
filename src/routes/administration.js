const express = require("express");
const router = express.Router();
const { requireSignin, isValidAdmin } = require('../middleware/middleware');

// AUTH
const { signinAdmin, forgotPasswordAdmin, resetPasswordAdmin, changePasswordAdmin } = require("../controllers/admin/login");
router.post("/signin", signinAdmin);
router.post("/forgot-password", forgotPasswordAdmin);
router.post("/reset-password", resetPasswordAdmin);
router.put("/change-password/:id", requireSignin, isValidAdmin, changePasswordAdmin);

// NEWSLETTER
const { getNewsletter, updateNewsletter } = require("../controllers/admin/newsletter");
// admin
router.get("/newsletter", requireSignin, isValidAdmin, getNewsletter);
router.put('/newsletter', requireSignin, isValidAdmin, updateNewsletter);

// ADMIN MAIL TEMPLATES
const { listTemplates, getTemplate, postTemplate, deleteTemplate } = require("../controllers/admin/AWStemplates");
router.get("/templates", requireSignin, isValidAdmin, listTemplates);
router.get("/templates/:name", requireSignin, isValidAdmin, getTemplate);
router.post("/templates", requireSignin, isValidAdmin, postTemplate);
router.delete("/templates/:id", requireSignin, isValidAdmin, deleteTemplate);

// ADMIN MAIL CRUD
const { getEmails, getEmail, deleteEmail, responderEmail } = require("../controllers/admin/AWSmails");
router.get("/emails", requireSignin, isValidAdmin, getEmails);
router.get("/email/:id", requireSignin, isValidAdmin, getEmail);
router.delete("/email/:id", requireSignin, isValidAdmin, deleteEmail);
router.post("/responderEmail", requireSignin, isValidAdmin, responderEmail);

// ADMIN CRUD DESTINOS (web y archivos)
const { getCampus, postCampus, updateCampus, deleteCampus } = require("../controllers/admin/campus");
router.get('/campus', requireSignin, isValidAdmin, getCampus);
router.post('/campus', requireSignin, isValidAdmin, postCampus);
router.put('/campus/:id', requireSignin, isValidAdmin, updateCampus);
router.delete('/campus/:id', requireSignin, isValidAdmin, deleteCampus);

// ADMIN CRUD LOGINS
const { getLoginsWeb, updateLogins } = require("../controllers/admin/loginFailure");
router.get('/logins', requireSignin, isValidAdmin, getLoginsWeb);
router.put('/logins', requireSignin, isValidAdmin, updateLogins);

// ADMIN CRUD USUARIOS
const { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios, borrarImagenUsuario } = require("../controllers/admin/usuarios");
router.get("/usuarios", requireSignin, isValidAdmin, getUsuarios);
router.post("/usuarios", requireSignin, isValidAdmin, postUsuarios);
router.put("/usuarios/:id", requireSignin, isValidAdmin, putUsuarios);
router.put("/usuarios_img/:id", requireSignin, isValidAdmin, borrarImagenUsuario);
router.delete("/usuarios/:id", requireSignin, isValidAdmin, deleteUsuarios);

// ADMIN CRUD REPORTS
const { getReports, postReports, putReports, deleteReports } = require("../controllers/admin/reportes");
router.get("/reportes", requireSignin, isValidAdmin, getReports);
router.post("/reportes", requireSignin, isValidAdmin, postReports);
router.put("/reportes/:id", requireSignin, isValidAdmin, putReports);
router.delete("/reportes/:id", requireSignin, isValidAdmin, deleteReports);

// ADMIN CRUD VIAJES
const { getViajes, postViajes, putViajes, deleteViajes } = require("../controllers/admin/viajes");
router.get("/viajes", requireSignin, isValidAdmin, getViajes);
router.post("/viajes", requireSignin, isValidAdmin, postViajes);
router.put("/viajes/:id", requireSignin, isValidAdmin, putViajes);
router.delete("/viajes/:id", requireSignin, isValidAdmin, deleteViajes);

// ADMIN CRUD RESERVAS
const { getReservas, putReservas, postReservas, deleteReservas } = require("../controllers/admin/reservas");
router.get("/reservas", requireSignin, isValidAdmin, getReservas);
router.put("/reservas/:id", requireSignin, isValidAdmin, putReservas);
router.post("/reservas", requireSignin, isValidAdmin, postReservas);
router.delete("/reservas/:id", requireSignin, isValidAdmin, deleteReservas);

// ADMIN CRUD IMAGENES
const { getUnisImg, getUsersImg } = require("../controllers/admin/imagenes");
router.get("/uni-imgs", requireSignin, isValidAdmin, getUnisImg);
router.get("/user-imgs", requireSignin, isValidAdmin, getUsersImg);

// 404 error
router.all("*", (req, res) => {
  res.status(404).json({error: true, info: 'Esta ruta no existe.', data: ''});
});

module.exports = router;