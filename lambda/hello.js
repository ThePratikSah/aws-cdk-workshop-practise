exports.handler = async (event) => {
	return {
		statusCode: 200,
		headers: { 'Content-Type': 'text/plain' },
		body: `Hello, CDK! You've hit ${event.path}\n`,
	};
};
