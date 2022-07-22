const { z } = require("zod");

const protocolSchema = z.object({
	body: z.object({ annoNums: z.array(z.string()) }),
});

module.exports = {
	protocolSchema,
};
