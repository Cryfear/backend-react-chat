import DialogsController from "../controllers/DialogsController.js";
import { onlineChanger } from "../utils/onlineChanger.js";
import { Router } from "express";

const routes = Router();

routes.get("/dialogs/:id&:id2", onlineChanger, DialogsController.findDialog);
routes.post("/dialogs/my/:id", onlineChanger, DialogsController.findMyDialogs);
routes.post("/dialogs/create", onlineChanger, DialogsController.createDialog);
routes.put("/dialogs/:id", onlineChanger, DialogsController.updateDialog);
routes.delete("/dialogs/:id", onlineChanger, DialogsController.deleteDialog);

export default routes;
