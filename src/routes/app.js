const express = require("express");
const router = express.Router();
// MIDDLEWARES
const { requireSignin } = require('../middleware/middleware');

// AUTH
const { signup, signin, forgotPassword, resetPassword, changePassword, getAuthCode, verifyUser } = require("../controllers/app/auth");
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.put("/change-password", requireSignin, changePassword);
router.post("/get-auth-code", requireSignin, getAuthCode);
router.post("/verify", requireSignin, verifyUser);


// FILES
const { getUserPic, getUniPic } = require("../controllers/app/files");
router.get("/file/user/:name", requireSignin, getUserPic);
router.get("/file/uni/:name", requireSignin, getUniPic);

// USUARIOS
const { obtenerUsuario, modificarUsuario, modificarUniversidad, modificarPassword, borrarUsuario, updateRrss } = require("../controllers/app/usuarios");
router.get("/usuarios/:id", requireSignin, obtenerUsuario);
router.put("/usuarios/:id", requireSignin, modificarUsuario);
router.put("/usuarios/universidad/:id", requireSignin, modificarUniversidad);
router.put("/usuarios/password/:id", requireSignin, modificarPassword);
router.delete("/usuarios/:id", requireSignin, borrarUsuario);
router.put("/rrss/:id", requireSignin, updateRrss);

// REPORTS
const { postReports } = require("../controllers/app/reportes");
router.post("/reportes", requireSignin, postReports);

// VIAJES
const { topViajes, obtenerViajesDia, obtenerViajesGeneral, detallesViaje, misViajes, publicarViaje, modificarViaje, borrarViaje } = require("../controllers/app/viajes");
router.get("/viajes", requireSignin, topViajes);
router.get("/viajes-general", requireSignin, obtenerViajesGeneral);
router.post("/viajes", requireSignin, obtenerViajesDia);
router.get("/viaje/:id", requireSignin, detallesViaje);
router.get("/mis-viajes", requireSignin, misViajes);
router.post("/viaje", requireSignin, publicarViaje);
router.put("/viajes/:id", requireSignin, modificarViaje);
router.delete("/viajes/:id", requireSignin, borrarViaje);

// DESTINOS
const { obtenerCampus } = require("../controllers/app/campus");
router.get("/campus", requireSignin, obtenerCampus);

// RESERVAS
const { comprobarReserva, obtenerReserva, obtenerReservas, publicarReserva, borrarReserva } = require("../controllers/app/reservas");
router.get("/reservas", requireSignin, obtenerReservas);
router.get("/reserva/:id", requireSignin, obtenerReserva);
router.post("/reserva", requireSignin, comprobarReserva);
router.post("/reservas", requireSignin, publicarReserva);
router.delete("/reservas/:id", requireSignin, borrarReserva);

// VALORACIONES
const { obtenerValoraciones, publicarValoracion, borrarValoracion } = require("../controllers/app/valoraciones");
router.get("/valoraciones", requireSignin, obtenerValoraciones);
router.post("/valoraciones", requireSignin, publicarValoracion);
router.delete("/valoraciones/:id", requireSignin, borrarValoracion);

// ERROR HANDLING
// 404 error
router.all("*", (req, res) => {
  res.status(404).json({error:true, info:'Esta ruta no existe.', data:''});
});

module.exports = router;