import router from "express";
import ProfilesController from "../controllers/ProfilesController.ts";
import PostsController from "../controllers/PostsController.ts";

const routs = router.Router();

routs.get("/profile/:id", ProfilesController.findProfile);
routs.post("/profile/createPost", PostsController.createPost);
routs.get('/profile/posts/:id', PostsController.findPosts)

export default routs;
