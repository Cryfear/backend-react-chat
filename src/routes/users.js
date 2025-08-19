import router from "express";
import UsersController from "../controllers/UsersController.js";
import onlineChanger from "../utils/onlineChanger.js";
import { verifyToken } from "../utils/verifyToken.js";

const routs = router.Router();

routs.get("/users/:id", onlineChanger, UsersController.findUser);
routs.get("/getUsers/:page", onlineChanger, UsersController.getUsers);
routs.get("/getUsersByName/:page/:name", onlineChanger, UsersController.getUsersByName);

routs.post("/users/create", onlineChanger, UsersController.createUser);
routs.delete("/users/:id", onlineChanger, UsersController.deleteUser);

routs.post("/users/changeName", onlineChanger, verifyToken, UsersController.changeUserName);
routs.post("/users/uploadAvatar", onlineChanger, verifyToken, UsersController.uploadAvatar);
routs.post("/users/changeUserPassword", onlineChanger, verifyToken, UsersController.changeUserPassword);

export default routs;
