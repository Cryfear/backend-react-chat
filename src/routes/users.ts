import UsersController from "../controllers/UsersController.js";
import { onlineChanger } from "../utils/onlineChanger.js";
import { verifyToken } from "../utils/verifyToken.js";
import { Router } from "express";

const routes = Router();

routes.get("/users/:id", onlineChanger, UsersController.findUser);
routes.get("/getUsers/:page", onlineChanger, UsersController.getUsers);
routes.get("/getUsersByName/:page/:name", onlineChanger, UsersController.getUsersByName);

routes.post("/users/create", onlineChanger, UsersController.createUser);
routes.delete("/users/:id", onlineChanger, UsersController.deleteUser);

routes.post("/users/changeName", onlineChanger, verifyToken, UsersController.changeUserName);
routes.post("/users/uploadAvatar", onlineChanger, verifyToken, UsersController.uploadAvatar);
routes.post("/users/changeUserPassword", onlineChanger, verifyToken, UsersController.changeUserPassword);

export default routes;
