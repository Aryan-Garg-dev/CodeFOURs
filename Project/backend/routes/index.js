const { Router } = require("express");
const userRouter = require("./user");
const clubRouter = require("./club");
const router = Router();

router.use("/user", userRouter);
router.use("/club", clubRouter);
// router.use("/event", eventRouter);

module.exports = router;