import router from "express";
import DialogsController from "../controllers/DialogsController";

const routs = router.Router();

routs.get("/dialogs/:id&:id2", DialogsController.findDialog);
routs.post("/dialogs/my/:id", DialogsController.findMyDialogs);
routs.post("/dialogs/create", DialogsController.createDialog);
routs.put("/dialogs/:id", DialogsController.updateDialog);
routs.delete("/dialogs/:id", DialogsController.deleteDialog);

export default routs;
