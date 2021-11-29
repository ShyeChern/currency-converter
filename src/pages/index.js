import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, sub } from 'date-fns';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Label,
	ResponsiveContainer,
} from 'recharts';

export default function Home() {
	const [errorText, setErrorText] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [rates, setRates] = useState([]);
	const [startDate, setStartDate] = useState(
		`${format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd')}`
	);
	const [endDate, setEndDate] = useState(`${format(new Date(), 'yyyy-MM-dd')}`);

	useEffect(() => {
		getCurrencyRate();
	}, []);

	const getCurrencyRate = () => {
		setIsLoading(true);
		axios(`/api/currency`, {
			method: 'GET',
			params: { startDate, endDate },
		})
			.then((res) => {
				setRates(res.data);
			})
			.catch((err) => {
				setErrorText(err.response.data || err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	return (
		<div className="container body">
			<main>
				<h1 className="fw-bolder">Mastercard Currency Converter (MYR to USD)</h1>
				<p className="">
					Source:{' '}
					<a
						href="https://www.mastercard.us/en-us/personal/get-support/convert-currency.html"
						rel="noreferrer noopener"
						target="_blank"
					>
						https://www.mastercard.us/en-us/personal/get-support/convert-currency.html
					</a>
				</p>
				{isLoading ? (
					<>
						<div className="spinner-grow spinner-grow-sm text-primary me-3" role="status"></div>
						<div className="spinner-grow spinner-grow-sm text-primary me-3" role="status"></div>
						<div className="spinner-grow spinner-grow-sm text-primary me-3" role="status"></div>
					</>
				) : (
					<>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								getCurrencyRate();
							}}
						>
							<p className="text-danger">{errorText}</p>
							<div className="d-flex justify-content-around align-items-center">
								<input
									type="date"
									className="form-control"
									onFocus={() => setErrorText('')}
									onChange={(e) => setStartDate(e.target.value)}
									min={'2021-06-01'}
									max={format(new Date(), 'yyyy-MM-dd')}
									value={startDate}
								/>
								<span className="px-2">to</span>
								<input
									type="date"
									className="form-control"
									onFocus={() => setErrorText('')}
									onChange={(e) => setEndDate(e.target.value)}
									min={'2021-06-01'}
									max={format(new Date(), 'yyyy-MM-dd')}
									value={endDate}
								/>
							</div>
							<div className="d-flex justify-content-end pt-2">
								<button className="btn btn-primary text-white">View</button>
							</div>
						</form>
						<ResponsiveContainer height={350}>
							<LineChart
								data={rates}
								margin={{
									right: 15,
									left: 5,
									bottom: 20,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="date"
									tickFormatter={(value) =>
										new Date(value) instanceof Date && !isNaN(new Date(value).getTime())
											? format(new Date(value), 'dd/MM')
											: ''
									}
								>
									<Label value="Date" offset={-10} position="insideBottom" />
								</XAxis>
								<YAxis
									dataKey="rate"
									label={{ value: 'Rate', angle: -90, position: 'insideLeft' }}
									domain={[
										(dataMin) => Math.floor(dataMin * 100) / 100,
										(dataMax) => Math.ceil(dataMax * 100) / 100,
									]}
								/>
								<Tooltip labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')} />
								<Line type="linear" dataKey="rate" stroke="#8884d8" activeDot={{ r: 6 }} />
								<Legend verticalAlign="top" />
							</LineChart>
						</ResponsiveContainer>
					</>
				)}
			</main>
		</div>
	);
}
