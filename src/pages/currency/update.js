import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { format } from 'date-fns';

export default function Home() {
	const [errorText, setErrorText] = useState('');
	const [successText, setSuccessText] = useState('');
	const [date, setDate] = useState('');
	const [rate, setRate] = useState('');
	const [manualUpdatePassword, setManualUpdatePassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const updateData = (e) => {
		e.preventDefault();
		if (!date || !rate || !manualUpdatePassword) {
			setErrorText('Please enter all the input field');
			return;
		}
		setErrorText('');
		setIsLoading(true);
		axios(`/api/currency`, {
			method: 'POST',
			data: {
				date,
				rate,
				manualUpdatePassword,
			},
		})
			.then((res) => {
				setSuccessText(res.data);
				setDate('');
				setRate('');
				setManualUpdatePassword('');
				setTimeout(() => {
					setSuccessText('');
				}, 3000);
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
				<Link href="/" passHref>
					<a className="btn btn-danger my-2">Back to Main Page</a>
				</Link>
				<h1 className="fw-bolder pb-2">Manual Currency Rate Update (USD to MYR)</h1>
				{isLoading && (
					<>
						<div className="spinner-grow spinner-grow-sm text-primary me-3" role="status"></div>
						<div className="spinner-grow spinner-grow-sm text-primary me-3" role="status"></div>
						<div className="spinner-grow spinner-grow-sm text-primary me-3" role="status"></div>
					</>
				)}
				<form onSubmit={updateData}>
					<p className="text-danger">{errorText}</p>
					<p className="text-success">{successText}</p>
					<div className="row">
						<div className="row col-md-6">
							<label htmlFor="date" className="col-sm-2 col-form-label">
								Date
							</label>
							<div className="col-sm-10">
								<input
									id="date"
									type="date"
									className="form-control"
									onFocus={() => setErrorText('')}
									onChange={(e) => setDate(e.target.value)}
									max={format(new Date(), 'yyyy-MM-dd')}
									value={date}
								/>
							</div>
						</div>
						<div className="row col-md-6">
							<label htmlFor="rate" className="col-sm-2 col-form-label">
								Rate
							</label>
							<div className="col-sm-10">
								<input
									id="rate"
									type="number"
									placeholder="Enter currency rate"
									min={0}
									step="any"
									className="form-control"
									onWheel={(e) => e.target.blur()}
									onFocus={() => setErrorText('')}
									onChange={(e) => setRate(e.target.value)}
									value={rate}
								/>
							</div>
						</div>
					</div>
					<div className="row my-2">
						<div className="row">
							<label htmlFor="manual-update-password" className="col-sm-3 col-form-label">
								Manual Update Password
							</label>
							<div className="col-sm-4">
								<input
									id="manual-update-password"
									type="password"
									placeholder="Enter manual update password"
									className="form-control"
									onFocus={() => setErrorText('')}
									onChange={(e) => setManualUpdatePassword(e.target.value)}
									value={manualUpdatePassword}
								/>
							</div>
						</div>
					</div>
					<div className="d-flex justify-content-end pt-2">
						<button className="btn btn-primary text-white">Update</button>
					</div>
				</form>
			</main>
		</div>
	);
}
