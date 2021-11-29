require('utils/database').init();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exchangeRateSchema = new Schema(
	{
		fromCurrency: {
			type: String,
			required: true,
		},
		toCurrency: {
			type: String,
			required: true,
		},
		rate: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
);

// if model already exist then reuse else create model
module.exports = mongoose.models.ExchangeRate || mongoose.model('ExchangeRate', exchangeRateSchema);
