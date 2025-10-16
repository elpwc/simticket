'use client';

import React, { useState } from 'react';

const UnderConstruction: React.FC = ({}) => {
	const [diyValue, setDiyValue] = useState('');

	return (
		<div className="flex gap-1 flex-wrap">
			<p>工事中</p>
			<p>Under Construction</p>
		</div>
	);
};

export default UnderConstruction;
