/** ArrayTools Boîte à outil pour les tableau (Array)
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */


module.exports = {
	
	/** Retire un élément d'un Array
	 * @param aArray élément à traiter
	 * @param nItem index de l'élément à retirer
	 */
	removeItem: function(aArray, nItem) {
		let aItem = Array.prototype.splice.call(aArray, nItem, 1);
		return aItem[0];
	},
	
	isArray: function(o) {
		return Array.isArray(o);
	},
	
	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
	shuffle: function(o){ //v1.0
		for (let j, x, i = o.length; i; j = (Math.random() * i | 0), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},
	
	// renvoie l'indice du plus grand élément
	indexOfMax: function(a) {
		if (!a) {
			return null;
		}
		let nGreater = a[0], iGreater = 0;
		for (let i = 1; i < a.length; ++i) {
			if (a[i] > nGreater) {
				nGreater = a[iGreater = i];
			}
		}
		return iGreater;
	}
};

