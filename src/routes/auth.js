import router from "express";
import UsersController from "../controllers/UsersController.js";
import onlineChanger from "../utils/onlineChanger.js";
import { verifyToken } from "../utils/verifyToken.js";

const routs = router.Router();

routs.post("/login", UsersController.loginUser);
routs.post("/login/me", onlineChanger, verifyToken, UsersController.getMe);
routs.delete("/logout", onlineChanger, UsersController.logoutUser);


export default routs;
