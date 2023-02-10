import {rowCol2index, index2row, index2col} from "./helper.js"

export const canvas = document.querySelector("#canvas");
var mine = document.querySelector("#mine");
var flag = document.querySelector("#flag");
var ctx = canvas.getContext('2d');


const tileColor = '#eee'
const canvasColor = '#fff'
canvas.style.backgroundColor = canvasColor;

class Image
{
	constructor()
	{ 
		this.no = 0; 
		this.flag = 1; 
		this.mine = 2; 
		this.showN = 3;
	}
}
const image = new Image();


class Tile
{ 
	constructor(i, j, minesCount, gImage, dimension ) 
	{ 
		this.width = canvas.width /dimension;
		this.height = canvas.height / dimension;
		this.flagSize = this.width;
		this.mineSize = this.width;
		this.row = i;
		this.col = j;
		this.minesCount = minesCount; 
		this.image = gImage;
	} 
	draw() 
	{ 
		switch(this.image)
		{
			case image.no: 
				ctx.fillStyle = tileColor 
				ctx.strokeStyle = canvasColor 
				ctx.linewidth = 5 
				ctx.fillRect(this.col * this.width, this.row * this.height, this.width, this.height) 
				ctx.strokeRect(this.col * this.width, this.row * this.height, this.width, this.height) 
				break;
			case image.flag: 
				ctx.fillStyle = tileColor 
				ctx.strokeStyle = canvasColor 
				ctx.linewidth = 5 
				ctx.fillRect(this.col * this.width, this.row * this.height, this.width, this.height) 
				ctx.strokeRect(this.col * this.width, this.row * this.height, this.width, this.height) 
				ctx.drawImage(flag, this.col * this.width, this.row * this.width, this.flagSize, this.flagSize);  
				break;
			case image.showN:
				ctx.fillStyle = tileColor 
				ctx.strokeStyle = canvasColor 
				ctx.linewidth = 5 
				ctx.fillRect(this.col * this.width, this.row * this.height, this.width, this.height) 
				ctx.strokeRect(this.col * this.width, this.row * this.height, this.width, this.height) 
				ctx.font = `${this.width * 0.6}px Arial` 
				ctx.fillStyle = "black" 
				ctx.textAlign = 'center' 
				ctx.textBaseline = "middle" 
				ctx.fillText(this.minesCount, this.col * this.width + this.width / 2, this.row * this.height + this.height / 2) 
				break;
			case image.mine:
				ctx.fillStyle = "red";
				ctx.strokeStyle = canvasColor;
				ctx.linewidth = 5;
				ctx.fillRect(this.col * this.width, this.row * this.height, this.width, this.height);
				ctx.strokeRect(this.col * this.width, this.row * this.height, this.width, this.height);
				ctx.drawImage(mine, this.col * this.width, this.row * this.width, this.mineSize, this.mineSize);  
		}
	}
}


export class GameView
{
    constructor(game)
    { 
	    ctx.clearRect(0, 0, canvas.width, canvas.height)
	    for(let i = 0; i < game.dimension * game.dimension; ++i)
	    { 
		    let boad = [];
		    let cell;
		    if(game.endGame)
		    {
			    if(game.mines.has(i)) 
				    new Tile(index2row(i, game.dimension), 
					    index2col(i, game.dimension), 
					    game.countMines(i),  
					    image.mine, game.dimension).draw();
			    else
				    new Tile(index2row(i, game.dimension), 
					    index2col(i, game.dimension), 
					    game.countMines(i),  
					    image.showN, game.dimension).draw();
		    }
		    else
		    {
			    if(game.flags.has(i))
				    new Tile(index2row(i, game.dimension), 
					    index2col(i, game.dimension), 
					    game.countMines(i),  
					    image.flag, game.dimension).draw();
			    else if(game.moves_made.has(i))
				    new Tile(index2row(i, game.dimension), 
					    index2col(i, game.dimension), 
					    game.countMines(i),  
					    image.showN, game.dimension).draw();
			    else
			    {
				    cell = new Tile(index2row(i, game.dimension), 
					    index2col(i, game.dimension), 
					    game.countMines(i),  
					    image.no, game.dimension);
				    cell.draw();
			    }
		    }
	    }
    }
}



export function clickToTail(x, y, canvas, dimension)
{ 
	const width = canvas.width /dimension;
	const height = canvas.height / dimension;
	const i = Math.floor(y / height); 
	const j = Math.floor(x / width); 
	return rowCol2index(i,j, dimension);
}



