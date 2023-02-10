import {getNeighbors, random_from_list} from "./helper.js"


export default class Game
{
	constructor(dimension, nMines)
	{
		this.dimension = dimension;
		this.nMines = nMines;
		this.flags = new Set();
		this.moves_made = new Set();
		this.mines = new Set();
		this.endGame = false;
	}

	start()
	{
		//random choose mined cells
		this.endGame = false;
		let list = [];
		this.mines = new Set();
		this.moves_made = new Set();
		this.flags = new Set();
		for(let i = 0; i < this.dimension * this.dimension; i++) 
			list.push(i);
		for(let i = this.nMines; i > 0; --i)
		{ 
			this.mines.add(
				random_from_list(list)
			);
		}
	}

	countMines(cell)
	{
		let count = 0;
		for(let elem of getNeighbors(cell, this.dimension))
		{
			if(this.mines.has(elem)) ++count;
		}
		return count;
	}

};



