import React from 'react';
import TetrisGame from './TetrisGame.jsx';

class Arcade extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isPaused: false,
			gameLoaded: null
		};
		
		this.gameLibrary = {
			Tetris: <TetrisGame />
		}
	}
	
	buildGameSelectionScreen = () => {
		return <div>
			<p>Please select a game</p>
			<ul>
				<li id="Tetris" onClick={this.gameClicked}>Tetris</li>
			</ul>
		</div>;
	}
	
	gameClicked = (e) => {
		const chosenGame = e.currentTarget.getAttribute("id")
		if (chosenGame) {
			this.setState({ gameLoaded: chosenGame });
		}
	}
	
	render() {
		if(!this.state.gameLoaded) { return this.buildGameSelectionScreen(); };
		return <div id='ArcadeContainer' style={{ display: 'flex' }}>
			<div style={{ display: 'flex', flex: 2 }}>			
				{this.gameLibrary[this.state.gameLoaded]}
			</div>
		</div>
	}
}

export default Arcade;
