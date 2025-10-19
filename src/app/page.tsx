import './globals.css';
import { Suspense } from 'react';
import HomePage from './HomePage';

export default function Home() {
	return (
		<Suspense>
			<HomePage />
		</Suspense>
	);
}
