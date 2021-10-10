import router from "express";
import UsersController from "../controllers/UsersController";
import { verifyToken } from "../utils/verifyToken";

const routs = router.Router();

routs.get("/users/:id", UsersController.findUser);
routs.get("/getUsers/:page", UsersController.getUsers);
routs.get("/getUsersByName/:page/:name", UsersController.getUsersByName);

routs.post("/users/create", UsersController.createUser);
routs.delete("/users/:id", UsersController.deleteUser);

routs.post("/users/changeName", verifyToken, UsersController.changeUserName);
routs.post("/users/uploadAvatar", verifyToken, UsersController.uploadAvatar);
routs.post("/users/changeUserPassword", verifyToken, UsersController.changeUserPassword);

export default routs;
