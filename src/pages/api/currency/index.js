const exchangeRateModel = require('models/exchangeRate.model');
const { add } = require('date-fns');

export default async function handler(req, res) {
	try {
		if (req.method === 'GET') {
			const rates = await exchangeRateModel
				.find({
					date: {
						$gte: new Date(req.query.startDate),
						$lte: new Date(req.query.endDate),
					},
				})
				.select('rate date -_id')
				.sort({ date: 1 })
				.lean();
			res.send(rates);
		} else if (req.method === 'POST') {
			if(req.body.manualUpdatePassword!==process.env.MANUAL_UPDATE_PASSWORD){
				res.status(400).send('Invalid manual update password');
				return;
			}
			await exchangeRateModel.findOneAndUpdate(
				{
					// filter document with same date (ignore time)
					date: {
						$gte: new Date(req.body.date),
						$lt: add(new Date(req.body.date), { days: 1 }),
					},
				},
				{
					fromCurrency: 'USD',
					toCurrency: 'MYR',
					rate: req.body.rate,
					date: req.body.date,
				},
				{
					upsert: true,
				}
			);
			res.send(`Update exchange rate on ${req.body.date} successfully`);
		} else {
			res.status(404).send();
		}
	} catch (err) {
		res.status(400).send(err.message);
	}
}
