const { z } = require("zod");

const generatorSchema = z.object({
	body: z
		.object({
			filterCodes: z.array(z.string()).optional(),
			annoNumbers: z.array(z.string()).default([]),
			lotNames: z.array(z.string()).default([]),
			trdMethods: z.array(z.number()).default([]),
			signs: z
				.object({
					disablePersonId: z.number().optional(),
					isLightIndustry: z.number().optional(),
				})
				.strict()
				.default(new Object()),
		})
		.refine(
			(data) => data.annoNumbers.length > 0 || data.lotNames.length > 0,
			{
				message:
					"one of annoNumbers or lotNames should have at least one item",
			}
		),
});

module.exports = {
	generatorSchema,
};
