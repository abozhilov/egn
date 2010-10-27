// MIT License
// Copyright (c) 2010 Asen Bozhilov

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

/**
  * @version 1.0
  * @author Asen Bozhilov
  */

/**
 * @construct
 * @param egn String   
 */
function EGN(egn) {
	this.value = egn;

	this._year = +egn.slice(0, 2); 
	this._month = +egn.slice(2, 4); 
	this._date = +egn.slice(4, 6); 
	this._order = +egn.slice(6, 9);
}

EGN.prototype = {
	constructor : EGN,
	/**
	  * Съдържа имената на всички региони в България, в които може да бъде записан човек при неговото раждане.
	  * @type Array
	  */
	regionNames : [
		'Благоевград',
		'Бургас',
		'Варна',
		'Велико Търново',
		'Видин',
		'Враца',
		'Габрово',
		'Кърджали',
		'Кюстендил',
		'Ловеч',
		'Монтана',
		'Пазарджик',
		'Перник',
		'Плевен',
		'Пловдив',
		'Разград',
		'Русе',
		'Силистра',
		'Сливен',
		'Смолян',
		'София - град',
		'София - окръг',
		'Стара Загора',
		'Добрич (Толбухин)',
		'Търговище',
		'Хасково',
		'Шумен',
		'Ямбол',
		'Друг/Неизвестен'
	],
	
	/**
	 * Съдържа отделените интервали за всеки един регион. 
	 * Интервала е: (x, y]
	 * Използва се за определяне на региона.
	 * @private
	 * @type Array
	 */
	_regionIds : [-1, 43, 93, 139, 169, 183, 217, 233, 281, 301, 319, 341, 377, 395, 435, 501, 527, 555, 575, 601, 623, 721, 751, 789, 821, 843, 871, 903, 925, 999],	
	
	/**
	 * На базата на числата в масива се изчислява 10-тата контролна цифра в ЕГН.
	 * Използва се за валидация на ЕГН.
	 * @private
	 * @type Array
	 */
	_weights : [2, 4, 8, 5, 10, 9, 7, 3, 6],
	
	/**
	  * Проверява валидността на ЕГН.
	  * Датата на раждане се проверява за валидност спрямо Григорианският календар.
	  * @type Boolean value
	  */
	isValid : function() 
	{
		var egn = this.value,
			bornDate = this.getBornDate(),
			month = (this._month % 20) - 1;
			
		if (egn.length != 10 || /\D/.test(egn) || bornDate.getMonth() != month || bornDate.getDate() != this._date) 
		{
			return false;
		}
		
		egn = egn.split('');
		for (var i = this._weights.length, sum = 0; i--;)
		{
			sum += this._weights[i] * egn[i];
		}
		if (sum % 11 % 10 != egn[9]) 
		{
			return false;
		}
		
		return true;
	},
	
	/**
	  * Извлича датата на раждане.
	  * @type Date
	  */
	getBornDate : function() 
	{
		var year = 1900;
		if (this._month > 40) 
		{
			year += 100;
		}
		else if (this._month > 20) 
		{
			year -= 100;
		}
		
		return new Date(year + this._year, (this._month % 20) - 1, this._date);
	},
	
	/**
	  * Изчислява региона, на който отговаря ЕГН-то.
	  * @type Number value
	  * @return Името на региона може да се вземе като се използва върнатия резултат за индекс в масива <code>regionNames</code>.
	  * @see #regionNames
	  */
	getRegion : function() 
	{
		if (typeof this._region != 'number') 
		{
			var start = 0,
				end = this._regionIds.length - 1,
				middle, lower_b, upper_b;
			
			while(start <= end)
			{
				middle = Math.floor((end + start) / 2);
				lower_b = this._regionIds[middle];
				upper_b = this._regionIds[middle + 1];
				if (this._order > upper_b) 
				{	
					start = middle + 1;
				}
				else if (this._order < lower_b)
				{
					end = middle - 1;
				}
				else {
					this._region = middle;
					break;
				}
			}
		}
		return this._region;
	},
	
	/** 
	  * Изчислява поредността на раждане за региона.
	  * @type Number value
	  */
	getOrderByRegion : function() 
	{
		return this._order - this._regionIds[this.getRegion()];
	},
	
	/** 
	  * Изчислява поредността на раждане за региона, спрямо хората от същия пол.
	  * @type Number value
	  */	
	getSexOrderByRegion : function()
	{
		return Math.ceil(this.getOrderByRegion() / 2);
	},
	
	/**
	  * Определяне на пола.
	  * @type Number value
	  * @return 0 - мъж<br /> 1 - жена
	  */
	getSex : function() 
	{
		return this._order % 2;
	}
};

