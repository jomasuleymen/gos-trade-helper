const router = require("express").Router();
const { generatorSchema } = require("./announce.schemas");
const { announceGenerator } = require("./announce.controller");
const validateResource = require("../../middlewares/resourceValidator");

/* 
    /announce
*/

router.post("/generator", validateResource(generatorSchema), announceGenerator);

module.exports = router;
