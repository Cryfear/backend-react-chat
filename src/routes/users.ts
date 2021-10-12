import router from "express";
import UsersController from "../controllers/UsersController";
import onlineChanger from "../utils/onlineChanger";
import { verifyToken } from "../utils/verifyToken";

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
