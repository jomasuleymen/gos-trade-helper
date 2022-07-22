const {
	fetchAnnouncements,
	filterAnnosByCode,
} = require("./services/announce.service");
const { convert } = require("./services/excel.service");

const announceGenerator = async (req, res) => {
	try {
		const data = req.body;

		let announcements = await fetchAnnouncements(data); // with filters
		if (data.filterCodes)
			announcements = filterAnnosByCode(announcements, data.filterCodes);

		if (announcements.length === 0)
			throw new Error("Не найдены подходящие объявлений.");

		const zipBuffer = await convert(announcements);
		res.append("Content-Type", "application/zip");
		res.append("Content-Disposition", `attachment; filename="uploads.zip"`);
		res.send(zipBuffer);
	} catch (err) {
		console.log(err);
		res.status(400).json({ error: err.message });
	}
};

module.exports = { announceGenerator };
