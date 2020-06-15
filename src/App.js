import React from 'react';
import { ContextProvider } from "./contexts/CanvasContext";
import Controller from "./components/Controller";
import Canvas from "./components/Canvas";
function App() {
	return (
		<div className="App">
			<ContextProvider>
				<Controller />
				<Canvas/>
			</ContextProvider>
		</div>
	);
}

export default App;
