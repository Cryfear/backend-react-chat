import router from "express";
import UsersController from "../controllers/UsersController";
import { verifyToken } from "../controllers/verifyToken";

const routs = router.Router();

routs.post("/login", UsersController.loginUser);

routs.post("/login/me", verifyToken, UsersController.getMe);
routs.delete("/logout", UsersController.logoutUser);

export default routs;
