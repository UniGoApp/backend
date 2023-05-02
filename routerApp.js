const express = require("express");
const router = express.Router();

// MIDDLEWARES
const { requireSignin } = require('./controllers/middleware');

// AUTH
const { signup, signin, forgotPassword, resetPassword, getAuthCode, verifyUser } = require("./controllers/app/auth");
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/get-auth-code", requireSignin, getAuthCode);
router.post("/verify", requireSignin, verifyUser);


// FILES
const { getUserPic, getUniPic } = require("./controllers/app/files");
router.get("/file/user/:name", requireSignin, getUserPic);
router.get("/file/uni/:name", requireSignin, getUniPic);

// USUARIOS
const { obtenerUsuario, modificarUsuario, modificarUniversidad, modificarPassword, borrarUsuario, updateRrss } = require("./controllers/app/usuarios");
router.get("/usuarios/:id", requireSignin, obtenerUsuario);
router.put("/usuarios/:id", requireSignin, modificarUsuario);
router.put("/usuarios/universidad/:id", requireSignin, modificarUniversidad);
router.put("/usuarios/password/:id", requireSignin, modificarPassword);
router.delete("/usuarios/:id", requireSignin, borrarUsuario);
router.put("/rrss/:id", requireSignin, updateRrss);

// REPORTS
const {postReports} = require("./controllers/reports");
router.post("/reports", requireSignin, postReports);

// VIAJES
const { obtenerViajes, detallesViaje, misViajes, publicarViaje, modificarViaje, borrarViaje } = require("./controllers/app/viajes");
router.get("/viajes", requireSignin, obtenerViajes);
router.get("/viaje/:id", requireSignin, detallesViaje);
router.get("/misviajes", requireSignin, misViajes);
router.post("/viajes", requireSignin, publicarViaje);
router.put("/viajes/:id", requireSignin, modificarViaje);
router.delete("/viajes/:id", requireSignin, borrarViaje);

// DESTINOS
const { obtenerCampus } = require("./controllers/app/campus");
router.get("/campus", requireSignin, obtenerCampus);

// RESERVAS
const { obtenerReserva, obtenerReservas, publicarReserva, borrarReserva } = require("./controllers/app/reservas");
router.get("/reserva/:id", requireSignin, obtenerReserva);
router.get("/reservas", requireSignin, obtenerReservas);
router.post("/reservas", requireSignin, publicarReserva);
router.delete("/reservas/:id", requireSignin, borrarReserva);

// VALORACIONES
const { obtenerValoraciones, publicarValoracion, borrarValoracion } = require("./controllers/app/valoraciones");
router.get("/valoraciones", requireSignin, obtenerValoraciones);
router.post("/valoraciones", requireSignin, publicarValoracion);
router.delete("/valoraciones/:id", requireSignin, borrarValoracion);

// ERROR HANDLING
// 404 error
router.get("*", (req, res) => {
  res.json({error: true, info: 'Esta ruta no existe.', data:''});
});

module.exports = router;