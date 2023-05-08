import React from 'react';
import ReactDOM from 'react-dom/client';

function Child() {
	return <span>1</span>;
}

function App() {
	return (
		<div>
			<Child />
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
