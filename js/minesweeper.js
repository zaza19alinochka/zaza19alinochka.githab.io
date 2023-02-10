import {getNeighbors, isSubSet, difference} from "./helper.js"

class Sentence
{
	constructor(cells, count)
	{
		this.cells = new Set(cells);
		this.count = count;
	}

	equal(other)
	{
		if((this.count !== other.count) || (this.cells.size !== other.cells.size)) return false;
		for(var a of this.cells)
			if(!other.cells.has(a))
				return false;
		return true;
	}

	known_mines()
	{
		//Возвращает ячейки, о которых известно, что они мины.
		//--------------------------------Реализуйте самостоятельно-----------
		if(this.cells.size == this.count)
			return new Set(this.cells)
		else
			return new Set()
	}

	known_safes()
	{

		//Возвращает ячейки, о которых известно, что они безопасны.
		//--------------------------------Реализуйте самостоятельно-----------
		if(this.cells.size == this. count)
			return new Set()
		else
			return new Set(this.count)
	}

	mark_safe(cell)
	{
		//Обновляет внутреннее представление знаний, 
		//учитывая, что ячейка известна как безопасная.
		//--------------------------------Реализуйте самостоятельно-----------
		if(this.cells.has(cell))
			this.cells.delete(cell)
	}


	mark_mine(cell)
	{
		//Обновляет внутреннее представление знаний, 
		//учитывая, что ячейка изсвестна как мина.
		//--------------------------------Реализуйте самостоятельно-----------
		if(this.count.has(this.count))
			this.count.delete(this.count)
	}

	infer_from(sentence2)
	//Если множество ячеек одного предложения является подмножеством другого,
	//то создаём новое предложение, иначе возвращаем 0.
	{
		let set1 = this.cells;
		let set2 = sentence2.cells;
		let set3;
		if(this.equal(sentence2)) 
			return 0;
		else if(isSubSet(set1, set2))
		{
			set3 = difference(set2, set1);
			return new Sentence(set3, sentence2.count - this.count);
		}
		else if(isSubSet(set2, set1))
		{
			set3 = difference(set1, set2);
			return new Sentence(set3, this.count - sentence2.count);
		}
		else
			return 0;
	}

}


export class MinesweeperAI
{
	constructor(dimension)
	{
		//Ширина и высота поля игры
		this.dimension = dimension;

		//Следит за тем, какие ячейки были нажаты 
		this.moves_made = new Set();

		//Следит за ячейками, которые считаются безопасными или минами
		this.mines = new Set();
		this.safes = new Set();
		this.knowledge = [];
	}

	start()
	{
		this.moves_made = new Set();
		this.mines = new Set();
		this.safes = new Set();
		this.knowledge = [];
	}

	mark_mine(cell)
	{
		//Помечает ячейку как мину и обновляет все знания,
		//чтобы пометить эту ячейку как мину.
		this.mines.add(cell);
		for(let i = 0; i < this.knowledge.length; i++)
		{
			if(this.knowledge[i].cells.has(cell))
			{
				let sent1 = new Sentence(this.knowledge[i].cells, this.knowledge[i].count);
				sent1.mark_mine(cell);
				if(this.knowledge[i].cells.size == 0 || this.has_sentence(sent1))
				{
					this.knowledge.splice(i, 1);
					--i;
				}
				else
				{
					this.knowledge[i] = sent1;
				} 
			} 
		} 
	}

	mark_safe(cell)
	{
		//Помечает ячейку как безопасную и обновляет все знания,
		//чтобы пометить эту ячейку как безопасную.
		this.safes.add(cell);
		for(let i = 0; i < this.knowledge.length; i++)
		{
			if(this.knowledge[i].cells.has(cell))
			{
				let sent1 = new Sentence(this.knowledge[i].cells, this.knowledge[i].count);
				sent1.mark_safe(cell);
				if(this.knowledge[i].cells.size == 0 || this.has_sentence(sent1))
				{
					this.knowledge.splice(i, 1);
					--i; 
				}
				else
				{
					this.knowledge[i] = sent1;
				}
			}
		}
	}


