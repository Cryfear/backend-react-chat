import UsersController from "../controllers/UsersController.js";
import { onlineChanger } from "../utils/onlineChanger.js";
import { verifyToken } from "../utils/verifyToken.js";
import { Router } from "express";

const routes = Router();

routes.post("/login", UsersController.loginUser);
routes.post("/login/me", onlineChanger, verifyToken, UsersController.getMe);
routes.delete("/logout", onlineChanger, UsersController.logoutUser);

export default routes;
