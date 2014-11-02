'use strict';

Object.prototype.clone = function()
{
	var objClone;
	if ( this.constructor === Object ){objClone = new this.constructor();}
	else {objClone = new this.constructor(this.valueOf());}
	for ( var key in this )
	{
		if ( objClone[key] !== this[key] )
		{
			if ( typeof(this[key]) === 'object' )
			{
				objClone[key] = this[key].clone();
			}
			else
			{
				objClone[key] = this[key];
			}
		}
	}
	objClone.toString = this.toString;
	objClone.valueOf = this.valueOf;
	return objClone;
};