import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(contactRouter);

export default router;
