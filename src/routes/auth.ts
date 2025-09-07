import router from "express";
import UsersController from "../controllers/UsersController.ts";
import onlineChanger from "../utils/onlineChanger.ts";
import { verifyToken } from "../utils/verifyToken.ts";

const routs = router.Router();

routs.post("/login", UsersController.loginUser);
routs.post("/login/me", onlineChanger, verifyToken, UsersController.getMe);
routs.delete("/logout", onlineChanger, UsersController.logoutUser);


export default routs;
