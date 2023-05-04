import Cell from './Cell.jsx';
import React from 'react';

class TetrisGame extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasFallingBlock: false,
			fallingBlocks: [],
			setBlocks: [],
			isPaused: false,
			score: 0
		};
		this.gamePace = 1000;
		this.generateCells = this.generateCells.bind(this);
		this.computeCellColor = this.computeCellColor.bind(this);
	}
	
	generateCells() {
		let cells = [];
		let counter = 0;
		for (let i = 1; i < 11; i++) {
			for (let j = 1; j < 21; j++) {
				cells.push(<Cell x={i} y={j} key={counter} color={this.computeCellColor(i, j)}/>);
				counter++;
			}
		}
		return cells;
	}
	
	/***
	* Summary : Stage of the game when the block will drop by 1
	***/
	dropBlockByOne() {
		let hasFallingBlock = true;
		let setBlocks = this.state.setBlocks.slice();
		let fallingBlocks = this.state.fallingBlocks.slice();
		if (this.shouldBlockStop()) {
			hasFallingBlock = false;
			// Set block
			setBlocks = setBlocks.concat(fallingBlocks);
			this.setState({ fallingBlocks: [], hasFallingBlock, setBlocks }, this.betweenTurnsVerifications);
			return;
		} else {
			fallingBlocks = fallingBlocks.map((block) => { 
				return { ...block, y: block.y + 1 }
			});
		}
		this.setState({ fallingBlocks, hasFallingBlock, setBlocks });	
	}
	
	/***
	* Summary : Performs 2 checks between each turn :
	* 1) Counts the number of block on each row. If a row reaches 10 blocks, it is full, so it's cleared.
	* 2) Makes sure no set blocks is at row 0, which means it is outside the display, so game over.
	***/
	betweenTurnsVerifications = () => {
		let setBlocks = this.state.setBlocks.slice();
		let rowCounter = {};
		for (let i = 1; i < 21; i ++) {
			rowCounter[i] = 0;
		}
		if (setBlocks && setBlocks.length > 0) {
			setBlocks.map((block) => { 
				if (block.y === 0) {
					this.endGame("Game Over");
				}
				rowCounter[block.y]++;
				if (rowCounter[block.y] == 10) {
					this.clearRow(block.y);
					return;
				}
			});
		}
	}
	
	/***
	* Summary : Removes all set blocks on the given row number. Then drops by 1 all blocks above this row.
	***/
	clearRow = (row) => {
		let setBlocks = this.state.setBlocks.slice();
		if (setBlocks && setBlocks.length > 0) {
			// Clears the row
			let clearedSetBlocks = setBlocks.filter((block) => {
				if (block.y == row) {
					return false;
				}
				return true;
			});
			// Drops the blocks by 1 if they were above the cleared row
			let updatedSetBlocks = clearedSetBlocks.map((block) => {
				if (block.y < row) {
					return { ...block, y: block.y + 1 };
				} return block;
			});
			const newScore = this.state.score + 100;
			// Updates the state, and check if a completed row has been produced by moving the blocks
			this.setState({ setBlocks: updatedSetBlocks, score: newScore }, this.betweenTurnsVerifications);
		}
	}
	
	/***
	* Summary : Returns true if the block should stop, either because it reached the bottom of the pit, 
	* or because another block is in the way.
	***/
	shouldBlockStop = () => {
		const fallingBlocks = this.state.fallingBlocks.slice();
		const setBlocks = this.state.setBlocks.slice();
		let shouldStop = false;
		fallingBlocks.map((block) => {
			if (block.y === 20) {
				shouldStop = true;
			}
			if (setBlocks && setBlocks.length > 0) {
				for (let i = 0; i < setBlocks.length; i++) {
					let { x:setX, y:setY } = setBlocks[i];
					if (block.x == setX && block.y == (setY - 1)) {
						shouldStop = true;
					}
				}
			}
		});
		return shouldStop;
	}
	
	createNewBlock() {
		const rand = Math.floor(Math.random() * 7);
		const blockFactory = {
			0: [{ x: 5, y: 1, color: "#f00000", isRef: true },
				{ x: 6, y: 1, color: "#f00000", isRef: false },
				{ x: 4, y: 0, color: "#f00000", isRef: false },
				{ x: 5, y: 0, color: "#f00000", isRef: false }], // Z shape
			1: [{ x: 4, y: 1, color: "#00f0f0", isRef: false },
				{ x: 5, y: 1, color: "#00f0f0", isRef: true },
				{ x: 6, y: 1, color: "#00f0f0", isRef: false },
				{ x: 7, y: 1, color: "#00f0f0", isRef: false }], // I shape
			2: [{ x: 4, y: 1, color: "#0000f0", isRef: true },
				{ x: 5, y: 1, color: "#0000f0", isRef: false },
				{ x: 6, y: 1, color: "#0000f0", isRef: false },
				{ x: 4, y: 0, color: "#0000f0", isRef: false }], // L shape
			3: [{ x: 4, y: 1, color: "#f0a000", isRef: false },
				{ x: 5, y: 1, color: "#f0a000", isRef: false },
				{ x: 6, y: 1, color: "#f0a000", isRef: true },
				{ x: 6, y: 0, color: "#f0a000", isRef: false }], // reverse L shape
			4: [{ x: 4, y: 1, color: "#f0f000", isRef: false },
				{ x: 5, y: 1, color: "#f0f000", isRef: true },
				{ x: 4, y: 0, color: "#f0f000", isRef: false },
				{ x: 5, y: 0, color: "#f0f000", isRef: false }], // square
			5: [{ x: 4, y: 1, color: "#00f000", isRef: false },
				{ x: 5, y: 1, color: "#00f000", isRef: true },
				{ x: 5, y: 0, color: "#00f000", isRef: false },
				{ x: 6, y: 0, color: "#00f000", isRef: false }], // reverse Z shape
			6: [{ x: 4, y: 1, color: "#a000f0", isRef: false },
				{ x: 5, y: 1, color: "#a000f0", isRef: true },
				{ x: 6, y: 1, color: "#a000f0", isRef: false },
				{ x: 5, y: 0, color: "#a000f0", isRef: false }] // inverted T shape
		};
		if (this.checkIfCreationIsPossible(blockFactory[rand])) {
			this.setState({ hasFallingBlock: true, fallingBlocks: blockFactory[rand]});
		} else {
			this.endGame("Game Over");
		}
	}
	
	/***
	* Summary : Before creating one falling block, checks the set block on the first row, if any.
	* If one of the new block's cell if already occupied by the set block's, creation is impossible, and game's over.
	***/
	checkIfCreationIsPossible = (newBlock) => {
		const setBlocks = this.state.setBlocks.slice();
		let firstRowSetBlocks = setBlocks.filter(block => block.y === 1);
		if (firstRowSetBlocks && firstRowSetBlocks.length > 0) {
			for (let i = 0; i < firstRowSetBlocks.length; i++) {
				for (let j = 0; j < newBlock; j++) {
					if (firstRowSetBlocks[i].x === newBlock[j].x && firstRowSetBlocks[i].y === newBlock[j].y) {
						return false;
					}
				}
			}
		}
		return true;
		
	}
	
	endGame = (outcome) => {
		clearTimeout(this.timerID);
		alert(outcome);
	}
	
	// Every second, decreases the block's position by 1
	tick(gamePace) {
		if (this.state.hasFallingBlock) {
			this.dropBlockByOne();
		} else {
			this.createNewBlock();
		}
		this.timerID = setTimeout(
		  () => this.tick(this.gamePace),
		  gamePace
		);
	}
	
	/***
	* Summary : Determines the color of each cell
	***/
	computeCellColor(x, y) {
		let fallingBlocks = this.state.fallingBlocks.slice();
		let setBlocks = this.state.setBlocks.slice();
		// Colors the block already set in the game
		if (setBlocks && setBlocks.length > 0) {
			for (let i = 0; i < setBlocks.length; i++) {
				if (x == setBlocks[i].x && y == setBlocks[i].y) {
					return setBlocks[i].color;
				}
			}
		}
		// Colors the falling blocks
		if (fallingBlocks.filter((block) => {
			return (block.x == x && block.y == y);
		}).length > 0) {
			return fallingBlocks[0].color;
		}
	}
	
	moveBlockLeft = () => {
		let fallingBlocks = this.state.fallingBlocks.slice();
		let isAllowed = true;
		let isBeyondEdge = false;
		let newFallingBlocks = fallingBlocks.map((block) => {
			if (block.x == 1) {
				isBeyondEdge = true;
				return;
			}
			if (isAllowed) {
				isAllowed = this.isCellAtCoordinatesFree(block.x - 1, block.y);
			}
			return { ...block, x: block.x - 1 };
		});
		if (isAllowed && !isBeyondEdge) {
			this.setState({ fallingBlocks: newFallingBlocks });
		} else {
			// Can't go further left !
		}
	}
	
	moveBlockRight = () => {
		let fallingBlocks = this.state.fallingBlocks.slice();
		let isAllowed = true;
		let isBeyondEdge = false;
		let newFallingBlocks = fallingBlocks.map((block) => {
			if (block.x == 10) {
				isBeyondEdge = true;
				return;
			}
			if (isAllowed) {
				isAllowed = this.isCellAtCoordinatesFree(block.x + 1, block.y);
			}
			return { ...block, x: block.x + 1 };
		});
		if (isAllowed && !isBeyondEdge) {
			this.setState({ fallingBlocks: newFallingBlocks });
		} else {
			// Can't go further left !
		}
	}
	
	quickenPace = () => {
		if (this.gamePace === 1000) {
			document.addEventListener('keyup', this.onStopFastDrop);
			this.gamePace = 50;
		}
	}
	
	onStopFastDrop = (e) => {
		if (e.keyCode !== 40) { return; }
		this.gamePace = 1000;
		document.removeEventListener('keyup', this.onStopFastDrop);
	}
	
	onKeyDown = (e) => {
		// Go left
		if (e.keyCode === 37) {
			this.moveBlockLeft();
		}
		// Go right
		if (e.keyCode === 39) {
			this.moveBlockRight();
		}
		// Go down 
		if (e.keyCode === 40) {
			this.quickenPace();
		}
		// Rotate (up)
		if (e.keyCode === 38) {
			this.rotateBlock();
		}
		// Pause (space)
		if (e.keyCode === 32) {
			this.setState((prevState => ({ isPaused : !prevState.isPaused })), this.pauseGame);
		}
	}
	
	/***
	* Summary : Rorates a block (set of cells) 90° clockwise.
	***/
	rotateBlock = () => {
		const fallingBlocks = this.state.fallingBlocks.slice();
		let isAllowed = true;
		const refBlock = fallingBlocks.filter(block => block.isRef)[0];
		const newFallingBlocks = fallingBlocks.map(block => {
			if (!isAllowed) { return; }
			const newX = refBlock.x + (refBlock.y - block.y);
			const newY = refBlock.y + (block.x - refBlock.x);
			isAllowed = this.isRotationAllowed(newX, newY);
			return { ...block, x: newX, y: newY };
		});
		if (isAllowed) {
			this.setState({ fallingBlocks: newFallingBlocks });
		}
	}
	
	/***
	* Summary : Rotation is not allowed if the new coordinates are outside the screen, or if a set block already is in the cell
	***/
	isRotationAllowed = (newX, newY) => {
		if ((newX < 1 || newX > 10) || newY > 20) { 
			return false;
		}
		return this.isCellAtCoordinatesFree(newX, newY);
	}

	/***
	* Summary : Goes through all set blocks, and returns whether the given coordinates are already occupied.
	***/
	isCellAtCoordinatesFree(x, y) {
		const {setBlocks} = this.state; 
		let isAllowed = true;
		setBlocks.map(block => {
			if ((block.x === x) && (block.y === y)) {
				isAllowed = false;
			}
		});
		return isAllowed;
	}
	
	pauseGame = () => {
		const isPaused = this.state.isPaused;
		if (isPaused) {
			clearTimeout(this.timerID);
		} else {
			this.tick(this.gamePace);
		}
	}
	
	/***
	* Summary : a block is a set of several cell moving together. 
	* One of the cells is a reference, used to calculated positions for the whole block.
	***/
	getRefBlock = (block) => {
		for (let i = 0; i < block.length; i++) {
			if (block[i].isRef) {
				return block[i];
			}
		}
	}

	computeScore = () => {
		return `Current score : ${this.state.score}`;
	}
	
	componentWillUnmount() {
		clearTimeout(this.timerID);
	}
	
	componentDidMount() {
		document.addEventListener('keydown', this.onKeyDown);

		this.tick(this.gamePace);
	}
	
	render() {
		if(!this.timerID) { return <p> Initialising ....</p>; };
		const cells = this.generateCells();
		return <div id='TetrisArcadeContainer'>
			<div style={{ display: 'flex', flex: 2 }}>
				<div id='TetrisGameArea'>
					{cells}
				</div>
			</div>
			<div id='TetrisHubArea' style={{ display: 'flex', flex: 4 }}>
				{this.computeScore()}
				<br/>
				{this.state.isPaused ? 'Game Paused' : ''}
			</div>
		</div>
	}
}

export default TetrisGame;
