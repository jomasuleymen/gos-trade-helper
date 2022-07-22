const router = require("express").Router();
const { protocolSchema } = require("./protocol.schemas");
const { protocolController } = require("./protocol.controller");
const validateResource = require("../../middlewares/resourceValidator");

/* 
    /protocol
*/

router.post("/", validateResource(protocolSchema), protocolController);

module.exports = router;
