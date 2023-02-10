import Game from "./game.js"
import {GameView, clickToTail, canvas} from "./view.js"
import {MinesweeperAI} from "./minesweeper.js"
import {dimension, nMine} from "./config.js"

const startBtn = document.querySelector("#start");
const aiMoveBtn = document.querySelector("#ai_move");
startBtn.addEventListener('click', startGame);
aiMoveBtn.addEventListener('click', aiMove);
canvas.addEventListener('mouseup', moveView);

var game = new Game(dimension, nMine);
var ai = new MinesweeperAI(dimension);

startGame();

function startGame()
{
	game.start();
	ai.start(); 
	new GameView(game);
}



function moveView(event)
{ 
	if(!game.endGame)
	{ 
		const cell = clickToTail(event.offsetX, event.offsetY, canvas, game.dimension);
		if(event.button === 0)
		{ 
			if(!game.mines.has(cell))
			{ 
				game.moves_made.add(cell); 
				ai.add_knowledge(cell, game.countMines(cell));
			} 
			else 
			{ 
				game.endGame = true; 
				for(let l = 0; l < dimension * dimension; ++l) 
					game.moves_made.add(l);
			}
		}
		else 
		{ 
			if(game.flags.has(cell)) 
				game.flags.delete(cell); 
			else if(!game.flags.has(cell) && !game.moves_made.has(cell)) 
				game.flags.add(cell);
		} 
		new GameView(game)
	}
}

function aiMove()
{
	if(!game.endGame)
	{ 
		let cell = ai.make_safe_move(); 
		if(cell === undefined) 
		{ 
			cell = ai.make_random_move(); 
			if(cell === undefined) 
			{ 
				console.log("Нет ходов"); 
			} 
			else
			{
				console.log("Случайный выбор"); 
				if(game.mines.has(cell)) 
					game.endGame = true; 
				else
				{ 
					game.moves_made.add(cell); 
					ai.add_knowledge(cell, game.countMines(cell));
				}

			}
		}
		else
		{ 
			game.moves_made.add(cell); 
			console.log("Безопасный ход");
			ai.add_knowledge(cell, game.countMines(cell));
		} 
	} 
	ai.mines.forEach(m => game.flags.add(m));
	new GameView(game)
}


