import router from "express";
import DialogsController from "../controllers/DialogsController.js";
import onlineChanger from "../utils/onlineChanger.js";

const routs = router.Router();

routs.get("/dialogs/:id&:id2", onlineChanger, DialogsController.findDialog);
routs.post("/dialogs/my/:id", onlineChanger, DialogsController.findMyDialogs);
routs.post("/dialogs/create", onlineChanger, DialogsController.createDialog);
routs.put("/dialogs/:id", onlineChanger, DialogsController.updateDialog);
routs.delete("/dialogs/:id", onlineChanger, DialogsController.deleteDialog);

export default routs;
