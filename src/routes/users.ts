import router from "express";
import UsersController from "../controllers/UsersController";

const routs = router.Router();

routs.get("/users/:id", UsersController.findUser);
routs.get("/getUsers/:page", UsersController.getUsers);
routs.get("/getUsersByName/:page/:name", UsersController.getUsersByName);

routs.post("/users/create", UsersController.createUser);
routs.put("/users/:id", UsersController.updateUser);
routs.delete("/users/:id", UsersController.deleteUser);

export default routs;