	add_knowledge(cell, count)
	{
		/* Вызывается, когда доска "Сапёр" сообщает нам,
		 * для данной безопасной ячейки, сколько соседей имеют мины.
		 *
		 * Эта функция должна:
		 * 1) пометить ячейку, как сделанный ход
		 * 2) пометить ячейку, как безопасную, обновить все предложения базы знаний, которые содержат эту ячейку
		 * 3) добавить новое предложение в базу знаний
		 * на основе значений cell и count, предложение содержит только те ячейки, 
		 * состояние которых не определено.
		 * 4) пометить дополнительные ячейки как безопасные или как мины,
		 * если это можно сделать на основе базы знаний ИИ.
		 * 5) добавить новые предложения в базу знаний если они могут
		 * быть выведены из существующих знаний.
		 */
		//--------------------------------Реализуйте самостоятельно-----------
		try
		{ 
			// 1) помечает ячейку, как сделанный ход 
			this.moves_made.add(cell);
			// 2) пометить ячейку, как безопасную, обновить все предложения базы знаний, которые содержат эту ячейку
			this.mark_safe(cell); 
			// 3) добавить новое предложение в базу знаний
			// на основе значений cell и count, предложение содержит только те ячейки, 
			// состояние которых не определено.
			this.add_sentence(cell, count);
			// 4) пометить дополнительные ячейки как безопасные или как мины,
			// если это можно сделать на основе базы знаний ИИ.
			this.infer();
		}
		catch(error)
		{
			console.log(error);
		}

	}



	make_safe_move()
	{
		/* Возвращает безопасную ячейку для выбора на поле Сапёра.
		 * Ход должен быть известен как безопасный и ещё не был сделан. 
		 * Функция может использовать this.mines, this.safes, this.moves_made,
		 * но не должна их изменять.
		 */
		//--------------------------------Реализуйте самостоятельно-----------
		if(this.safes.size > 0)
		{ 

			let  move = [...difference(this.safes, this.moves_made)][0];
			return move;
		}
		else
		{
			return undefined;
		}
	}

	make_random_move()
	{
		/*Возваращает ход, который надо сделать на доске Сапёра.
		 * Следует выбрать случайным образом среди ячеек, которые:
		 * 1) ещё не выбрали
		 * 2) не известно, что это мины.
		 */
		//--------------------------------Реализуйте самостоятельно-----------
		let board = [];
		for(let l = 0; l < this.dimension * this.dimension; ++l) board.push(l);
		let boardSet = new Set(board);
		boardSet = difference(boardSet, this.moves_made);
		boardSet = difference(boardSet, this.mines);
		board = [...boardSet];
		if(board.length > 0)
		{ 
			const index = Math.floor(Math.random() * board.length); 
			return board[index];
		}else 
			return undefined;
	}

	
	
//-------------добавил позже

	add_sentence(cell, count) 	
	//Добавляет предложение используя значение cell, count, учитывает только те ячейки, 
	//состояние которых не определено
	{
		let s1 = new Sentence(getNeighbors(cell, this.dimension), count);
		for(let mine of this.mines)
		{
			s1.mark_mine(mine)
		}
		for(let safe of this.safes)
		{
			s1.mark_safe(safe);
		}
		if(s1.cells.size > 0 && !this.has_sentence(s1)) 
			this.knowledge.push(s1);
	}

	infer()
	{
		for(let i = 0; i < this.knowledge.length; i++)
		{
			let s1 = this.knowledge[i].known_safes();
			if(s1.size > 0)
			{
				this.knowledge.splice(i,1);
				for(let safe of s1)
				{
					this.mark_safe(safe);
				}
				i = 0;
				continue;
			}
			let s2 = this.knowledge[i].known_mines();
			if(s2.size > 0)
			{
				this.knowledge.splice(i, 1);
				for(let mine of s2)
				{
					this.mark_mine(mine);
				}
				i = 0;
				continue;
			}
			for(let j = i + 1; j<this.knowledge.length; j++)
			{
				let sent1 = this.knowledge[i].infer_from(this.knowledge[j]);
				if(sent1 == 0 || this.has_sentence(sent1)) continue;
				this.knowledge.push(sent1);
				i = 0;
				break;
			}
		}
	}

	has_sentence(sent1)
	{
		for(let sent of this.knowledge)
		{
			if(sent1.equal(sent)) return true;
		}
		return false;
	}
}


