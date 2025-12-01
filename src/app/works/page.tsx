import { Suspense } from 'react';
import Works from './Works';

export default function Home() {
	return (
		<Suspense>
			<Works />
		</Suspense>
	);
}
