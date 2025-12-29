import router from "express";
import UsersController from "../controllers/UsersController.ts";
import { onlineChanger } from "../utils/onlineChanger.ts";
import { verifyToken } from "../utils/verifyToken.ts";

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
