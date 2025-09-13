import router from "express";
import ProfilesController from "../controllers/ProfilesController.ts";

const routs = router.Router();

routs.get("/profile/:id", ProfilesController.findProfile);

export default routs;
