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
function EGN(egn){this.value=egn;this._year=+egn.slice(0,2);this._month=+egn.slice(2,4);this._date=+egn.slice(4,6);this._order=+egn.slice(6,9);}
EGN.prototype={constructor:EGN,regionNames:['Благоевград','Бургас','Варна','Велико Търново','Видин','Враца','Габрово','Кърджали','Кюстендил','Ловеч','Монтана','Пазарджик','Перник','Плевен','Пловдив','Разград','Русе','Силистра','Сливен','Смолян','София - град','София - окръг','Стара Загора','Добрич (Толбухин)','Търговище','Хасково','Шумен','Ямбол','Друг/Неизвестен'],_regionIds:[-1,43,93,139,169,183,217,233,281,301,319,341,377,395,435,501,527,555,575,601,623,721,751,789,821,843,871,903,925,999],_weights:[2,4,8,5,10,9,7,3,6],isValid:function()
{var egn=this.value,bornDate=this.getBornDate(),month=(this._month%20)-1;if(egn.length!=10||/\D/.test(egn)||bornDate.getMonth()!=month||bornDate.getDate()!=this._date)
{return false;}
egn=egn.split('');for(var i=this._weights.length,sum=0;i--;)
{sum+=this._weights[i]*egn[i];}
if(sum%11%10!=egn[9])
{return false;}
return true;},getBornDate:function()
{var year=1900;if(this._month>40)
{year+=100;}
else if(this._month>20)
{year-=100;}
return new Date(year+this._year,(this._month%20)-1,this._date);},getRegion:function()
{if(typeof this._region!='number')
{var start=0,end=this._regionIds.length-1,middle,lower_b,upper_b;while(start<=end)
{middle=Math.floor((end+start)/2);lower_b=this._regionIds[middle];upper_b=this._regionIds[middle+1];if(this._order>upper_b)
{start=middle+1;}
else if(this._order<lower_b)
{end=middle-1;}
else{this._region=middle;break;}}}
return this._region;},getOrderByRegion:function()
{return this._order-this._regionIds[this.getRegion()];},getSexOrderByRegion:function()
{return Math.ceil(this.getOrderByRegion()/2);},getSex:function()
{return this._order%2;}};