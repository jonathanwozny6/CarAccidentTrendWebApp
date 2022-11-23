import React from 'react';

const Query3 = () => {
	const [numLocs, setNumLocs] = useState(1);

	// US State selected from Search bar dropdown
	const [stateUS, setStateUS] = useState("")

	const childToParent = (childSelectedState) => {
			setStateUS(childSelectedState);
	}

	// options for data request to backend
	const options = {
		method: 'GET',
		url: 'http://localhost:8080/query1',
		params: {state: stateUS},
	}

	axios.request(options).then((response) => {
		console.log(response.data)
	}).catch((error) => {
		console.error(error)
	})
	console.log(stateUS)


return (
	<div>
	<h1>Mail us on feedback@geeksforgeeks.org</h1>
	</div>
);
};

export default Query3;
