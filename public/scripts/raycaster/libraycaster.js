"use strict";
/** O2: Fonctionalités Orientées Objets pour Javascript
 * 2010 Raphaël Marandet
 * ver 1.0 10.10.2010
 * ver 1.1 28.04.2013 : ajout d'un support namespace  
 * ver 1.2 01.07.2016 : mixin et test unitaire / O2.parent
 * good to GIT
 */

var O2 = {};

/** Creation d'une nouvelle classe
 * @example NouvelleClasse = Function.createClass(function(param1) { this.data = param1; });
 * @param pPrototype {*} prototype du constructeur
 * @return Function
 */
Function.prototype.createClass = function(pPrototype) {
	var f;
	f = function() {
		if ('__construct' in this) {
			this.__construct.apply(this, arguments);
		}
	};
	if (pPrototype === undefined) {
		return f;
	} else if (typeof pPrototype === 'object') {
		return f.extendPrototype(pPrototype);
	} else {
		return null;
	}
};

/**
 * Permet de superizer une fonction
 * @param f
 * @param fParent
 * @return {any}
 * @private
 */
O2._superizeFunction = function(f, fParent) {
	var fNew, s = 'fNew = function() {\n' +
		'var __inherited = (function() {\n' +
		'	return fParent.apply(this, arguments);\n' +
		'}).bind(this);\n' +
		'var __function = ' +
		f.toString() + ';' +
		'\nreturn __function.apply(this, arguments);\n' +
	'}\n';
	return eval(s);
};

/** Mécanisme d'extention de classe.
 * Cette fonction accepte un ou deux paramètres
 * Appel avec 1 paramètre :
 * @param Définition de prototype à ajouter à la classe.
 * Appel avec 2 paramètres :
 * @param Classe parente
 * @param Définition de prototype à ajouter à la classe.
 * @return Instance de lui-même.
 */
Function.prototype.extendPrototype = function(aDefinition) {
	var iProp, f, fInherited;
	if (aDefinition instanceof Function) {
		aDefinition = aDefinition.prototype;
	}
	for (iProp in aDefinition) {
		f = aDefinition[iProp];
		if (iProp in this.prototype && (this.prototype[iProp] instanceof Function)) {
			// Sauvegarde de la méthode en cours : elle pourrait être héritée
			fInherited = this.prototype[iProp];
			// La méthode en cour est déja présente dans la super classe
			if (f instanceof Function) {
				// completion des __inherited
				// Ancien code
				//eval('f = ' + __inheritedThisMacroString(f.toString()));
				//this.prototype[iProp] = f;
				//this.prototype[iProp].__inherited = fInherited;

				// Nouveau code
				this.prototype[iProp] = O2._superizeFunction(f, fInherited);

			} else {
				// On écrase probablement une methode par une propriété : Erreur
				throw new Error(
						'o2: method ' + iProp + ' overridden by property.');
			}
		} else {
			// Ecrasement de la propriété
			this.prototype[iProp] = aDefinition[iProp];
		}
	}
	return this;
};

/** Mécanisme d'extension de classe
 * @param Parent Nom de la classe Parente
 * @param X prototype du constructeur (optionnel)
 * @param Y prototype de la classe étendue
 */
Function.prototype.extendClass = function(Parent, X) {
	var f = this.createClass().extendPrototype(Parent).extendPrototype(X);
	return f;
};

/**
 * Creation d'un objet
 * Le nom de l'objet peut contenir des "." dans ce cas de multiple objets sont créés
 * ex: O2.createObject("MonNamespace.MaBibliotheque.MaClasse", {...});
 * var créer un objet global "MonNamespace" contenant un objet "MaBibliotheque" contenant lui même l'objet "MaClasse"
 * ce dernier objet recois la définition du second paramètre.
 *  
 * 
 * @param sName nom de l'objet
 * @param oObject objet
 * @param object
 */
O2.createObject = function(sName, oObject) {
	var aName = sName.split('.');
	var sClass = aName.pop();
	var pIndex = window;
	var sNamespace;
	while (aName.length) {
		sNamespace = aName.shift();
		if (!(sNamespace in pIndex)) {
			pIndex[sNamespace] = {};
		}
		pIndex = pIndex[sNamespace];
	}
	if (!(sClass in pIndex)) {
		pIndex[sClass] = oObject;
	} else {
		for ( var sProp in oObject) {
			pIndex[sClass][sProp] = oObject[sProp];
		}
	}
	return pIndex;
};

/** 
 * Charger une classe à partir de son nom - le nom suit la syntaxe de la fonction O2.createObject() concernant les namespaces. 
 * @param s string, nom de la classe
 * @return pointer vers la Classe
 */
O2.loadObject = function(s, oContext) {
	var aClass = s.split('.');
	var pBase = oContext || window;
	var sSub, sAlready = '';
	while (aClass.length > 1) {
		sSub = aClass.shift();
		if (sSub in pBase) {
			pBase = pBase[sSub];
		} else {
			throw new Error('could not find ' + sSub + ' in ' + sAlready.substr(1));
		}
		sAlready += '.' + sSub;
	}
	var sClass = aClass[0];
	if (sClass in pBase) {
		return pBase[sClass];
	} else {
		throw new Error('could not find ' + sClass + ' in ' + sAlready.substr(1));
	}
};

/** Creation d'une classe avec support namespace
 * le nom de la classe suit la syntaxe de la fonction O2.createObject() concernant les namespaces.
 * @param sName string, nom de la classe
 * @param pPrototype définition de la nouvelle classe
 */
O2.createClass = function(sName, pPrototype) {
	return O2.createObject(sName, Function.createClass(pPrototype));
};

/** Extend d'un classe
 * le nom de la nouvelle classe suit la syntaxe de la fonction O2.createObject() concernant les namespaces.
 * @param sName string, nom de la nouvelle classe
 * @param pParent string|object Classe parente
 * @param pPrototype Définition de la classe fille  
 */
O2.extendClass = function(sName, pParent, pPrototype) {
	if (typeof pParent === 'string') {
		pParent = O2.loadObject(pParent);
	}
	return O2.createObject(sName, Function.extendClass(pParent, pPrototype));
};


/**
 * Ajout d'un mixin dans un prototype
 * @param pPrototype classe dans laquelle ajouter le mixin
 * @param pMixin mixin lui même
 */
O2.mixin = function(pPrototype, pMixin) {
	var oMixin;
	if (typeof pPrototype === 'string') {
		pPrototype = O2.loadObject(pPrototype);
	}
	if (typeof pMixin === 'function') {
		oMixin = new pMixin();
		oMixin.mixin(pPrototype);
	} else {
		oMixin = pMixin;
		pPrototype.extendPrototype(oMixin);
	}
};


/**
 * @class O876.Mixin.Events
 * This class is a mixin
 * it will add custom events management functions to an existing prototype
 */
O2.createClass('O876.Mixin.Events', {
	mixin: function(p) {
		p.extendPrototype({
			
			_WeirdEventHandlers: null,

            /**
			 * Will declare an event handler
             * @param sEvent event name
             * @param pCallback function to be called when the event is triggered
             * @returns {*}
             */
			on: function(sEvent, pCallback) {
				if (this._WeirdEventHandlers === null) {
					this._WeirdEventHandlers = {};
				}
				var weh = this._WeirdEventHandlers;
				if (!(sEvent in weh)) {
					weh[sEvent] = [];
				}
				weh[sEvent].push(pCallback);
				return this;
			},

            /**
             * Will declare an event handler. The handler will be called
			 * at most one time.
             * @param sEvent event name
             * @param pCallback function to be called when the event is triggered
             * @returns {*}
             */
			one: function(sEvent, pCallback) {
				var pCallbackOnce;
				pCallbackOnce = (function() {
					pCallback.apply(this, Array.prototype.slice.call(arguments, 0));
					this.off(sEvent, pCallbackOnce);
					pCallbackOnce = null;
				}).bind(this);
				return this.on(sEvent, pCallbackOnce);
			},

            /**
             * Will remove an event handler.
			 * If pCallback is specified, this pCallback only will be remove
			 * if no callback is specified, all the handlers will be removed for that
			 * event.
			 * if neither sEvent nor pCallback are specified, all events and all handler
			 * will be removed.
             * @param sEvent event name
             * @param pCallback function to be called when the event is triggered
             * @returns {*}
             */
			off: function(sEvent, pCallback) {
				if (this._WeirdEventHandlers === null) {
					throw new Error('no event "' + sEvent + '" defined');
				}
				if (sEvent === undefined) {
					this._WeirdEventHandlers = {};
				} else if (!(sEvent in this._WeirdEventHandlers)) {
					throw new Error('no event "' + sEvent + '" defined');
				}
				var weh = this._WeirdEventHandlers;
				var wehe, n;
				if (pCallback !== undefined) {
					wehe = weh[sEvent];
					n = wehe.indexOf(pCallback);
					if (n < 0) {
						throw new Error('this handler is not defined for event "' + sEvent + '"');
					} else {
						wehe.splice(n, 1);
					}
				} else {
					weh[sEvent] = [];
				}
				return this;
			},

            /**
			 * Triggers an event.
			 * Will call all callback associated with that event.
			 * All parameters following sEvent will be passed to
			 * the event handler.
             * @param sEvent event name
             * @returns {trigger}
             */
			trigger: function(sEvent) {
				if (this._WeirdEventHandlers === null) {
					return this;
				}
				var weh = this._WeirdEventHandlers;
				if (!(sEvent in weh)) {
					return this;
				}
				var aArgs = Array.prototype.slice.call(arguments, 1);
				weh[sEvent].forEach(function(pCallback) {
					pCallback.apply(this, aArgs);
				}, this);
				return this;
			}
		});
	}
});

/**
 * @class O876.Mixin.Data
 * This is a mixin.
 * It adds custom "data" management functions to an existing prototype
 * it adds "getData", "setData", and "data" methods
 */
O2.createClass('O876.Mixin.Data', {
	
	mixin: function(p) {
		p.extendPrototype({
		
			_DataContainer: null,

            /**
			 * Sets a custom variable
             * @param s variable name
             * @param v new value
             * @returns {*}
             */
			setData: function(s, v) {
				return this.data(s, v);
			},

            /**
			 * Get a previously set value
             * @param s variable name
             * @returns {*}
             */
			getData: function(s) {
				return this.data(s);
			},

            /**
			 * This method is a synthesis between getData and setData
			 * with 2 parameters the setData method will be called
			 * with 1 parameter the getData method will be called
             * @param s variable name
             * @param v (optional) value
             * @returns {*}
             */
			data: function(s, v) {
				if (this._DataContainer === null) {
					this._DataContainer = {};
				}
				var D = this._DataContainer;
				if (v === undefined) { // get data
					if (s === undefined) {
						return D; // getting all data
					} else if (typeof s === 'object') {
						for (var x in s) { // setting many pairs of key values
							D[x] = s[x];
						}
					} else if (s in D) { // getting one key
						return D[s]; // found !
					} else {
						return null; // not found
					}
				} else { // set data
					// setting one pair on key value
					D[s] = v;
				}
				return this;
			}
		});
	}
});

O2.createClass('H5UI.Font', {
	_sStyle: '',
	_sFont : '',
	_nFontSize : 10,
	_sColor : 'rgb(255, 255, 255)',
	_oControl : null,
	_sOutlineColor: 'rgb(0, 0, 0)',
	_bOutline: false,

	__construct : function(oControl) {
		this._sFont = H5UI.font.defaultFont;
		this._nFontSize = H5UI.font.defaultSize;
		this._sColor = H5UI.font.defaultColor;
		if (oControl === undefined) {
			throw new Error('h5ui.font: no specified control');
		}
		this.setControl(oControl);
	},

	/**
	 * Défini le controle propriétaire
	 * 
	 * @param oControl
	 *            nouveau control propriétaire
	 */
	setControl : function(oControl) {
		this._oControl = oControl;
		this.invalidate();
	},

	/**
	 * Invalide le controle propriétaire afin qu'il se redessineen tenant compte
	 * des changement apporté à l'aspect du texte.
	 */
	invalidate : function() {
		if (this._oControl) {
			this.update();
			this._oControl.invalidate();
		}
	},

	/**
	 * Modification de la police de caractère, on ne change que la variable et
	 * on invalide le controle
	 * 
	 * @param sFont
	 *            nouvelle police
	 */
	setFont : function(sFont) {
		if (this._sFont != sFont) {
			this._sFont = sFont;
			this.invalidate();
		}
	},
	
	setStyle: function(sStyle) {
		if (this._sStyle != sStyle) {
			this._sStyle = sStyle;
			this.invalidate();
		}
	},

	/**
	 * Modifie la taille de la police
	 * 
	 * @param nSize
	 *            nouvelle taille en pixel
	 */
	setSize : function(nSize) {
		if (this._nFontSize != nSize) {
			this._nFontSize = nSize;
			this.invalidate();
		}
	},

	/**
	 * Modification de la couleur
	 * 
	 * @param s
	 *            nouvelle couleur HTML5 (peut etre un gradient)
	 */
	setColor : function(sColor, sOutline) {
		var bInvalid = false;
		if (this._sColor != sColor) {
			this._sColor = sColor;
			bInvalid = true;
		}
		if (this._sOutlineColor != sOutline) {
			this._sOutlineColor = sOutline;
			bInvalid = true;
		}
		this._bOutline = this._sOutlineColor !== undefined;
		if (bInvalid) {
			this.invalidate();
		}
	},

	/**
	 * Calcule la chaine de définition de police de caractère Cette fonction
	 * génère une chaine de caractère utilisable pour définir la propriété Font
	 * d'une instance Canvas2DContext
	 * 
	 * @return string
	 */
	getFontString : function() {
		return (this._sStyle ? this._sStyle + ' ' : '') + this._nFontSize.toString() + 'px ' + this._sFont;
	},

	/**
	 * Applique les changements de taille, de couleur... Le context2D du
	 * controle propriété de cette instance est mis à jour quant au nouvel
	 * aspect de la Font.
	 */
	update : function() {
		var oContext = this._oControl.getSurface();
		oContext.font = this.getFontString();
		oContext.fillStyle = this._sColor;
		if (this._bOutline) {
			oContext.strokeStyle = this._sOutlineColor;
		}
	}
});


/* H5UI: Bibliothèque de composants visuels basé sur la technologie HTML 5
   2012 Raphaël Marandet
   ver 1.0 01.06.2012
 */

/*
 H5UI est un système de gestion de controles fenêtrés basé sur HTML 5, plus particulièrement son objet de rendu graphique Canvas.
 Ce système gère : 
 1) l'affichage d'une interface graphique (ensemble de fenêtres, boutons, texte, tableau, images, barres de défilement....).
 2) le traitement des évènements souris (déplacement, clic, drag and drop...)
 3) Le rafraichissement optimisé des composants graphiques dont l'état a changé.

 Principe
 --------

 Le système s'apparentant à un Document Object Model (DOM) est articulé autour d'une classe Composite : 
 Les instances de contrôles fenêtrés entretiennent chacune une collection d'instances de même classe.
 Ces contrôles sont organisé en arborescence. Chaque contrôle fenêtré possède un seul parent et 0-n enfants.

 Lorsqu'un contrôle s'invalide (sous l'effet d'une action externe comme une action utilisateur ou un timer écoulé), 
 il doit être redessiné. Sa chaîne hierarchique est invalidée à son tour,
 et lors du rafraichissement d'écran seul les composants invalides font appel à leur méthode de rendu graphique 
 et sont effectivement redessinés. 
 Les autres contrôles ne sont que replaqués sur la surface de leur parent en utilisant leur état graphique actuel inchangé.
 Les composants dont les parents n'ont pas été invalidés ne sont pas atteints par la procédure de rafraîchissement.


 +--------------------------------------------------+
 | Controle A                                       |
 |            +-----------------------------+       |
 |            | Controle B                  |       |
 |            |                             |       |
 |            |                             |       |
 |            +-----------------------------+       |
 |                                                  |
 |    +-----------------------------+               |
 |    | Controle C                  |               |
 |    |    +-----------------+      |               |
 |    |    | Controle D      |      |               |
 |    |    |                 |      |               |
 |    |    |                 |      |               |
 |    |    |                 |      |               |
 |    |    +-----------------+      |               |
 |    +-----------------------------+               |
 |                                                  |
 +--------------------------------------------------+

 Dans ce schémas le Controle A contient B et C, le Contrôle C contient quand à lui le Controle D
 Autrement l'arborescence se représente ainsi

 A
 |
 +--- B
 |
 +--- C
 |
 +--- D




 Vocabulaire
 -----------

 Contrôle fenêtré
 Elément de base d'une interface graphique.
 Le contrôle fenêtré est un objet visuel qui possède plusieurs propriétés de base et 
 Les propriété fondamentales pour tout objet graphique sont : 
 - la position (en pixels).
 - la taille (longueur et hauteur en pixels).
 - un indicateur d'invalidation (booléen) lorsque celui ci est a VRAI le contrôle doit être redessiné.
 - un contrôle fenêtré parent.
 - une collection de contrôles fenêtrés enfants.

 Composite
 Design pattern permettant de traiter un groupe d'objet de même instance de la même manière qu'un seul objet.
 Les objets sont organisés hierarchiquement.
 En pratique : chaque controle fenêtré comporte une collection d'autres controles fenetrés.
 Le rendu graphique d'un controle fenêtré fait intervenir la fonction qui gère le rendu graphique des sous-contrôles fenêtrés

 Etat graphique
 C'est l'ensemble des propriétés d'un contrôle fenêtré qui concourent à son aspect visuel.
 Si l'une de ces propriétés changent, c'est l'aspect visuel du contrôle fenêtré qui en est modifié, il doit donc être redessiné.
 La collection de contrôles fenêtrés font partit de l'état graphique de fait que la modification de l'état graphique d'un contrôle fenêtré
 provoque le changement de l'état graphique du contrôle parent.

 */

O2.createObject('H5UI', {
	data : {
		renderCount : 0,
		cdiCount : 0,
		pixelCount : 0,
		renderedList : {},
		buildCanvases : 0,
		destroyedCanvases : 0
	},
	canvasDispenser: [],
	handle : 0,
	
	font: {
		defaultFont: 'monospace',
		defaultSize: 12,
		defaultColor: '#000'
	},
	
	root: null,

	initRoot: function() {
		UI.root = document.getElementsByTagName('body')[0];
	},

	setRoot: function(oDomElement) { H5UI.root = oDomElement; },

	getCanvas: function () {
		var oCanvas = H5UI.canvasDispenser.pop();
		if (oCanvas) {
			return oCanvas;
		} else {
			return O876.CanvasFactory.getCanvas();
		}
	},

	recycleCanvas: function (oCanvas) {
		H5UI.canvasDispenser.push(oCanvas);
	}
});

/**
 * Controle fenètré graphique de base. Cette classe-souche possède les
 * propriétés et les méthodes de base permettant la représentation graphique
 * d'une zone rectangulaire de l'interface.
 */
O2.createClass('H5UI.WinControl', {
	_sClass : 'WinControl', // Nom indicatif de la classe
	_sName : '', // Nom indicatif du composant
	_nHandle : 0, // Numero de l'instance du controle
	_nIndex : 0, // Rang du controle parmis ses frères (autres enfants de son
	// parent)

	_oParent : null, // Control parent

	// Etat graphique
	_oCanvas : null, // Canvas privé du controle
	_oContext : null, // Contexte 2D du canvas
	_nWidth : 0, // Taille du controle
	_nHeight : 0, // Taille du controle
	_x : 0, // Position du controle
	_y : 0, // Position du controle
	_bInvalid : true, // Flag d'invalidation graphique

	// switches
	_bVisible : true, // Flag de visibilité

	// Controles enfants
	_aControls : null, // Tableau contenant les controles enfants
	_aInvalidControls : null, // Tableau indexant les controles devenus
	// invalides
	_aAlignedControls : null, // Tableau indexant les controles alignés
	// (position/taille change en fonction du
	// parent)
	_aHideControls : null, // Tableau indexant les controles qui passent de
	// l'état visible à invisible

	// évenements
	_oPointedControl : null, // Référence du controle sujet à un drag and
	// drop
	_oDraggedControl : null, // Référence au controle actuellement en cour de
	// drag
	_bDragHandler : false, // Le controle actuel est un gestionnaire de drag
	// and drop

	// CONSTRUCTEUR
	__construct : function() {
		this._nHandle = ++H5UI.handle;
		this._aControls = [];
		this._aInvalidControls = [];
		this._aAlignedControls = {
			center : []
		};
		this._aHideControls = [];
		this._buildSurface();
		this.invalidate();
	},

	// DESTRUCTEUR
	__destruct : function() {
		H5UI.recycleCanvas(this._oCanvas);
		this.clear();
		var aProps = [];
		for ( var i in this) {
			this[i] = null;
			aProps.push(i);
		}
		for (i = 0; i < aProps.length; i++) {
			delete this[aProps[i]];
		}
		aProps = null;
		H5UI.data.destroyedCanvases++;
	},

	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */

	/**
	 * Methode de construction du canvas
	 * 
	 */
	_buildSurface : function() {
		this._oCanvas = H5UI.getCanvas();
		H5UI.data.buildCanvases++;
		this._oContext = this._oCanvas.getContext('2d');
	},

	/**
	 * Fonction protégée de modification de propriété conduisant à une
	 * invalidation
	 * 
	 * @param sProperty
	 *            propritété à modifier
	 * @param xValue
	 *            nouvelle valeur
	 */
	_set : function(sProperty, xValue) {
		if (sProperty in this && this[sProperty] != xValue) {
			this[sProperty] = xValue;
			this.invalidate();
		}
	},

	/**
	 * Réaligne les controles alignés. Un contrôle aligné est un contrôle
	 * fenêtré dont la position dépent de la taille de son parent Pour chaque
	 * controle aligné, lance la méthode de placement correspondant à
	 * l'alignement. Cete méthode à pour préfixe "moveTo" Un réalignement
	 * intervient lorsque le controle parent change de place ou de taille.
	 */
	_realignControls : function() {
		var n, a, sDokoMethod;
		for ( var sDoko in this._aAlignedControls) {
			sDokoMethod = 'moveTo' + sDoko.substr(0, 1).toUpperCase() + sDoko.substr(1).toLowerCase();
			a = this._aAlignedControls[sDoko];
			for (n = 0; n < a.length; n++) {
				a[n][sDokoMethod]();
			}
		}
	},

	/**
	 * Permet de définir un control aligné * Utiliser plutôt align() la position
	 * et la taille des les controles alignés sont en fonction de la position et
	 * la taille de leur parent
	 * 
	 * @param oControl
	 *            controle à aligner
	 * @param nDoko
	 *            Où doit etre aligner le controle ('center')
	 */
	_registerAlignedControl : function(oControl, sDoko) {
		oControl.render();
		this._unregisterAlignedControl(oControl);
		this._pushArrayItem(this._aAlignedControls[sDoko], oControl);
		this._realignControls();
	},

	/**
	 * Supprime l'alignement forcé du controle
	 * 
	 * @param oControl
	 *            control, dont il faut supprimer l'alignement
	 */
	_unregisterAlignedControl : function(oControl) {
		for ( var sDoko in this._aAlignedControls) {
			this._removeArrayItem(this._aAlignedControls[sDoko], oControl);
		}
	},

	/**
	 * Supprime un élément d'un tableau à indice numérique séquentiel la
	 * fonction accepte un indice ou une instance si l'instance se trouve dans
	 * le tableau, on la vire et on décale les objet de manière à combler le
	 * trou
	 * 
	 * @param oArray
	 *            tableau
	 * @param xItem
	 *            indice ou instance de l'élément à virer
	 * @param sIndex
	 *            optionnel, clé de l'index à mettre à jour
	 */
	_removeArrayItem : function(oArray, xItem, sIndex) {
		var nItem;
		if (typeof xItem == 'object') {
			nItem = oArray.indexOf(xItem);
			if (nItem < 0) {
				return;
			}
		} else {
			nItem = xItem;
		}
		if (nItem == (oArray.length - 1)) {
			oArray.pop();
		} else {
			oArray[nItem] = oArray.pop();
			if (sIndex !== undefined) {
				oArray[nItem][sIndex] = nItem;
			}
		}
	},

	/**
	 * Méthode utilitaire de stockage d'un élément dans un tableau Permet de
	 * mettre à jour la propriété d'index de l'élément.
	 * 
	 * @param oArray
	 *            tableau
	 * @param oItem
	 *            instance de l'élément à ajouter au tableau
	 * @param sIndex
	 *            optionnel, clé de l'index à mettre à jour
	 * @return item
	 */
	_pushArrayItem : function(oArray, oItem, sIndex) {
		var nLen, nItem = oArray.indexOf(oItem);
		if (nItem < 0) {
			nLen = oArray.length;
			if (sIndex !== undefined) {
				oItem[sIndex] = nLen;
			}
			oArray.push(oItem);
			return nLen;
		} else {
			return nItem;
		}
	},

	/**
	 * Place un controle dans la liste des controle à cacher, suite à l'appel
	 * d'un hide()
	 * 
	 * @param oControl
	 *            control qui se cache
	 */
	_hideControl : function(oControl) {
		this._pushArrayItem(this._aHideControls, oControl);
	},

	/**
	 * Rend visible un control qui a été caché
	 * 
	 * @param oControl
	 *            controle à rendre visible
	 */
	_showControl : function(oControl) {
		this._removeArrayItem(this._aHideControls, oControl);
	},


	/**
	 * Transforme un objet d'arguments en tableau (spécificité webkit)
	 * 
	 * @param a
	 *            args
	 * @return array
	 */
	_argObjectToArray : function(a) {
		var i = '';
		var aArgs = [];
		if ('length' in a) {
			for (i = 0; i < a.length; i++) {
				aArgs.push(a[i]);
			}
			return aArgs;
		}
		for (i in a) {
			aArgs.push(a[i]);
		}
		return aArgs;
	},

	/**
	 * Appelle un method du parent
	 * 
	 * @param sMethod
	 *            nom de la methode à appeler
	 * @param autre
	 *            method
	 * @return retourn de la methode
	 */
	_callParentMethod : function() {
		if (this._oParent === null) {
			return null;
		}
		var aArgs = this._argObjectToArray(arguments);
		var sMethod = aArgs.shift();
		if (sMethod in this._oParent) {
			return this._oParent[sMethod].apply(this._oParent, aArgs);
		}
	},

	/**
	 * Appelle une methode si celle ci existe Utilisé lors d'appel d'évènement
	 * facultativement défini
	 */
	_callEvent : function() {
		var aArgs = this._argObjectToArray(arguments);
		var sMethod = aArgs.shift();
		if (sMethod in this) {
			return this[sMethod].apply(this, aArgs);
		}
	},

	/**
	 * Ajoute le control à la liste des controle invalide pour une optimisation
	 * du rendu
	 * 
	 * @param o
	 *            Controle à invalider
	 */
	_invalidateControl : function(o) {
		if (this._aInvalidControls.indexOf(o) < 0) {
			this._aInvalidControls.push(o);
		}
	},

	/**
	 * Dessine les controle enfant
	 */
	_renderControls : function() {
		var o;
		while (this._aInvalidControls.length) {
			o = this._aInvalidControls.shift();
			if (o._nHandle) {
				o.render();
			}
		}
	},

	/**
	 * Efface les controles caché de la surface
	 */
	_hideControls : function() {
		var o;
		while (this._aHideControls.length) {
			o = this._aHideControls.shift();
			this._oContext.clearRect(o._x, o._y, o.width(), o.height());
		}
	},





	////// RENDERING ////// RENDERING ////// RENDERING ////// RENDERING //////
	////// RENDERING ////// RENDERING ////// RENDERING ////// RENDERING //////
	////// RENDERING ////// RENDERING ////// RENDERING ////// RENDERING //////

	renderSelf : function() {
	},

	needRender : function() {
		return this._bVisible && (this._nWidth * this._nHeight) !== 0;
	},

	/**
	 * Redessine le contenu graphique du controle fenêtré l'extérieur de ce
	 * rectangle est normalment invisible et n'a aps besoin d'etre traité
	 */
	render : function() {
		var o;
		if (this._bInvalid) {
			this._hideControls();
			this.renderSelf();
			// repeindre les controle enfant
			this._renderControls();
			for (var i = 0; i < this._aControls.length; i++) {
				o = this._aControls[i];
				if (o.needRender()) {
					this._oContext.drawImage(o._oCanvas, o._x, o._y);
				}
			}
			this._bInvalid = false;
		}
	},

	////// SOURIS ////// SOURIS ////// SOURIS ////// SOURIS ////// SOURIS //////
	////// SOURIS ////// SOURIS ////// SOURIS ////// SOURIS ////// SOURIS //////
	////// SOURIS ////// SOURIS ////// SOURIS ////// SOURIS ////// SOURIS //////

	/**
	 * Gestion des évènement souris (click, mousein, mouseout, mousemove,
	 * mousedown, mouseup) La méthode exécute une methode déléguée "on....."
	 * puis transmet l'évènement à l'élément pointé par la souris
	 * 
	 * @param sEvent
	 *            nom de l'évènement (Click, MouseIn, MouseOut, MouseMove,
	 *            MouseDown, MouseUp)
	 * @param x,
	 *            y coordonnée de la souris lors de l'évènement
	 * @param nButton
	 *            bouton appuyé
	 */
	doMouseEvent : function(sEvent, x, y, nButton, oClicked) {
		if (this._oDraggedControl !== null) {
			this.doDragDropEvent(sEvent, x, y, nButton);
			return;
		}
		if (oClicked === undefined) {
			oClicked = this.peek(x, y);
		}
		if (oClicked != this._oPointedControl) {
			if (this._oPointedControl !== null) {
				this.doMouseEvent('mouseout', x, y, nButton,
						this._oPointedControl);
			}
			this._oPointedControl = oClicked;
			this.doMouseEvent('mousein', x, y, nButton, oClicked);
		}
		var oEvent;
		if (oClicked) {
			oEvent = {type: sEvent, target: oClicked, x: x - oClicked._x, y: y - oClicked._y, button: nButton, stop: false};
			oClicked.trigger(sEvent, oEvent);
			if (!oEvent.stop) {
				oClicked.doMouseEvent(sEvent, x - oClicked._x, y - oClicked._y,
					nButton);
			}
		} else {
			oEvent = {type: sEvent, target: this, x: x, y: y, button: nButton, stop: false};
			this.trigger(sEvent, this, x, y, nButton);
		}
	},
	
	/**
	 * Renvoie la position relative du controle spécifié Intervien lors du drag
	 * n drop
	 */
	getControlRelativePosition : function(oControl) {
		var oPos = {
			x : 0,
			y : 0
		};
		while (oControl != this && oControl !== null) {
			oPos.x += oControl._x;
			oPos.y += oControl._y;
			oControl = oControl._oParent;
		}
		return oPos;
	},

	doDragDropEvent : function(sEvent, x, y, nButton) {
		var oPos = this.getControlRelativePosition(this._oDraggedControl);
		switch (sEvent) {
		case 'mousemove':
			this._oDraggedControl._callEvent('onDragging', x - oPos.x, y - oPos.y, nButton);
			break;

		case 'mouseup': // fin du drag n drop
			this._oDraggedControl._callEvent('onEndDragging', x - oPos.x, y - oPos.y, nButton);
			this._oDraggedControl = null;
			break;
		}
	},

	/**
	 * Initialise le drag n drop appelle le gestionnaire de DragDrop, s'il n'y
	 * en a pas, appelle le parent
	 */
	startDragObject : function(oTarget, x, y, b) {
		if (this._bDragHandler) {
			this._oDraggedControl = oTarget;
			oTarget._callEvent('onStartDragging', x, y, b);
		} else {
			this._callParentMethod('startDragObject', oTarget, x, y, b);
		}
	},


	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */

	prop: function(sProp, xValue) {
		if (xValue !== undefined) {
			this._set(sProp, xValue);
			return this;
		} else {
			return this[sProp];
		}
	},

	/**
	 * Renvoie la loongeur du controle en pixels pour changer la longeur
	 * utiliser setSize()
	 * 
	 * @return int
	 */
	width : function(w) {
		return this.prop('_nWidth', w);
	},

	/**
	 * Renvoie la hauteur du controle en pixels pour changer la hauteur utiliser
	 * setSize()
	 * 
	 * @return int
	 */
	height : function(h) {
		return this.prop('_nHeight', h);
	},

	/**
	 * Renvoie l'instance du controle parent
	 * 
	 * @return H5UI.WinControl
	 */
	getParent : function() {
		return this._oParent;
	},

	/**
	 * Ajoute un controle enfant et renvoie l'instance de ce control
	 * nouvellement linké
	 * 
	 * @param o
	 *            Controle enfant à ajouter
	 * @return H5UI.WinControl
	 */
	linkControl : function(o) {
		o._nIndex = this._aControls.length;
		this._aControls.push(o);
		o._oParent = this;
		o.invalidate();
		return o;
	},

	/**
	 * Défini quel controle sera au sommet de la pile des autre contrôles
	 * il apparaitra par dessus tous les autres
	 * @param o Objet controle
	 */
	setTopControl : function(o) {
		var nIndex = this._aControls.indexOf(o);
		var nCount = this.getControlCount();
		if (nIndex >= 0) {
			for (var i = nIndex; i < (nCount - 1); i++) {
				this._aControls[i] = this._aControls[i + 1];
				this._aControls[i]._set('_nIndex', i);
			}
			this._aControls[nCount - 1] = o;
			o._set('_nIndex', i);
		}
	},

	/** 
	 * se placer au dessus des autres controles
	 * fait appel au top du client
	 */
	top : function() {
		this._callParentMethod('setTopControl', this);
	},

	/**
	 * Supprime un controle et appelle le destructeur de ce controle
	 * 
	 * @param n
	 *            controle à virer
	 */
	unlinkControl : function(n) {
		var oControl;
		if (n >= this._aControls.length) {
			throw new Error('out of bounds: ' + n.toString() + ' - range is 0 to ' + this._aControls.length);
		}
		oControl = this._aControls[n];
		this._removeArrayItem(this._aControls, n, '_nIndex');
		this._removeArrayItem(this._aInvalidControls, oControl);
		for ( var sAlign in this._aAlignedControls) {
			this._removeArrayItem(this._aAlignedControls[sAlign], oControl);
		}
		this._removeArrayItem(this._aHideControls, oControl);
		/*
		 * if (n == (this._aControls.length - 1)) { oControl =
		 * this._aControls.pop(); } else { oControl = this._aControls[n];
		 * this._aControls[n] = this._aControls.pop();
		 * this._aControls[n]._nIndex = n; }
		 */
		oControl.__destruct();
		this.invalidate();
	},


	/**
	 *  Détruit tous les controles enfant
	 */
	clear : function() {
		while (this.hasControls()) {
			this.unlinkControl(0);
		}
	},

	/**
	 * Autodestruction d'un objet
	 */
	free : function() {
		this.callParentMethod('unlinkControl', this._nIndex);
	},

	/**
	 * Renvoie le controle de rang n
	 * 
	 * @param n
	 * @exception "out
	 *                of bounds"
	 * @return controle au rang n
	 */
	getControl : function(n) {
		if (n >= this._aControls.length) {
			throw new Error('out of bounds: ' + n.toString() + ' - range is 0 to ' + this._aControls.length);
		}
		return this._aControls[n];
	},

	/**
	 * Renvoie le nombre de controles
	 * 
	 * @return int
	 */
	getControlCount : function() {
		if (this._aControls) {
			return this._aControls.length;
		} else {
			return 0;
		}
	},

	/**
	 * Alignement d'un controle fenetré
	 * 
	 * @param sDoko
	 *            position du controle à maintenir (pour l'instant uniquement
	 *            'center') si le paramètre est omis, l'alignement du controle
	 *            est supprimé
	 */
	align : function(sDoko) {
		if (sDoko in this._aAlignedControls) {
			this._callParentMethod('_registerAlignedControl', this, sDoko);
		} else {
			this._callParentMethod('_unregisterAlignedControl', this);
		}
	},

	/**
	 * Changement de taille du controle
	 * 
	 * @param w
	 *            taille x
	 * @param h
	 *            taille y
	 */
	setSize : function(w, h) {
		if (w != this.width() || h != this.height()) {
			this._nWidth = this._oCanvas.width = w;
			this._nHeight = this._oCanvas.height = h;
			this._realignControls();
			this.invalidate();
		}
	},

	/**
	 * Positionne le controle à la position spécifiée
	 * 
	 * @param x
	 * @param y
	 */
	moveTo : function(x, y) {
		if (x != this._x || y != this._y) {
			this._x = x;
			this._y = y;
			this._realignControls();
			this.invalidate();
		}
	},

	/**
	 * Déplace le control au centre de son parent Le controle conserve sa
	 * taille, seule sa position change Cette methode est exploitée par le
	 * système d'alignement des control mais peut etre utilisé ponctuellement
	 * pour centrer un controle.
	 */
	moveToCenter : function() {
		var p = this.getParent();
		if (p) {
			this.moveTo(((p.width() - this.width()) >> 1), ((p.height() - this.height()) >> 1));
		}
	},

	/**
	 * Cache le controle
	 */
	hide : function() {
		if (this._bVisible) {
			this._bVisible = false;
			this._callParentMethod('_hideControl', this);
			this.invalidate();
		}
	},

	/**
	 * Affiche le controle
	 */
	show : function() {
		if (!this._bVisible) {
			this._bVisible = true;
			this.invalidate();
		}
	},

	isVisible: function() {
		return this._bVisible;
	},

	/**
	 * Renvoie la référence au context du canvas
	 * 
	 * @return Object HTMLCanvasContext2d
	 */
	getSurface : function() {
		if (this._oContext === null) {
			this._oContext = this._oCanvas.getContext('2d');
		}
		return this._oContext;
	},

	/**
	 * Renvoie la surface du parent
	 * 
	 * @return Object HTMLCanvasContext2d
	 */
	getParentSurface : function() {
		return this._callParentMethod('getSurface');
	},

	/**
	 * Renvoie la référence du controle pointé par les coordonées spécifiées
	 * 
	 * @param x,
	 *            y coordonnées
	 */
	peek : function(x, y) {
		var o, ox, oy, w, h;
		if (this._aControls) {
			for (var i = this._aControls.length - 1; i >= 0; i--) {
				o = this._aControls[i];
				ox = o._x;
				oy = o._y;
				w = o.width();
				h = o.height();
				if (x >= ox && y >= oy && x < (ox + w) && y < (oy + h) && o._bVisible) {
					return o;
				}
			}
		}
		return null;
	},

	/**
	 * Démarre le processus de drag and drop
	 * 
	 * @param x,
	 *            y position de la souris
	 * @param b
	 *            bouttons de la souris enfoncé
	 */
	dragStart : function(x, y, b) {
		this._callParentMethod('startDragObject', this, x, y, b);
	},

	/**
	 * Invalide l'état graphique, forcant le controle à se redessiner
	 */
	invalidate : function() {
		this._bInvalid = true;
		this._callParentMethod('invalidate');
		this._callParentMethod('_invalidateControl', this);
	},

	/**
	 * Renvoie true si le controle possède des enfants
	 * 
	 * @return bool
	 */
	hasControls : function() {
		return this._aControls !== null && this._aControls.length > 0;
	} 
});


O2.mixin(H5UI.WinControl, O876.Mixin.Events);
O2.mixin(H5UI.WinControl, O876.Mixin.Data);

/**
 * @class O876.Ambiance
 * This class will manage sound ambiance events
 * It works with O876.SoundSystem
 */
O2.createClass('O876.Ambiance', {
	
	_nNextTime: 0,
	_bValid: false,

	period: 0,
	variation: 0,
	sounds: null,

	getRandomSound: function() {
		return this.sounds[Math.random() * this.sounds.length | 0];
	},

	load: function(c) {
		this._bValid = true;
		if (c.period <= 0) {
			this._bValid = false;
		}
		if ((!Array.isArray(c.sounds)) || (c.sounds.length == 0)) {
			this._bValid = false;
		}
		if (c.variation < 0) {
			this._bValid = false;
		}
		if (!this._bValid) {
			return false;
		}
		this.period = c.period;
		this.variation = c.variation;
		this.sounds = c.sounds;
		return true;
	},

	isValid: function() {
		return this._bValid;
	},

	nextTime: function() {
		this._nNextTime += this.period + Math.random() * this.variation;
	},

	process: function(nTime) {
		if (!this.isValid()) {
			return;
		}
		if (this.nNextTime === 0) {
			this.nNextTime = nTime;
			this.nextTime();
		}
		if (nTime >= this._nNextTime) {
			this.trigger('sound', { 
				sound: this.getRandomSound(),
				time: this._nNextTime
			});
			this._nNextTime += this.period + Math.random() * this.variation;
		}
	}
});

O2.mixin(O876.Ambiance, O876.Mixin.Events);
O2.createClass('O876.Astar.Point', {
	x : 0,
	y : 0,
	__construct : function(x, y) {
		this.x = x;
		this.y = y;
	}
});

O2.createClass('O876.Astar.Nood', {
	fGCost : 0.0,
	fHCost : 0.0,
	fFCost : 0.0,
	oParent : null,
	oPos : null,

	__construct : function() {
		this.oParent = new O876.Astar.Point(0, 0);
		this.oPos = new O876.Astar.Point(0, 0);
	},

	isRoot : function() {
		return this.oParent.x == this.oPos.x && this.oParent.y == this.oPos.y;
	}
});

O2.createClass('O876.Astar.NoodList', {
	aList : null,

	__construct : function() {
		this.aList = {};
	},

	add : function(oNood) {
		this.set(oNood.oPos.x, oNood.oPos.y, oNood);
	},

	set : function(x, y, oNood) {
		this.aList[this.getKey(x, y)] = oNood;
	},

	count : function() {
		var n = 0, i = '';
		for (i in this.aList) {
			n++;
		}
		return n;
	},

	exists : function(x, y) {
		if (this.getKey(x, y) in this.aList) {
			return true;
		} else {
			return false;
		}
	},

	getKey : function(x, y) {
		return x.toString() + '__' + y.toString();
	},

	get : function(x, y) {
		if (this.exists(x, y)) {
			return this.aList[this.getKey(x, y)];
		} else {
			return null;
		}
	},

	del : function(x, y) {
		delete this.aList[this.getKey(x, y)];
	},

	empty : function() {
		var i = '';
		for (i in this.aList) {
			return false;
		}
		return true;
	}
});


O2.createClass('O876.Astar.Grid', {
	bUseDiagonals : false,
	MAX_ITERATIONS : 2048,
	nIterations : 0,
	aTab : null,
	nWidth : 0,
	nHeight : 0,
	oOpList : null,
	oClList : null,
	aPath : null,
	xLast : 0,
	yLast : 0,
	nLastDir : 0,

	GRID_BLOCK_WALKABLE: 0,

	init : function(c) {
		if ('grid' in c) {
			this.aTab = c.grid;
			this.nHeight = c.grid.length;
			this.nWidth = c.grid[0].length;
		}
		if ('diagonals' in c) {
			this.bUseDiagonals = c.diagonals;
		}
		if ('max' in c) {
			this.MAX_ITERATIONS = c.max;
		}
		if ('walkable' in c) {
			this.GRID_BLOCK_WALKABLE = c.walkable;
		}
	},

	reset : function() {
		this.oOpList = new O876.Astar.NoodList();
		this.oClList = new O876.Astar.NoodList();
		this.aPath = [];
		this.nIterations = 0;
	},

	distance : function(x1, y1, x2, y2) {
		var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		var r = {
			distance: d,
			from: {x: x1, y: y1},
			to: {x: x2, y: y2}
		};
		this.trigger('distance', r);
		return r.distance;
	},

	setCell : function(x, y, n) {
		if (this.aTab[y] !== undefined && this.aTab[y][x] !== undefined) {
			this.aTab[y][x] = n;
		} else {
			throw new Error(
					'O876.Astar: writing tile out of Grid: ' + x + ', ' + y);
		}
	},

	getCell : function(x, y) {
		if (this.aTab[y]) {
			if (x < this.aTab[y].length) {
				return this.aTab[y][x];
			}
		}
		throw new Error('O876.Astar: read tile out of Grid: ' + x + ', ' + y);
	},

	cell: function(x, y, v) {
		if (v === undefined) {
			return this.getCell(x, y);
		} else {
			this.setCell(x, y, v);
			return this;
		}
	},

	isCellWalkable : function(x, y) {
		try {
			var r = {
				walkable: this.getCell(x, y) == this.GRID_BLOCK_WALKABLE,
				cell: {
					x: x, 
					y: y
				}
			};
			this.trigger('walkable', r);
			return r.walkable;
		} catch (e) {
			return false;
		}
	},

	// Transferer un node de la liste ouverte vers la liste fermee
	closeNood : function(x, y) {
		var n = this.oOpList.get(x, y);
		if (n) {
			this.oClList.set(x, y, n);
			this.oOpList.del(x, y);
		}
	},

	addAdjacent : function(x, y, xArrivee, yArrivee) {
		var i, j;
		var i0, j0;
		var oTmp;
		for (i0 = -1; i0 <= 1; i0++) {
			i = x + i0;
			if ((i < 0) || (i >= this.nWidth)) {
				continue;
			}
			for (j0 = -1; j0 <= 1; j0++) {
				if (!this.bUseDiagonals && (j0 * i0) !== 0) {
					continue;
				}
				j = y + j0;
				if ((j < 0) || (j >= this.nHeight)) {
					continue;
				}
				if ((i == x) && (j == y)) {
					continue;
				}
				if (!this.isCellWalkable(i, j)) {
					continue;
				}

				if (!this.oClList.exists(i, j)) {
					oTmp = new O876.Astar.Nood();
					oTmp.fGCost = this.oClList.get(x, y).fGCost	+ this.distance(i, j, x, y);
					oTmp.fHCost = this.distance(i, j, xArrivee,	yArrivee);
					oTmp.fFCost = oTmp.fGCost + oTmp.fHCost;
					oTmp.oPos = new O876.Astar.Point(i, j);
					oTmp.oParent = new O876.Astar.Point(x, y);

					if (this.oOpList.exists(i, j)) {
						if (oTmp.fFCost < this.oOpList.get(i, j).fFCost) {
							this.oOpList.set(i, j, oTmp);
						}
					} else {
						this.oOpList.set(i, j, oTmp);
					}
				}
			}
		}
	},

	// Recherche le meilleur noeud de la liste et le renvoi
	bestNood : function(oList) {
		var oBest = null;
		var oNood;
		var iNood = '';

		for (iNood in oList.aList) {
			oNood = oList.aList[iNood];
			if (oBest === null) {
				oBest = oNood;
			} else if (oNood.fFCost < oBest.fFCost) {
				oBest = oNood;
			}
		}
		return oBest;
	},

	find : function(xFrom, yFrom, xTo, yTo) {
		this.reset();
		var oBest;
		var oDepart = new O876.Astar.Nood();
		oDepart.oPos = new O876.Astar.Point(xFrom, yFrom);
		oDepart.oParent = new O876.Astar.Point(xFrom, yFrom);
		var xCurrent = xFrom;
		var yCurrent = yFrom;
		this.oOpList.add(oDepart);
		this.closeNood(xCurrent, yCurrent);
		this.addAdjacent(xCurrent, yCurrent, xTo, yTo);

		var iIter = 0, MAX = this.MAX_ITERATIONS;

		while (!((xCurrent == xTo) && (yCurrent == yTo)) && (!this.oOpList.empty())) {
			oBest = this.bestNood(this.oOpList);
			xCurrent = oBest.oPos.x;
			yCurrent = oBest.oPos.y;
			this.closeNood(xCurrent, yCurrent);
			this.addAdjacent(oBest.oPos.x, oBest.oPos.y, xTo, yTo);
			if (++iIter > MAX) {
				throw new Error('O876.Astar: too much iterations');
			}
		}
		if (this.oOpList.empty() && !((xCurrent == xTo) && (yCurrent == yTo))) {
			 throw new Error('O876.Astar: no path to destination');
		}
		this.nIterations = iIter;
		this.buildPath(xTo, yTo);
		return this.aPath;
	},

	buildPath : function(xTo, yTo) {
		var oCursor = this.oClList.get(xTo, yTo);
		if (oCursor !== null) {
			while (!oCursor.isRoot()) {
				this.aPath.unshift({
					x: oCursor.oPos.x, 
					y: oCursor.oPos.y
				});
				oCursor = this.oClList.get(oCursor.oParent.x, oCursor.oParent.y);
			}
		}
	}
});


O2.mixin(O876.Astar.Grid, O876.Mixin.Events);
/**
 * @class O876.Auto.State
 * A simple state machine that triggers events.
 * "enter" when enter a state
 * "run" when running/looping a state
 * "exit" when exiting a state
 * "state" when a state is parsed from an input plain-object
 * "trans" when a transition is parsed from an input plain-object
 *
 */
O2.createClass('O876.Auto.State', {

	_name: '',
	_trans: null,
	_current: null,
	_start: null,

	__construct: function() {
		this._trans = [];
	},

	run: function() {
		this._current = this._current.process();
	},

	reset: function() {
		this._current = this._start;
	},
	
	/**
	 * Adds a new transition
	 */
	trans: function(t) {
		if (t !== undefined) {
			this._trans.push(t);
			return this;
		} else {
			return this._trans;
		}
	},

	process: function() {
		// runs the states
		if (this.name()) {
			this.trigger('run', this);
		}
		// check all transition associated with the current states
		var oState = this;
		this._trans.some(function(t) {
			if (t.pass(this)) {
				this.trigger('exit', this);
				oState = t.state();
				oState.trigger('enter', oState);
				return true;
			} else {
				return false;
			}
		}, this);
		return oState;
	},
	
	
	parse: function(oData, oEvents) {
		var sState, oState, oStates = {}, sTrans, oTrans, sTest;
		this._start = null;
		for (sState in oData) {
			if (oData.hasOwnProperty(sState)) {
                oState = new O876.Auto.State();
                if (this._start === null) {
                    this._start = oState;
                }
                oState.name(sState);
                oStates[sState] = oState;
                if (oEvents && 'exit' in oEvents) {
                    oState.on('exit', oEvents.exit);
                }
                if (oEvents && 'enter' in oEvents) {
                    oState.on('enter', oEvents.enter);
                }
                if (oEvents && 'run' in oEvents) {
                    oState.on('run', oEvents.run);
                }
                this.trigger('state', oState);
            }
		}
		for (sState in oData) {
			if (oData.hasOwnProperty(sState)) {
                oState = oData[sState];
                for (sTrans in oState) {
                    if ((sTrans in oStates) && oState.hasOwnProperty(sTrans)) {
                        sTest = oState[sTrans];
                        oTrans = new O876.Auto.Trans();
                        if (oEvents && 'test' in oEvents) {
                            oTrans.on('test', oEvents.test);
                        }
                        oTrans.test(sTest).state(oStates[sTrans]);
                        oStates[sState].trans(oTrans);
                        this.trigger('trans', oTrans);
                    } else {
                        throw new Error('unknown next-state "' + sTrans + '" in state "' + sState + '"');
                    }
                }
            }
		}
		this.reset();
		return oStates;
	}
});

O2.mixin(O876.Auto.State, O876.Mixin.Prop);
O2.mixin(O876.Auto.State, O876.Mixin.Events);

/**
 * @class O876.Auto.Trans
 * Transition for the Automaton
 * This class is a Transition.
 * A test is done, and if a "true" boolean value is return then
 * the automaton switches to another State
 */

O2.createClass('O876.Auto.Trans', {
	_test: null,
	_state: null,
	
	/**
	 * Returns true if all tests pass
	 * @return boolean
	 */
	pass: function(oState) {
		var ev = {
			state: oState,
			test: this._test,
			result: null
		};
		this.trigger('test', ev);
		return !!ev.result;
	}
});


O2.mixin(O876.Auto.Trans, O876.Mixin.Prop);
O2.mixin(O876.Auto.Trans, O876.Mixin.Events);

/**
 * This class implements the bresenham algorithm
 * and extend its use for other purpose than drawing pixel lines
 * good to GIT
 */
O2.createClass('O876.Bresenham', {
	/**
	 * This function will virtually draw points along a line
	 * and will call back a plot function. 
	 * The line will start at x0, y0 and will end at x1, y1
	 * Each time a points is "drawn" a callback is done 
	 * if the callback returns false, the line function will stop and return false
	 * else the line function will return an array of plots
	 * @param x0 starting point x
	 * @param y0 starting point y
	 * @param x1 ending point x
	 * @param y1 ending point y
	 * @param pCallback a plot function of type function(x, y, n) { return bool; }
	 * avec x, y les coordonnée du point et n le numéro duj point
	 * @returns {Boolean} false if the fonction has been canceled
	 */
	line: function(x0, y0, x1, y1, pCallback) {
		x0 |= 0;
		y0 |= 0;
		x1 |= 0;
		y1 |= 0;
		var dx = Math.abs(x1 - x0);
		var dy = Math.abs(y1 - y0);
		var sx = (x0 < x1) ? 1 : -1;
		var sy = (y0 < y1) ? 1 : -1;
		var err = dx - dy;
		var e2;
		var n = 0;
		while (true) {
			if (pCallback) {
				if (pCallback(x0, y0, n) === false) {
					return false;
				}
			}
			if (x0 == x1 && y0 == y1) {
				break;
			}
			e2 = err << 1;
			if (e2 > -dy) {
				err -= dy;
				x0 += sx;
			}
			if (e2 < dx) {
				err += dx;
				y0 += sy;
			}
			++n;
		}
		return true;
	}
});

/**
 * good to GIT
 */

O2.createObject('O876.Browser', {
	
	STRINGS: {
		en: {
			wontrun: 'The game won\'t run because some HTML 5 features are not supported by this browser',
			install: 'You should install the latest version of one of these browsers : <b>Firefox</b>, <b>Chrome</b> or <b>Chromium</b>.',
			legend: '(the red colored features are not supported by your browser)'
		},
		
		fr: {
			wontrun: 'Le jeu ne peut pas se lancer, car certaines fonctionnalités HTML 5 ne sont pas supportées par votre navigateur',
			install: 'Vous devriez installer la dernière version de l\'un de ces navigateurs : <b>Firefox</b>, <b>Chrome</b> ou <b>Chromium</b>.',
			legend: '(les fonctionnalités marquées en rouge ne sont pas supportées par votre navigateur)'
		}
	},
	
	LANGUAGE: 'en',
	
	isOpera: function() {
		return !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
			// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	},
	
	isFirefox: function() {
		return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
	},
	
	isSafari: function() {
		return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
			// At least Safari 3+: "[object HTMLElementConstructor]"
	},
	
	isChrome: function() {
		return !!window.chrome && !O876.Browser.isOpera();              // Chrome 1+
	},
	
	isIE: function() {
		return /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	},
	
	/**
	 * Return the lists of detected browsers
	 */
	getDetectedBrowserList: function() {
		return (['Opera', 'Firefox', 'Safari', 'Chrome', 'IE']).filter(function(f) {
			return O876.Browser['is' + f]();
		});
	},

	/**
	 * Tests if all specified HTML5 feature are supported by the browser
	 * if no parameter is set, tests all the HTML 5 feature
	 * the returned objet has a 'html' field to be displayed
	 * @param aRequire array of string
	 * @return object
	 */
	getHTML5Status: function(aRequired) {
		var oReport = {
			canvas: 'HTMLCanvasElement' in window,
			audio: 'HTMLAudioElement' in window,
			fullscreen: ('webkitIsFullScreen' in document) || ('mozFullScreen' in document),
			animation: 'requestAnimationFrame' in window,
			performance: ('performance' in window) && ('now' in performance),
			pointerlock: ('pointerLockElement' in document) || ('mozPointerLockElement' in document),
			uint32array: 'Uint32Array' in window
		};
		var i, b = true;
		var aFeats = ['<table><tbody>'];
		
		function testFeature(iFeat) {
			b = b && oReport[iFeat];
			aFeats.push('<tr><td style="color: ' + (oReport[iFeat] ? '#080' : '#800') + '">' + (oReport[iFeat] ? '✔' : '✖') + '</td><td' + (oReport[iFeat] ? '' : ' style="color: #F88"') + '>' + iFeat + '</td></tr>');
		}
		
		if (aRequired) {
			aRequired.forEach(testFeature);
		} else {
			for (i in oReport) {
				testFeature(i);
			}
		}
		aFeats.push('</tbody></table>');
		oReport.all = b;
		oReport.html = '<div>' + aFeats.join('') + '</div>';
		oReport.browser = O876.Browser.getDetectedBrowserList();
		return oReport;
	},
	
	checkHTML5: function(sTitle) {
		if (!sTitle) {
			sTitle = 'HTML 5 Application';
		}
		var oHTML5 = O876.Browser.getHTML5Status();
		if (!oHTML5.all) {
			var m = O876.Browser.STRINGS[O876.Browser.LANGUAGE];
			document.body.innerHTML = '<div style="color: #AAA; font-family: monospace; background-color: black; border: solid 4px #666; padding: 8px">' +
				'<h1>' + sTitle + '</h1>' +
				'<p>' + m.wontrun + ' (' + oHTML5.browser.join(', ') + ').<br/>' +
				m.install + '</p>' + oHTML5.html + 
				'<p style="color: #888; font-style: italic">' + m.legend + '</p></div>'; 
			return false;
		}
		return oHTML5.all;
	},
});

/**
 * Canvas factory
 * @class O876.CanvasFactory
 */
O2.createObject('O876.CanvasFactory', {


	defaultImageSmoothing: false,

	/**
	 * Create a new canvas
     * @param w {int} width of the new canvas
     * @param h {int} height of the new canvas
	 * @param bImageSmoothing {boolean} default : true. if true, the new canvas will be smooth when resized
	 * @return {*}
	 */
	getCanvas: function(w, h, bImageSmoothing) {
		let oCanvas = document.createElement('canvas');
		let oContext = oCanvas.getContext('2d');
		if (w && h) {
			oCanvas.width = w;
			oCanvas.height = h;
		}
		if (bImageSmoothing === undefined) {
			bImageSmoothing = O876.CanvasFactory.defaultImageSmoothing;
		}
		O876.CanvasFactory.setImageSmoothing(oContext, bImageSmoothing);
		if (bImageSmoothing) {
			oCanvas.style.imageRendering = 'pixelated';
		}
		return oCanvas;
	},
	
	/**
	 * Set canvas image smoothing flag on or off
	 * @param oContext HTMLContext2D
	 * @param b {boolean} on = smoothing on // false = smoothing off
	 */
	setImageSmoothing: function(oContext, b) {
		oContext.imageSmoothingEnabled = b;
	},
	
	getImageSmoothing: function(oContext) {
		return oContext.imageSmoothingEnabled;
	},

	/**
	 * Clones a canvas into a new one
	 * @param oCanvas {HTMLCanvasElement} to be cloned
	 * @return  HTMLCanvasElement
	 */
	cloneCanvas: function(oCanvas) {
		let c = O876.CanvasFactory.getCanvas(
			oCanvas.width, 
			oCanvas.height, 
			O876.CanvasFactory.getImageSmoothing(oCanvas.getContext('2d'))
		);
		c.getContext('2d').drawImage(oCanvas, 0, 0);
		return c;
	}
});

/** Interface de controle des mobile 
 * O876 Raycaster project
 * @class O876.Easing
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger un mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 * good to GIT
 */
O2.createClass('O876.Easing', {	
	xStart: 0,
	xEnd: 0,
    /**
	 * @property x {number}
     */
	x: 0,
	nTime: 0,
	iTime: 0,
	fWeight: 1,
	pFunction: null,

    /**
	 * Will define de starting value
     * @param x {number}
     * @returns {O876.Easing}
     */
	from: function(x) {
		this.xStart = this.x = x;
		return this;
	},

    /**
	 * Will define the ending value
     * @param x {number}
     * @returns {O876.Easing}
     */
	to: function(x) {
		this.xEnd = x;
		return this;
	},

    /**
	 * Will define the duration of the transition
     * @param t {number} arbitrary unit
     * @returns {O876.Easing}
     */
	during: function(t) {
		this.nTime = t;
		this.iTime = 0;
		return this;
	},

	/**
	 * Définition de la fonction d'Easing
	 * @param string sFunction fonction à choisir parmi :
	 * linear : mouvement lineaire uniforme
	 * smoothstep : accelération et déccelération douce
	 * smoothstepX2 : accelération et déccelération moyenne
	 * smoothstepX3 : accelération et déccelération brutale
	 * squareAccel : vitesse 0 à T-0 puis uniquement accelération 
	 * squareDeccel : vitesse max à T-0 puis uniquement deccelération
	 * cubeAccel : vitesse 0 à T-0 puis uniquement accelération brutale 
	 * cubeDeccel : vitesse max à T-0 puis uniquement deccelération brutale
	 * sine : accelération et deccelération brutal, vitesse nulle à mi chemin
	 * cosine : accelération et deccelération selon le cosinus, vitesse max à mi chemin
	 * weightAverage : ... me rapelle plus 
	 */
	use: function(xFunction) {
		switch (typeof xFunction) {
			case 'string':
				this.pFunction = this['_' + xFunction].bind(this);
			break;

			case 'function':
				this.pFunction = xFunction;
			break;

			default:
				throw new Error('unknown function type');
		}
		return this;
	},
	
	/**
	 * Calcule les coordonnée pour le temps t
	 * mets à jour les coordonnée x et y de l'objets
	 * @param int t temps
	 * si "t" est indéfini, utilise le timer interne 
	 */
	next: function(t) {
		if (t === undefined) {
			t = this.iTime = Math.min(this.nTime, this.iTime + 1);
		} else {
			t = this.iTime = Math.min(this.nTime, t);
		}
		var p = this.pFunction;
		if (typeof p !== 'function') {
			throw new Error('easing function is invalid : ' + p);
		}
		var v = p(t / this.nTime);
		this.x = this.xEnd * v + (this.xStart * (1 - v));
		return this;
	},

	val: function() {
		return this.x;
	},

	over: function() {
		return this.iTime >= this.nTime;
	},

	_linear: function(v) {
		return v;
	},
	
	_smoothstep: function(v) {
		return v * v * (3 - 2 * v);
	},
	
	_smoothstepX2: function(v) {
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	_smoothstepX3: function(v) {
		v = v * v * (3 - 2 * v);
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	_squareAccel: function(v) {
		return v * v;
	},
	
	_squareDeccel: function(v) {
		return 1 - (1 - v) * (1 - v);
	},
	
	_cubeAccel: function(v) {
		return v * v * v;
	},
	
	_cubeDeccel: function(v) {
		return 1 - (1 - v) * (1 - v) * (1 - v);
	},
	
	_cubeInOut: function(v) {
		if (v < 0.5) {
			v = 2 * v;
			return v * v * v;
		} else {
			v = (1 - v) * 2;
			return v * v * v;
		}
	},
	
	_sine: function(v) {
		return Math.sin(v * Math.PI / 2);
	},
	
	_cosine: function(v) {
		return 0.5 - Math.cos(-v * Math.PI) * 0.5;
	},
	
	_weightAverage: function(v) {
		return ((v * (this.nTime - 1)) + this.fWeight) / this.nTime;
	},
	
	_quinticBezier: function(v) {
		var ts = v * this.nTime;
		var tc = ts * this.nTime;
		return 4 * tc - 9 * ts + 6 * v;
	}
});

/**
 * An implementation of the Mediator Design Pattern
 * This pattern allows application to communicate with plugins
 * The Client Application instanciate Mediator
 * The plugins are extends of the Plugin Class
 *
 * good to GIT
 */
 
 

O2.createClass('O876.Mediator.Plugin', {
	_oMediator: null,
	_NAME: '',
	
	getName: function() {
		return this._NAME;
	},
	
	register: function(sType) {
		this._oMediator.registerPluginSignal(sType, this);
	},
	
	unregister: function(sType) {
		this._oMediator.unregisterPluginSignal(sType, this);
	},

	setMediator: function(m) {
		this._oMediator = m;
	},
	
	getPlugin: function(s) {
		return this._oMediator.getPlugin(s);
	},
	
	sendSignal: function() {
		var aArgs = Array.prototype.slice.call(arguments, 0);
		return this._oMediator.sendPluginSignal.apply(this._oMediator, aArgs);
	}
});

O2.createClass('O876.Mediator.Mediator', {

	_oPlugins: null,
	_oRegister: null,
	_oApplication: null,
	
	/**
	 * Constructeur
	 */
	__construct: function() {
		this._oPlugins = {};
		this._oRegister = {};
	},
	
	
	setApplication: function(a) {
		return this._oApplication = a;		
	},
	
	getApplication: function() {
		return this._oApplication;		
	},
	
	
	
	/**
	 * Ajoute un plugin
	 * @param oPlugin instance du plugin ajouté
	 * @return instance du plugin ajouté
	 */
	addPlugin: function(oPlugin) {
		if (!('getName' in oPlugin)) {
			throw new Error('O876.Mediator : anonymous plugin');
		}
		var sName = oPlugin.getName();
		if (sName === '') {
			throw new Error('O876.Mediator : undefined plugin name');
		}
		if (!('setMediator' in oPlugin)) {
			throw new Error('O876.Mediator : no Mediator setter in plugin ' + sName);
		}
		if (sName in this._oPlugins) {
			throw new Error('O876.Mediator : duplicate plugin entry ' + sName);
		}
		this._oPlugins[sName] = oPlugin;
		oPlugin.setMediator(this);
		if ('init' in oPlugin) {
			oPlugin.init();
		}
		return oPlugin;
	},
	
	removePlugin: function(x) {
		if (typeof x != 'string') {
			x = x.getName();
		}
		this._oPlugins[x] = null;
	},
	
	/**
	 * Renvoie le plugin dont le nom est spécifié
	 * Renvoie undefined si pas trouvé
	 * @param sName string
	 * @return instance de plugin
	 */
	getPlugin: function(sName) {
		return this._oPlugins[sName];
	},
	
	/**
	 * Enregistrer un plugin pour qu'il réagisse aux signaux de type spécifié
	 * @param sSignal type de signal
	 * @param oPlugin plugin concerné
	 */
	registerPluginSignal: function(sSignal, oPlugin) {
		if (this._oRegister === null) {
			this._oRegister = {};
		}
		if (sSignal in oPlugin) {
			if (!(sSignal in this._oRegister)) {
				this._oRegister[sSignal] = [];
			}
			if (this._oRegister[sSignal].indexOf(oPlugin) < 0) {
				this._oRegister[sSignal].push(oPlugin);
			}
		} else {
			throw new Error('O876.Mediator : no ' + sSignal + ' function in plugin ' + oPlugin.getName());
		}
	},
	
	/** 
	 * Retire le plugin de la liste des plugin signalisés
	 * @param sSignal type de signal
	 * @param oPlugin plugin concerné
	 */
	unregisterPluginSignal: function(sSignal, oPlugin) {
		if (this._oRegister === null) {
			return;
		}
		if (!(sSignal in this._oRegister)) {
			return;
		}
		var n = this._oRegister[sSignal].indexOf(oPlugin);
		if (n >= 0) {
			ArrayTools.removeItem(this._oRegister[sSignal], n);
		}
	},
	
	
	
	/**
	 * Envoie un signal à tous les plugins enregistré pour ce signal
	 * signaux supportés
	 * 
	 * damage(oAggressor, oVictim, nAmount) : lorsqu'une créature en blesse une autre
	 * key(nKey) : lorsqu'une touche est enfoncée ou relachée
	 * time : lorsqu'une unité de temps s'est écoulée
	 * block(nBlockCode, oMobile, x, y) : lorsqu'un block a été activé
	 */
	sendPluginSignal: function(s) {
		var i, p, pi, n;
		if (this._oRegister && (s in this._oRegister)) {
			p = this._oRegister[s];
			n = p.length;
			if (n) {
				var aArgs;
				if (arguments.length > 1) {
					aArgs = Array.prototype.slice.call(arguments, 1);
				} else {
					aArgs = [];
				}
				for (i = 0; i < n; i++) {
					pi = p[i];
					pi[s].apply(pi, aArgs);
				}
			}
		}
	}
});

/**
 * @class O876.Mixin.Prop
 * Provide jquery like function to access private properties
 */
O2.createClass('O876.Mixin.Prop', {

	_buildPropFunction: function(sProp) {
		return function(value) {
			if (value === undefined) {
				return this[sProp];
			} else {
				this[sProp] = value;
				return this;
			}
		};
	},

	mixin: function(p) {
		var pProto = {
			prop: function(variable, value) {
				if (value === undefined) {
					return this[variable];
				} else {
					this[variable] = value;
					return this;
				}
			}
		};
		for (var i in p.prototype) {
			if (i.match(/^_/)) {
				if (!(i.substr(1) in p.prototype) && typeof p.prototype[i] !== 'function') {
					pProto[i.substr(1)] = this._buildPropFunction(i);
				}
			}
		}

		p.extendPrototype(pProto);
	}
});

O2.createClass('O876.Perlin', {

	_rand: null,	// pseudo random generator
	_width: 0,		// tile width
	_height: 0,		// tile height
	_octaves: 0,	// octave counts
	_interpolate: null,	// string : interpolation function. Allowed values are 'cosine', 'linear', defualt is 'cosine'


	__construct: function() {
		this._rand = new O876.Random();
		this.interpolation('cosine');
	},

	/**
	 * Generate white noise on a matrix
	 * @param w matrix width
	 * @param h matrix height
	 * @return matrix
	 */
	generateWhiteNoise: function(w, h) {
		var r, a = [];
		for (var x, y = 0; y < h; ++y) {
			r = []; 
			for (x = 0; x < w; ++x) {
				r.push(this._rand.rand());
			}
			a.push(r);
		}
		return a;
	},

	/**
	 * Linear interpolation
	 * @param x1 minimum
	 * @param x2 maximum
	 * @param alpha value between 0 and 1
	 * @return float, interpolation result
	 */
	linearInterpolate: function(x0, x1, alpha) {
		return x0 * (1 - alpha) + alpha * x1;
	},

	/**
	 * Cosine Interpolation
	 */
	cosineInterpolate: function(x0, x1, mu) {
		var mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
   		return x0 * (1 - mu2) + x1 * mu2;
	},

	/**
	 * selects an interpolation
	 * @param f string | function the new interpolation function
	 * f can be either a string ('cosine', 'linear') or a custom function
	 */
	interpolation: function(f) {
		switch (typeof f) {
			case 'string':
				if ((f + 'Interpolate') in this) {
					this._interpolate = this[f + 'Interpolate'];
				} else {
					throw new Error('only "linear" or "cosine" interpolation');
				}
				return this;
				
			case 'function':
				this._interpolate = f;
				return this;
				
			case 'undefined':
				return this._interpolate;
		}
		return this;
	},

	generateSmoothNoise: function(aBaseNoise, nOctave) {
		var w = aBaseNoise.length;
		var h = aBaseNoise[0].length;
		var aSmoothNoise = [];
		var r;
		var nSamplePeriod = 1 << nOctave;
		var fSampleFreq = 1 / nSamplePeriod;
		var xs = [], ys = [];
		var hBlend, vBlend, fTop, fBottom;
		for (var x, y = 0; y < h; ++y) {
      		ys[0] = (y / nSamplePeriod | 0) * nSamplePeriod;
      		ys[1] = (ys[0] + nSamplePeriod) % h;
      		hBlend = (y - ys[0]) * fSampleFreq;
      		r = [];
      		for (x = 0; x < w; ++ x) {
       			xs[0] = (x / nSamplePeriod | 0) * nSamplePeriod;
      			xs[1] = (xs[0] + nSamplePeriod) % w;
      			vBlend = (x - xs[0]) * fSampleFreq;

      			fTop = this._interpolate(aBaseNoise[ys[0]][xs[0]], aBaseNoise[ys[1]][xs[0]], hBlend);
      			fBottom = this._interpolate(aBaseNoise[ys[0]][xs[1]], aBaseNoise[ys[1]][xs[1]], hBlend);
     			
     			r.push(this._interpolate(fTop, fBottom, vBlend));
      		}

      		aSmoothNoise.push(r);
		}
		return aSmoothNoise;
	},

	generatePerlinNoise: function(aBaseNoise, nOctaveCount) {
		var w = aBaseNoise.length;
		var h = aBaseNoise[0].length;
		var aSmoothNoise = [];
		var fPersist = 0.5;

		for (var i = 0; i < nOctaveCount; ++i) {
			aSmoothNoise.push(this.generateSmoothNoise(aBaseNoise, i));
		}

		var aPerlinNoise = [];
		var fAmplitude = 1;
		var fTotalAmp = 0;
		var x, y, r;

		for (y = 0; y < h; ++y) {
			r = [];
			for (x = 0; x < w; ++x) {
				r.push(0);
			}
			aPerlinNoise.push(r);
		}

		for (var iOctave = nOctaveCount - 1; iOctave >= 0; --iOctave) {
			fAmplitude *= fPersist;
			fTotalAmp += fAmplitude;

			for (y = 0; y < h; ++y) {
				r = [];
				for (x = 0; x < w; ++x) {
					aPerlinNoise[y][x] += aSmoothNoise[iOctave][y][x] * fAmplitude;
				}
			} 
		}
		for (y = 0; y < h; ++y) {
			r = [];
			for (x = 0; x < w; ++x) {
				aPerlinNoise[y][x] /= fTotalAmp;
			}
		}
		return aPerlinNoise;
	},


	hash: function (a) {
	    a = (a ^ 61) ^ (a >> 16);
	    a = a + (a << 3);
	    a = a ^ (a >> 4);
	    a = a * 0x27d4eb2d;
	    a = a ^ (a >> 15);
    	return a;
    },

	/** 
	 * Calcule le hash d'une région
	 * Permet de choisir une graine aléatoire
	 * et de raccorder seamlessly les région adjacente
	 */
	getPointHash: function(x, y) {
		var xh = this.hash(x).toString().split('');
		var yh = this.hash(y).toString().split('');
		var s = xh.shift() + yh.shift() + '.';
		while (xh.length || yh.length) {
			if (xh.length) {
				s += xh.shift();
			}
			if (yh.length) {
				s += yh.shift();
			}
		}
		return parseFloat(s);
	},

	generate: function(x, y) {
		var _self = this;

		function gwn(xg, yg) {
			var nSeed = _self.getPointHash(xg, yg);
			_self.rand().seed(nSeed);
			return _self.generateWhiteNoise(_self.width(), _self.height());
		}

		function merge33(a33) {
			var h = _self.height();
			var a = [];
			for (var y, ya = 0; ya < 3; ++ya) {
				for (y = 0; y < h; ++y) {
					a.push(a33[ya][0][y].concat(a33[ya][1][y], a33[ya][2][y]));
				}
			}
			return a;
		}

		function extract33(a) {
			var w = _self.width();
			var h = _self.height();
			return a.slice(h, h * 2).map(r => r.slice(w, w * 2));
		}

		var a0 = [
			[gwn(x - 1, y - 1), gwn(x, y - 1), gwn(x + 1, y - 1)],
			[gwn(x - 1, y), gwn(x, y), gwn(x + 1, y)],
			[gwn(x - 1, y + 1), gwn(x, y + 1), gwn(x + 1, y + 1)]
		];

		var a1 = merge33(a0);
		var a2 = this.generatePerlinNoise(a1, this.octaves());
		var a3 = extract33(a2);
		return a3;
	},


	render: function(aNoise, oContext, aPalette) {
		var oRainbow = new O876.Rainbow();
		var aPalette = aPalette || oRainbow.gradient({
			0: '#008',
			49: '#00F',
			50: '#840',
			84: '#0A0',
			85: '#888',
			99: '#FFF'
		});
		var h = aNoise.length, w = aNoise[0].length, pl = aPalette.length;
		var oImageData = oContext.createImageData(w, h);
		var data = oImageData.data;
		var oRainbow = new O876.Rainbow();
		aNoise.forEach(function(r, y) {
			r.forEach(function(p, x) {
				var nOfs = (y * w + x) << 2;
				var rgb = oRainbow.parse(aPalette[p * pl | 0]);
				data[nOfs] = rgb.r;
				data[nOfs + 1] = rgb.g;
				data[nOfs + 2] = rgb.b;
				data[nOfs + 3] = 255;
			});
		});
		oContext.putImageData(oImageData, 0, 0);
	}

});


O2.mixin(O876.Perlin, O876.Mixin.Prop);

/**
 * A class for manipulating canvas
 * Provides gimp like filter and effect like blur, emboss, sharpen
 */

O2.createClass('O876.Philter', {

	_oFilters: null,
	
	perf: null,

	__construct: function() {
		if ('performance' in window) {
			this.perf = performance;
		} else {
			this.perf = Date;
		}
		this.config({
			kernel: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
			bias: 0,
			factor: 1,
			more: false,
			radius: 1,
			level: 50,
			left: 0,
			top: 0,
			width: null,
			height: null,
			right: 0,
			bottom: 0,
			red: true,
			green: true,
			blue: true,
			alpha: true,
			channels: 'rgba',
			command: '',
			sync: true,
			delay: 256
		});
	},

	/**
	 * Configures the instance
	 * @param c string|object if this is a string, the function returns the 
	 * value of the config key. If c is an object, the function modify configuration
	 * according to the key/values pairs contained in the object
	 * @return value | this
	 */
	config: function(c, v) {
		return this.data(c, v);
	},

	init: function(p1, p2) {
		// analyzing parameters
		var sArgs = O876.typeMap(arguments, 'short');
		switch (sArgs) {
			case 's': // one string
			case 'su': // one string
				this.config('command', p1);
			break;
			
			case 'so': // one string, one object
				this.config(p2);
				this.config('command', p1);
			break;
			
			case 'o':
			case 'ou': // one object
				this.config(p1);
			break;
			
			case 'sf': // define new filter
				this._oFilters[p1] = p2;
				return;
			break;
			
			default:
				throw new Error('bad parameter format');
		}
		var sChannels = this.config('channels').toLowerCase();
		this.config('red', sChannels.indexOf('r') >= 0);
		this.config('green', sChannels.indexOf('g') >= 0);
		this.config('blue', sChannels.indexOf('b') >= 0);
		this.config('alpha', sChannels.indexOf('a') >= 0);
	},

	/**
	 * builds a canvas and copy the given image content inside this canvas
	 * builds a pixel buffer
	 * builds a structure containing references to the image, the canvas
	 * and the pixel buffer
	 * @param oImage DOM Image
	 * @return a structure
	 */
	buildShadowCanvas: function(oCanvas) {
		var ctx = oCanvas.getContext('2d');
		var w = oCanvas.width;
		var h = oCanvas.height;
		var imgdata = ctx.getImageData(0, 0, w, h);
		var data = new Uint32Array(imgdata.data.buffer);
		
		return {
			canvas: oCanvas,
			context: ctx,
			imageData: imgdata,
			pixelData: imgdata.data,
			pixels: data,
			width: w,
			height: h,
			_p: false
		};
	},

	/**
	 * Copies the pixel data buffer to the original canvas ;
	 * This operation visually modify the image
	 * @param sc Structure built by buildShadowCanvas()
	 */
	commitShadowCanvas: function(sc) {
		if (sc._p) {
			sc.context.putImageData(sc.imageData, 0, 0);
		}
	},


	/**
	 * Get the working region
	 */
	getRegion: function(sc) {
		var xs = this.config('left');
		var ys = this.config('top');
		var xe = this.config('width') !== null ? xs + this.config('width') - 1 : null;
		var ye = this.config('height') !== null ? ys + this.config('height') - 1 : null;
		xe = xe !== null ? xe : sc.width - this.config('left') - 1;
		ye = ye !== null ? ye : sc.height - this.config('right') - 1;
		return {
			xs: xs,
			ys: ys,
			xe: xe,
			ye: ye
		};
	},

	/**
	 * Get a color structure of the given pixel
	 * if a color structure is specified, the function will fill this
	 * structure with pixel color values. this will prevent from
	 * building a new object each time a pixel is read,
	 * and will potentially increase overall performances
	 * in all cases, the color structure is also returned
	 * @param sc Shadow Canvas structure
	 * @param x pixel x
	 * @param y pixel y
	 * @param oResult optional Color structure {r: int, g: int, b: int, a: int}
	 * @return Color structure
	 */
	getPixel: function(sc, x, y, oResult) {
		if (oResult === undefined) {
			oResult = {};
		}
		if (x >= 0 && y >= 0 && x < sc.width && y < sc.height) {
			var n = y * sc.width + x;
			var p = sc.pixels[n];
			oResult.r = p & 255;
			oResult.g = (p >> 8) & 255;
			oResult.b = (p >> 16) & 255;
			oResult.a = (p >> 24) & 255;
			return oResult;
		} else {
			return null;
		}
	},


	/**
	 * Change pixel value
	 * @param sc Shadow Canvas structure
	 * @param x pixel x
	 * @param y pixel y
	 * @param c Color structure {r: int, g: int, b: int, a: int}
	 */
	setPixel: function(sc, x, y, c) {
		if (x >= 0 && y >= 0 && x < sc.width && y < sc.height) {
			var n = y * sc.width + x;
			var nAlpha = ('a' in c) ? c.a << 24 : (sc.pixels[n] & 0xFF000000);
			sc.pixels[n] = c.r | (c.g << 8) | (c.b << 16) | nAlpha;
			sc._p = true;
		}
	},
	
	
	/**
	 * applies a function to each pixel
	 * @param sc shadow canvas
	 * @param pFunc function to call
	 */
	pixelProcess: function(sc, pFunc, oContext) {
		var x, y, p = {}, r = {}, k;
		var w = sc.width;
		var h = sc.height;
		var bChr = this.config('red');
		var bChg = this.config('green');
		var bChb = this.config('blue');
		var bCha = this.config('alpha');
		var factor = this.config('factor');
		var bias = this.config('bias');
		var r = this.getRegion(sc);
		var nStartTime = this.perf.now();
		var perf = this.perf;
		var nDelay = this.config('delay');
		var bASync = !this.config('sync');
		var rxs = r.xs;
		var rys = r.ys;
		var xFrom = rxs;
		var yFrom = rys;
		var rxe = r.xe;
		var rye = r.ye;
		if (oContext) {
			xFrom = oContext.x;
			yFrom = oContext.y;
		} else {
			this.trigger('progress', {value: 0});
		}
		var getPixel = this.getPixel;
		var setPixel = this.setPixel;
		for (y = yFrom; y <= rye; ++y) {
			for (x = xFrom; x <= rxe; ++x) {
				this.getPixel(sc, x, y, p);
				for (k in p) {
					r[k] = p[k];
				}
				pFunc(x, y, p);
				if (bChr) {
					r.r = Math.min(255, Math.max(0, factor * p.r + bias)) | 0;
				}	
				if (bChg) {
					r.g = Math.min(255, Math.max(0, factor * p.g + bias)) | 0;
				}
				if (bChb) {
					r.b = Math.min(255, Math.max(0, factor * p.b + bias)) | 0;
				}
				if (bCha) {
					r.a = Math.min(255, Math.max(0, factor * p.a + bias)) | 0;
				}
				this.setPixel(sc, x, y, r);
			}
			xFrom = rxs;
			var pn = perf.now();
			var nElapsedTime = pn - nStartTime;
			if (bASync && nElapsedTime > nDelay) {
				nStartTime = pn;
				requestAnimationFrame((function() {
					this.trigger('progress', { elapsed: nElapsedTime, value: (y - rys) / (rye - rys)});
					this.pixelProcess(sc, pFunc, {
						x: x,
						y: y
					});
				}).bind(this));
				return;
			}
		}
		if (bASync) {
			this.trigger('progress', {value: 1});
			this.trigger('pixelprocess.end', {sc: sc});
		}
	},

	/**
	 * filter: convolution
	 * applies a convolution kernel on the image
	 * used options:
	 * 	- kernel
	 *  - factor
	 * 	- bias
	 */
	convolutionProcess: function(scs) {
		var x, y, p = {}, nc = {}, xyf;
		var scd = this.buildShadowCanvas(scs.canvas);
		var w = scs.width;
		var h = scs.height;
		var aMatrix = this.config('kernel');
		var yfCount = aMatrix.length;
		var xfCount = yfCount > 0 ? aMatrix[0].length : 0;
		this.pixelProcess(scs, (function(x, y, p) {
			var xm, ym, xf, yf, p2 = {}, k;
			for (k in p) {
				p[k] = 0;
			}
			for (yf = 0; yf < yfCount; ++yf) {
				for (xf = 0; xf < xfCount; ++xf) {
					xm = (x - (xfCount >> 1) + xf + w) % w;
					ym = (y - (yfCount >> 1) + yf + h) % h;
					if (this.getPixel(scd, xm, ym, p2)) {
						xyf = aMatrix[yf][xf];
						for (k in p2) {
							p[k] += p2[k] * xyf;
						}
					}
				}
			}
		}).bind(this));
	},

	/**
	 * applies a contrast filter
	 * @param level 
	 */
	filterContrast: function(sc) {
		var c = this.config('level');
		var f = (259 * (c + 255)) / (255 * (259 - c));
		this.pixelProcess(sc, function(x, y, p) {
			p.r = f * (p.r - 128) + 128;
			p.g = f * (p.g - 128) + 128;
			p.b = f * (p.b - 128) + 128;
		});
	},

	/**
	 * Applies a negate color filter
	 */
	filterNegate: function(sc) {
		this.pixelProcess(sc, function(x, y, p) {
			p.r = 255 - p.r;
			p.g = 255 - p.g;
			p.b = 255 - p.b;
		});
	},

	/**
	 * Applies a color filter
	 * @param kernel a 3x3 kernel, corresponding to a transformation matrix
	 */
	filterColor: function(sc) {
		var m = this.config('kernel');
		if (m.length < 3) {
			throw new Error('color kernel must be 3x3 sized');
		}
		if (m[0].length < 3 || m[1].length < 3 || m[2].length < 3) {
			throw new Error('color kernel must be 3x3 sized');
		}
		this.pixelProcess(sc, function(x, y, p) {
			var r = (p.r * m[0][0] + p.g * m[0][1] + p.b * m[0][2]);
			var g = (p.r * m[1][0] + p.g * m[1][1] + p.b * m[1][2]);
			var b = (p.r * m[2][0] + p.g * m[2][1] + p.b * m[2][2]);
			p.r = r;
			p.g = g;
			p.b = b;
		});
	},

	/**
	 * Applies a noise filter
	 * @param level amount of noise
	 */
	filterNoise: function(sc) {
		var nAmount = this.config('level');
		this.pixelProcess(sc, function(x, y, p) {
			var nb = nAmount * (Math.random() - 0.5);
			p.r = Math.min(255, Math.max(0, p.r + nb)) | 0;
			p.g = Math.min(255, Math.max(0, p.g + nb)) | 0;
			p.b = Math.min(255, Math.max(0, p.b + nb)) | 0;
		});
	},

	/**
	 * Build a gaussian blur matrix
	 * @param phi
	 */
	buildGaussianBlurMatrix: function(phi) {
		var nSize = Math.max(1, Math.ceil(phi * 3));
		var a = [], row;
		var y, x;
		for (y = -nSize; y <= nSize; ++y) {
			row = [];
			for (x = -nSize; x <= nSize; ++x) {
				row.push((1 / (2 * Math.PI * phi * phi)) * Math.exp(-(x * x + y * y) / (2 * phi * phi)));
			}
			a.push(row);
		}
		return a;
	},

	/** 
	 * Applies a hsl filter to change hue, brightness and saturation
	 */
	filterHSL: function(sc) {
		/**
		 * Converts an RGB color value to HSL. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes r, g, and b are contained in the set [0, 255] and
		 * returns h, s, and l in the set [0, 1].
		 *
		 * @param   Number  r       The red color value
		 * @param   Number  g       The green color value
		 * @param   Number  b       The blue color value
		 * @return  Array           The HSL representation
		 */
		function rgbToHsl(r, g, b){
			r /= 255, g /= 255, b /= 255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;

			if (max == min){
				h = s = 0; // achromatic
			} else {
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}

			return [h, s, l];
		}

		// utility function used by hslToRgb
		function hue2rgb(p, q, t){
			if (t < 0) {
				++t;
			}
			if (t > 1) {
				--t;
			}
			if (t < 1 / 6) {
				return p + (q - p) * 6 * t;
			}
			if (t < 1 / 2) {
				return q;
			}
			if (t < 2 / 3) {
				return p + (q - p) * (2/3 - t) * 6;
			}
			return p;
		}
		
		/**
		 * Converts an HSL color value to RGB. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes h, s, and l are contained in the set [0, 1] and
		 * returns r, g, and b in the set [0, 255].
		 *
		 * @param   Number  h       The hue
		 * @param   Number  s       The saturation
		 * @param   Number  l       The lightness
		 * @return  Array           The RGB representation
		 */
		function hslToRgb(h, s, l) {
			var r, g, b;

			if (s === 0){
				r = g = b = l; // achromatic
			} else {
				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}
			return [r * 255, g * 255, b * 255];
		}
		var hue = this.config('hue') || 0;
		var saturation = this.config('saturation') || 0;
		var lightness = this.config('lightness') || 0;

		this.pixelProcess(sc, function(x, y, pixel) {
			var hsl = rgbToHsl(pixel.r, pixel.g, pixel.b);
			var h = (hsl[0] + hue + 1) % 1;
			var s = Math.min(1, Math.max(0, hsl[1] + saturation));
			var l = Math.min(1, Math.max(0, hsl[2] + lightness));
			h += hue;
			var rgb = hslToRgb(h, s, l);
			pixel.r = rgb[0];
			pixel.g = rgb[1];
			pixel.b = rgb[2];
		});
	},
	
	/**
	 * description copied from http://www.incx.nec.co.jp/imap-vision/library/wouter/kuwahara.html
	 * implemented by Øyvind Kolås <oeyvindk@hig.no> 2004
	 * Performs the Kuwahara Filter
	 */
	filterKuwahara: function(sc) {
		var oSelf = this;
		var edge_duplicate = 1;
		var height = sc.height;
		var width = sc.width;
		
		function get_rgb(x, y) {
			var p = oSelf.getPixel(sc, Math.min(width - 1, Math.max(0, x)), Math.min(height - 1, Math.max(0, y)));
			p.r /= 255;
			p.g /= 255;
			p.b /= 255;
			return p;
		}

		function get_value(x, y) {
			var p = get_rgb(x, y);
			var max = Math.max(p.r, p.g, p.b), min = Math.min(p.r, p.g, p.b);
			return (max + min) / 2;
		}
		
		function set_rgb(x, y, r, g, b) {
			if (x >= 0 && x < width && y >= 0 && y < height) {
				oSelf.setPixel(sc, x, y, {r: r * 255 | 0, g: g * 255 | 0, b: b * 255 | 0});
			}
		}
		
		// local function to get the mean value, and
		// variance from the rectangular area specified
		
		function rgb_mean_and_variance (x0, y0, x1, y1) {
			var variance, mean, r_mean, g_mean, b_mean;
			var min = 1;
			var max = 0;
			var accumulated_r = 0;
			var accumulated_g = 0;
			var accumulated_b = 0;
			var count = 0;
			var x, y, v, rgb;
	 
			for (y = y0; y <= y1; ++y) {
				for (x = x0; x <= x1; ++x) {
					v = get_value(x, y);
					rgb = get_rgb(x, y);
					accumulated_r += rgb.r;
					accumulated_g += rgb.g;
					accumulated_b += rgb.b;
					++count;
					if (v < min) {
						min = v;
					}
					if (v > max) {
						max = v;
					}
				}
			}
			var variance = max - min;
			var mean_r = accumulated_r / count;
			var mean_g = accumulated_g / count;
			var mean_b = accumulated_b / count;
			return {mean: {r: mean_r, g: mean_g, b: mean_b}, variance: variance};
		}

		// return the kuwahara computed value
		function rgb_kuwahara(x, y, radius) {
			var best_r, best_g, best_b;
			var best_variance = 1.0;
			
			function updateVariance(x0, y0, x1, y1) {
				var m = rgb_mean_and_variance (x0, y0, x1, y1);
				if (m.variance < best_variance) {
					best_r = m.mean.r;
					best_g = m.mean.g;
					best_b = m.mean.b;
					best_variance = m.variance;
				}
			}
			
			updateVariance(x - radius, y - radius, x, y);
			updateVariance(x, y - radius, x + radius, y);
			updateVariance(x, y, x + radius, y + radius);
			updateVariance(x - radius, y, x, y + radius);
			return {r: best_r * 255 | 0, g: best_g * 255 | 0, b: best_b * 255 | 0};
		}

		var radius = this.config('radius');
		
		this.pixelProcess(sc, function(x, y, p) {
			var rgb = rgb_kuwahara(x, y, radius);
			p.r = rgb.r;
			p.g = rgb.g;
			p.b = rgb.b;
		});
	},


	run: function(oCanvas, p1, p2) {
		this.init(p1, p2);
		var fStartTime = this.perf.now();
		var sc = this.buildShadowCanvas(oCanvas);
		this.one('pixelprocess.end', (function(oEvent) {
			this.commitShadowCanvas(oEvent.sc);
			this.trigger('complete', this.config());
		}).bind(this));
		switch (this.config('command')) {

			case 'contrast': 
				this.filterContrast(sc);
			break;

			case 'negate': 
				this.filterNegate(sc);
			break;

			case 'grayscale':
				this.config('kernel', [
					[0.30, 0.59, 0.11], 
					[0.30, 0.59, 0.11], 
					[0.30, 0.59, 0.11]
				]);
				this.filterColor(sc);
			break;
			
			case 'sepia':
				this.config('kernel', [
					[0.393, 0.769, 0.189],
					[0.349, 0.686, 0.168],
					[0.272, 0.534, 0.131]
				]);
				this.filterColor(sc);
			break;

			case 'color':
				this.filterColor(sc);
			break;

			case 'noise':
				this.filterNoise(sc);
			break;

			case 'hsl':
				this.filterHSL(sc);
			break;

			case 'blur':
				if (this.config('radius') < 2) {
					this.config('kernel', [
						[0.0, 0.2, 0.0],
						[0.2, 0.2, 0.2],
						[0.0, 0.2, 0.0]
					]);
				} else {
					this.config('kernel', this.buildGaussianBlurMatrix(Math.max(2, this.config('radius')) / 3));
				}
				this.convolutionProcess(sc);
			break;

			case 'convolution':
				this.convolutionProcess(sc);
			break;
			
			case 'pixelmap':
				this.pixelProcess(sc, this.config('func'));
			break;

			case 'sharpen':
				if (this.config('more')) {
					this.config('kernel', [
						[1,  1,  1], 
						[1, -7,  1], 
						[1,  1,  1] 
					]);
				} else {
					this.config('kernel', [
						[-1, -1, -1, -1, -1], 
						[-1,  2,  2,  2, -1], 
						[-1,  2,  8,  2, -1], 
						[-1,  2,  2,  2, -1], 
						[-1, -1, -1, -1, -1]
					]);
					this.config('factor', 1 / 8);
				}
				this.convolutionProcess(sc);
			break;
			
			case 'edges':
				this.config('alpha', false); // alpha channel will mess up everything
				this.config('kernel', [
					[-1, -1, -1], 
					[-1,  8, -1], 
					[-1, -1, -1] 
				]);
				this.convolutionProcess(sc);
			break;
			
			case 'emboss':
				if (this.config('sobel')) {
					this.config('kernel', [
						[-1, -2, -1], 
						[ 0,  0,  0], 
						[ 1,  2,  1]
					]);
				} else if (this.config('more')) {
					this.config('kernel', [
						[-2, -1,  0], 
						[-1,  1,  1], 
						[ 0,  1,  2]
					]);
				} else {
					this.config('kernel', [
						[-1, -1,  0], 
						[-1,  1,  1], 
						[ 0,  1,  1]
					]);
				}
				this.convolutionProcess(sc);
			break;
			
			case 'kuwahara':
				this.filterKuwahara(sc);
			break;
			
		}
		if (this.config('sync')) {
			this.commitShadowCanvas(sc);
			var fEndTime = this.perf.now();
			this.data('duration', fEndTime - fStartTime);
		}
	}


});

O2.mixin(O876.Philter, O876.Mixin.Data);
O2.mixin(O876.Philter, O876.Mixin.Events);

/**
 * @class O876.Rainbow
 * Rainbow - Color Code Convertor Boîte à outil graphique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 * good to GIT
 */

O2.createClass('O876.Rainbow', {
	
	COLORS: {
		aliceblue : '#F0F8FF',
		antiquewhite : '#FAEBD7',
		aqua : '#00FFFF',
		aquamarine : '#7FFFD4',
		azure : '#F0FFFF',
		beige : '#F5F5DC',
		bisque : '#FFE4C4',
		black : '#000000',
		blanchedalmond : '#FFEBCD',
		blue : '#0000FF',
		blueviolet : '#8A2BE2',
		brown : '#A52A2A',
		burlywood : '#DEB887',
		cadetblue : '#5F9EA0',
		chartreuse : '#7FFF00',
		chocolate : '#D2691E',
		coral : '#FF7F50',
		cornflowerblue : '#6495ED',
		cornsilk : '#FFF8DC',
		crimson : '#DC143C',
		cyan : '#00FFFF',
		darkblue : '#00008B',
		darkcyan : '#008B8B',
		darkgoldenrod : '#B8860B',
		darkgray : '#A9A9A9',
		darkgrey : '#A9A9A9',
		darkgreen : '#006400',
		darkkhaki : '#BDB76B',
		darkmagenta : '#8B008B',
		darkolivegreen : '#556B2F',
		darkorange : '#FF8C00',
		darkorchid : '#9932CC',
		darkred : '#8B0000',
		darksalmon : '#E9967A',
		darkseagreen : '#8FBC8F',
		darkslateblue : '#483D8B',
		darkslategray : '#2F4F4F',
		darkslategrey : '#2F4F4F',
		darkturquoise : '#00CED1',
		darkviolet : '#9400D3',
		deeppink : '#FF1493',
		deepskyblue : '#00BFFF',
		dimgray : '#696969',
		dimgrey : '#696969',
		dodgerblue : '#1E90FF',
		firebrick : '#B22222',
		floralwhite : '#FFFAF0',
		forestgreen : '#228B22',
		fuchsia : '#FF00FF',
		gainsboro : '#DCDCDC',
		ghostwhite : '#F8F8FF',
		gold : '#FFD700',
		goldenrod : '#DAA520',
		gray : '#808080',
		grey : '#808080',
		green : '#008000',
		greenyellow : '#ADFF2F',
		honeydew : '#F0FFF0',
		hotpink : '#FF69B4',
		indianred  : '#CD5C5C',
		indigo  : '#4B0082',
		ivory : '#FFFFF0',
		khaki : '#F0E68C',
		lavender : '#E6E6FA',
		lavenderblush : '#FFF0F5',
		lawngreen : '#7CFC00',
		lemonchiffon : '#FFFACD',
		lightblue : '#ADD8E6',
		lightcoral : '#F08080',
		lightcyan : '#E0FFFF',
		lightgoldenrodyellow : '#FAFAD2',
		lightgray : '#D3D3D3',
		lightgrey : '#D3D3D3',
		lightgreen : '#90EE90',
		lightpink : '#FFB6C1',
		lightsalmon : '#FFA07A',
		lightseagreen : '#20B2AA',
		lightskyblue : '#87CEFA',
		lightslategray : '#778899',
		lightslategrey : '#778899',
		lightsteelblue : '#B0C4DE',
		lightyellow : '#FFFFE0',
		lime : '#00FF00',
		limegreen : '#32CD32',
		linen : '#FAF0E6',
		magenta : '#FF00FF',
		maroon : '#800000',
		mediumaquamarine : '#66CDAA',
		mediumblue : '#0000CD',
		mediumorchid : '#BA55D3',
		mediumpurple : '#9370DB',
		mediumseagreen : '#3CB371',
		mediumslateblue : '#7B68EE',
		mediumspringgreen : '#00FA9A',
		mediumturquoise : '#48D1CC',
		mediumvioletred : '#C71585',
		midnightblue : '#191970',
		mintcream : '#F5FFFA',
		mistyrose : '#FFE4E1',
		moccasin : '#FFE4B5',
		navajowhite : '#FFDEAD',
		navy : '#000080',
		oldlace : '#FDF5E6',
		olive : '#808000',
		olivedrab : '#6B8E23',
		orange : '#FFA500',
		orangered : '#FF4500',
		orchid : '#DA70D6',
		palegoldenrod : '#EEE8AA',
		palegreen : '#98FB98',
		paleturquoise : '#AFEEEE',
		palevioletred : '#DB7093',
		papayawhip : '#FFEFD5',
		peachpuff : '#FFDAB9',
		peru : '#CD853F',
		pink : '#FFC0CB',
		plum : '#DDA0DD',
		powderblue : '#B0E0E6',
		purple : '#800080',
		rebeccapurple : '#663399',
		red : '#FF0000',
		rosybrown : '#BC8F8F',
		royalblue : '#4169E1',
		saddlebrown : '#8B4513',
		salmon : '#FA8072',
		sandybrown : '#F4A460',
		seagreen : '#2E8B57',
		seashell : '#FFF5EE',
		sienna : '#A0522D',
		silver : '#C0C0C0',
		skyblue : '#87CEEB',
		slateblue : '#6A5ACD',
		slategray : '#708090',
		slategrey : '#708090',
		snow : '#FFFAFA',
		springgreen : '#00FF7F',
		steelblue : '#4682B4',
		tan : '#D2B48C',
		teal : '#008080',
		thistle : '#D8BFD8',
		tomato : '#FF6347',
		turquoise : '#40E0D0',
		violet : '#EE82EE',
		wheat : '#F5DEB3',
		white : '#FFFFFF',
		whitesmoke : '#F5F5F5',
		yellow : '#FFFF00',
		yellowgreen : '#9ACD32'
	},
	
	/** 
	 * Fabrique une chaine de caractère représentant une couleur au format CSS
	 * @param xData une structure {r: int, g: int, b: int, a: float}
	 * @return code couleur CSS au format rgb(r, g, b) ou rgba(r, g, b, a)
	 */
	rgba: function(xData) {
		return this._buildRGBAFromStructure(this.parse(xData));
	},
	
	/**
	 * Analyse une valeur d'entrée pour construire une structure avec les 
	 * composantes "r", "g", "b", et eventuellement "a".
	 */ 
	parse: function(xData) {
		if (typeof xData === "object") {
			return xData;
		} else if (typeof xData === "number") {
			return this._buildStructureFromInt(xData);
		} else if (typeof xData === "string") {
			xData = xData.toLowerCase();
			if (xData in this.COLORS) {
				xData = this.COLORS[xData];
			}
			switch (xData.length) {
				case 3:
					return this._buildStructureFromString3(xData);
					
				case 4:
					if (xData[0] === '#') {
						return this._buildStructureFromString3(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				case 6:
					return this._buildStructureFromString6(xData);
					
				case 7:
					if (xData[0] === '#') {
						return this._buildStructureFromString6(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				default:
					var rx = xData.match(/^rgb\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)$/);
					if (rx) {
						return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0};
					} else {
						rx = xData.match(/^rgba\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([.0-9]+) *\)$/);
						if (rx) {
							return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0, a: parseFloat(rx[4])};
						} else {
							throw new Error('invalid color structure ' + xData);
						}
					}
			}
		}
	},
	
	/**
	 * Génère un spectre entre deux valeurs de couleurs
	 * La fonction renvoi 
	 */
	spectrum: function(sColor1, sColor2, nSteps) {
		var c1 = this.parse(sColor1);
		var c2 = this.parse(sColor2);
		
		var nSecur = 100;
		
		function getMedian(x1, x2) {
			if (x1 === undefined) {
				throw new Error('first color is undefined');
			}
			if (x2 === undefined) {
				throw new Error('second color is undefined');
			}
			return {
				r: (x1.r + x2.r) >> 1,
				g: (x1.g + x2.g) >> 1,
				b: (x1.b + x2.b) >> 1
			};			
		}
		
		function fillArray(a, x1, x2, n1, n2) {
			var m = getMedian(x1, x2);
			var n = (n1 + n2) >> 1;
			if (--nSecur < 0) {
				return a;
			}
			if (Math.abs(n1 - n2) > 1) {
				fillArray(a, x1, m, n1, n);
				fillArray(a, m, x2, n, n2);
			}
			a[n1] = x1;
			a[n2] = x2;
			return a;
		}
		
		return fillArray([], c1, c2, 0, nSteps - 1).map(function(c) {
			return this.rgba(c);
		}, this);
	},
	
	/**
	 * Generate a gradient
	 * @param oPalette palette definition
	 * 
	 * {
	 * 		start: value,
	 * 		stop1: value,
	 * 		stop2: value,
	 * 		...
	 * 		stopN: value,
	 * 		end: value
	 * },
	 * 
	 * example :
	 * {
	 * 		0: '#00F',
	 * 		50: '#FF0',
	 * 		100: '#F00'
	 * }
	 * rappel : une palette d'indices de 0 à 100 dispose de 101 entrée
	 */
	gradient: function(oPalette) {
		var aPalette = [];
		var sColor = null;
		var sLastColor = null;
		var nPal;
		var nLastPal = 0;
		for (var iPal in oPalette) {
			nPal = iPal | 0;
			sColor = oPalette[iPal];
			if (sLastColor !== null) {
				aPalette = aPalette.concat(this.spectrum(sLastColor, sColor, nPal - nLastPal + 1).slice(1));
			} else {
				aPalette[nPal] = this.rgba(sColor);
			}
			sLastColor = sColor;
			nLastPal = nPal;
		}
		return aPalette;
	},

	_buildStructureFromInt: function(n) {
		var r = (n >> 16) & 0xFF;
		var g = (n >> 8) & 0xFF;
		var b = n & 0xFF;
		return {r: r, g: g, b: b};
	},
	
	_buildStructureFromString3: function(s) {
		var r = parseInt('0x' + s[0] + s[0]);
		var g = parseInt('0x' + s[1] + s[1]);
		var b = parseInt('0x' + s[2] + s[2]);
		return {r: r, g: g, b: b};
	},

	_buildStructureFromString6: function(s) {
		var r = parseInt('0x' + s[0] + s[1]);
		var g = parseInt('0x' + s[2] + s[3]);
		var b = parseInt('0x' + s[4] + s[5]);
		return {r: r, g: g, b: b};
	},

	_buildRGBAFromStructure: function(oData) {
		var s1 = 'rgb';
		var s2 = oData.r.toString() + ', ' + oData.g.toString() + ', ' + oData.b.toString();
		if ('a' in oData) {
			s1 += 'a';
			s2 += ', ' + oData.a.toString();
		}
		return s1 + '(' + s2 + ')';
	},
	
	_buildString3FromStructure: function(oData) {
		var sr = ((oData.r >> 4) & 0xF).toString(16);
		var sg = ((oData.g >> 4) & 0xF).toString(16);
		var sb = ((oData.b >> 4) & 0xF).toString(16);
		return sr + sg + sb;
	}
});

/**
 * @class O876.Random
 * a FALSE random very false...
 * generated random numbers, with seed
 * used for predictable landscape generation
 */

O2.createClass('O876.Random', {

	_seed: 1,

	__construct: function() {
		this._seed = Math.random();
	},

	seed: function(x) {
    	return this.prop('_seed', x);
	},


	_rand: function() {
		return this._seed = Math.abs(((Math.sin(this._seed) * 1e12) % 1e6) / 1e6);
	},

	rand: function(a, b) {
		var r = this._rand();
		switch (typeof a) {
			case "undefined":
				return r;
				
			case "number":
				if (b === undefined) {
					b = a - 1;
					a = 0;
				}
				return Math.max(a, Math.min(b, (b - a + 1) * r + a | 0));
			
			case "object":
				if (Array.isArray(a)) {
					if (a.length > 0) {
						return a[r * a.length | 0];
					} else {
						return undefined;
					}
				} else {
					return this.rand(Object.keys(a));
				}
				
			default:
				return r;
		}
	}
});

O2.mixin(O876.Random, O876.Mixin.Prop);

/**
 * This class will rasterize any XHTML document (including images
 * and stylesheets) into a canvas.
 * The document must be valid XHTML
 *
 * Some tags, referencing external resources, will be transformed :
 *
 * The <style> tag is allowed and will be "scoped"
 * If the <style> tag has an "src" attribute,pointing to an external file 
 * then the corresponding file will be ajaxed and included in the style tag.
 *
 * Same goes for the <img> tag. If an "src" attribute referencing external
 * image is present, then the corresponding image will be loaded, converted
 * to base 64 data url, and the "src" file will be updated.
 *
 * In order to properly rasterize a document, 
 * the following parameters must be specified
 * - the
 *
 */
O2.createClass('O876.Rasterize', {


	xhr: null,
	BASEPATH: '',
	bBusy: false,
	oDomParser: null,
	bDebug: false,

	__construct: function() {
		this.xhr = new O876.XHR();
		this.oDomParser = new DOMParser();
	},

	_get: function(sFile, cb) {
		this.xhr.get(this.BASEPATH + sFile, cb);
	},

	_computeMetrics: function(oObject, w, h, pDone) {
		var oElement = document.createElement('div');
		oElement.style.padding = '0px';
		oElement.style.margin = '0px';
		oElement.style.position = 'relative';
		oElement.style.visibility = 'hidden';
		oElement.style.width = w + 'px';
		oElement.style.height = h + 'px';
		oElement.appendChild(oObject);

		/**
		 * for a given element, checks if all images are loaded
		 * a function is called back when every image is loaded.
		 */
		function waitUntilAllImagesLoaded(oDoc, pAllLoaded) {
			// get all images
			var aImages = oDoc.getElementsByTagName('img');
			for (var i = 0, l = aImages.length; i < l; ++i) {
				if (!aImages[i].complete) {
					// uncomplete image : attach "load" event listener
					aImages[i].addEventListener('load', function() {
						// will recheck all images
						waitUntilAllImagesLoaded(oDoc, pAllLoaded);
					});
					// no need to iterate further
					return;
				}
			}
			// all images seem complete : callback
			if (pAllLoaded) {
				pAllLoaded();
			}
		}

		function buildMetricStructure() {
			var q = oElement.querySelectorAll('[id]');
			var oResult = {}, e, id;
			for (var i = 0; i < q.length; ++i) {
				e = q[i];
				id = e.getAttribute('id');
				oResult[id] = {
					width: e.offsetWidth,
					height: e.offsetHeight,
					left: e.offsetLeft,
					top: e.offsetTop
				};
			}
			oElement.remove();
			return oResult;
		}

		document.body.appendChild(oElement);
		waitUntilAllImagesLoaded(oElement, function() {
			pDone(buildMetricStructure());
		});
	},
	
	_parseXMLString: function(sXML) {
		return this.oDomParser.parseFromString(sXML, 'application/xml');		
	},
	
	_renderSVGString: function(sXML, w, h) {
		return ([
	'	<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">',
	'		<foreignObject width="100%" height="100%">',
	'			<style scoped="scoped">',
	'root {',
	'	width: 100%; ',
	'	height: 100%; ',
	'	overflow: hidden;',
	'	background-color: transparent;',
	'	color: black;',
	'	font-family: monospace;',
	'	font-size: 8px;',
	'}',
	'',
	'			</style>',
	'           <root xmlns="http://www.w3.org/1999/xhtml">',
	            sXML,
	'           </root>',
	'      </foreignObject>',
	'</svg>'
	    ]).join('\n');
	},

	_debugMetrics: function(m, c) {
		var ctx = c.getContext('2d');
		var mi;
		ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
		for (var i in m) {
			mi = m[i];
			ctx.fillRect(mi.left, mi.top, mi.width, mi.height);
		}
	},

	_renderToCanvas: function(xElement, oCanvas, pDone) {
		var w = oCanvas.width;
		var h = oCanvas.height;
		var ctx = oCanvas.getContext('2d');
		var xs = new XMLSerializer();
		var sSVG = xs.serializeToString(xElement.documentElement);
		// proved to be inadequate
		var img = new Image();
		var svg = new Blob([sSVG], {type: 'image/svg+xml;charset=utf-8'});
		var url = URL.createObjectURL(svg);
		img.addEventListener('load', (function() {
		    ctx.drawImage(img, 0, 0);
		    URL.revokeObjectURL(url);
			this._computeMetrics(
				xElement.documentElement, 
				oCanvas.width, 
				oCanvas.height,
				(function(oMetrics) {
			    	var o = {
						canvas: oCanvas,
						metrics: oMetrics
					};
					if (this.bDebug) {
						this._debugMetrics(o.metrics, o.canvas);
					}
					this.trigger('render', o);
					if (pDone) {
						pDone(o);
					}
				}).bind(this)
			);
		}).bind(this));
		img.setAttribute('src', url);
	},

	_convertToBase64: function(imgSrc, img, cb) {
		var cvs = document.createElement('canvas');
		cvs.width = imgSrc.naturalWidth; 
		cvs.height = imgSrc.naturalHeight;
		var ctx = cvs.getContext('2d');
		ctx.drawImage(imgSrc, 0, 0);
		img.setAttribute('src', cvs.toDataURL());
	},


	_processImg: function(img, cb) {
		var sSrc = img.getAttribute('src');
		var sSign = 'data:image/';
		if (sSrc.substr(0, sSign.length) === sSign) {
			setTimeout(cb, 0);
			return;
		}
		var oImage = new Image();
		var pEvent = (function(oEvent) {
			this._convertToBase64(oImage, img);
			cb();
		}).bind(this);
		oImage.addEventListener('load', pEvent);
		oImage.src = this.BASEPATH + img.getAttribute('src');
	},

	_processStyle: function(style, cb) {
		var sSrc = style.getAttribute('src');
		if (!sSrc) {
			setTimeout(cb, 0);
			return;
		}
		style.removeAttribute('src');
		style.setAttribute('type', 'text/css');
		this._get(sSrc, function(data, err) {
			style.appendChild(document.createTextNode(data));
			cb();
		});
	},


	_processQueue: function(q, cb) {
		var x = q.shift();
		if (x) {
			switch (x[0]) {
				case 'style':
					this._processStyle(x[1], (function() {
						this._processQueue(q, cb);
					}).bind(this));
				break;

				case 'img':
					this._processImg(x[1], (function() {
						this._processQueue(q, cb);
					}).bind(this));
				break;
			}
		} else {
			cb();
		}
	},


	_processXML: function(oXML, cb) {
		var aQueue = [];
		var aStyles = oXML.getElementsByTagName('style');
		var aImages = oXML.getElementsByTagName('img');
		var i, oStyle, oImage;
		for (i = 0; i < aStyles.length; ++i) {
			oStyle = aStyles[i];
			oStyle.setAttribute('scoped', 'scoped');
			if (oStyle.getAttribute('src')) {
				aQueue.push(['style', oStyle, oStyle.getAttribute('src')]);
			}
		}
		for (i = 0; i < aImages.length; ++i) {
			oImage = aImages[i];
			if (oImage.getAttribute('src')) {
				if (!oImage.getAttribute('src').match(/^data/)) {
					aQueue.push(['img', oImage, oImage.getAttribute('src')]);
				}
			}
		}
		this._processQueue(aQueue, cb);
	},

	renderXML: function(data, oCanvas, pDone) {
		var sXML = this._renderSVGString(data, oCanvas.width, oCanvas.height);
		var oDoc = this._parseXMLString(sXML);
		this.trigger('load', {
			element: oDoc.documentElement
		});
		this._processXML(oDoc.documentElement, (function() {
			this.trigger('parse', {
				element: oDoc.documentElement
			});
			this._renderToCanvas(oDoc, oCanvas, pDone);
		}).bind(this));
	},

	render: function(sFile, oCanvas, pDone) {
		var aPath = sFile.split('/');
		var sFile = aPath.pop();
		this.BASEPATH = aPath.filter(function(x) {
			return x !== '';
		}).join('/');
		if (this.BASEPATH !== '') {
			this.BASEPATH += '/';
		}
		this._get(sFile, (function(data) {
			this.renderXML(data, oCanvas, pDone);
		}).bind(this));
	}
});

O2.mixin(O876.Rasterize, O876.Mixin.Events);

O2.createClass('O876.Snail', {
	/**
	 * Renvoie la largeur d'un carré de snail selon le niveau
	 * @param nLevel niveau
	 * @return int nombre d'élément sur le coté
	 */
	getLevelSquareWidth: function(nLevel) {
		return nLevel * 2 + 1;
	},
	
	/**
	 * Renvoie le nombre d'élément qu'il y a dans un niveau
	 * @param nLevel niveau
	 * @return int nombre d'élément
	 */
	getLevelItemCount: function(nLevel) {
		var w = this.getLevelSquareWidth(nLevel);
		return 4 * w - 4;
	},
	
	/**
	 * Renvoie le niveau auquel appartient ce secteur
	 * le niveau 0 correspond au point 0, 0
	 */
	getLevel: function(x, y) {
		x = Math.abs(x);
		y = Math.abs(y);
		return Math.max(x, y);
	},
	
	/**
	 * Renvoie tous les secteur de niveau spécifié
	 */
	crawl: function(nLevelMin, nLevelMax) {
		if (nLevelMax === undefined) {
			nLevelMax = nLevelMin;
		}
		if (nLevelMin > nLevelMax) {
			throw new Error('levelMin must be lower or equal levelMax');
		}
		if (nLevelMin < 0) {
			return [];
		}
		var aSectors = [];
		var n, x, y;
		for (y = -nLevelMax; y <= nLevelMax; ++y) {
			for (x = -nLevelMax; x <= nLevelMax; ++x) {
				n = this.getLevel(x, y);
				if (n >= nLevelMin && n <= nLevelMax) {
					aSectors.push({x: x, y: y});
				}
			}
		}
		return aSectors;
	}

});

/**
 * Class of multiple channels audio management
 * deals with sound effects and background music
 * deals with crossfading background musics
 */
 
/* globals O2 */

O2.createClass('O876.SoundSystem', {
	CHAN_MUSIC : 99,

	HAVE_NOTHING: 0,		// on n'a aucune information sur l'état du fichier audio ; mieux vaut ne pas lancer la lecture.
	HAVE_METADATA: 1,		// on a les méta données.
	HAVE_CURRENT_DATA: 2,	// on a assez de données pour jouer cette frames seulement.
	HAVE_FUTURE_DATA: 3,	// on a assez de données pour jouer les deux prochaines frames. 
	HAVE_ENOUGH_DATA: 4,	// on a assez de données.
	
	oBase : null,
	aChans : null,
	oMusicChan : null,
	nChanIndex : -1,

	bMute: false,
	bAllUsed: false,
	
	sCrossFadeTo: '',
	bCrossFading: false,

	sSndPlayedFile: '',
	fSndPlayedVolume: 0,
	nSndPlayedTime: 0,
	
	sFormat: '',
	sPath: '', 
	
	oInterval: null,

	__construct : function() {
		this.oBase = document.body;
		this.aChans = [];
		this.aAmbient = [];
		this._createMusicChannel();
	},
	
	
	/****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ******/
	/****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ******/
	/****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ******/
	/**
	 * Returns true if the specified audio file is worth playing.
	 * and false if it's not.
	 *
	 * A file is worth playing if it has not already started to play a few milliseconds ago.
	 * his is why a "time" value is being passed among parameters
	 * This prevents two similar sounds from being played at very small interval (which produce ugly sound experience)
	 * 
	 * The typical example :
	 * When the player fires five missiles, each missile producing the same sound,
	 * It's not a good idea to play five sounds !
	 * @param nTime current timestamp (given by Date.now() for example)
	 * @param sFile audio file name
	 * @param fVolume
	 */
	worthPlaying: function(nTime, sFile, fVolume) {
		if (this.nSndPlayedTime != nTime || this.sSndPlayedFile != sFile || this.fSndPlayedVolume != fVolume) {
			this.sSndPlayedFile = sFile;
			this.fSndPlayedVolume = fVolume;
			this.nSndPlayedTime = nTime;
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * Stops sounds from being played
	 * call unmute to restore normal audio function
	 */
	mute: function() {
		if (!this.bMute) {
			this.oMusicChan.pause();
			this.bMute = true;
		}
	},

	/**
	 * Restores normal audio function
	 * useful to restore sound after a mute() call
	 */
	unmute: function() {
		if (this.bMute) {
			this.oMusicChan.play();
			this.bMute = false;
		}
	},

	/**
	 * Destroys all audio channels
	 */
	free: function() {
		this.setChannelCount(0);
		this._freeMusicChannel();
	},

	/**
	 * Sets the number of maximum channels
	 * If called more than one time, it will 
	 * delete any previous created channel,
	 * and will rebuild new fresh ones.
	 * @param int n number if channels
	 */
	setChannelCount: function(n) {
		var c = this.aChans;
		while (c.length > n) {
			c.pop().remove();
		}
		while (c.length < n) {
			this._addChan();
		}
	},

	/**
	 * returns the maximum number of useable channels
	 * @return int
	 */
	getChannelCount: function() {
		return this.aChans.length;
	},

	/**
	 * Play another music track, replacing, if needed, the previous music track.
	 * Music tracks are play in a separated channel
	 * @param sFile new file
	 */
	playMusic : function(sFile) {
		var oChan = this._setChanSource(this.oMusicChan, sFile);
        oChan.loop = true;
		oChan.load();
		if (!this.bMute) {
			oChan.play();
		}
	},

	/**
	 * Define the directory where sound files are stored
	 * @param s string, path where sound files are stored
	 */
	setPath: function(s) {
		this.sPath = s;
	},

	/**
	 * Diminue graduellement le volume sonore du canal musical
	 * puis change le fichier sonore
	 * puis remonte graduellement le volume
	 * le programme d'ambience est reseté par cette manip
	 */
	crossFadeMusic: function(sFile) {
		if (sFile === undefined) {
			throw new Error('sound file is not specified');
		}
		if (this.bCrossFading) {
			this.sCrossFadeTo = sFile;
			return;
		}
		var iVolume = 100;
		var nVolumeDelta = -10;
		this.bCrossFading = true;
		if (this.oInterval) {
			window.clearInterval(this.oInterval);
		}
		this.oInterval = window.setInterval((function() {
			iVolume += nVolumeDelta;
			this.oMusicChan.volume = Math.min(1, Math.max(0, iVolume / 100));
			if (iVolume <= 0) {
				this.playMusic(sFile);
				this.oMusicChan.volume = 1;
				window.clearInterval(this.oInterval);
				this.oInterval = null;
				this.bCrossFading = false;
				if (this.sCrossFadeTo) {
					this.crossFadeMusic(this.sCrossFadeTo);
					this.sCrossFadeTo = '';
				}
			}
		}).bind(this), 100);
	},

	/**
	 * Starts a sound file playback
	 */
	play : function(sFile, fVolume) {
		var nChan = null;
		var oChan = null;
		// check if we should cancel the play call
		if (this.bMute || sFile === undefined) {
			return -1;
		}
		// case : music channel -> redirect to playMusic
		if (nChan === this.CHAN_MUSIC) {
			this.playMusic(sFile);
			return nChan;
		} else if (this._hasChan()) { 
			// checks channel availability
			if (nChan === null) {
				// get a free channel, if none specified
				nChan = this._getFreeChan(sFile);
			}
			oChan = this.aChans[nChan];
		} else {
			// no free channel available
			oChan = null;
			return -1;
		}
		if (oChan !== null) {
			// we got a channel
			if (oChan.__file !== sFile) {
				// new file
				oChan = this._setChanSource(oChan, sFile);
				oChan.__file = sFile;
				oChan.load();
			} else if (oChan.readyState > this.HAVE_NOTHING) {
				// same file, play again from start
				oChan.currentTime = 0;
				oChan.play();
			}
		} else {
			// could not get a channel:
			// exit in shame
			return -1;
		}
		// set volume, if specified
		if (fVolume !== undefined) {
			oChan.volume = fVolume;
		}
	},








	/****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ******/
	/****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ******/
	/****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ******/




	/**
	 * Sets a channel source
	 * Uses default path and extension
	 * This function is used internaly : use play()
	 * @param oChan HTMLAudio Element
	 * @param sSrc what file to play (neither path nor extension)
	 */
	_setChanSource: function(oChan, sSrc) {
		if (sSrc === undefined) {
			throw new Error('undefined sound');
		}
		var iChan = this.aChans.indexOf(oChan);
		if (iChan >= 0) {
			oChan.remove();
            oChan = this._addChan(iChan);
		} else if (oChan === this.oMusicChan) {
            oChan = this._createMusicChannel();
		}
		oChan.src = this.sPath + '/' + this.sFormat + '/' + sSrc + '.' + this.sFormat;
		return oChan;
	},
	
	
	/**
	 * creates a new audio channel element
	 * and appends it to the DOM
	 * @return HTMLAudioElement
	 */
	_createChan: function() {
		var oChan = document.createElement('audio');
		this.oBase.appendChild(oChan);
		return oChan;
	},

	/**
	 * Adds and initializes a new Audio channel
	 * @return HTMLAudioElement
	 */
	_addChan : function(i) {
		var oChan = this._createChan();
		oChan.setAttribute('preload', 'auto');
		oChan.setAttribute('autoplay', 'autoplay');
		oChan.__file = '';
		if (i === undefined) {
            this.aChans.push(oChan);
        } else {
			this.aChans[i] = oChan;
		}
		this.bAllUsed = false;
		return oChan;
	},

	/**
	 * returns true if the specified channel iis currently playing
	 * the specified sound file
	 * @param nChan int channel number
	 * @param sFile string sound file name
	 * @return boolean
	 */
	_isChanFree : function(nChan, sFile) {
		// case : music channel
		if (nChan == this.CHAN_MUSIC) {
			return this.oMusicChan.ended;
		}
		// check specified channel number validity
		nChan = Math.max(0, Math.min(this.aChans.length - 1, nChan));
		var oChan = this.aChans[nChan];
		if (sFile === undefined) {
			return oChan.ended;
		} else {
			var bEmpty = oChan.__file === '';
			var bNotPlaying = oChan.ended;
			var bAlreadyLoaded = sFile == oChan.__file;
			return bEmpty || (bNotPlaying && bAlreadyLoaded);
		}
	},

	_getFreeChan : function(sFile) {
		if (!this._hasChan()) {
			return -1;
		}
		var iChan, nChanCount;
		for (iChan = 0, nChanCount = this.aChans.length; iChan < nChanCount; ++iChan) {
			if (this._isChanFree(iChan, sFile)) {
				return iChan;
			}
		}
		for (iChan = 0, nChanCount = this.aChans.length; iChan < nChanCount; ++iChan) {
			if (this._isChanFree(iChan)) {
				return iChan;
			}
		}
		this.nChanIndex = (this.nChanIndex + 1) % this.aChans.length;
		return this.nChanIndex;
	},

	_hasChan : function() {
		return this.aChans.length > 0;
	},

	_freeMusicChannel: function() {
		if (this.oMusicChan) {
			this.oMusicChan.remove();
			this.oMusicChan = null;
		}		
	},

	_createMusicChannel: function() {
		this._freeMusicChannel();
		this.oMusicChan = this._createChan();
		if (this.oMusicChan.canPlayType('audio/ogg')) {
			this.sFormat = 'ogg';
		} else if (this.oMusicChan.canPlayType('audio/mp3')) {
			this.sFormat = 'mp3';
		} else {
			throw new Error('neither ogg nor mp3 can be played back by this browser');
		}
		return this.oMusicChan;
	}

});


/**
 * @class O876.ThemeGenerator
 * Générateur de Thème CSS
 * Permet de définir un theme dynamiquement à partir d'une couleur.
 * L'objet theme fournit est un objet associatif dont les clé sont des selecteur CSS 
 * et les valeurs sont des couleurs générées.
 * les couleurs générées ont ce format : $color(-text)(-darken-[1-5] | -lighten-[1-5])
 * exemple de couleur générées :
 * - $color : la couleur de base (appliquée a des backgrounds)
 * - $color-lighten-2 : la couleur de base légèrement plus claire (appliquée a des backgrounds)
 * - $color-darken-2 : la couleur de base légèrement plus foncée (appliquée a des backgrounds)
 * - $color-text : la couleur de base (appliquée à du texte) 
 * - $color-text-lighten-5 : la couleur de base fortemennt éclaircée (appliquée a du texte)
 * 
 * exemple de thème :
 * 
 * {
 * 		body: ['$color-ligthen-4', '$color-text-darken-5'],
 * 		div.test: ['$color', '$color-text-lighten-3']
 * }
 */
O2.createClass('O876.ThemeGenerator', {
	
	_oStyle: null,
	
	define: function(sColor, oTheme) {
		var oRainbow = new O876.Rainbow();
		var aLighten = oRainbow.spectrum(sColor, '#FFFFFF', 7);
		var aDarken = oRainbow.spectrum(sColor, '#000000', 7);
		var sName = '$color';
	
		var oCSS = {};
		oCSS[sName] = 'background-color : ' + sColor;
		oCSS[sName + '-text'] = 'color : ' + sColor;
		
		for (var i = 1; i < 6; ++i) {
			oCSS[sName + '.lighten-' + i] = 'background-color: ' + aLighten[i];
			oCSS[sName + '.darken-' + i] = 'background-color: ' + aDarken[i];
			oCSS[sName + '-text.lighten-' + i] = 'color: ' + aLighten[i];
			oCSS[sName + '-text.darken-' + i] = 'color: ' + aDarken[i];
			oCSS[sName + '-border.lighten-' + i] = 'border-color: ' + aLighten[i];
			oCSS[sName + '-border.darken-' + i] = 'border-color: ' + aDarken[i];
		}
		
		var aTheme = [];
		
		for (var sClass in oTheme) {
			if (oTheme.hasOwnProperty(sClass)) {
                aTheme.push(sClass + ' { ' + oTheme[sClass].map(function (t) {
                        return oCSS[t];
                    }).join('; ') + '; }');
            }
		}
	
		
		if (this._oStyle) {
			this._oStyle.remove();
			this._oStyle = null;
		}
		var oStyle = document.createElement('style');
		oStyle.setAttribute('type', 'text/css');
		oStyle.innerHTML = aTheme.join('\n').replace(/\$color/g, sName);
		this._oStyle = oStyle; 
		document.getElementsByTagName('head')[0].appendChild(oStyle);
	}
});

/**
 * Outil d'exploitation de requete Ajax
 * Permet de chainer les requete ajax avec un système de file d'attente.
 * good to GIT
 */

O2.createClass('O876.XHR', {
	_oInstance : null,
	aQueue: null,
	_bAjaxing : false,
	pCurrentCallback : null,
	
	__construct: function() {
		this.aQueue = [];
	},

	// Renvoie une instance XHR
	getInstance : function() {
		if (this._oInstance === null) {
			this._oInstance = new XMLHttpRequest();
			this._oInstance.addEventListener('readystatechange', this._dataReceived.bind(this));
		}
		return this._oInstance;
	},

	_dataReceived : function(oEvent) {
		var xhr = oEvent.target;
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var n = this.aQueue.shift();
			if (n) {
				if (xhr.status == 200) {
					n.callback(xhr.responseText);
				} else {
					n.callback(null, xhr.status.toString());
				}
			}
			if (this.aQueue.length) {
				this.runAjax();
			} else {
				this._bAjaxing = false;
			}
		}
	},

	runAjax: function() {
		this._bAjaxing = true;
		var q = this.aQueue;
		if (q.length) {
			var n = q[0];
			var xhr = this.getInstance();
			xhr.open(n.method, n.url, true);
			xhr.send(n.data);
		}
	},

	autoRunAjax: function() {
		if (!this._bAjaxing) {
			this.runAjax();
		}
	},


	/**
	 * Get data from server asynchronously and feed the spécified DOM Element
	 * 
	 * @param string sURL url
	 * @param object/string/function oTarget
	 * @return string
	 */
	get : function(sURL, pCallback) {
		if (sURL === null) {
			throw new Error('url is invalid');
		}
		this.aQueue.push({method: 'GET', data: null, url: sURL, callback: pCallback});
		this.autoRunAjax();
	},
	
	post: function(sURL, sData, pCallback) {
		if (typeof sData === 'object') {
			sData = JSON.stringify(sData);
		}
		this.aQueue.push({method: 'POST', data: sData, url: sURL, callback: pCallback});
		this.autoRunAjax();
	},
	
	/**
	 * Get data from server synchronously.
	 * It is known that querying synchronously is bad for health and makes animals suffer. 
	 * So don't use synchronous ajax calls.
	 */
	getSync: function(sURL) {
		console.warn('Synchronous Ajax Query (url : ' + sURL + ') ! It is known that querying synchronously is bad for health and makes animals suffer.');
		var xhr = this.getInstance();
		xhr.open('GET', sURL, false);
	    xhr.send(null);
	    if (xhr.status == 200) {
	    	return xhr.responseText;
	    } else {
	    	throw new Error('XHR failed to load: ' + sURL + ' (' + xhr.status.toString() + ')');
	    }
	},

	postSync: function(sURL, sData) {
		console.warn('Synchronous Ajax Query (url : ' + sURL + ') ! It is known that querying synchronously is bad for health and makes animals suffer.');
		var xhr = this.getInstance();
		xhr.open('POST', sURL, false);
	    xhr.send(sData);
	    if (xhr.status == 200) {
	    	return xhr.responseText;
	    } else {
	    	throw new Error('XHR failed to post to: ' + sURL + ' (' + xhr.status.toString() + ')');
	    }
	}
});

/**
 * Parse a string of format "?param1=value1&param2=value2"
 * useful when it comes to get parameters from an url
 * good to GIT
 */
O2.createObject('O876.parseSearch' , function(sSearch) {
	if (sSearch) {
		var nQuest = sSearch.indexOf('?');
		if (nQuest >= 0) {
			sSearch = sSearch.substr(nQuest + 1);
		} else {
			return {};
		}
	} else {
		sSearch = window.location.search.substr(1);
	}
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		query  = sSearch,
		_decode = function(s) {
			return decodeURIComponent(s.replace(pl, ' '));
		};
	var oURLParams = {};
	while (match = search.exec(query)) {
	   oURLParams[_decode(match[1])] = _decode(match[2]);
	}
	return oURLParams;
});

/**
 * O876 Toolkit
 * This tool is used to determine the type of all parameters passed
 * to a function, durinng a call.
 * usually you type : O876.typeMap(arguments, format)
 * the format controls the output format (either array or string)
 * the function returns an array or a string.
 * each item stands for the type of the matching argument
 * the 'short' version returns
 *
 * undefined : undefined / null
 * number : number
 * object : object, not an array, not null
 * function : function
 * boolean : boolean
 * array : array
 *
 * goot to GIT
 */ 
O2.createObject('O876.typeMap', function(aArgs, sFormat) {
	var aOutput = Array.prototype.slice.call(aArgs, 0).map(function(x) {
		var tx = (typeof x);
		switch (tx) {
			case 'object':
				if (x === null) {
					return 'undefined';
				} else if (Array.isArray(x)) {
					return 'array';
				} else {
					return 'object';
				}
				break;
				
			default:
				return tx;
		}
	});
	switch (sFormat) {
		case 'short':
			return aOutput.map(function(x) {
				return x.charAt(0);
			}).join('');
		break;

		default:
			return aOutput;
	}
});

/** Animation : Classe chargée de calculer les frames d'animation
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */
O2.createClass('O876_Raycaster.Animation',  {
	nStart : 0, // frame de début
	nIndex : 0, // index de la frame en cours d'affichage
	nCount : 0, // nombre total de frames
	nDuration : 0, // durée de chaque frame, plus la valeur est grande plus l'animation est lente
	nTime : 0, // temps
	nLoop : 0, // type de boucle 1: boucle forward; 2: boucle yoyo 3: random
	nFrame: 0, // Frame actuellement affichée
	
	nDirLoop: 1,  // direction de la boucle (pour yoyo)
	bOver: false,
	
	assign: function(a) {
		this.bOver = false;
		if (a) {
			this.nStart = a.nStart;
			this.nCount = a.nCount;
			this.nDuration = a.nDuration;
			this.nLoop = a.nLoop;
			this.nIndex = a.nIndex % this.nCount;
			this.nTime = a.nTime % this.nDuration;
		} else {
			this.nCount = 0;
		}
	},
	
	animate : function(nInc) {
		if (this.nCount <= 1 || this.nDuration === 0) {
			return this.nIndex + this.nStart;
		}
		this.nTime += nInc;
		// Dépassement de duration (pour une seule fois)
		if (this.nTime >= this.nDuration) {
			this.nTime -= this.nDuration;
			if (this.nLoop === 3) {
				this.nIndex = Math.random() * this.nCount | 0;
			} else {
				this.nIndex += this.nDirLoop;
			}
		}
		// pour les éventuels très gros dépassement de duration (pas de boucle)
		if (this.nTime >= this.nDuration) {
			this.nIndex += this.nDirLoop * (this.nTime / this.nDuration | 0);
			this.nTime %= this.nDuration;
		}
		
		switch (this.nLoop) {
			case 0:
				if (this.nIndex >= this.nCount) {
					this.nIndex = this.nCount - 1;
					this.bOver = true;
				}
				break;

			case 1:
				if (this.nIndex >= this.nCount) {
					this.nIndex = 0;
				}
			break;
				
			case 2:
				if (this.nIndex >= this.nCount) {
					this.nIndex = this.nCount - 1;
					this.nDirLoop = -1;
				}
				if (this.nIndex <= 0) {
					this.nDirLoop = 1;
					this.nIndex = 0;
				}
			break;

			default:
				if (this.nIndex >= this.nCount) {
					this.nIndex = this.nCount - 1;
				}
		}
		this.nFrame = this.nIndex + this.nStart;
		return this.nFrame;
	},

	reset : function() {
		this.nIndex = 0;
		this.nTime = 0;
		this.nDirLoop = 1;
		this.bOver = false;
	},

	isOver: function() {
		return this.bOver;
	}
});

// Block fields manager
O2.createClass('O876_Raycaster.BF',  {
	getCode: function(n) {
		return n & 0xFF;
	},

	modifyCode: function(n, v) {
		return (n & 0xFFFFFF00) | v;
	},
	
	getPhys: function(n) {
		return (n >> 8) & 0xFF;
	},

	modifyPhys: function(n, v) {
		return (n & 0xFFFF00FF) | (v << 8);
	},
	
	getOffs: function(n) {
		return (n >> 16) & 0xFF;
	},

	modifyOffs: function(n) {
		return (n & 0xFF00FFFF) | (v << 16);
	},
});

/** Un blueprint est un élément de la palette de propriétés
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * Les blueprint servent de modèle et de référence pour alimenter les propriétés des sprites créé dynamiquement pendant le jeu
 */
O2.createClass('O876_Raycaster.Blueprint', {
  sId: '',
  nType: 0,
  // propriétés visuelles
  oTile: null,        // référence objet Tile

  // propriétés physiques
  nPhysWidth: 0,      // Largeur zone impactable
  nPhysHeight: 0,     // Hauteur zone impactable
  sThinker: '',       // Classe de Thinker
  nFx: 0,             // Gfx raster operation
  oXData: null,       // Additional data

  __construct: function(oData) {
    if (oData !== undefined) {
      this.nPhysWidth = oData.width;
      this.nPhysHeight = oData.height;
      this.sThinker = oData.thinker;
      this.nFx = oData.fx;
      this.nType = oData.type;
      if ('data' in oData) {
        this.data(oData.data);
      }
    }
  }
});

O2.mixin(O876_Raycaster.Blueprint, O876.Mixin.Data);

/** Entrée sortie clavier - utilise les code ES6
 * O876 Raycaster project
 * @date 2018-02-12
 * @author Raphaël Marandet 
 * Memorise les touches clavier enfoncées
 */
O2.createClass('O876_Raycaster.ES6KeyboardDevice', {
	oKeys: null,	// Index inversée Code->Action
	aKeyBuffer: null,
	nKeyBufferSize: 16,
	bUseBuffer: true,
	aAliases: null,
	oHandlers: null,

	__construct: function() {
		this.oKeys = {};
		this.oHandlers = {};
		this.aAliases = {};
		// Gros tableau pour capter plus rapidement les touches...
		// peu élégant et peu économe mais efficace.
		this.aKeyBuffer = [];
	},

    getKey: function(sCode) {
		if (sCode in this.oKeys) {
            return this.oKeys[sCode];
		} else {
			return 0;
		}
    },

    setAliases: function(a) {
		this.aAliases = a;
	},

	keyAction: function(sCode, nVal) {
        this.oKeys[sCode] = nVal;
	},

	keyBufferPush: function(nKey) {
		if (this.bUseBuffer && nKey && this.aKeyBuffer.length < this.nKeyBufferSize) {
			this.aKeyBuffer.push(nKey);
		}
	},

	eventKeyUp: function(oEvent) {
		var sCode = oEvent.key;
		if (sCode in this.aAliases) {
			sCode = this.aAliases[sCode];
		}
		this.keyBufferPush('-' + sCode);
		this.keyAction(sCode, 2);
		return false;
	},

	eventKeyDown: function(oEvent) {
		var sCode = oEvent.key;
		if (sCode in this.aAliases) {
			sCode = this.aAliases[sCode];
		}
		this.keyBufferPush(sCode);
		this.keyAction(sCode, 1);
		return false;
	},

	/** 
	 * renvoie le code clavier de la première touche enfoncée du buffer FIFO
	 * renvoie 0 si aucune touche n'a été enfoncée
	 * @return int
	 */
	inputKey: function() {
		if (this.aKeyBuffer.length) {
			return this.aKeyBuffer.shift();
		} else {
			return 0;
		}
	},

	/**
	 * Will add event listener and keep track of it for future remove
	 * @param sEvent DOM Event name
	 * @param pHandler event handler function
	 */
	plugHandler: function(sEvent, pHandler) {
		var p = pHandler.bind(this);
		this.oHandlers[sEvent] = p;
		document.addEventListener(sEvent, p, false);
	},

	/**
	 * Will remove previously added event handler
	 * Will do nothing if handler has not been previously added
	 * @param sEvent DOM event name
	 */
	unplugHandler: function(sEvent) {
		if (sEvent in this.oHandlers) {
			var p = this.oHandlers[sEvent];
			document.removeEventListener(sEvent, p);
			delete this.oHandlers[sEvent];
		}
	},

	plugHandlers: function() {
		this.plugHandler('keyup', this.eventKeyUp);
		this.plugHandler('keydown', this.eventKeyDown);
	},
	
	unplugHandlers: function() {
		this.unplugHandler('keyup');
		this.unplugHandler('keydown');
	}
});


/** Entrée sortie clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Memorise les touches clavier enfoncées
 */
O2.createClass('O876_Raycaster.KeyboardDevice', {
	aKeys: null,	// Index inversée Code->Action
	aKeyBuffer: null,
	nKeyBufferSize: 16,
	bUseBuffer: true,
	aAliases: null,
	oHandlers: null,

	__construct: function() {
		this.aKeys = [];
		this.oHandlers = {};
		this.aAliases = {};
		// Gros tableau pour capter plus rapidement les touches...
		// peu élégant et peu économe mais efficace.
		for (var i = 0; i < 256; i++) {
			this.aKeys.push(0);	 
		}
		this.aKeyBuffer = [];
	},

	getKey: function(n) {
		return this.aKeys[n];
	},
	
	setAliases: function(a) {
		this.aAliases = a;
	},

	keyAction: function(k, n) {
		this.aKeys[k] = n;
	},
	
	keyBufferPush: function(nKey) {
		if (this.bUseBuffer && nKey && this.aKeyBuffer.length < this.nKeyBufferSize) {
			this.aKeyBuffer.push(nKey);
		}
	},

	eventKeyUp: function(e) {
		var oEvent = window.event ? window.event : e;
		var nCode = oEvent.charCode ? oEvent.charCode : oEvent.keyCode;
		if (nCode in this.aAliases) {
			nCode = this.aAliases[nCode];
		}
		this.keyBufferPush(-nCode);
		this.keyAction(nCode, 2);
		return false;
	},

	eventKeyDown: function(e) {
		var oEvent = window.event ? window.event : e;
		var nCode = oEvent.charCode ? oEvent.charCode : oEvent.keyCode;
		if (nCode in this.aAliases) {
			nCode = this.aAliases[nCode];
		}
		this.keyBufferPush(nCode);
		this.keyAction(nCode, 1);
		return false;
	},

	/** 
	 * renvoie le code clavier de la première touche enfoncée du buffer FIFO
	 * renvoie 0 si aucune touche n'a été enfoncée
	 * @return int
	 */
	inputKey: function() {
		if (this.aKeyBuffer.length) {
			return this.aKeyBuffer.shift();
		} else {
			return 0;
		}
	},

	/**
	 * Will add event listener and keep track of it for future remove
	 * @param sEvent DOM Event name
	 * @param pHandler event handler function
	 */
	plugHandler: function(sEvent, pHandler) {
		var p = pHandler.bind(this);
		this.oHandlers[sEvent] = p;
		document.addEventListener(sEvent, p, false);
	},

	/**
	 * Will remove previously added event handler
	 * Will do nothing if handler has not been previously added
	 * @param sEvent DOM event name
	 */
	unplugHandler: function(sEvent) {
		if (sEvent in this.oHandlers) {
			var p = this.oHandlers[sEvent];
			document.removeEventListener(sEvent, p);
			delete this.oHandlers[sEvent];
		}
	},

	plugHandlers: function() {
		this.plugHandler('keyup', this.eventKeyUp);
		this.plugHandler('keydown', this.eventKeyDown);
	},
	
	unplugHandlers: function() {
		this.unplugHandler('keyup');
		this.unplugHandler('keydown');
	}
});


// Device Motion

O2.createClass('O876_Raycaster.MotionDevice', {

	boundHandleMotion: null,

	aRanges: null,
	oOutput: null,
	oEventAngles: null,
	sMode: 'Acceleration',
	
	__construct: function() {
		this.oOutput = {
			alpha: 0,
			beta: 0,
			gamma: 0
		};
		this.createAngleRange('alpha', 0);
		this.createAngleRange('alpha', 1);
		this.createAngleRange('beta', 0);
		this.createAngleRange('beta', 1);
		this.createAngleRange('gamma', 0);
		this.createAngleRange('gamma', 1);
	},
	
	createAngleRange: function(sAngle, n) {
		if (!this.aRanges) {
			this.aRanges = {};
		}
		if (!(sAngle in this.aRanges)) {
			this.aRanges[sAngle] = [];
		}
		var a = new O876_Raycaster.MotionDeviceRange();
		this.aRanges[sAngle][n] = a;
	},
	
	getAngleRange: function(sAngle, n) {
		return this.aRanges[sAngle][n];
	},
	
	compute: function(f) {
		this.oEventAngles = f;
		var i, l, r, R = this.aRanges;
		var oOutput = {}, aOutput;
		var sAngle;
		for (sAngle in R) {
			r = R[sAngle];
			l = r.length;
			aOutput = [];
			for (i = 0; i < l; ++i) {
				aOutput[i] = r[i].compute(f[sAngle]);
			}
			oOutput[sAngle] = aOutput;
		}
		for (sAngle in oOutput) {
			r = oOutput[sAngle];
			if (r[0] != 0) {
				this.oOutput[sAngle] = -r[0];
			} else {
				this.oOutput[sAngle] = r[1];
			}
		}
		return this.oOutput;
	},
	
	getAngleValue: function(sAngle) {
		if (this.oOutput) {
			return this.oOutput[sAngle];
		} else {
			return 0;
		}
	},
	
	setMotionCaptureMethod: function(s) {
		var sAllowed = 'Acceleration Rotation';
		var aAllowed = sAllowed.split(' ');
		if (aAllowed.indexOf(s) >= 0) {
			this.sMode = s;
		} else {
			throw new Error('Device motion capture method unknown : "' + s + '". Allowed values are "' + sAllowed + '"');
		}
	},
	
	handleMotionRotation: function(oEvent) {
		var rr = oEvent.rotationRate;
		this.compute({
			alpha: rr.alpha,
			beta: rr.beta,
			gamma: rr.gamma
		});
	},
	
	handleMotionAcceleration: function(oEvent) {
		var aig = oEvent.accelerationIncludingGravity;
		this.compute({
			alpha: aig.x,
			beta: aig.y,
			gamma: aig.z
		});
	},	

	/**
	 * Branche le handler de leture souris à l"élément spécifié
	 */
	plugHandlers: function(oElement) {
		this.boundHandleMotion = this['handleMotion' + this.sMode].bind(this);
		window.addEventListener('devicemotion', this.boundHandleMotion, false);
	},
	
	unplugHandlers: function() {
		window.removeEventListener('devicemotion', this.boundHandleMotion);
	},
});

O2.createClass('O876_Raycaster.MotionDeviceRange', {
	min: 0,
	max: 0,
	value: 0,
	bInvert: false,
	
	setRange: function(min, max, bInvert) {
		this.min = parseFloat(min);
		this.max = parseFloat(max);
		this.bInvert = !!bInvert;
	},
	
	compute: function(v) {
		return this.value = this.prorata(v, this.min, this.max);
	},
	
	prorata: function(v, m1, m2) {
		if (m1 == 0 && m2 == 0) {
			return 0;
		}
		var vLen, vNorm, vMin, vMax, bInvert = this.bInvert;
		if (!bInvert) {
			vMin = Math.min(m1, m2);
			vMax = Math.max(m1, m2);
			if (v >= vMin) {
				vLen = vMax - vMin;
				vNorm = v - vMin;
				return Math.min(1, vNorm / vLen);
			} else {
				return 0;
			}
		} else {
			vMin = Math.max(m1, m2);
			vMax = Math.min(m1, m2);
			if (v <= vMin) {
				vLen = vMax - vMin;
				vNorm = v - vMin;
				return Math.min(1, vNorm / vLen);
			} else {
				return 0;
			}
		}
	}
});

/** Entrée de la souris
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Mémorise les coordonnée de la souris et les touche enfoncées
 */
O2.createClass('O876_Raycaster.MouseDevice', {
	nButtons: 0,
	aEventBuffer: null,
	nKeyBufferSize: 16,
	bUseBuffer: true,
	nSecurityDelay: 0,
	oElement: null,
	vMouse: null,
	oHandlers: null,
	
	__construct: function() {
		this.aEventBuffer = [];
		this.oHandlers = {};
		this.vMouse = {clientX: 0, clientY: 0};
	},
	
	clearBuffer: function() {
		this.aEventBuffer = [];
	},

	getElementPosition: function() {
		var e = this.oElement;
		var x = e.offsetLeft;
		var y = e.offsetTop;
		while (e.offsetParent) {
			e = e.offsetParent;
			x += e.offsetLeft;
			y += e.offsetTop;
		}
		return {x: x, y: y};
	},

	getMousePosition: function(oEvent) {
		var cx = oEvent.clientX || oEvent.x;
		var cy = oEvent.clientY || oEvent.y;
		var p = this.getElementPosition();
		var x = cx - p.x;
		var y = cy - p.y;
		var e = this.oElement;
		var xReal = x * e.width / e.offsetWidth | 0;
		var yReal = y * e.height / e.offsetHeight | 0;
		return {x: xReal, y: yReal};
	},

	eventMouseUp: function(oEvent) {
		this.nButtons = oEvent.buttons;
		if (this.bUseBuffer && this.aEventBuffer.length < this.nKeyBufferSize) {
			var p = this.getMousePosition(oEvent);
			this.aEventBuffer.push([0, p.x, p.y, oEvent.button]);
		}
		return false;
	},

	eventMouseDown: function(oEvent) {
		this.nButtons = oEvent.buttons;
		if (this.bUseBuffer && this.aEventBuffer.length < this.nKeyBufferSize) {
			var p = this.getMousePosition(oEvent);
			this.aEventBuffer.push([1, p.x, p.y, oEvent.button]);
		}
		if (oEvent.button === 2) {
			if (oEvent.stopPropagation) {
				oEvent.stopPropagation();
			}
			oEvent.cancelBubble = true;
		}
		return false;
	},

	eventMouseMove: function(oEvent) {
		this.vMouse.x = oEvent.clientX;
		this.vMouse.y = oEvent.clientY;
	},
	
	eventMouseClick: function(oEvent) {
		if (oEvent.button === 2) {
			if (oEvent.stopPropagation) {
				oEvent.stopPropagation();
			}
			oEvent.cancelBubble = true;
		}
		return false;
	},

	/**
	 * Renvoie la position du curseur de la souris dans le context du canvas associé
	 * @return {*}
	 */
	getPixelPointer: function() {
		return this.getMousePosition(this.vMouse);
	},
	
	/** 
	 * Renvoie le prochain message souris précédemment empilé
	 * ou renvoie "undefined" s'il n'y a pas de message
	 * un message prend ce format :
	 * [ nUpOrDown, X, Y, Button ]
	 * nUpOrDown vaut 0 quand le bouton de la souris est relaché et vaut 1 quand le bouton est enfoncé
	 * il vaut 3 quand la molette de la souris est roulée vers le haut, et -3 vers le bas 
	 */
	readMouse: function() {
		if (this.nSecurityDelay > 0) {
			--this.nSecurityDelay;
			this.clearBuffer();
			return null;
		} else {
			return this.aEventBuffer.shift();
		}
	},
	
	mouseWheel: function(e) {
		var oEvent = window.event ? window.event : e;
		var nDelta = 0;
		if (oEvent.wheelDelta) {
			nDelta = oEvent.wheelDelta; 
		} else {
			nDelta = -40 * oEvent.detail;
		}
		if (this.bUseBuffer && this.aEventBuffer.length < this.nKeyBufferSize) {
			if (e.wheelDelta) {
				nDelta = oEvent.wheelDelta > 0 ? 3 : -3; 
				this.aEventBuffer.push([nDelta, 0, 0, 3]);
			} else {
				nDelta = oEvent.detail > 0 ? -3 : 3;
				this.aEventBuffer.push([nDelta, 0, 0, 3]);
			}
		}
	},

	/**
	 * Will add event listener and keep track of it for future remove
	 * @param sEvent DOM Event name
	 * @param pHandler event handler function
	 */
	plugHandler: function(sEvent, pHandler) {
		var p = pHandler.bind(this);
		this.oHandlers[sEvent] = p;
		this.oElement.addEventListener(sEvent, p, false);
	},

	/**
	 * Will remove previously added event handler
	 * Will do nothing if handler has not been previously added
	 * @param sEvent DOM event name
	 */
	unplugHandler: function(sEvent) {
		if (sEvent in this.oHandlers) {
			var p = this.oHandlers[sEvent];
			this.oElement.removeEventListener(sEvent, p);
			delete this.oHandlers[sEvent];
		}
	},

	/**
	 * Branche le handler de leture souris à l"élément spécifié
	 */
	plugHandlers: function(oElement) {
		this.oElement = oElement;
		this.plugHandler('mousedown', this.eventMouseDown);
		this.plugHandler('click', this.eventMouseClick);
		this.plugHandler('mouseup', this.eventMouseUp);
		this.plugHandler('mousewheel', this.mouseWheel);
		this.plugHandler('DOMMouseScroll', this.mouseWheel);
		this.plugHandler('mousemove', this.eventMouseMove);
	},
	
	unplugHandlers: function() {
		('mousedown click mouseup mousewheel DOMMouseScroll mousemove').split(' ').forEach(this.unplugHandler.bind(this));
	}
});


O2.createClass('O876_Raycaster.FrameCounter', {

	bCheck: false, // when true the FPS is being checked...
	bLoop: true,
	// if FPS is too low we decrease the LOD
	nFPS: 0,
	nTimeStart: null,
	nCount: 0,
	nSeconds: 0,
	nAcc: 0,
	
	/**
	 * Starts to count frames per second
	 */
	start: function(nTimeStamp) {
		this.nTimeStart = nTimeStamp;
		this.bCheck = true;
		this.nCount = 0;
	},
	
	getAvgFPS: function() {
		return ((this.nAcc / this.nSeconds) * 10 | 0) / 10;
	},

	/**
	 * count frames per second
	 */
	check: function(nNowTimeStamp) {
		if (this.nTimeStart === null) {
			this.start(nNowTimeStamp);
		}
		if (this.bCheck) {
			++this.nCount;
			if ((nNowTimeStamp - this.nTimeStart) >= 1000) {
				this.nFPS = this.nCount;
				this.nAcc += this.nCount;
				++this.nSeconds;
				this.bCheck = this.bLoop;
				if (this.bCheck) {
					this.start(nNowTimeStamp);
				}
				return true;
			}
		}
		return false;
	},

});

O2.createObject('O876_Raycaster.FullScreen', {
	enter: function(oElement) {
		oElement.requestFullScreen = oElement.requestFullScreen || oElement.webkitRequestFullScreen || oElement.mozRequestFullScreen;
		document.onfullscreenchange = O876_Raycaster.FullScreen.changeEvent;
		document.onwebkitfullscreenchange = O876_Raycaster.FullScreen.changeEvent;
		document.onmozfullscreenchange = O876_Raycaster.FullScreen.changeEvent;
		oElement.requestFullScreen(oElement.ALLOW_KEYBOARD_INPUT);
	},
	
	isFullScreen: function() {
		return document.webkitIsFullScreen || document.mozFullScreen;
	},
	
	changeEvent: function(oEvent) {
		
	}
	
});

/** GXEffect : Classe de base pour les effets graphiques temporisés
 * O876 raycaster project
 * @class O876_Raycaster.GXEffect
 * 2012-01-01 Raphaël Marandet
 */
O2.createClass('O876_Raycaster.GXEffect', {
	sClass: 'Effect',
	oRaycaster: null,     // référence de retour au raycaster (pour le rendu)

	__construct: function(oRaycaster) {
		this.oRaycaster = oRaycaster;
	},

	/** Cette fonction doit renvoyer TRUE si l'effet est fini
	* @return bool
	*/
	isOver: function() {
		return true;
	},

	/** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
	*/
	process: function() {
	},

	/** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
	*/
	render: function() {
	},

	/** Fonction appelée lorsque l'effet se termine de lui même
	* ou stoppé par un clear() du manager
	*/
	done: function() {
	},

	/** Permet d'avorter l'effet
	* Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
	* (restauration de l'état du laby par exemple)
	*/
	terminate: function() {
	}
});


/** Effet graphique temporisé
 * O876 Raycaster project
 * @class O876_Raycaster.GXFade
 * @extends O876_Raycaster.GXEffect
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * L'écran se colore graduellement d'une couleur unis
 * Permet de produire des effet de fade out pour faire disparaitre le contenu de l'écran
 * - oColor : couleur {r b g a} du fadeout
 * - fAlpha : opacité de départ
 * - fAlpha : Incrément/Décrément d'opacité
 */
O2.extendClass('O876_Raycaster.GXFade', O876_Raycaster.GXEffect, {
	sClass : 'FadeOut',
	oCanvas : null,
	oContext : null,
	oColor : null,
	oRainbow: null,
	oEasing: null,
	bOver: false,
	bNeverEnding: false,

	__construct : function(oRaycaster) {
		__inherited(oRaycaster);
		this.oRainbow = new O876.Rainbow();
		this.oCanvas = this.oRaycaster.getRenderCanvas();
		this.oContext = this.oRaycaster.getRenderContext();
		this.oEasing = new O876.Easing();
	},
	
	fade: function(sColor, fTime, fFrom, fTo) {
		this.oColor = this.oRainbow.parse(sColor);
		this.oEasing.from(fFrom).to(fTo).during(fTime / this.oRaycaster.TIME_FACTOR | 0).use('smoothstep');
		this.bOver = fFrom == fTo;
		return this;
	},
	
	neverEnding: function() {
		this.bNeverEnding = true;
	},

	fadeIn: function(sColor, fTime) {
		var c = this.oRainbow.parse(sColor);
		var f = 1;
		if (c.a) {
			f = c.a;
		}
		return this.fade(sColor, fTime, f, 0);
	},
	
	fadeOut: function(sColor, fTime) {
        var c = this.oRainbow.parse(sColor);
        var f = 1;
        if (c.a) {
            f = c.a;
        }
		return this.fade(sColor, fTime, 0, f);
	},
	
	isOver : function() {
		if (!this.bNeverEnding) {
			return this.bOver;
		} else {
			return false;
		}
	},

	process : function() {
		if (!this.bOver) {
            this.bOver = this.oEasing.next().over();
            this.oColor.a = this.oEasing.val();
        }
	},

	render : function() {
		this.oContext.fillStyle = this.oRainbow.rgba(this.oColor);
		this.oContext.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
	},

	terminate : function() {
		this.bNeverEnding = false;
		this.bOver = true;
	}
});

/** Effet graphique temporisé
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * Colore l'ecran d'un couleur unique qui s'estompe avec le temps
 * Permet de produire des effet de flash rouge ou d'aveuglement
 * - oColor : couleur {r b g a} du flash
 * - fAlpha : opacité de départ
 * - fAlphaFade : Incrément/Décrément d'opacité
 */
O2.extendClass('O876_Raycaster.GXFlash', O876_Raycaster.GXFade, {
	sClass: 'Flash',

	setFlash: function(sColor, fAlpha1, fTime) {
		this.oColor = this.oRainbow.parse(sColor);
		this.oEasing
			.from(fAlpha1)
			.to(0)
			.during(fTime / this.oRaycaster.TIME_FACTOR | 0)
			.use('cubeDeccel');
	}
});



/** Gestionnaire d'effets temporisés
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 *
 * Cette classe gère les effet graphique temporisés
 */
O2.createClass('O876_Raycaster.GXManager', {
	aEffects : null, // liste des effets

	/** Le constructeur initialise la liste des effet à vide
	 */
	__construct : function() {
		this.aEffects = [];
	},

	/** Compte le nombre d'effets
	 * @return entier
	 */
	count : function() {
		return this.aEffects.length;
	},

	/** Permet d'ajouter un effet à la liste
	 * @param oEffect un nouveau GXEffect
	 * @return oEffect
	 */
	addEffect : function(oEffect) {
		this.aEffects.push(oEffect);
		return oEffect;
	},

	getEffects: function() {
		return this.aEffects;
	},
	
	/**
	 * Suppression d'un effet GX
	 */
	removeEffect: function(xEffect) {
		var oEffect, iEffect;
		var sType = O876.typeMap([xEffect], 'short');
		switch (sType) {
			case 'f': 
				this.removeEffect(this.aEffects.filter(xEffect));
				break;
				
			case 'a':
				xEffect.forEach(function(e) {
					this.removeEffect(e);
				}, this);
				break;
				
			case 'o':
				iEffect = this.aEffects.indexOf(xEffect);
				if (iEffect >= 0) {
					this.removeEffect(iEffect);
				}
				break;

			case 'n':
				iEffect = xEffect;
				oEffect = this.aEffects[iEffect];
				oEffect.terminate();
				oEffect.done();
				this.aEffects.splice(iEffect, 1);
				break;
		}
	},


	/** Supprime tous les effet actuels
	 * Lance la methode terminate de chacun d'eux
	 */
	clear : function() {
		for ( var i = 0; i < this.aEffects.length; ++i) {
			this.aEffects[i].terminate();
			this.aEffects[i].done();
		}
		this.aEffects = [];
	},

	/** Lance la methode process() de chaque effet
	 * Supprime les effet qui sont arrivé à terme
	 */
	process : function() {
		var i = this.aEffects.length - 1;
		while (i >= 0) {
			this.aEffects[i].process();
			if (this.aEffects[i].isOver()) {
				this.aEffects[i].done();
				ArrayTools.removeItem(this.aEffects, i);
			}
			i--;
		}
	},

	/** Lance la methode render() de chaque effet
	 */
	render : function() {
		var nLen = this.aEffects.length;
		for (var i = nLen - 1; i >= 0; i--) {
			this.aEffects[i].render();
		}
	}
});

/**
 * Effet graphique temporisé O876 Raycaster project
 * 
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * Affichage d'un message au centre de l'écran - sMessage : Texte à afficher -
 * oColor : couleur {r b g a} du fadeout - fAlpha : opacité de départ - fAlpha :
 * Incrément/Décrément d'opacité
 */
O2.extendClass('O876_Raycaster.GXMessage', O876_Raycaster.GXEffect, {
	sClass: 'Message',
	oCanvas : null,
	oContext : null,
	nTime : 0,
	sMessage : '',
	oMessageCanvas : null,
	xPos : 0,
	yPos : 0,
	xTo : 0,
	yTo : 0,
	yOfs : 48,
	nState : 0,
	fAlpha : 1,
	aPath : null,
	iPath : 0,
	sTextAlign: 'left',
	xTextPos: 0,
	yTextPos: 0,
	nTextHeight: 13,
	fTimePerChar: 150,
	wSize: 512,
	hSize: 40,
	sFontFamily: 'monospace',
	
	// styles
	oStyle: {
		background: 'rgb(255, 255, 255)',
		border: 'rgb(64, 64, 64)',
		shadow: 'rgb(220, 220, 220)',
		text: 'rgb(0, 0, 0)',
		width: 512,
		height: 40,
		font: 'monospace 13',
		speed: 100,
		position: 48
	},
	
	
	oIcon: null,
	

	__construct : function(oRaycaster) {
		__inherited(oRaycaster);
		var s = this.oStyle;
		this.wSize = s.width;
		this.hSize = s.height;
		this.fTimePerChar = s.speed;
		this.yOfs = s.position;
		s.font.toString().split(' ').forEach((function(sFontProp) {
			if (sFontProp | 0) {
				this.nTextHeight = sFontProp | 0;
			} else {
				this.sFontFamily = sFontProp;
			}
		}).bind(this));
		this.oCanvas = this.oRaycaster.getRenderCanvas();
		this.oContext = this.oRaycaster.getRenderContext();
		this.oMessageCanvas = O876.CanvasFactory.getCanvas();
		this.oMessageCanvas.width = this.wSize; 
		this.oMessageCanvas.height = this.hSize;
		O876.CanvasFactory.setImageSmoothing(this.oMessageCanvas, true);
		O876.CanvasFactory.setImageSmoothing(this.oCanvas, true);
		this.xPos = this.xTo = (this.oCanvas.width - this.oMessageCanvas.width) >> 1;
		this.yPos = 0;
		this.yTo = 16;
		this.xAcc = 0;
		this.yAcc = -2;
		this.buildPath();
		if (this.sTextAlign == 'center') {
			this.xTextPos = this.oMessageCanvas.width >> 1; 
		} else {
			this.xTextPos = this.oMessageCanvas.height >> 1; 
		}
		this.yTextPos = (this.nTextHeight >> 1) + (this.oMessageCanvas.height >> 1);
	},
	
	drawIcon: function(oSource, x, y, w, h) {
		var nOffset = (this.oMessageCanvas.height - 32) >> 1;
		this.oMessageCanvas.getContext('2d').drawImage(oSource, x, y, w, h, nOffset, nOffset, 32, 32);
		this.xTextPos += 32;
		this.oIcon = null;
	},
	
	setIcon: function(oSource, x, y, w, h) {
		this.oIcon = {
			src: oSource,
			x: x,
			y: y,
			w: w,
			h: h
		};
	},
	
	setMessage: function(sMessage) {
		this.sMessage = sMessage;
		this.nTime = sMessage.length * this.fTimePerChar / this.oRaycaster.TIME_FACTOR | 0;
	},
	
	getTime: function() {
		return this.nTime;
	},

	isOver : function() {
		return this.nState >= 4;
	},

	buildPath : function() {
		this.aPath = [];
		var nWeightPos = 1;
		var nWeightTo = 1;
		var nSum = nWeightPos + nWeightTo;
		var bMove;
		var xPos = this.xPos;
		var yPos = this.yPos;
		do {
			bMove = false;
			if (xPos != this.xTo) {
				if (Math.abs(xPos - this.xTo) < 1) {
					xPos = this.xTo;
				} else {
					xPos = (xPos * nWeightPos + this.xTo * nWeightTo) / nSum;
				}
				bMove = true;
			}
			if (yPos != this.yTo) {
				if (Math.abs(yPos - this.yTo) < 1) {
					yPos = this.yTo;
				} else {
					yPos = (yPos * nWeightPos + this.yTo * nWeightTo) / nSum;
				}
				bMove = true;
			}
			if (bMove) {
				this.aPath.push( [ xPos | 0, yPos + this.yOfs | 0, 1 ]);
			}
		} while (bMove && this.aPath.length < 20);
		for (var i = this.aPath.length - 2; i >= 0; i--) {
			this.aPath[i][2] = Math.max(0, this.aPath[i + 1][2] - 0.2); 
		}
	},

	movePopup : function() {
		if (this.iPath < this.aPath.length) {
			var aPos = this.aPath[this.iPath];
			this.xPos = aPos[0];
			this.yPos = aPos[1];
			this.fAlpha = aPos[2];
			this.iPath++;
		}
	},

	reverseMovePopup : function() {
		if (this.aPath.length) {
			var aPos = this.aPath.pop();
			this.xPos = aPos[0];
			this.yPos = aPos[1];
			this.fAlpha = aPos[2];
		}
	},

	// Début : création du message dans un canvas
	process : function() {
		switch (this.nState) {
		case 0:
			var sMessage = this.sMessage;
			var oCtx = this.oMessageCanvas.getContext('2d');
			oCtx.font = this.nTextHeight.toString() + 'px ' + this.sFontFamily;
			oCtx.textAlign = this.sTextAlign;
			oCtx.fillStyle = this.oStyle.background;
			oCtx.strokeStyle = this.oStyle.border;
			oCtx.fillRect(0, 0, this.oMessageCanvas.width, this.oMessageCanvas.height);
			oCtx.strokeRect(0, 0, this.oMessageCanvas.width, this.oMessageCanvas.height);
			if (this.oIcon) {
				this.drawIcon(this.oIcon.src, this.oIcon.x, this.oIcon.y, this.oIcon.w, this.oIcon.h);
			}
			var nTextWidth = oCtx.measureText(sMessage).width;
			if ((nTextWidth + this.xTextPos + 2) < this.wSize) {
				oCtx.fillStyle = this.oStyle.shadow;
				oCtx.fillText(sMessage, this.xTextPos + 2, this.yTextPos + 2);
				oCtx.fillStyle = this.oStyle.text;
				oCtx.fillText(sMessage, this.xTextPos, this.yTextPos);
			} else {
				// faut mettre sur deux lignes (mais pas plus)
				var sMessage2 = '';
				var aWords = sMessage.split(' ');
				while (aWords.length > 0 && (oCtx.measureText(sMessage2 + aWords[0]).width + this.xTextPos + 8) < this.wSize) {
					sMessage2 += aWords.shift();
					sMessage2 += ' ';
				}
				sMessage = aWords.join(' ');
				oCtx.fillStyle = this.oStyle.shadow;
				var yLine = (this.nTextHeight >> 1) + 2;
				oCtx.fillText(sMessage2, this.xTextPos + 2, this.yTextPos + 2 - yLine);
				oCtx.fillText(sMessage, this.xTextPos + 2, this.yTextPos + 2 + yLine);
				oCtx.fillStyle = this.oStyle.text;
				oCtx.fillText(sMessage2, this.xTextPos, this.yTextPos - yLine);
				oCtx.fillText(sMessage, this.xTextPos, this.yTextPos + yLine);
			}
			this.nState++;
			this.fAlpha = 0;
			break;

		case 1:
			this.movePopup();
			this.nTime--;
			if (this.nTime <= 0) {
				this.yTo = -this.oMessageCanvas.height;
				this.nState++;
			}
			break;

		case 2:
			if (this.aPath.length === 0) {
				this.nState++;
			}
			this.reverseMovePopup();
			break;

		case 3:
			this.oMessageCanvas = null;
			this.terminate();
			break;
		}
	},

	render : function() {
		if (this.fAlpha > 0) {
			var a = this.oContext.globalAlpha;
			this.oContext.globalAlpha = this.fAlpha;
			this.oContext.drawImage(this.oMessageCanvas,
					this.xPos | 0, this.yPos | 0);
			this.oContext.globalAlpha = a;
		}
	},

	terminate : function() {
		this.nState = 4;
	}
});

/**
 * Effet spécial temporisé O876 Raycaster project
 * 
 * @date 2012-01-01
 * @author Raphaël Marandet Cet effet gère l'ouverture et la fermeture des
 *         portes, ce n'est pas un effet visuel a proprement parlé L'effet se
 *         sert de sa référence au raycaster pour déterminer la présence
 *         d'obstacle génant la fermeture de la porte C'est la fonction de
 *         temporisation qui est exploitée ici, même si l'effet n'est pas
 *         visuel.
 */
O2.extendClass('O876_Raycaster.GXSecret', O876_Raycaster.GXEffect, {
	sClass : 'Secret',
	nPhase : 0, // Code de phase : les block secrets ont X
				// phases : 0: fermé(init), 1: ouverture block
				// 1, 2: ouverture block 2, 3: terminé
	oRaycaster : null, // Référence au raycaster
	x : 0, // position de la porte
	y : 0, // ...
	fOffset : 0, // offset de la porte
	fSpeed : 0, // vitesse d'incrémentation/décrémentation de la
				// porte
	nLimit : 0, // Limite d'offset de la porte
	oEasing: null,

	__construct: function(r) {
		__inherited(r);
		this.nLimit = r.nPlaneSpacing;
		this.oEasing = new O876.Easing();
	},
	
	isOver : function() {
		return this.nPhase >= 3;
	},

	seekBlockSecret : function(dx, dy) {
		if (this.oRaycaster.getMapPhys(this.x + dx,
				this.y + dy) === this.oRaycaster.PHYS_SECRET_BLOCK) {
			this.oRaycaster.setMapPhys(this.x, this.y, 0);
			Marker.clearXY(this.oRaycaster.oDoors, this.x,
					this.y);
			this.x += dx;
			this.y += dy;
			Marker.markXY(this.oRaycaster.oDoors, this.x,
					this.y, this);
			return true;
		}
		return false;
	},

	seekBlockSecret4Corners : function() {
		if (this.seekBlockSecret(-1, 0)) {
			return;
		}
		if (this.seekBlockSecret(0, 1)) {
			return;
		}
		if (this.seekBlockSecret(1, 0)) {
			return;
		}
		if (this.seekBlockSecret(0, -1)) {
			return;
		}
	},

	process : function() {
		switch (this.nPhase) {
			case 0: // init
				Marker.markXY(this.oRaycaster.oDoors, this.x,
						this.y, this);
				this.fSpeed = RC.TIME_DOOR_SECRET / this.oRaycaster.TIME_FACTOR;
				this.nPhase++; /** no break here */
				this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('squareAccel');
				/** @fallthrough */

				// passage au case suivant
			case 1: // le block se pousse jusqu'a : offset > limite
				if (this.oEasing.next().over()) {
					this.fOffset = this.nLimit - 1;
					// rechercher le block secret suivant
					this.seekBlockSecret4Corners();
					this.nPhase++;
					this.fOffset = 0;
					this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('squareDeccel');
				} else {
					this.fOffset = this.oEasing.val();
				}
				break;
	
			case 2: // le 2nd block se pousse jusqu'a : offset >
					// limite
				if (this.oEasing.next().over()) {
					this.oRaycaster.setMapPhys(this.x, this.y, 0);
					Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
					this.nPhase++;
					this.fOffset = 0;
				} else {
					this.fOffset = this.oEasing.val();
				}
				break;
		}
		this.oRaycaster.setMapOffs(this.x, this.y, this.fOffset | 0);
	},

	terminate : function() {
		// en phase 0 rien n'a vraiment commencé : se
		// positionner en phase 3 et partir
		switch (this.nPhase) {
		case 0:
			this.nPhase = 3;
			Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
			break;
	
		case 1:
		case 2:
			this.fOffset = 0;
			Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
			this.oRaycaster.setMapPhys(this.x, this.y, 0);
			break;
		}
	}
});

/** Effet graphique temporisé
 * O876 Raycaster project
 * @date 2016-08-08
 * @author Raphaël Marandet
 * 
 * Fait tourner le backgroun sky.
 */
O2.extendClass('O876_Raycaster.GXSkyRotate', O876_Raycaster.GXEffect, {
	sClass: 'SkyRotate',

	fSpeed: 1,
	bOver: false,

	setSpeed: function(fSpeed) {
		this.fSpeed = fSpeed;
	},

	/** Cette fonction doit renvoyer TRUE si l'effet est fini
	* @return bool
	*/
	isOver: function() {
		return this.bOver;
	},

	/** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
	*/
	process: function() {
		var rc = this.oRaycaster;
		if (rc.oBackground) {
			rc.fBGOfs += this.fSpeed;
			rc.fBGOfs %= rc.oBackground.width;
		}
	},

	/** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
	*/
	render: function() {
	},

	/** Fonction appelée lorsque l'effet se termine de lui même
	* ou stoppé par un clear() du manager
	*/
	done: function() {
		this.terminate();
	},

	/** Permet d'avorter l'effet
	* Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
	* (restauration de l'état du laby par exemple)
	*/
	terminate: function() {
		this.bOver = true;
	}

});



/** Gestion de la horde de sprite
 * L'indice des éléments de cette horde n'a pas d'importance.
 * O876 Raycaster project
 * @class O876_Raycaster.Horde
 * @date 2012-01-01
 * @author Raphaël Marandet
 */
O2.createClass('O876_Raycaster.Horde',  {
	oRaycaster : null,
	oThinkerManager : null,
	aMobiles : null,
	aStatics : null,
	aSprites : null,
	oBlueprints : null,
	oTiles : null,
	nTileCount : 0,
	oImageLoader : null,
	oMobileDispenser : null,
	xTonari: [ 0, 0, 1, 1, 1, 0, -1, -1, -1 ],
	yTonari: [ 0, -1, -1, 0, 1, 1, 1, 0, -1 ],

	__construct : function(r) {
		this.oRaycaster = r;
		this.oImageLoader = this.oRaycaster.oImages;
		this.oMobileDispenser = new O876_Raycaster.MobileDispenser();
		this.aMobiles = [];
		this.aStatics = [];
		this.aSprites = [];
		this.oBlueprints = {};
		this.oTiles = {};
	},

	/** lance think pour chaque élément de la horde
	 */
	think : function() {
		var oMobile, aDiscarded = null;
		var i = 0;
		while (i < this.aMobiles.length) {
			oMobile = this.aMobiles[i];
			oMobile.think();
			if (oMobile.bActive) {
				i++;
			} else {
				if (aDiscarded === null) {
					aDiscarded = [];
				}
				aDiscarded.push(oMobile);
				this.unlinkMobile(oMobile);
				this.oMobileDispenser.pushMobile(oMobile.oSprite.oBlueprint.sId, oMobile);
			}
		}
		return aDiscarded;
	},

	/**
	 * {src, width, height, frames}
	 */
	defineTile : function(sId, aData) {
		this.nTileCount++;
		var oTile = new O876_Raycaster.Tile(aData);
		oTile.oImage = this.oImageLoader.load(oTile.sSource);
		this.oTiles[sId] = oTile;
		return oTile;
	},

	/**
	 * defines a new blueprint from a plain object of the worl definition
	 * @param sId blueprint identifier
	 * @param oData blueprint plain objet definition
	 */
	defineBlueprint : function(sId, oData) {
		var oBP = new O876_Raycaster.Blueprint(oData);
		if (oData.tile in this.oTiles) {
			oBP.oTile = this.oTiles[oData.tile];
		} else if ('tile' in oData) {
			throw new Error('this tile is unknown : "' + oData.tile + '" for blueprint ' + sId);
		} else {
			throw new Error('no tile is defined in "' + sId + '" data');
		}
		oBP.sId = sId;
		this.oBlueprints[sId] = oBP;
		this.oMobileDispenser.registerBlueprint(sId);
	},

	// {blueprint}
	defineSprite : function(aData) {
		var oSprite = new O876_Raycaster.Sprite();
		oSprite.oBlueprint = this.oBlueprints[aData.blueprint];
		this.aSprites.push(oSprite);
		return oSprite;
	},

	// Ajoute un mobile existant dans la liste
	/**
	 * @param oMobile
	 */
	linkMobile : function(oMobile) {
		oMobile.bActive = true;
		this.aMobiles.push(oMobile);
		return oMobile;
	},

	unlinkMobile : function(oMobile) {
		var nHordeRank = this.aMobiles.indexOf(oMobile);
		if (nHordeRank < 0) {
			this.unlinkStatic(oMobile);
			return;
		}
		ArrayTools.removeItem(this.aMobiles, nHordeRank);
	},
	

	unlinkStatic : function(oMobile) {
		var nHordeRank = this.aStatics.indexOf(oMobile);
		if (nHordeRank < 0) {
			return;
		}
		ArrayTools.removeItem(this.aStatics, nHordeRank);
		// Un static n'a pas de thinker il faut le sortir du laby ici.
        this.oRaycaster.oMobileSectors.unregister(oMobile);
        oMobile.xSector = -1;
        oMobile.ySector = -1;
	},
	

	/**
	 * Définition d'un Mobile
	 * @param aData donnée de définition
	 * @return O876_Raycaster.Mobile
	 */ 	
	defineMobile : function(aData) {
		var oMobile = new O876_Raycaster.Mobile();
		oMobile.oRaycaster = this.oRaycaster;
		oMobile.oSprite = this.defineSprite(aData);
		var bp = oMobile.getBlueprint();
		var oThinker = null;
		if (bp.sThinker !== null) {
			oThinker = this.oThinkerManager.createThinker(bp.sThinker);
		}
		oMobile.data(bp.data());
		oMobile.setThinker(oThinker);
		oMobile.fTheta = aData.angle;
		oMobile.nSize = oMobile.oSprite.oBlueprint.nPhysWidth >> 1;
		oMobile.setXY(aData.x, aData.y);
		if (oThinker) {
			this.linkMobile(oMobile);
		} else {
			this.aStatics.push(oMobile);
			oMobile.bVisible = true;
			oMobile.bEthereal = true;
			oMobile.bActive = true;
		}
		return oMobile;
	},

	/**
	 * Création d'un nouveau mobile
	 * @param sBlueprint string, blueprint
	 * @param x ...
	 * @param y position initiale
	 * @param fTheta angle initial
	 * @return O876_Raycaster.Mobile
	 */
	spawnMobile : function(sBlueprint, x, y, fTheta) {
		var oMobile = this.oMobileDispenser.popMobile(sBlueprint);
		if (!oMobile) {
			var aData = {
				blueprint : sBlueprint,
				x : x,
				y : y,
				angle : fTheta
			};
			oMobile = this.defineMobile(aData);
		} else {
			this.linkMobile(oMobile);
			oMobile.fTheta = fTheta;
			oMobile.setXY(x, y);
		}
		return oMobile;
	},


	getMobile : function(n) {
		return this.aMobiles[n];
	},

	getMobileCount : function() {
		return this.aMobiles.length;
	},

	/** Test si le mobile spécifié entre en collision avec un autre mobile
	 */
	computeCollision : function(oMobile) {
		var xTonari = this.xTonari;
		var yTonari = this.yTonari;
		var oRegister = this.oRaycaster.oMobileSectors;
		var oSector;
		var i;
		var oOther, iOther, nSectorLength;
		for (i = 0; i < 9; i++) {
			oSector = oRegister.get(oMobile.xSector + xTonari[i],
					oMobile.ySector + yTonari[i]);
			if (oSector !== null) {
				nSectorLength = oSector.length;
				for (iOther = 0; iOther < nSectorLength; ++iOther) {
					oOther = oSector[iOther];
					if (oOther !== oMobile) {
						if (oMobile.hits(oOther)) {
							oMobile.oMobileCollision = oOther;
							return true;
						}
					}
				}
			}
		}
		oMobile.oMobileCollision = null;
		return false;
	},
	
	getAllocatedMemory: function() {
		var nRes = 0, oTile;
		for (var s in this.oTiles) {
			oTile = this.oTiles[s];
			nRes += oTile.oImage.width * oTile.oImage.height * 4;
		}
		return nRes;
	}
});

/** Classe gérant le chargement des images
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 *
 */
O2.createClass('O876_Raycaster.ImageLoader', {
	oImages : null,
	aLoading : null,
	bComplete : false,
	nLoaded : 0,
	oStats: null,

	__construct : function() {
		this.oImages = {};
		this.aLoading = [];
		this.oStats = {
			images: {},
			totalsize: 0
		};
	},
	
	
	/** 
	 * Permet de vider les images déja chargées
	 */
	finalize: function() {
		this.aLoading = null;
		for(var i in this.oImages) {
			this.oImages[i] = null;
		}
		this.oImages = null;
		this.oStats = null;
	},

	/** Chargement d'une image.
	 * Si l'image est déja chargée, renvoie sa référence
	 * @param sUrl chaine url de l'image
	 * @return référence de l'objet image instancié
	 */
	load : function(sUrl) {
		if (!(sUrl in this.oImages)) {
			this.oImages[sUrl] = new Image();
			this.oImages[sUrl].src = sUrl;
		}
		this.bComplete = false;
		this.aLoading.push(this.oImages[sUrl]);
		// L'image n'est pas chargée -> on la mets dans la liste "en chargement"
		return this.oImages[sUrl];
	},

	complete : function() {
		if (this.bComplete) {
			return true;
		}
		this.nLoaded = 0;
	
		this.bComplete = true;
		for (var i = 0; i < this.aLoading.length; i++) {
			if (this.aLoading[i].complete) {
				this.nLoaded++;
			} else {
				this.bComplete = false;
			}
		}
		if (this.bComplete) {
			this.aLoading = [];
			var oImg;
			for (var sImg in this.oImages) {
				oImg = this.oImages[sImg];
				this.oStats.images[sImg] = oImg.width * oImg.height * 4;
				this.oStats.totalsize += this.oStats.images[sImg];
			}
		}
		return this.bComplete;
	},
	
	countLoading : function() {
		if (this.bComplete) {
			return this.nLoaded;
		} else {
			return this.aLoading.length;
		}
	},
	
	countLoaded : function() {
		return this.nLoaded;
	}
});

/**
 * The MAIN object
 */
O2.createObject('MAIN', {
	
	game: null,
	screen: null,
	config: null,
	pointerlock: null,


	configure: function(c) {
		MAIN.config = c;
	},


	setupScreen: function() {
		var screen = document.getElementById(MAIN.config.raycaster.canvas);
		if (screen === null) {
			throw new Error('the final canvas does not exist');
		}
		MAIN.screen = screen;
		if (MAIN.config.raycaster.canvasAutoResize) {
			MAIN.screenResize();
			window.addEventListener('resize', MAIN.screenResize);
		}
	},

	setupPointerlock: function() {
		var PL = MAIN.pointerlock = new O876_Raycaster.PointerLock();
		if (MAIN.config.game.fpsControl && PL.init()) {
			MAIN.screen.addEventListener('click', function(oEvent) {
				MAIN.lockPointer();
			});
		}
	},

	setupGameInstance: function(oGameInstance) {
		MAIN.game = oGameInstance;
	},

	/**
	 * Will start a game
	 * requires a CONFIG object
	 */
	run: function(oGameInstance) {
		MAIN.configure(oGameInstance.getConfig());
		if (!(MAIN.config)) {
			throw new Error('Where is my CONFIG object ? (use MAIN.configure)');
		}
		MAIN.setupScreen();
		MAIN.setupPointerlock();
		MAIN.setupGameInstance(oGameInstance);
	},

	/**
	 * Auto stats game using default config
	 * @param config
	 */
	autorun: function(config) {
		MAIN.configure(config);
        window.addEventListener('load', function() {
            MAIN.configure(MAIN.config);
            if (!('namespace' in MAIN.config.game)) {
            	throw new Error('"namespace" key is mandatory in CONFIG.game while using autorun feature');
			}
            var ns = MAIN.config.game.namespace;
            var gcn = ns + '.Game';
            var gc = O2.loadObject(gcn);
            var data = LEVEL_DATA[Object.keys(LEVEL_DATA)[0]];
            MAIN.run(new gc(MAIN.config));
            MAIN.game.initRaycaster(data);
        });
	},
	
	/**
	 * Entre en mode pointerlock
	 * @param oElement
	 * @returns {Boolean}
	 */
	lockPointer: function() {
		var G = MAIN.game;
		var rc = G.oRaycaster;
		var oElement = rc.getScreenCanvas();
		var rcc = rc.oCamera;
		var rcct = rcc.oThinker;
		if (!rcc || !rcct) {
			return false;
		}
		if (MAIN.pointerlock.locked()) {
			return false;
		}
		if (MAIN.config.game.fullScreen) {
			O876_Raycaster.FullScreen.changeEvent = function(e) {
				if (O876_Raycaster.FullScreen.isFullScreen()) {
					MAIN.pointerlock.requestPointerLock(oElement);
					//MAIN.pointerlock.on('mousemove', G.oRaycaster.oCamera.oThinker.readMouseMovement.bind(G.oRaycaster.oCamera.oThinker));
				}
			};
			O876_Raycaster.FullScreen.enter(oElement);
		} else {
			MAIN.pointerlock.requestPointerLock(oElement);
			//MAIN.pointerlock.on('mousemove', rcct.readMouseMovement.bind(rcct));
		}
		return true;
	},


	screenResize: function(oEvent) {
		var nPadding = 24;
		var h = innerHeight;
		var w = innerWidth;
		var r = (h - nPadding) / w;
		var oCanvas = MAIN.screen;
		var ch = oCanvas.height;
		var cw = oCanvas.width;
		var rBase = ch / cw; 
		var wf, hf;
		if (r < rBase) { // utiliser height
			h -= nPadding;
			hf = h;
			wf = h * cw / ch;
		} else { // utiliser width
			wf = w;
			hf = w * ch / cw;
		}
		oCanvas.style.width = (wf | 0).toString() + 'px';
		oCanvas.style.height = (hf | 0).toString() + 'px';
		oCanvas.__aspect = wf / cw;
		if (oCanvas.style.position === 'absolute' && oCanvas.style['margin-left'] === 'auto') {
			oCanvas.style.left = ((w - wf) >> 1 | 0).toString() + 'px';
		}
	}
});


O2.createClass('O876_Raycaster.Minimap',  {

	oRaycaster: null,
	aSquares: null,
	aModified: null,
	aColors: null,
	oCanvas: null,
	oContext: null,
	
	aPixels: null,
	
	bRestricted : true, // affichage reduit pour ne pas detecter les autre joeur
	
	reset: function(oRaycaster) {
		this.aColors = [
              '#000000', // mur
              '#FF8888', // missiles
              '#00FF00', // mobiles
              '#00FFFF', 
              '#5588AA', // champ de vision
              '#FF00FF',
              '#FFFF00',
              '#555555', // vide             
              '#777777'  // placeable
		];
		this.oRaycaster = oRaycaster;
		this.aSquares = [];
		this.aModified = [
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
		var aSqrRaw;
		var x, y;
		for (y = 0; y < this.oRaycaster.nMapSize; y++) {
			aSqrRaw = [];
			for (x = 0; x < this.oRaycaster.nMapSize; x++) {
				aSqrRaw.push([-1, false, x, y]);
			}
			this.aSquares.push(aSqrRaw);
		}
		if (this.oCanvas === null) {
			this.oCanvas = O876.CanvasFactory.getCanvas();
		}
		this.oCanvas.width = this.oCanvas.height = this.oRaycaster.nMapSize << 2;
		var ctx = this.oCanvas.getContext('2d');

		var pix = [];
		this.aColors.forEach(function(sItem, i, a) {
			var oID = ctx.createImageData(1, 1);
			var d = oID.data;
			d[0] = 100;//parseInt('0x' + sItem.substr(1, 2));
			d[1] = 200;//parseInt('0x' + sItem.substr(3, 2));
			d[2] = 50;//parseInt('0x' + sItem.substr(5, 2));
			d[3] = 1;
			pix.push(oID);
		});
		this.aPixels = pix;
		this.oContext = ctx;
	},
	
	setSquare: function(x, y, n) {
		var q = this.aSquares[y][x];
		if (q[0] != n) {
			q[0] = n;
			if (!q[1]) {
				q[1] = true;
				this.aModified[n].push(q);
			}
		}
	},
	
	getMobileColor: function(aMobiles) {
		var l = aMobiles.length;
		var m, nType, bPlaceable = false;
		for (var i = 0; i < l; ++i) {
			m = aMobiles[i];
			nType = m.getType();
			if (nType == RC.OBJECT_TYPE_PLAYER || nType == RC.OBJECT_TYPE_MOB) {
				return 2;
			}
			if (nType == RC.OBJECT_TYPE_MISSILE) {
				return 1;
			}
			if (nType == RC.OBJECT_TYPE_PLACEABLE) {
				bPlaceable = true;
			}
		}
		return bPlaceable ? 8 : 7;
	},
	
	render: function() {
		var rc = this.oRaycaster;
		var nMapSize = rc.nMapSize;
		var x, y, nColor;
		for (y = 0; y < nMapSize; y++) {
			for (x = 0; x < nMapSize; x++) {
				if (this.bRestricted && rc.oCamera.xSector === x && rc.oCamera.ySector === y) {
					nColor = 2;
				} else if (this.bRestricted === false && rc.oMobileSectors.get(x, y).length) {
					nColor = this.getMobileColor(rc.oMobileSectors.get(x, y));  // mobile
				} else if (Marker.getMarkXY(rc.aScanSectors, x, y)) {
					nColor = 4;  // champ de vision joueur
				} else if (rc.getMapPhys(x, y)) {
					nColor = 0;  // mur
				} else {
					nColor = 7;  // vide
				}
				this.setSquare(x, y, nColor);
			}
		}
		var q, mc, m = this.aModified;
		for (nColor = 0; nColor < m.length; nColor++) {
			if (this.aColors[nColor]) {
				mc = m[nColor];
				this.oContext.fillStyle = this.aColors[nColor];
				while (mc.length) {
					q = mc.shift();
					this.oContext.fillRect(q[2], q[3], 1, 1);
					q[1] = false;
				}
			}
		}
		rc.getRenderContext().drawImage(this.oCanvas, 2, 2);
	}
	
});

/**
 * La classe mobile permet de mémoriser la position des objets circulant dans le laby
 * O876 Raycaster project
 * @class O876_Raycaster.Mobile
 * @date 2012-01-01
 * @author Raphaël Marandet
 */
O2.createClass('O876_Raycaster.Mobile', {
	oRaycaster: null,						// Référence de retour au raycaster
	x: 0,									// position du mobile
	y: 0,									// ...
	xSave: 0,
	ySave: 0,

	// flags
	bActive: false,							// Flag d'activité
	bEthereal: false,						// Flage de collision globale

	fTheta: 0,								// Angle de rotation
	fMovingAngle: 0,						// Angle de déplacement
	fSpeed: 0,								// Vitesse de déplacement initialisée à partir du blueprint du sprite
	fMovingSpeed: 0,						// Dernière vitesse enregistrée
	fRotSpeed: 0,							// Vitesse de rotation initialisée à partir du blueprint du sprite
	xInertie: 0,							// Vitesse utilisée pour accelerer les calculs...
	yInertie: 0,							// ... lorsque vitesse et angle sont conservée
	xSpeed: 0,								// Dernière vitesse X appliquée
	ySpeed: 0,								// Dernière vitesse Y appliquée
	xSector: -1,							// x Secteur d'enregistrement pour les collision ou les test de proximité
	ySector: -1,							// y ...	
	nSectorRank: -1,						// Rang dans le secteur pour un repérage facile
	nSize: 16,								// Taile du polygone de collision mobile-mur
	oSprite: null,							// Référence du sprite
	oThinker: null,
	oWallCollision: null,					// x: bool : on bumpe un mur qui empeche la progression en X
	oMobileCollision: null,
	oFrontCell: null,						// coordonnées du bloc devant soit

	nBlueprintType: null,					// type de mobile : une des valeurs de GEN_DATA.blueprintTypes
	bSlideWall: true,						// True: corrige la trajectoire en cas de collision avec un mur
	bVisible: true,							// Visibilité au niveau du mobile (le sprite dispose de sont propre flag de visibilité prioritaire à celui du mobile)
	bWallCollision: false,

	//oData: null,


    /**
	 * Retreive the blueprint of the sprite associated with this mobile
	 * If a parameter is given, the method will return its values
	 * else the method return the blueprint object
	 * if no sprite is defined, the method returns null
     * @param sXData {string=} a parameter of the blueprint
     * @returns {*}
     */
	getBlueprint: function(sXData) {
		if (this.oSprite) {
			if (sXData === undefined) {
				return this.oSprite.oBlueprint;
			} else {
				if (this.oSprite.oBlueprint) {
					return this.oSprite.oBlueprint.data(sXData);
				} else {
					return null;
				}
			}
		} else {
			return null;
		}
	},

	isMoving: function() {
		return this.x !== this.xSave || this.y !== this.ySave;
	},

	/**
	 * Renvoie le type de blueprint
	 * Si le mobile n'a pas de sprite (et n'a pas de blueprint)
	 * On renvoie 0, c'est généralement le cas pour le mobile-caméra
	 * @return {int}
	 */
	getType: function() {
		if (this.nBlueprintType === null) {
			if (this.oSprite) {
				this.nBlueprintType = this.oSprite.oBlueprint.nType;
			} else if (this == this.oRaycaster.oCamera){
				this.nBlueprintType = RC.OBJECT_TYPE_PLAYER;
			} else {
				this.nBlueprintType = RC.OBJECT_TYPE_NONE;
			}
		}
		return this.nBlueprintType;
	},


	// évènements

    /**
	 * Define the thinker
     * @param oThinker {O876_Raycaster.Thinker}
     */
	setThinker: function(oThinker) {
		this.oThinker = oThinker;
		if (oThinker) {
			this.oThinker.oMobile = this;
		}
		this.oWallCollision = {x: 0, y: 0};
		this.bWallCollision = false;
		this.gotoLimbo();
	},

    /**
	 * Get the thinker instance defined previously by setThinker
     * @returns {O876_Raycaster.Thinker}
     */
	getThinker: function() {
		return this.oThinker;
	},

    /**
	 * Makes the thinker think
     */
	think: function() {
		this.xSave = this.x;
		this.ySave = this.y;
		if (this.oThinker) {
			this.xSpeed = 0;
			this.ySpeed = 0;
			this.oThinker.think();
		}
	},
	
	/**
	 * Rotates the mobile point of view angle
	 * @param f {number} delta en radiant
	 */
	rotate: function(f) {
		this.setAngle(this.fTheta + f);
	},

    /**
	 * Sets the mobile speed
     * @param f {number} new speed
     */
	setSpeed: function(f) {
		this.fSpeed = f;
	},

    /**
	 * Get the mobile speed previously defined by blueprint or by setSpeed
     * @returns {number}
     */
	getSpeed: function() {
		return this.fSpeed;
	},

    /**
	 * Define a new angle
     * @param f {number}
     */
	setAngle: function(f) {
		this.fTheta = f % (PI * 2);
	},

    /**
	 * Get the angle value previously define by setAngle
     * @returns {number}
     */
	getAngle: function() {
		return this.fTheta;
	},	
	
	/** 
	 * Renvoie les coordonnée du bloc devant le mobile
	 * @return {x, y}
	 */
	getFrontCellXY: function() {
		if (this.oFrontCell === null) {
			this.oFrontCell = {};
		}
		var rc = this.oRaycaster;
		var nActionRadius = rc.nPlaneSpacing * 0.75;
		this.oFrontCell.x = (this.x + Math.cos(this.fTheta) * nActionRadius) / rc.nPlaneSpacing | 0;
		this.oFrontCell.y = (this.y + Math.sin(this.fTheta) * nActionRadius) / rc.nPlaneSpacing | 0;
		return this.oFrontCell;
	},


	/**
	 * Quitte la grille de collision de manière à ne plus interférer avec les autres sprites
	 */
	gotoLimbo: function() {
		this.oRaycaster.oMobileSectors.unregister(this);
		this.xSector = -1;
		this.ySector = -1;
	},

	/** Modifie la position du mobile
	 * @param x nouvelle position x
	 * @param y nouvelle position y
	 */
	setXY: function(x, y) {
		var rc = this.oRaycaster;
		var ps = rc.nPlaneSpacing;
		this.x = x;
		this.y = y;
		var xs = x / ps | 0;
		var ys = y / ps | 0;
		if (xs !== this.xSector || ys !== this.ySector) {
			rc.oMobileSectors.unregister(this);
			this.xSector = xs;
			this.ySector = ys;
			rc.oMobileSectors.register(this);
		}
		// collision intersprites
		this.oRaycaster.oHorde.computeCollision(this);
	},

	rollbackXY: function() {
		var ps = this.oRaycaster.nPlaneSpacing;
		this.x = this.xSave;
		this.y = this.ySave;
		this.xSpeed = 0;
		this.ySpeed = 0;
		var xs = this.x / ps | 0;
		var ys = this.y / ps | 0;
		if (xs !== this.xSector || ys !== this.ySector) {
			this.oRaycaster.oMobileSectors.unregister(this);
			this.xSector = xs;
			this.ySector = ys;
			this.oRaycaster.oMobileSectors.register(this);
		}
	},

	_vecScale: function(v, fScale) {
		var v1 = MathTools.normalize(v.x, v.y);
		return {
			x: v1.x * fScale,
			y: v1.y * fScale
        };
	},

	/**
	 * Détermine la collision entre le mobile et les murs du labyrinthe
	 * @typedef {Object} xy
	 * @property {number} x
	 * @property {number} y
	 *
	 * @param vPos {xy} position du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param vSpeed {xy} delta de déplacement du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param nSize {number} demi-taille du mobile
	 * @param nPlaneSpacing {number} taille de la grille
	 * (pour savoir ou est ce qu'on s'est collisionné). ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param bCrashWall {boolean} si true alors il n'y a pas de correction de glissement
	 * @param pSolidFunction {function} fonction permettant de déterminer si un point est dans une zone collisionnable
	 */
	computeWallCollisions: function(vPos, vSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction) {
		// par defaut pas de colision détectée
		var oWallCollision = {x: 0, y: 0};
		var dx = vSpeed.x;
		var dy = vSpeed.y;
		var x = vPos.x;
		var y = vPos.y;
		// une formule magique permettant d'igorer l'oeil "à la traine", evitant de se faire coincer dans les portes
		var iIgnoredEye = (Math.abs(dx) > Math.abs(dy) ? 1 : 0) | ((dx > dy) || (dx === dy && dx < 0) ? 2 : 0);
		var xClip, yClip, ix, iy, xci, yci;
		var bCorrection = false;
		// pour chaque direction...
		for (var i = 0; i < 4; ++i) {
			// si la direction correspond à l'oeil à la traine...
			if (iIgnoredEye === i) {
				continue;
			}
			// xci et yci valent entre -1 et 1 et correspondent aux coeficients de direction
			xci = (i & 1) * Math.sign(2 - i);
			yci = ((3 - i) & 1) * Math.sign(i - 1);
			ix = nSize * xci + x;
			iy = nSize * yci + y;
			// déterminer les collsion en x et y
			// xClip = pSolidFunction(ix + dx, iy);
			// yClip = pSolidFunction(ix, iy + dy);
			xClip = pSolidFunction((ix + dx) / nPlaneSpacing | 0, iy / nPlaneSpacing | 0);
			yClip = pSolidFunction(ix / nPlaneSpacing | 0, (iy + dy) / nPlaneSpacing | 0);
			if (xClip) {
				dx = 0;
				if (bCrashWall) {
					dy = 0;
					oWallCollision.y = yci;
				}
				oWallCollision.x = xci;
				bCorrection = true;
			}
			if (yClip) {
				dy = 0;
				if (bCrashWall) {
					dx = 0;
					oWallCollision.x = xci;
				}
				oWallCollision.y = yci;
				bCorrection = true;
			}
		}
		x += dx;
		y += dy;
		if (bCorrection) {
			// il y a eu collsion
			// corriger la coordonée impactée
			if (oWallCollision.x > 0) {
				x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
			} else if (oWallCollision.x < 0) {
				x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
			}
			if (oWallCollision.y > 0) {
				y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
			} else if (oWallCollision.y < 0) {
				y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
			}
		}
		return {
			pos: {x: x, y: y},
			speed: {x: x - vPos.x, y: y - vPos.y},
			wcf: oWallCollision
		};
	},


    /**
     * Fait glisser le mobile
     * détecte les collision avec le mur
     * @param dx {number}
     * @param dy {number}
     */
    slide: function(dx, dy) {
    	var vPos = {x: this.x, y: this.y};
        var vSpeed = {x: dx, y: dy};
        var rc = this.oRaycaster;

		var nDist = MathTools.distance(vSpeed.x, vSpeed.y);
		var nSize = this.nSize;
		var nPlaneSpacing = rc.nPlaneSpacing;
		var bCrashWall = !this.bSlideWall;
		var r;
		var pSolidFunction = function(x, y) { return rc.getMapPhys(x, y); };
		if (nDist > nSize) {
			var vSubSpeed = this._vecScale(vSpeed, nSize);
			var nModDist = nDist % nSize;
			if (nModDist) {
				var vModSpeed = this._vecScale(vSpeed, nModDist);
				this.computeWallCollisions(vPos, vModSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction);
			}
			for (var iIter = 0; iIter < nDist; iIter += nSize) {
				this.slide(vSubSpeed.x, vSubSpeed.y);
				if (bCrashWall && this.bWallCollision) {
					break;
				}
			}
			return;
		}
		r = this.computeWallCollisions(
			vPos,
			vSpeed,
			nSize,
			nPlaneSpacing,
			bCrashWall,
			pSolidFunction
		);
		this.setXY(r.pos.x, r.pos.y);
        this.xSpeed = r.speed.x;
        this.ySpeed = r.speed.y;
        var wcf = r.wcf;
        this.oWallCollision = wcf;
        this.bWallCollision = wcf.x !== 0 || wcf.y !== 0;
    },


	/**
	 * Déplace la caméra d'un certain nombre d'unité vers l'avant
     * @param fAngle {number} Angle of displacement
     * @param fDist {number} Distance de déplacement
	 */
	move: function(fAngle, fDist) {
		if (this.fMovingAngle !== fAngle || this.fMovingSpeed !== fDist) {
			this.fMovingAngle = fAngle;
			this.fMovingSpeed = fDist;
			this.xInertie = Math.cos(fAngle) * fDist;
			this.yInertie = Math.sin(fAngle) * fDist;
		}
		this.slide(this.xInertie, this.yInertie);
	},

	/**
	 * Test de collision avec le mobile spécifié
	 * @param oMobile {O876_Raycaster.Mobile} mobile susceptible d'entrer en collision
	 * @returnn {bool}
	 */
	hits: function(oMobile) {
		if (this.bEthereal || oMobile.bEthereal) {
			return false;
		}
		var dx = oMobile.x - this.x;
		var dy = oMobile.y - this.y;
		var d2 = dx * dx + dy * dy;
		var dMin = this.nSize + oMobile.nSize;
		dMin *= dMin;
		return d2 < dMin;
	},

	/**
	 * Fait tourner le mobile dans le sens direct en fonction de la vitesse de rotation
	 * si la vitesse est négative le sens de rotation est inversé
	 */
	rotateLeft: function() {
		this.rotate(-this.fRotSpeed);
	},

	/**
	 * Fait tourner le mobile dans le sens retrograde en fonction de la vitesse de rotation
	 * si la vitesse est négative le sens de rotation est inversé
	 */
	rotateRight: function() {
		this.rotate(this.fRotSpeed);
	},

	/**
	 * Déplace le mobile vers l'avant, en fonction de sa vitesse
	 */
	moveForward: function() {
		this.move(this.fTheta, this.fSpeed);
	},

	/**
	 * Déplace le mobile vers l'arrière, en fonction de sa vitesse
	 */
	moveBackward: function() {
		this.move(this.fTheta, -this.fSpeed);
	},

	/**
	 * Déplace le mobile d'un mouvement latéral vers la gauche, en fonction de sa vitesse
	 */
	strafeLeft: function() {
		this.move(this.fTheta - PI / 2, this.fSpeed);
	},

	/**
	 * Déplace le mobile d'un mouvement latéral vers la droite, en fonction de sa vitesse
	 */
	strafeRight: function() {
		this.move(this.fTheta + PI / 2, this.fSpeed);
	}
});

O2.mixin(O876_Raycaster.Mobile, O876.Mixin.Data);

/** Classe de distribution optimisée de mobiles
 * O876 Raycaster project
 * @date 2012-04-04
 * @author Raphaël Marandet 
 * 
 * Classe gérant une liste de mobile qui seront réutilisé à la demande.
 * Cette classe permet de limiter le nom de d'instanciation/destruction
 */
O2.createClass('O876_Raycaster.MobileDispenser', {
  aBlueprints: null,

  __construct: function() {
    this.aBlueprints = {};
  },

  registerBlueprint: function(sId) {
    this.aBlueprints[sId] = [];
  },

  /** Ajoute un mobile dans sa pile de catégorie
   */
  pushMobile: function(sBlueprint, oMobile) {
    this.aBlueprints[sBlueprint].push(oMobile);
  },

  /**
   * @return O876_Raycaster.Mobile
   */
	popMobile: function(sBlueprint) {
		if (!(sBlueprint in this.aBlueprints)) {
			throw new Error('no such blueprint : "' + sBlueprint + '"');
		}
		if (this.aBlueprints[sBlueprint].length) {
			return this.aBlueprints[sBlueprint].pop();
		} else {
			return null;
		}  
	},

  render: function() {
    var sRender = '';
    for (var sBlueprint in this.aBlueprints) {
      if (this.aBlueprints[sBlueprint].length) {
        sRender += '[' + sBlueprint + ': ' + this.aBlueprints[sBlueprint].length.toString() + ']';
      }
    }
    return sRender;
  }
});

/** Registres des mobiles. Permet d'enregistrer les mobile dans les secteurs composant le labyrinthe et de pouvoir
 * Organiser plus efficacement les collisions inter-mobile (on n'effectue les tests de collision qu'entre les mobiles des secteur proches).
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 */
O2.createClass('O876_Raycaster.MobileRegister', {
  aSectors: null,         // Secteurs
  nSize: 0,               // Taille des secteur (diviseur position mobile -> secteur)

  /** Construit l'instance en initialisant la taille des secteur 
   * @param n int, taille des secteurs
   */
  __construct: function(n) {
    var x, y;
    this.nSize = n;
    this.aSectors = {};
    for (x = 0; x < n; x++) {
      this.aSectors[x] = {};
      for (y = 0; y < n; y++) {
        this.aSectors[x][y] = [];
      }
    }
  },

  /** Renvoie la référence d'un secteur, la fonction n'effectue pas de test de portée, aussi attention aux paramètres foireux.
   * @param x position du secteur recherché
   * @param y ...
   * @return Secteur trouvé
   */
  get: function(x, y) {
    if (x >= 0 && y >= 0 && y < this.nSize && x < this.nSize) {
      return this.aSectors[x][y];
    } else {
      return null;
    }
  },
  
  /** Désenregistre un mobile de son secteur
   * @param oMobile mobile à désenregistrer
   */
  unregister: function(oMobile) {
    if (oMobile.xSector < 0 || oMobile.ySector < 0 || oMobile.xSector >= this.nSize || oMobile.ySector >= this.nSize) {
      return;
    }
    var aSector = this.aSectors[oMobile.xSector][oMobile.ySector];
    var n = oMobile.nSectorRank;
    if (n == (aSector.length - 1)) {
      aSector.pop();
      oMobile.nSectorRank = -1;
    } else {
      aSector[n] = aSector.pop();
      aSector[n].nSectorRank = n;
    }
  },

  /** Enregistre en mobile dans son secteur, le mobile sera enregistré dans le secteur qu'il occupe réellement, calculé à partir de sa position
   * @param oMobile
   */
  register: function(oMobile) {
    if (oMobile.xSector < 0 || oMobile.ySector < 0 || oMobile.xSector >= this.nSize || oMobile.ySector >= this.nSize) {
      return;
    }
    var aSector = this.aSectors[oMobile.xSector][oMobile.ySector];
    var n = aSector.length;
    aSector.push(oMobile);
    oMobile.nSectorRank = n;
  }
});


/**
 * Api de gestion du fullscreen et de la capture de souris
 */

O2.createClass('O876_Raycaster.PointerLock', {
    oElement: null,
    bInitialized: null,
    bLocked: false,
    bEnabled: true,

	__construct: function() {
    	// this event handler maybe set or removed, thus let's bind it
        this.eventMouseMove = this.eventMouseMove.bind(this);
	},

    hasPointerLockFeature: function() {
        return 'pointerLockElement' in document || 'mozPointerLockElement' in document;
    },

    enable: function(oElement) {
        if (!this.bEnabled) {
            this.bEnabled = true;
            if (oElement) {
                this.requestPointerLock(oElement);
            }
        }
    },

    disable: function() {
        if (this.bEnabled) {
            this.bEnabled = false;
            this.exitPointerLock();
        }
    },

    init: function() {
        if (!this.hasPointerLockFeature()) {
            return false;
        }
        if (this.bInitialized) {
            return true;
        }
        document.addEventListener('pointerlockchange', this.eventChange.bind(this), false);
        document.addEventListener('mozpointerlockchange', this.eventChange.bind(this), false);
        document.addEventListener('pointerlockerror', this.eventError.bind(this), false);
        document.addEventListener('mozpointerlockerror', this.eventError.bind(this), false);
        this.bInitialized = true;
        return true;
    },

    /**
     * Renvoie TRUE si le pointer à été desactivé
     */
    locked: function() {
        return this.bLocked;
    },


    requestPointerLock: function(oElement) {
        var pl = this;
        if (!pl.bEnabled) {
            return;
        }
        if (pl.locked()) {
            return;
        }
        pl.oElement = oElement;
        oElement.requestPointerLock = oElement.requestPointerLock || oElement.mozRequestPointerLockWithKeys || oElement.mozRequestPointerLock;
        oElement.requestPointerLock();
    },

    exitPointerLock: function() {
        if (!this.locked()) {
            return;
        }
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
        document.exitPointerLock();
    },

    eventChange: function(e) {
        var oPointerLockElement = document.pointerLockElement || document.mozPointerLockElement;
        if (oPointerLockElement) {
            document.addEventListener('mousemove', this.eventMouseMove, false);
            this.bLocked = true;
            this.trigger('enter');
        } else {
            document.removeEventListener('mousemove', this.eventMouseMove, false);
            this.oElement = null;
            this.bLocked = false;
            this.trigger('exit');
        }
    },

    eventError: function(e) {
        console.error('PointerLock error', e);
    },

    eventMouseMove: function(e) {
        var xMove = e.movementX || e.mozMovementX || 0;
        var yMove = e.movementY || e.mozMovementY || 0;
        this.trigger('mousemove', {
        	x: xMove,
			y: yMove
		});
    }
});

O2.mixin(O876_Raycaster.PointerLock, O876.Mixin.Events);
/**
 * Raycasting engine
 * -----------------
 * Writen by Raphael Marandet
 * raphael.marandet@gmail.com
 * 
 * Inspiration : 
 * 2 web sites gave me inspiration to create this engine.
 * #1 the first one : 
 *   Raytracing Engine
 *   C0D3D by Gunnar Leffler
 *   http://www.leftech.com/raycaster.htm
 *   Version 1.0
 *   
 * #2 the second one :
 *   http://arguingwithmyself.com/demos/raycaster/
 *   I looked at version 1
 *
 * I took one function from each (CastRay() from #1 and DrawScreen() from #2), 
 * merged them both and added some features.
 * - sprite support with alpha
 * - semi-transparent walls (with windows, iron bars, grates...).
 * - doors (one panel, two panels, sliding up, squeezing up). 
 * - secret doors (just like wolfenstein 3D secret walls).
 * - ambient light and darkness.
 * - weapon canvas layer.
 * - speed optimization.
 * - raster effects.
 * - ...
 *
 *
 * Second storey
 * in upper map :
 * - all blocks above a ceiling must be ray-blocking except when explicitly defined
 *
 */


/** Notes:
 * 
 * Raycaster configuration JSO
 * 
 * raycasterConfig = {
 *   canvas: string | HTMLCanvasElement,   // canvas id or canvas instance
 *   drawMap: boolean,   // drawing map or not
 * }
 *
 *
 *
 *
 *
 */
 
/* jshint undef: false, unused: true */
/* globals O2, PI, O876, O876_Raycaster, GfxTools, ArrayTools, Marker, MathTools */
 
O2.createClass('O876_Raycaster.Raycaster',  {
	// Laby Phys Properties
	PHYS_NONE : 0x00,
	PHYS_WALL : 0x01,

	// Laby door properties
	PHYS_FIRST_DOOR : 0x02,
	PHYS_DOOR_SLIDING_UP : 0x02,
	PHYS_CURT_SLIDING_UP : 0x03,
	PHYS_DOOR_SLIDING_DOWN : 0x04,
	PHYS_CURT_SLIDING_DOWN : 0x05,
	PHYS_DOOR_SLIDING_LEFT : 0x06,
	PHYS_DOOR_SLIDING_RIGHT : 0x07,
	PHYS_DOOR_SLIDING_DOUBLE : 0x08,

	PHYS_LAST_DOOR : 0x08,

	PHYS_SECRET_BLOCK : 0x09,
	PHYS_TRANSPARENT_BLOCK : 0x0A,
	PHYS_INVISIBLE_BLOCK : 0x0B,
	PHYS_OFFSET_BLOCK : 0x0C,
	PHYS_DOOR_D : 0x0D,
	PHYS_DOOR_E : 0x0E,
	PHYS_DOOR_F : 0x0F,
	// Permet de régler les évènements liés au temps
	TIME_FACTOR : 50,  // c'est le nombre de millisecondes qui s'écoule entre chaque calcul

	bPause: false,

	// World Render params
	oWall : null,
	oFloor : null,
	oBackground : null,
	nMapSize : 0,
	aMap : null,
	oVisual : null,
	nPlaneSpacing : 64,
	nShadingFactor : 50,
	nShadingThreshold : 15,    // default 15
	nDimmedWall : 7,
	oDoors : null,
	oXMap : null, // Données supplémentaires pour chaque faces d'un block
	oMinimap: null,
	oRainbow: null, // outil de management des couleurs

	// Textures
	xTexture : 64,
	yTexture : 96,

	// Viewport
	_oCanvas : null,
	_oContext : null,
	_oRenderCanvas : null,
	_oRenderContext : null,
    _o3DBufferCanvas: null, // holds the stereoscopic left buffer screen
    _o3DBufferContext: null, // holds the stereoscopic left buffer screen

	b3d: false, // active l'option 3D
	i3dFrame: 0, // what frame is being rendered
	x3dOfs: 0, // offset 3D
	y3dOfs: 0, // offset 3D
	n3dGap: 4, // ecar entre deux camera
	xLimitL: 0, // x limite à gauche
	xLimitR: 400, // x limite à droite
	bUseVideoBuffer : true, // true: semble plus rapide sur chromium
	bGradient: true, // dessine des gradients
	bFloor : true,	// utilise le rendu du sol (automatiquement positionné selon le world def)
	bCeil : true,	// active le plafond
	bSky: false,		// active le ciel
	bFlatSky: false,	// a utiliser si le plafond a des "trous" au travers desquels on peut voir le ciel.
		// sinon on ne pourra voir le ciel qu'a travers les fenetre

	nZoom : 1,
	wCanvas : 0, // ratio 0.625
	hCanvas : 0,
	xScrSize : 0,
	yScrSize : 0,
	fViewAngle : 0,
    /**
	 * @property fViewHeight {number}
     */
	fViewHeight: 1,
	bDoubleHeight: false, // texture will be double plus high

	// Rendu des murs
	nRayLimit: 100,
	bExterior : false,
	nMeteo : 0,
	fCameraBGOfs : 0,
	fBGOfs: 0,
	fDist : 1,
	bSideWall : false,
	nWallPanel : 1,
	nWallPos : 1,
	xWall : 0,
	yWall : 0,
	aZBuffer : null,
	oContinueRay: null,
	
	// sprites
    /**
	 * @property oHorde {O876_Raycaster.Horde}
     */
	oHorde : null,
	aScanSectors : null,
	oMobileSectors : null,
	oThinkerManager : null,
	aVisibleMobiles: null,
	aDiscardedMobiles: null,
	oImages : null,
	oEffects : null,
	aWorld : null,
	oConfig : null,
	oWeaponLayer: null,
	oArmory: null,

	// upper level
	oUpper: null,
	/**
	 * Set Raycaster Configuration
	 * 	{
			shades: integer (default: 15) shading levels. The more, the most resource expensive.
			vr: boolean (default: false) if true, activates VR mode at startup.
			canvas: string|object reference to the canvas being used for display.
			smoothTextures: boolean (default: false) if true, the wall textures will be smoothed.
			drawMap: boolean (default: false) if true, will draw a mini map during game phase.
			planeSpacing: integer (défaut: 64 pixels) modify the size of a square grid.
			wallHeight: integer (défaut: 96 pixels) modify the height of all walls.
		}
	 */
	setConfig : function(oConfig) {
		if (this.oConfig === null) {
			this.oConfig = oConfig;
		} else {
			for (var i in oConfig) {
				this.oConfig[i] = oConfig[i];
			}
		}
	},

	setVR: function(b) {
		if (b) {
			this.b3d = true;
			this.xLimitL = this.xScrSize * 0.25 | 0;
			this.xLimitR = this.xScrSize * 0.75 | 0;
			if (this.oUpper) {
				this.oUpper.b3d = true;
				this.oUpper.xLimitL = this.xScrSize * 0.25 | 0;
				this.oUpper.xLimitR = this.xScrSize * 0.75 | 0;
			}
			this._o3DBufferCanvas = O876.CanvasFactory.cloneCanvas(this._oRenderCanvas);
			this._o3DBufferContext = this._o3DBufferCanvas.getContext('2d');
		} else {
			this.b3d = false;
			if (this.oUpper) {
				this.oUpper.b3d = false;
			}
		}
	},

	/** Définition des données initiale du monde
	 * @param aWorld objet contenant des définition de niveau
	 */
	defineWorld : function(aWorld) {
		this.aWorld = aWorld;
	},
	
	getMapSize: function() {
		return this.nMapSize;
	},

	initialize : function() {
		this.oRainbow = new O876.Rainbow();
		this.fViewAngle = PI / 4;
		if (this.oConfig.planeSpacing) {
			this.nPlaneSpacing = this.oConfig.planeSpacing; 
			this.xTexture = this.oConfig.planeSpacing; 
		}
		if (this.oConfig.wallHeight) {
			this.yTexture = this.oConfig.wallHeight; 
		}
		if (this._oCanvas === null) {
			this.initCanvas();
		}
		this.setDetail(1);
		this.aZBuffer = [];
		this.oEffects = new O876_Raycaster.GXManager();
		if (this.oImages === null) {
			this.oImages = new O876_Raycaster.ImageLoader();
		}
		this.oThinkerManager = new O876_Raycaster.ThinkerManager();
		this.oContinueRay = { bContinue: false };
		// économiser la RAM en diminuant le nombre de shading degrees
		if (this.oConfig.shades) {
			this.nShadingThreshold = this.oConfig.shades;
		}
		if (this.oConfig.vr) {
			this.setVR(true);
		}
		
		switch (this.nShadingThreshold) {
			case 0:
				this.nDimmedWall = 0;
				break;
				
			case 1:
				this.nDimmedWall = 1;
				break;
				
			default:
				this.nDimmedWall = Math.round(this.nShadingThreshold / 3);
				break;
		}
	},
	
	finalize: function() {
		this.oEffects.clear();
		this.oEffects = null;
		this.oImages.finalize();
		this.oImages = null;
		this.oThinkerManager = null;
		this._oContext.clearRect(0, 0, this._oCanvas.width, this._oCanvas.height);
	},

	/** Le shade process est un processus qui peut prendre du temps
	 * aussi proposons nous un callback destiné à afficher une barre de progression
	 */
	shadeProcess : function() {
		if (this.nShadingThreshold === 0) {
			return true;
		}
		var w, i = '';
        if (!this.oWall.image.complete) {
			console.warn('shadeprocess : the wall image ' + this.oWall.image.src + ' is not loaded yet.');
        }
        try {
            w = this.shadeImage(this.oWall.image, false);
		} catch (e) {
			throw new Error('could not shade the wall textures');
		}
		this.oWall.image = w;
		if (this.bFloor) {
			try {
                if (!this.oFloor.image.complete) {
                    console.warn('shadeprocess : the flat image ' + this.oFloor.image.src + ' is not loaded yet.');
                }
                w = this.shadeImage(this.oFloor.image, false);
			} catch (e) {
                console.log(this.oFloor.image);
                console.error(e.message);
                throw new Error('could not shade the flat textures');
			}
			this.oFloor.image = w;
		}
		
		for (i in this.oHorde.oTiles) {
			if (this.oHorde.oTiles[i].bShading) {
				try {
                    if (!this.oHorde.oTiles[i].oImage.complete) {
                        console.warn('shadeprocess : the sprite image of horde item "' + i + '" is not loaded yet.');
                    }
                    w = this.shadeImage(this.oHorde.oTiles[i].oImage, true);
				} catch (e) {
                    console.error(e.message);
                    throw new Error('could not shade the horde item ' + i);
				}
				this.oHorde.oTiles[i].bShading = false;
				this.oHorde.oTiles[i].oImage = w;
				return false;
			}
		}
		return true;
	},
	
	drawUpper: function() {
		this.oUpper.fViewHeight = this.fViewHeight + 2; 
		this.oUpper.drawScreen();
	},
	
	getDiscardedMobiles: function() {
		return this.aDiscardedMobiles;
	},

	frameProcess : function() {
		if (this.bPause) {
			return;
		}
		this.aDiscardedMobiles = this.updateHorde();
		if (this.oWeaponLayer) {
			this.oWeaponLayer.process(this.TIME_FACTOR, this.oCamera);
		}
		this.oEffects.process();
	},

	frameRender : function() {
		if (this.bPause) {
			this.flipBuffer();
			return;
		}
		if (this.b3d) {
			var c = this.oCamera; // camera
			var a = c.fTheta; // angle camera
			var cx = c.x; // position x camera centrale
			var cy = c.y; // position y camera centrale
			var r = this.n3dGap; // demi distance entre 2 yeux
			var al = a - PI / 2; // angle à adopter à gauche
			var ar = a + PI / 2; // angle à adopter à droite
			var fSinL = Math.sin(al);
			var fCosL = Math.cos(al);
			var fSinR = Math.sin(ar);
			var fCosR = Math.cos(ar);
			var cxl = r * fCosL + cx; 
			var cyl = r * fSinL + cy; 
			var cxr = r * fCosR + cx; 
			var cyr = r * fSinR + cy;
			c.x = cxl;
			c.y = cyl;
			this.i3dFrame = 0;
			this.drawScreen();
			this.oEffects.render();
			this.flipBuffer(true);
			this.i3dFrame = 1;
			c.x = cxr;
			c.y = cyr;
			this.i3dFrame = 1;
			this.drawScreen();
			this.oEffects.render();
			this.flipBuffer(true);
			c.x = cx;
			c.y = cy;
		} else {
			this.drawScreen();
			this.oEffects.render();
		}
	},

	/**
	 * Retreive a tile
	 */
	getTile: function(sTile) {
		var t = this.oHorde.oTiles;
		if (sTile in t) {
			return t[sTile];
		} else {
			var warn = 'this tile is not defined : "' + sTile + '"';
			console.warn(warn);
			throw new Error(warn);
		}
	},
	
	/**
	 * An emergency fonction which decrease the level of detail
	 * because the computer is too slow
	 */
	downgrade: function() {
		this._oCanvas.width >>= 1;
		this._oCanvas.height >>= 1;
		this.xScrSize >>= 1;
		this.yScrSize >>= 1;
		this.backgroundRedim();
		if (this.oUpper) {
			this.oUpper.xScrSize >>= 1;
			this.oUpper.yScrSize >>= 1;
		}
	},

	/**
	 * Ajoute une instance GX Effect dans le circuit
	 * @param G Classe GX Effect
	 */
	addGXEffect: function(G) {
		var g = new G(this);
		this.oEffects.addEffect(g);
		return g;
	},

    /**
	 * Selectionne une nouvelle arme
     * @param w
     */
	weapon: function(w) {
		var unsheat = (w) => {
            var wl = this.oArmory[w];
            this.oWeaponLayer = wl;
            wl.unsheat();
		};
		if (this.oWeaponLayer) {
            this.oWeaponLayer.sheat(() => {
            	unsheat(w);
            });
        } else {
            unsheat(w);
		}
	},

	buildLevel : function() {
		this.oHorde = null;
		this.oEffects.clear();
		this.aScanSectors = null;
		this.oMobileSectors = null;
		this.buildMap();
		this.buildHorde();
		this.buildWeapons();
	},

	updateHorde : function() {
		return this.oHorde.think();
	},

	initCanvas : function() {
		if (typeof this.oConfig.canvas === 'string') {
			this._oCanvas = document.getElementById(this.oConfig.canvas);
		} else if (typeof this.oConfig.canvas === 'object' && this.oConfig.canvas !== null) {
			this._oCanvas = this.oConfig.canvas;
		} else {
			throw new Error('initCanvas failed: configuration object needs a valid canvas entry (dom or string id)');
		}
		if (this.wCanvas) {
			this._oCanvas.width = this.wCanvas;
		}
		if (this.hCanvas) {
			this._oCanvas.height = this.hCanvas;
		}
		this._oContext = this._oCanvas.getContext('2d');
		if (this.bUseVideoBuffer) {
			if (this._oRenderCanvas === null) {
				this._oRenderCanvas = O876.CanvasFactory.getCanvas();
			}
			this._oRenderCanvas.height = this._oCanvas.height;
			this._oRenderCanvas.width = this._oCanvas.width;
			this._oRenderContext = this._oRenderCanvas.getContext('2d');
		} else {
			this._oRenderCanvas = this._oCanvas;
			this._oRenderContext = this._oContext;
		}
		if ('smoothTextures' in this.oConfig) {
            O876.CanvasFactory.setImageSmoothing(this._oRenderContext, this.oConfig.smoothTextures);
		}
		this.xScrSize = this._oCanvas.width;
		this.yScrSize = this._oCanvas.height >> 1;
	},
	

	getRenderCanvas: function() {
		return this._oRenderCanvas;
	},

	getRenderContext: function() {
		return this._oRenderContext;
	},
	
	getScreenCanvas: function() {
		return this._oCanvas;
	},

	getScreenContext: function() {
		return this._oContext;
	},

	/** Modification du détail 
	 * @param nDetail 0: interdit ; 1: haute qualité ; 2: bonne qualité ; 4 basse qualité
	 */
	setDetail : function(nDetail) {
		switch (nDetail) {
			case 1:
				this.nZoom = 1;
				this.xScrSize = this._oCanvas.width;
				this.drawFloor = this.drawFloor_zoom1;
				this.drawFloorAndCeil = this.drawFloorAndCeil_zoom1;
				break;
				
			default:
				console.warning('setting detail is now deprecated. Use css resizing instead');
		}
	},

	loadImage : function(sUrl) {
		return this.oImages.load(sUrl);
	},
	
	
	filterImage : function(oImage, f) {
		if (f) {
			var oCtx = oImage.getContext('2d');
			var oImgData = oCtx.getImageData(0, 0, oImage.width, oImage.height);
			var aPixData = oImgData.data;
			var nPixCount = aPixData.length;
			var fr = f.r, fg = f.g, fb = f.b;
			/*var b255 = function(x) {
				return Math.min(255, Math.max(0, x | 0));
			};*/
			for (var iPix = 0; iPix < nPixCount; iPix += 4) {
				aPixData[iPix] = Math.min(255, Math.max(0, aPixData[iPix] * fr | 0));     //b255(aPixData[iPix] * fr); 
				aPixData[iPix + 1] = Math.min(255, Math.max(0, aPixData[iPix + 1] * fg | 0));     //b255(aPixData[iPix + 1] * fg); 
				aPixData[iPix + 2] = Math.min(255, Math.max(0, aPixData[iPix + 2] * fb | 0));    //b255(aPixData[iPix + 1] * fb); 
			}
			oCtx.putImageData(oImgData, 0, 0);
		}
	},

	/** Le shading est un traitement long et est soumis à une limite de temps
	 * Si la fonction dépasse le temps limite elle se termine
	 */
	shadeImage : function(oImage, bSprite) {
		if (oImage.__shaded) {
			return oImage;
		}
		// Récupération du Shaded en cours (ou création d'un nouveau)
		var oShaded = O876.CanvasFactory.getCanvas();
		oShaded.width = oImage.width;
		oShaded.height = oImage.height * (this.nShadingThreshold + 1);
		var oCtx = oShaded.getContext('2d');
		var g;
		var nMethod = 1;
		g = {
			r : this.oVisual.fogColor.r,
			g : this.oVisual.fogColor.g,
			b : this.oVisual.fogColor.b
		};
		// Maximiser le filter
		if (bSprite && this.oVisual.filter) {
			var oFilteredImage;
			oFilteredImage = O876.CanvasFactory.getCanvas();
			oFilteredImage.width = oImage.width;
			oFilteredImage.height = oImage.height;
			oFilteredImage.getContext('2d').drawImage(oImage, 0, 0);
			this.filterImage(oFilteredImage, this.oVisual.filter);
			oImage = oFilteredImage;
		}
		var fAlphaMin = this.oVisual.diffuse || 0;
		// i : 0 -> shadingThreshold
		// f : 0 -> 1
		// f2 : fAlphaMin -> 1
		for ( var i = 0; i <= this.nShadingThreshold; i++) {
			g.a = Math.min(i / this.nShadingThreshold, 1) * (1 - fAlphaMin);
			switch (nMethod) {
				case 0: // Méthode conservant l'Alpha (ne marche pas sous moz)
					oCtx.globalCompositeOperation = 'source-over';
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.fillStyle = this.oRainbow.rgba(g);
					oCtx.fillRect(0, i * oImage.height, oImage.width,
							oImage.height);
					oCtx.globalCompositeOperation = 'destination-in';
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.globalCompositeOperation = 'source-over';
					break;

				case 1:
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.globalCompositeOperation = 'source-atop';
					oCtx.fillStyle = this.oRainbow.rgba(g);
					oCtx.fillRect(0, i * oImage.height, oImage.width,
							oImage.height);
					oCtx.globalCompositeOperation = 'source-over';
					break;

				case 2:
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.globalCompositeOperation = 'source-over';
					break;
			}
		}
		oShaded.__shaded = true;
		return oShaded;
	},

	/**
	 * Clonage de mur.
	 * La texture nSide du pan mur spécifié par x, y est copiée dans un canvas transmis 
	 * à une function callBack. à charge de cette fonction de dessiner ce qu'elle veux dans 
	 * ce canvas cloné. cette modification sera reportée dans le jeu.
	 *   
	 * @param x coordonnée X du mur
	 * @param y coordonnée Y du mur
	 * @param nSide coté du mur 0:nord, 1:est, 2:sud, 3:ouest
	 * @param pDrawingFunction fonction qui servira à déssiner le mur (peut être un tableau [instance, function],
	 * cette fonction devra accepter les paramètres suivants :
	 * - param1 : instance du raycaster
	 * - param2 : instance du canvas qui contient le clone de la texture.
	 * - param3 : coordoonée X du mur
	 * - param4 : coordoonée Y du mur
	 * - param5 : coté du mur concerné
	 */
	cloneWall : function(x, y, nSide, pDrawingFunction) {
		if (nSide === false) {
			for (var i = 0; i < 4; ++i) {
				this.cloneWall(x, y, i, pDrawingFunction);
			}
			return;
		}
		if (pDrawingFunction === false) {
			this.oXMap.removeClone(x, y, nSide);
		} else {
			var c = this.oXMap.cloneTexture(this.oWall.image, this.aWorld.walls.codes[this.getMapCode(x, y)][nSide], x, y, nSide);
			pDrawingFunction(this, c, x, y, nSide);
			this.shadeCloneWall(c, x, y, nSide);
		}
	},

	shadeCloneWall : function(oCanvas, x, y, nSide) {
		var a = this.shadeImage(oCanvas, false);
		this.oXMap.get(x, y, nSide).surface = a;
		return a;
	},
	
	cloneFlat: function(x, y, nSide, pDrawingFunction) {
		if (nSide === false) {
			this.cloneFlat(x, y, 0, pDrawingFunction);
			this.cloneFlat(x, y, 1, pDrawingFunction);
			return;
		}
		if (pDrawingFunction === false) {
			this.oXMap.removeClone(x, y, nSide + 4);
			return;
		}
		var iTexture = this.aWorld.flats.codes[this.getMapCode(x, y)][nSide];
		if (iTexture < 0) {
			return;
		}
		var c = this.oXMap.cloneTexture(this.oFloor.image, iTexture, x, y, nSide + 4);
		nSide += 4;
		pDrawingFunction(this, c, x, y, nSide);
		c = this.shadeCloneWall(c, x, y, nSide);
		// faire l'image map du canvas
		var b = this.oXMap.get(x, y, nSide);
		var oCtx = c.getContext('2d');
		b.imageData = oCtx.getImageData(0, 0, c.width, c.height);
		b.imageData32 = new Uint32Array(b.imageData.data.buffer);
	},
	
	/* Code map
	 * Numéro de Tile (byte)
	 * Propriété physique (byte)
	 * - 0: pas d'état
	 * - 1: porte coulissant vers le haut
	 * - 2: porte coulissant vers le bas
	 * - 3: porte coulissant vers la gauche
	 * - 4: porte coulissant vers la droite
	 * Transitionneur (nombre permettant de faire evoluer un etat) (byte)
	 * - 1, 2, 3, 4: Offset de déplacement

	 */
	/** Vérifie l'existance d'une série de clé dans un objet
	 * @param oObj objet à vérifier
	 * @param aKeys liste des clés
	 * @return bool true : l'objet est OK, false : il manque une ou plusieur clé
	 */
	checkObjectStructure : function(oObj, xKeys) {
		// clé composée
		if (ArrayTools.isArray(xKeys)) {
			for (var i = 0; i < xKeys.length; i++) {
				this.checkObjectStructure(oObj, xKeys[i]);
			}
			return true;
		}
		if (xKeys.indexOf('.') >= 0) {
			var aKeys = xKeys.split('.');
			var sKey0 = aKeys.shift();
			if (this.checkObjectStructure(oObj, sKey0)) {
				// Vérifier premier objet
				return this.checkObjectStructure(oObj[sKey0], aKeys.join('.'));
			} else {
				throw new Error('invalid object structure: missing key [' + xKeys + ']');
			}
		} else {
			if (typeof oObj != 'object') {
				throw new Error('invalid object type : ' + (typeof oObj) + ' ; can not contain key [' + xKeys + ']');
			}
			if (oObj === null) {
				throw new Error('object is null, and can not contain key [' + xKeys + ']');
			}
			if (xKeys in oObj) {
				return true;
			} else {
				throw new Error('invalid object structure: missing key [' + xKeys + ']');
			}
		}
	},

    /**
	 * Renvoie la valeur de l'option spécifiée
	 * si elle est défini dans la définition du niveau
     * @param sOption
     */
	getWorldOption: function(sOption) {
		var oOptions = this.aWorld.options || {};
		if (sOption in oOptions) {
			return oOptions[sOption];
		} else {
			return undefined;
		}
	},

	/** Construction de la map avec les donnée contenues dans aWorld
	 */
	buildMap : function() {
		var oData = this.aWorld;
		// verifier integrité des données
		this.checkObjectStructure(oData, [
			'map.length',
			'walls.src',
			'walls.codes',
			'startpoint.x',
			'startpoint.y',
			'startpoint.angle',
			'visual'
		]);
		this.nMapSize = oData.map.length;
		this.oMobileSectors = new O876_Raycaster.MobileRegister(
				this.nMapSize);
		this.oDoors = Marker.create();
		this.aMap = [];
		var yMap, xMap;
		for (yMap = 0; yMap < oData.map.length; ++yMap) {
			this.aMap[yMap] = new Uint32Array(oData.map[yMap].length);
			for (xMap = 0; xMap < oData.map[yMap].length; ++xMap) {
				this.aMap[yMap][xMap] = oData.map[yMap][xMap];
			}
		}
		this.oWall = {
			image : this.loadImage(oData.walls.src),
			codes : oData.walls.codes,
			animated : 'animated' in oData.walls ? oData.walls.animated : {}
		};
		if ('flats' in oData && oData.flats) {
			this.bFloor = true;
			var bEmptyCeil = oData.flats.codes.every(function(item) {
				if (item) {
					return item[1] === -1;
				} else {
					return true;
				}
			});
			var bEmptyFloor = oData.flats.codes.every(function(item) {
				if (item) {
					return item[0] === -1;
				} else {
					return true;
				}
			});
			this.bCeil = !bEmptyCeil;
			this.bFloor = !bEmptyFloor;
			if (this.bFloor) {
				this.oFloor = {
					image : this.loadImage(oData.flats.src),
					codes : oData.flats.codes,
					imageData : null,
					imageData32 : null,
					renderSurface32 : null
				};
			}
		} else {
			this.bFloor = false;
			this.bCeil = false;
		}
		if ('background' in oData && oData.background) {
			this.oBackground = this.loadImage(oData.background);
			this.bSky = true;
		} else {
			this.oBackground = null;
			this.bSky = false;
		}
		// construction des textures animées
		this.buildAnimatedTextures();
		// Définition de la caméra
		this.oCamera = new O876_Raycaster.Mobile();
		this.oCamera.oRaycaster = this;
		this.oCamera.fSpeed = 8;
		this.oCamera.fRotSpeed = 0.1;
		this.oCamera.xSave = this.oCamera.x = oData.startpoint.x;
		this.oCamera.ySave = this.oCamera.y = oData.startpoint.y;
		this.oCamera.xSector = this.oCamera.x / this.nPlaneSpacing | 0;
		this.oCamera.ySector = this.oCamera.y / this.nPlaneSpacing | 0;
		this.oCamera.fTheta = oData.startpoint.angle;
		this.oCamera.bActive = true;
		this.oVisual = {
			ceilColor: oData.visual.ceilColor,		// couleur du plafond au pixel le plus proche
			floorColor: oData.visual.floorColor,	// couleur du sol au pixel le plus proche
			light: oData.visual.light,				// puissance lumineuse combinée à la distance pour déterminer la luminosité final d'un objet 
			diffuse: oData.visual.diffuse,			// luminosité minimale de tout objet ou mur
			filter: oData.visual.filter,			// filtre coloré appliqué aux sprites
			fogDistance: oData.visual.fogDistance,	// indice du gradient correspondant à la fogColor (0..1)
			fogColor: oData.visual.fogColor			// couleur du fog
		};
		this.buildGradient();
		// Extra Map
		this.oXMap = new O876_Raycaster.XMap();
		this.oXMap.setBlockSize(this.xTexture, this.yTexture);
		this.oXMap.setSize(this.nMapSize, this.nMapSize);

		if ('uppermap' in oData && !!oData.uppermap) {
			this.buildSecondFloor();
            this.oUpper.bDoubleHeight = !!this.getWorldOption('stretch');
		}
	},


	
	backgroundRedim: function() {
		var oBackground = this.oBackground;
		var dh = this.yScrSize << 1;
		if (oBackground && oBackground.height !== dh) {
			var sw = oBackground.width;
			var sh = oBackground.height;
			var dw = sw * dh / sh | 0;
			var bg2 = O876.CanvasFactory.getCanvas();
			bg2.height = dh;
			bg2.width = dw;
			var ctx = bg2.getContext('2d');
			ctx.drawImage(oBackground, 0, 0, sw, sh, 0, 0, dw, dh);
			this.oBackground = bg2;
		}
	},
	
	/**
	 * Ajoute un second étage au raycaster
	 */
	buildSecondFloor: function() {
		// Ajout du second étage
		var oData = this.aWorld;
		if ('uppermap' in oData) {
			var SELF = this.constructor;
			var urc = new SELF();
			urc.nRayLimit = 16;
			urc.TIME_FACTOR = this.TIME_FACTOR;
			urc.setConfig(this.oConfig);
			urc.bUseVideoBuffer = false;
			urc.initialize();
			var oUpperWorld = {
				map: oData.uppermap,
				walls: oData.walls,
				visual: oData.visual,
				startpoint: oData.startpoint,
				tiles: oData.tiles,
				blueprints: {},
				objects: []
			};
			urc.defineWorld(oUpperWorld);
			urc.buildMap();
			urc.bGradient = false;
			urc.oCamera = this.oCamera;
			urc.oWall = this.oWall;
			urc._oRenderCanvas = this._oRenderCanvas;
			urc._oRenderContext = this._oRenderContext;
			this.oUpper = urc;
		}
	},

	buildHorde : function() {
		this.oHorde = new O876_Raycaster.Horde(this);
		this.oHorde.oThinkerManager = this.oThinkerManager;
		var aData = this.aWorld;
		var oTiles = aData.tiles;
		var oBlueprints = aData.blueprints;
		var oMobs = aData.objects;
		this.oHorde.linkMobile(this.oCamera);
		var i = '';
		for (i in oTiles) {
			this.oHorde.defineTile(i, oTiles[i]);
		}
		for (i in oBlueprints) {
			this.oHorde.defineBlueprint(i, oBlueprints[i]);
		}
		for (i = 0; i < oMobs.length; i++) {
			this.oHorde.defineMobile(oMobs[i]);
		}
	},

	buildWeapons: function() {
        this.oArmory = {};
        var oData = this.aWorld;
        if ('weapons' in oData && !!oData.weapons) {
            var wl, wd;
            for (var iw in oData.weapons) {
                wd = oData.weapons[iw];
                wl = new O876_Raycaster.WeaponLayer();
                wl.tile = this.getTile(wd.tile);
                wl.base(wd.x, wd.y, this.yScrSize << 1);
                wl.playAnimation(0);
                this.oArmory[iw] = wl;
            }
        }
	},

	/** Création des gradient
	 * pour augmenter la luz :
	 * this.oVisual.light = 200; 
	 * this.oVisual.fogDistance = 1; 
	 * G.oRaycaster.buildGradient();
	 */
	buildGradient : function() {
		var g;
		var rainbow = this.oRainbow;
		this.oVisual.gradients = [];
		g = this._oRenderContext.createLinearGradient(0, 0, 0, this._oCanvas.height >> 1);
		g.addColorStop(0, rainbow.rgba(this.oVisual.ceilColor));
		if (this.oVisual.fogDistance < 1) {
			g.addColorStop(this.oVisual.fogDistance, rainbow.rgba(this.oVisual.fogColor));
		}
		g.addColorStop(1, rainbow.rgba(this.oVisual.fogColor));
		this.oVisual.gradients[0] = g;

		g = this._oRenderContext.createLinearGradient(0, this._oCanvas.height - 1, 0, (this._oCanvas.height >> 1) + 1);
		g.addColorStop(0, rainbow.rgba(this.oVisual.floorColor));
		if (this.oVisual.fogDistance < 1) {
			g.addColorStop(this.oVisual.fogDistance, rainbow.rgba(this.oVisual.fogColor));
		}
		g.addColorStop(1, rainbow.rgba(this.oVisual.fogColor));
		this.oVisual.gradients[1] = g;

		this.nShadingFactor = this.oVisual.light;
	},
	
	insideMap: function(x) {
		return x >= 0 && x < this.nMapSize;
	},

	/** Lance un rayon dans la map actuelle
	 * Lorsque le rayon frappe un mur opaque, il s'arrete et la fonction renvoie la liste
	 * des secteur traversé (visible).
	 * La fonction mets à jour un objet contenant les propriétés suivantes :
	 *   nWallPanel    : Code du Paneau (texture) touché par le rayon
	 *   bSideWall     : Type de coté (X ou Y)
	 *   nSideWall     : Coté
	 *   nWallPos      : Position du point d'impact du rayon sur le mur
	 *   xWall         : position du mur sur la grille
	 *   yWall         :  "       "       "       "
	 *   fDist         : longueur du rayon
	 * @param oData objet de retour
	 * @param x position de la camera
	 * @param y    "      "      "
	 * @param dx pente du rayon x (le cosinus de son angle)
	 * @param dy pente du rayon y (le sinus de son angle)
	 * @param aExcludes tableau des cases semi transparente que le rayon peut traverser
	 * @param aVisibles tableau des cases visitées par le rayon
	 */
	projectRay : function(oData, x, y, dx, dy, aExcludes, aVisibles) {
		var side = 0;
		var map = this.aMap;
		var nMapSize = this.nMapSize;
		var nScale = this.nPlaneSpacing;

		var xi, yi, xt, dxt, yt, dyt, t, dxi, dyi, xoff, yoff, cmax = oData.nRayLimit;
		
		var oContinue = oData.oContinueRay;
		
		
		// Le continue sert à se passer de refaire le raycast depuis la 
		// source (camera), on mémorise xi et yi
		if (oContinue.bContinue) {
			xi = oContinue.xi;
			yi = oContinue.yi;
		} else {
			xi = x / nScale | 0;
			yi = y / nScale | 0;
		}
		xoff = (x / nScale) - xi;
		yoff = (y / nScale) - yi;
		if (dx < 0) {
			xt = -xoff / dx;
			dxt = -1 / dx;
			dxi = -1;
		} else {
			xt = (1 - xoff) / dx;
			dxt = 1 / dx;
			dxi = 1;
		}
		if (dy < 0) {
			yt = -yoff / dy;
			dyt = -1 / dy;
			dyi = -1;
		} else {
			yt = (1 - yoff) / dy;
			dyt = 1 / dy;
			dyi = 1;
		}
		
		var xScale = nScale * dx;
		var yScale = nScale * dy;
		
		t = 0;
		var done = 0;
		var c = 0;
		var bStillVisible = true;
		var nOfs, nTOfs = 0;
		var nText;
		
		var Marker_getMarkXY = Marker.getMarkXY;
		var Marker_markXY = Marker.markXY;

		var nPhys;
		var nPHYS_FIRST_DOOR = this.PHYS_FIRST_DOOR;
		var nPHYS_LAST_DOOR = this.PHYS_LAST_DOOR;
		var nPHYS_SECRET_BLOCK = this.PHYS_SECRET_BLOCK;
		var nPHYS_OFFSET_BLOCK = this.PHYS_OFFSET_BLOCK;
		var nPHYS_TRANSPARENT_BLOCK = this.PHYS_TRANSPARENT_BLOCK;
		var xint = 0, yint = 0;
		
		var sameOffsetWall = this.sameOffsetWall;
		
		while (done === 0) {
			if (xt < yt) {
				xi += dxi;
				if (xi >= 0 && xi < nMapSize) {
					nText = map[yi][xi];
					nPhys = (nText >> 12) & 0xF; // **code12** phys
					
					if (nText !== 0	&& Marker_getMarkXY(aExcludes, xi, yi)) {
						nPhys = nText = 0;
					}
					
					if (nPhys >= nPHYS_FIRST_DOOR && nPhys <= nPHYS_LAST_DOOR) {
						// entre PHYS_FIRST_DOOR et PHYS_LAST_DOOR
						nOfs = nScale >> 1;
					} else if (nPhys === nPHYS_SECRET_BLOCK || nPhys === nPHYS_TRANSPARENT_BLOCK || nPhys === nPHYS_OFFSET_BLOCK) {
						// PHYS_SECRET ou PHYS_TRANSPARENT
						nOfs = (nText >> 16) & 0xFF; // **Code12** offs
					} else {
						nOfs = 0;
					}
					
					if (nOfs) {
						xint = x + xScale * xt;
						yint = y + yScale * xt;
						if (sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
							nTOfs = (dxt / nScale) * nOfs;
							yint = y + yScale * (xt + nTOfs);
							if (((yint / nScale | 0)) !== yi) {
								nPhys = nText = 0;
							}
							if (nText !== 0	&& Marker_getMarkXY(aExcludes, xi, yi)) {
								nPhys = nText = 0;
							}
						} else { // pas même mur -> wall
							nPhys = nText = 0;
						}
					} else {
						nTOfs = 0;
					}
					// 0xB00 : INVISIBLE_BLOCK ou vide 0x00
					if (nPhys === 0xB || nPhys === 0) {
						if (bStillVisible) {
							Marker_markXY(aVisibles, xi, yi);
						}
						xt += dxt;
					} else {
						t = xt + nTOfs;
						xint = x + xScale * t;
						yint = y + yScale * t;
						done = 1;
						side = 1;
						bStillVisible = false;
					}
				} else {
					t = xt;
					c = cmax;
				}
			} else {
				yi += dyi;
				if (yi >= 0 && yi < nMapSize) {
					nText = map[yi][xi];
					nPhys = (nText >> 12) & 0xF; // **Code12** phys

					if (nText !== 0 && Marker_getMarkXY(aExcludes, xi, yi)) {
						nPhys = nText = 0;
					} 
					
					if (nPhys >= nPHYS_FIRST_DOOR && nPhys <= nPHYS_LAST_DOOR) {
						// entre PHYS_FIRST_DOOR et PHYS_LAST_DOOR
						nOfs = nScale >> 1;
					} else if (nPhys === nPHYS_SECRET_BLOCK || nPhys === nPHYS_TRANSPARENT_BLOCK || nPhys === nPHYS_OFFSET_BLOCK) {
						// PHYS_SECRET ou PHYS_TRANSPARENT
						nOfs = (nText >> 16) & 0xFF; // **Code12** offs
					} else {
						nOfs = 0;
					}

					if (nOfs) {
						xint = x + xScale * yt;
						yint = y + yScale * yt;
						if (sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
							nTOfs = (dyt / nScale) * nOfs;
							xint = x + xScale * (yt + nTOfs);
							if (((xint / nScale | 0)) !== xi) {
								nPhys = nText = 0;
							}
							if (nText !== 0	&& Marker_getMarkXY(aExcludes, xi, yi)) {
								nPhys = nText = 0;
							}
						} else { // pas même mur -> wall
							nPhys = nText = 0;
						}
					} else {
						nTOfs = 0;
					}
					if (nPhys === 0xB || nPhys === 0) {
						if (bStillVisible) {
							Marker_markXY(aVisibles, xi, yi);
						}
						yt += dyt;
					} else {
						t = yt + nTOfs;
						xint = x + xScale * t;
						yint = y + yScale * t;
						done = 1;
						side = 2;
						bStillVisible = false;
					}
				} else {
					t = yt;
					c = cmax;
				}
			}
			c++;
			if (c >= cmax) {
				//			t = 100;
				done = 1;
			}
		}
		if (c < cmax) {
			oData.nWallPanel = map[yi][xi];
			oData.bSideWall = side === 1;
			oData.nSideWall = side - 1;
			oData.nWallPos = oData.bSideWall ? yint % oData.xTexture
					: xint % oData.xTexture;
			if (oData.bSideWall && dxi < 0) {
				oData.nWallPos = oData.xTexture - oData.nWallPos;
				oData.nSideWall = 2;
			}
			if (!oData.bSideWall && dyi > 0) {
				oData.nWallPos = oData.xTexture - oData.nWallPos;
				oData.nSideWall = 3;
			}
			oData.xWall = xi;
			oData.yWall = yi;
			oData.fDist = t * nScale;
			oData.bExterior = false;
			if (this.isWallTransparent(oData.xWall, oData.yWall)) {
				oContinue.bContinue = true;
				oContinue.xi = xi;
				oContinue.yi = yi;
			} else {
				oContinue.bContinue = false;
			}
		} else {
			oData.fDist = t * nScale;
			oData.bExterior = true;
		}
	},

	/**
	 * Calcule le caste d'un rayon  
	 */
	castRay : function(oData, x, y, dx, dy, xScreen, aVisibles) {
		var aExcludes = Marker.create();
		var oXBlock = null;
		var oWall;
		var nTextureBase;
		var nMaxIterations = 6;
		if (!aVisibles) {
			aVisibles = Marker.create();
		}
		var oBG = this.oBackground;
		do {
			this.projectRay(oData, x, y, dx, dy, aExcludes, aVisibles);
			if (oData.bExterior) {
				// hors du laby
				if (oBG) {
					this.drawExteriorLine(xScreen, oData.fDist);
				}
			} else if (oData.fDist >= 0) {
				if (xScreen !== undefined) {
					// Lecture données extra du block;
					oXBlock = this.oXMap.get(oData.xWall, oData.yWall,
							oData.nSideWall);
					if (oXBlock.surface) {
						oWall = oXBlock.surface;
						nTextureBase = 0;
					} else {
						oWall = oData.oWall.image;						
						nTextureBase = oData.oWall.codes[oData.nWallPanel & 0xFFF][oData.nSideWall] * this.xTexture; // **code12** code
					}
					this.drawLine(xScreen, oData.fDist, nTextureBase,
							oData.nWallPos | 0, oData.bSideWall, oWall,
							oData.nWallPanel, oXBlock.diffuse);
				} 
				if (oData.oContinueRay.bContinue) {
					Marker.markXY(aExcludes, oData.xWall, oData.yWall);
				}
			}
			--nMaxIterations;
		} while (oData.oContinueRay.bContinue && nMaxIterations > 0);
		return aVisibles;
	},

	/**
	 * CastRay rapide (pas de considération graphique)
	 * @param oData données à mettre à jour (bExterior fDist xwall ywall owall)
	 * @param x position camera x
	 * @param y position camera y
	 * @param dx direction du rayon X
	 * @param dy direction du rayon y
	 * @param xScreen (facultatif) Y actuellement déssiné (pour l'extérieur)
	 * @param aVisibles liste des secteur visibles
	 * @returns aVisibles
	 */
	fastCastRay : function(x, y, a) {
		var aExcludes = Marker.create();
		var nMaxIterations = 6;
		var aVisibles = {};
		var dx = Math.cos(a);
		var dy = Math.sin(a);
		var oData = { 
			oContinueRay : {
				bContinue : false
			},
			nRayLimit : 10
		};
		do {
			this.projectRay(oData, x, y, dx, dy, aExcludes, aVisibles);
			if (oData.fDist >= 0) {
				if (oData.oContinueRay.bContinue) {
					Marker.markXY(aExcludes, oData.xWall, oData.yWall);
				}
			}
			nMaxIterations--;
		} while (oData.oContinueRay.bContinue && nMaxIterations > 0);
		return aVisibles;
	},

	
	
	sameOffsetWall : function(nOfs, x0, y0, xm, ym, fBx, fBy, ps) {
		x0 += nOfs * fBx;
		y0 += nOfs * fBy;
		var ym2, xm2;
		ym2 = y0 / ps | 0;
		xm2 = x0 / ps | 0;
		return xm2 == xm && ym2 == ym;
	},

	// compare z, départage les z identique en comparant les x
	// du plus grand au plus petit Z (distance)
	// si Z identitiques du plus petit au plus grand dx
	zBufferCompare : function(a, b) {
		if (a[9] != b[9]) {
			return b[9] - a[9];
		}
		return a[5] - b[5];
	},

	// renvoie true si le code correspond à une porte (une vrai porte, pas un passage secret)
	isDoor : function(xw, yw) {
		var nPhys = this.getMapPhys(xw, yw);
		return (nPhys >= this.PHYS_FIRST_DOOR && nPhys <= this.PHYS_LAST_DOOR);
	},

	// Renvoie true si on peut voir a travers le murs, et qu'on doit relancer le seekWall pour ce Ray
	isWallTransparent : function(xWall, yWall) {
		var nPhys = this.getMapPhys(xWall, yWall);
		if (nPhys === 0) {
			return false;
		}
		var nOffset = this.getMapOffs(xWall, yWall);
		// code physique transparent
		if ((nPhys >= this.PHYS_FIRST_DOOR &&
				nPhys <= this.PHYS_LAST_DOOR && nOffset !== 0) ||
				nPhys == this.PHYS_TRANSPARENT_BLOCK ||
				nPhys == this.PHYS_INVISIBLE_BLOCK) {
			return true;
		}
		return false;
	},
	
	// Renvoie la distance d'un éventuel renfoncement
	getWallDepth : function(xw, yw) {
		var nPhys = this.getMapPhys(xw, yw);
		if (this.isDoor(xw, yw)) {
			return this.nPlaneSpacing >> 1;
		}
		if (nPhys == this.PHYS_SECRET_BLOCK || nPhys == this.PHYS_TRANSPARENT_BLOCK || nPhys == this.PHYS_OFFSET_BLOCK) {
			return this.getMapOffs(xw, yw);
		}
		return 0;
	},
	
	getBlockData: function(x, y, nSide) {
		return this.oXMap.get(x, y, nSide);
	},

	setMapXY: function(x, y, nCode) {
		this.aMap[y][x] = nCode;
	},

	getMapXY: function(x, y) {
		return this.aMap[y][x];
	},

	setMapCode : function(x, y, nTexture) {
		this.aMap[y][x] = (this.aMap[y][x] & 0xFFFFF000) | nTexture; // **code12** code
	},

	getMapCode : function(x, y) {
		return this.aMap[y][x] & 0xFFF; // **code12** code
	},

	setMapPhys : function(x, y, nPhys) {
		this.aMap[y][x] = (this.aMap[y][x] & 0xFFFF0FFF) | (nPhys << 12); // **code12** phys
	},

	getMapPhys : function(x, y) {
		return (this.aMap[y][x] >> 12) & 0xF;  // **code12** phys
	},

	setMapOffs : function(x, y, nOffset) {
		this.aMap[y][x] = (this.aMap[y][x] & 0xFF00FFFF) // **code12** offs
				| (nOffset << 16);
	},

	getMapOffs : function(x, y) {
		return (this.aMap[y][x] >> 16) & 0xFF; // **code12** offs
	},

	drawScreen : function() {
		// phase 1 raycasting
		
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);
		var dx = (wx2 - wx1) / this.xScrSize;
		var dy = (wy2 - wy1) / this.xScrSize;
		var fBx = wx1;
		var fBy = wy1;
		var xCam = this.oCamera.x;
		var yCam = this.oCamera.y;
		var xCam8 = xCam / this.nPlaneSpacing | 0;
		var yCam8 = yCam / this.nPlaneSpacing | 0;
		var i;
		this.aZBuffer = [];
		this.aScanSectors = Marker.create();
		if (this.oBackground) { // Calculer l'offset camera en cas de background
			this.fCameraBGOfs = (PI + this.oCamera.fTheta) * this.oBackground.width / PI;
		}
		Marker.markXY(this.aScanSectors, xCam8, yCam8);
		var oContinueRay = this.oContinueRay;
		var xScrSize = this.xScrSize;
		var aScanSectors = this.aScanSectors;
		var xl = this.b3d ? this.xLimitL : 0;
		var xr = this.b3d ? this.xLimitR : xScrSize;
		for (i = 0; i < xScrSize; ++i) {
			if (i >= xl && i <= xr) { 
				oContinueRay.bContinue = false;
				this.castRay(this, xCam, yCam, fBx, fBy, i, aScanSectors);
			}
			fBx += dx;
			fBy += dy;
		}
		// Optimisation ZBuffer -> suppression des drawImage inutile, élargissement des drawImage utiles.
		// si le last est null on le rempli
		// sinon on compare last et current
		// si l'un des indices 0, 1 diffèrent alors on flush, sinon on augmente le last
		var aZ = [];
		var nLast = 1;
		var nLLast = 1;
		var nLLLast = 1;
		var z = 1;
		
		// image 0
		// sx  1
		// sy  2
		// sw  3
		// sh  4
		// dx  5
		// dy  6
		// dw  7
		// dh  8
		// z   9
		// fx  10
		// id  11 identifiant image
		
		var zb = this.aZBuffer;
		var zbl = zb.length;
		if (zbl === 0) {
			return;
		}
		var b; // Element courrant du ZBuffer;
		var lb = zb[0];
		var llb = lb;
		var lllb = lb;
		var abs = Math.abs;
		
		for (i = 0; i < zbl; i++) {
			b = zb[i];
			// tant que c'est la même source de texture=
			if (b[10] === lb[10] && b[0] === lb[0] && b[1] === lb[1] && abs(b[9] - lb[9]) < 8) {
				nLast += z;
			} else if (b[10] === llb[10] && b[0] === llb[0] && b[1] === llb[1] && abs(b[9] - llb[9]) < 8) {
				nLLast += z;
			} else if (b[10] === lllb[10] && b[0] === lllb[0] && b[1] === lllb[1] && abs(b[9] - lllb[9]) < 8) {
				nLLLast += z;
			} else {
				lllb[7] = nLLLast;
				aZ.push(lllb);
				lllb = llb;
				nLLLast = nLLast;
				llb = lb;
				nLLast = nLast;
				lb = b;
				nLast = z;
			}
		}
		lllb[7] = nLLLast;
		aZ.push(lllb);
		llb[7] = nLLast;
		aZ.push(llb);
		lb[7] = nLast;
		aZ.push(lb);
		
		zb = this.aZBuffer = aZ;
		this.drawHorde();
		// Le tri permet d'afficher les textures semi transparente après celles qui sont derrières
		this.aZBuffer.sort(this.zBufferCompare);
		
		var rctx = this._oRenderContext;
		

		// phase 2 : rendering

		// sky
		if (this.bSky && this.oBackground) {
			var oBG = this.oBackground;
			var wBG = oBG.width;
			var hBG = oBG.height;
			var xBG = (this.fBGOfs + this.fCameraBGOfs) % wBG | 0;
			while (xBG < 0) {
				xBG += wBG;
			}
			var yBG = this.yScrSize - (hBG >> 1);
			hBG = hBG + yBG;
			rctx.drawImage(oBG, 0, 0, wBG, hBG, wBG - xBG, yBG, wBG, hBG);
			rctx.drawImage(oBG, 0, 0, wBG, hBG, -xBG, yBG, wBG, hBG);
		} else if (this.bGradient) {
			rctx.fillStyle = this.oVisual.gradients[0];
			rctx.fillRect(0, 0, this._oCanvas.width, this._oCanvas.height >> 1);
			if (!this.bFloor) {
				rctx.fillStyle = this.oVisual.gradients[1];
				rctx.fillRect(0, (this._oCanvas.height >> 1), this._oCanvas.width, this._oCanvas.height >> 1);
			}
		}
		// 2ndFloor
		if (this.oUpper) {
			this.drawUpper();
		}
		// floor
		if (this.bFloor) {
			if (this.bCeil && this.fViewHeight !== 1) {
				this.drawFloorAndCeil();
			} else {
				this.drawFloor();
			}
		}
		zbl = zb.length;
		for (i = 0; i < zbl; ++i) {
			this.drawImage(zb[i]);
		}
		// weapon
		if (this.oWeaponLayer) {
			this.oWeaponLayer.render(this._oRenderContext);
		}
		if (this.oConfig.drawMap) {
			this.drawMap();
		}
	},

	stats: function() {
		function oneStat(a) {
			return {
				cast: a.cast - a.start,
				sort: a.sort - a.cast,
				bg: a.bg - a.sort,
				upper: a.upper - a.bg,
				flat: a.flat - a.upper,
				render: a.render - a.flat,
				map: a.map - a.render,
				total: a.map - a.start
			};
		}
		var oStat = this
			.aChronoStat
			.map(oneStat)
			.reduce(function(oPrev, a) {
				var oRes = {};
				for (var x in oPrev) {
					oRes[x] = a[x] + oPrev[x];
				}
				return oRes;
			}, {
				cast: 0,
				sort: 0,
				bg: 0,
				upper: 0,
				flat: 0,
				render: 0,
				map: 0,
				total: 0
			})
		;
		for (var x in oStat) {
			oStat[x] = Math.floor(oStat[x]) / 10;

		}
		if (this.oUpper) {
			oStat.upperdet = this.oUpper.stats();
		}
		return oStat;
	},
	
	/**
	 * Transfere le contenu du buffer mémoire vers le buffer écran
	 * @param bPrerender {boolean} effectue le rendu dans un buffer intermediaire
	 */
	flipBuffer: function(bPrerender) {
		var rc = this._oRenderCanvas;
		if (this.bUseVideoBuffer) {
			var b3d = this.b3d;
			if (b3d && bPrerender) {
				// rendu stereo + pre rendu
				var rcw2 = rc.width >> 1;
                this._o3DBufferContext.drawImage(
					rc,
					this.xLimitL,
					0, 
					rcw2, 
					rc.height, 
					this.i3dFrame * rcw2, 
					0, 
					rcw2, 
					rc.height
				);
			} else if (b3d) {
                // rendu stereo + rendu normal
				this._oContext.drawImage(this._o3DBufferCanvas, 0, 0);
			} else {
                this._oContext.drawImage(rc, 0, 0);
			}
		}
	},

	drawSprite : function(oMobile) {
		var oSprite = oMobile.oSprite;
		// Si le sprite n'est pas visible, ce n'est pas la peine de gaspiller du temps CPU
		// on se barre immédiatement
		if (!(oSprite.bVisible && oMobile.bVisible)) {
			return;
		}
		var oTile = oSprite.oBlueprint.oTile;
		var dx = oMobile.x - this.oCamera.x;
		var dy = oMobile.y - this.oCamera.y;

		// Gaffe fAlpha est un angle ici, et pour un sprite c'est une transparence
		var fTarget = Math.atan2(dy, dx);
		var fAlpha = fTarget - this.oCamera.fTheta; // Angle
		if (fAlpha >= PI) { // Angle plus grand que l'angle plat
			fAlpha = -(PI * 2 - fAlpha);
		}
		if (fAlpha < -PI) { // Angle plus grand que l'angle plat
			fAlpha = PI * 2 + fAlpha;
		}
		var w2 = this._oCanvas.width >> 1;

		// Animation
		if (!this.b3d || (this.b3d && this.i3dFrame === 0)) {
			var fAngle1 = oMobile.fTheta + (PI / 8) - fTarget;
			if (fAngle1 < 0) {
				fAngle1 = 2 * PI + fAngle1;
			}
			oSprite.setDirection(((8 * fAngle1 / (2 * PI)) | 0) & 7);
			oSprite.animate(this.TIME_FACTOR);
		}

		if (Math.abs(fAlpha) <= (this.fViewAngle * 1.5)) {
			var x = (Math.tan(fAlpha) * w2 + w2) | 0;
			// Faire tourner les coordonnées du sprite : projection sur l'axe de la caméra
			var z = MathTools.distance(dx, dy) * Math.cos(fAlpha) * 1.333;  // le 1.333 empirique pour corriger une erreur de tri bizarroïde
			// Les sprites bénéficient d'un zoom 2x afin d'améliorer les détails.

			var dz = (oTile.nScale * oTile.nHeight / (z / this.yScrSize) + 0.5);
			var dzy = this.yScrSize - (dz * this.fViewHeight);
			var iZoom = (oTile.nScale * oTile.nWidth / (z / this.yScrSize) + 0.5);
			var nOpacity; // j'ai nommé opacity mais ca n'a rien a voir : normalement ca aurait été sombritude
			// Self luminous
			var nSFx = oSprite.oBlueprint.nFx | (oSprite.bTranslucent ? (oSprite.nAlpha << 2) : 0);
			if (nSFx & 2) {
				nOpacity = 0;
			} else {
				nOpacity = z / this.nShadingFactor | 0;
				if (nOpacity > this.nShadingThreshold) {
					nOpacity = this.nShadingThreshold;
				}
			}
			var aData = [ oTile.oImage, // image 0
					oSprite.nFrame * oTile.nWidth, // sx  1
					oTile.nHeight * nOpacity, // sy  2
					oTile.nWidth, // sw  3
					oTile.nHeight, // sh  4
					x - iZoom | 0, // dx  5
					dzy | 0, // dy  6   :: this.yScrSize - dz + (dz >> 1)
					iZoom << 1, // dw  7
					dz << 1, // dh  8
					z, 
					nSFx]; 
			oSprite.aLastRender = aData;
			this.aZBuffer.push(aData);
			// Traitement overlay
			var oOL = oSprite.oOverlay;
			if (oOL) {
				if (Array.isArray(oSprite.nOverlayFrame)) {
					oSprite.nOverlayFrame.forEach(function(of, iOF) {
						this.aZBuffer.push(
						[	oOL.oImage, // image 0
							of * oOL.nWidth, // sx  1
							0, // sy  2
							oOL.nWidth, // sw  3
							oOL.nHeight, // sh  4
							aData[5], // dx  5
							aData[6], // dy  6   :: this.yScrSize - dz + (dz >> 1)
							aData[7], // dw  7
							aData[8], // dh  8
							aData[9] - 1 - (iOF / 100), 
							2
						]);
					}, this);
				} else if (oSprite.nOverlayFrame !== null) {
					this.aZBuffer.push(
					[	oOL.oImage, // image 0
						oSprite.nOverlayFrame * oOL.nWidth, // sx  1
						0, // sy  2
						oOL.nWidth, // sw  3
						oOL.nHeight, // sh  4
						aData[5], // dx  5
						aData[6], // dy  6   :: this.yScrSize - dz + (dz >> 1)
						aData[7], // dw  7
						aData[8], // dh  8
						aData[9] - 1, 
						2
					]);
				}
			}
		}
	},
	

	drawHorde : function() {
		var x = '', y = '', aMobiles, oMobile, nMobileCount, i;
		this.aVisibleMobiles = [];
		for (x in this.aScanSectors) {
			for (y in this.aScanSectors[x]) {
				aMobiles = this.oMobileSectors.get(x, y);
				nMobileCount = aMobiles.length;
				for (i = 0; i < nMobileCount; i++) {
					oMobile = aMobiles[i];
					if (oMobile.bActive && oMobile.oSprite) {
						this.aVisibleMobiles.push(oMobile);
						this.drawSprite(oMobile);
					}
				}
			}
		}
	},

	drawExteriorLine : function(x, z) {
		var dz, sx, sy, sw, sh, dx, dy, dw, dh, a = null;
		if (z < 0.1) {
			z = 0.1;
		}
		dz = (this.yTexture / (z / this.yScrSize));
		var dzfv = (dz * this.fViewHeight);
		var dzy = this.yScrSize - dzfv;
		// dz = demi hauteur de la texture projetée
		var oBG = this.oBackground;
		var wBG = oBG.width, hBG = oBG.height;
		sx = (x + this.fCameraBGOfs) % wBG | 0;
		sy = Math.max(0, (hBG >> 1) - dzfv);
		sw = 1;
		sh = Math.min(hBG, dz << 1);
		dx = x;
		dy = Math.max(dzy, this.yScrSize - (hBG >> 1));
		dw = sw;
		dh = Math.min(sh, dz << 1);
		a = [ oBG, sx, sy, sw, sh, dx, dy, dw, dh, z, 0 ];
		this.aZBuffer.push(a);
	},
	
	
	drawFloor: null,
	
	/**
	 * Rendu du floor et du ceil quand fViewHeight est à 1
	 */
	drawFloor_zoom1: function() {
		var bCeil = this.bCeil;
		var oFloor = this.oFloor;
		var x, 
			y,
			xStart = this.b3d ? this.xLimitL : 0, 
			xEnd = this.b3d ? this.xLimitR : this.xScrSize,
			w = this.xScrSize, 
			h = this.yScrSize;
		if (oFloor.imageData === null) {
			var oFlat = O876.CanvasFactory.getCanvas();
			oFlat.width = oFloor.image.width;
			oFlat.height = oFloor.image.height;
			var oCtx = oFlat.getContext('2d');
			oCtx.drawImage(oFloor.image, 0, 0);
			oFloor.image = oFlat;
			oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
			oFloor.renderSurface = this._oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		if (this.bFlatSky) {
			// recommencer à lire le background pour prendre le ciel en compte
			oFloor.renderSurface = this._oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		var aFloorSurf = oFloor.imageData32;
		var aRenderSurf = oFloor.renderSurface32;
		// 1 : créer la surface
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);

		var fh = (this.yTexture >> 1) - ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDelta = (wx2 - wx1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var yDelta = (wy2 - wy1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var xDeltaFront;
		var yDeltaFront;
		var ff = this.yScrSize << 1; // focale
		var fx, fy; // coordonnée du texel finale
		var dFront; // distance "devant caméra" du pixel actuellement pointé
		var ofsDst; // offset de l'array pixel de destination (plancher)
		var wy;
		
		var ofsDstCeil; // offset de l'array pixel de destination (plancher)
		var wyCeil;

		var xCam = this.oCamera.x; // coord caméra x
		var yCam = this.oCamera.y; // coord caméra y
		var nFloorWidth = oFloor.image.width; // taille pixel des tiles de flats
		var ofsSrc; // offset de l'array pixel source
		var xOfs = 0; // code du block flat à afficher
		var yOfs = 0; // luminosité du block flat à afficher
		var ps = this.nPlaneSpacing;
		var nBlock;
		var xyMax = this.nMapSize * ps;
		var st = this.nShadingThreshold;
		var sf = this.nShadingFactor;
		var aMap = this.aMap;
		var F = this.oFloor.codes;
		var aFBlock;
		
		var fy64, fx64;
		var oXMap = this.oXMap;
		var oXBlock, oXBlockImage;
		var oXBlockCeil;
		var nXDrawn = 0; // 0: pas de texture perso ; 1 = texture perso sol; 2=texture perso plafond
		var fBx, fBy;
		
		for (y = 1; y < h; ++y) {
			fBx = wx1;
			fBy = wy1;
			
			// floor
			dFront = fh * ff / y; 
			fy = wy1 * dFront + yCam;
			fx = wx1 * dFront + xCam;
			xDeltaFront = xDelta * dFront;
			yDeltaFront = yDelta * dFront;
			wy = w * (h + y);
			wyCeil = w * (h - y - 1);
			yOfs = Math.min(st, dFront / sf | 0);
			
			for (x = 0; x < w; ++x) {
				ofsDst = wy + x;
				ofsDstCeil = wyCeil + x;
				fy64 = fy / ps | 0; // sector
				fx64 = fx / ps | 0;
				if (x >= xStart && x <= xEnd && fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
					nXDrawn = 0;
					oXBlock = oXMap.get(fx64, fy64, 4);
					oXBlockCeil = oXMap.get(fx64, fy64, 5);
					if (oXBlock.imageData32) {
						oXBlockImage = oXBlock.imageData32;
						ofsSrc = (((fy  % ps) + yOfs * ps | 0) * ps + (((fx % ps) | 0)));
						aRenderSurf[ofsDst] = oXBlockImage[ofsSrc];
						nXDrawn += 1;
					}
					if (oXBlockCeil.imageData32) {
						oXBlockImage = oXBlockCeil.imageData32;
						if (nXDrawn === 0) {
							ofsSrc = (((fy  % ps) + yOfs * ps | 0) * ps + (((fx % ps) | 0)));
						}
						aRenderSurf[ofsDstCeil] = oXBlockImage[ofsSrc];
						nXDrawn += 2;
					}
					if (nXDrawn != 3) {
						nBlock = aMap[fy / ps | 0][fx / ps | 0] & 0xFFF; // **code12** code
						aFBlock = F[nBlock];
						if (aFBlock !== null) {
							if (nXDrawn != 1) {
								xOfs = aFBlock[0];
								ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
								aRenderSurf[ofsDst] = aFloorSurf[ofsSrc];
							}
							if (bCeil && nXDrawn != 2) {
								xOfs = aFBlock[1];
								if (xOfs >= 0) {
									ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
									aRenderSurf[ofsDstCeil] = aFloorSurf[ofsSrc];
								}
							}
						}
					}
				}
				fy += yDeltaFront;
				fx += xDeltaFront;
			}
		}
		this._oRenderContext.putImageData(oFloor.renderSurface, 0, 0);
	},

	
	drawFloorAndCeil: null,
	
	/**
	 * Rendu du floor et du ceil si le fViewHeight est différent de 1
	 * (presque double ration de calcul....)
	 */
	drawFloorAndCeil_zoom1: function() {
		var oFloor = this.oFloor;
		var x, 
			y,
			xStart = this.b3d ? this.xLimitL : 0, 
			xEnd = this.b3d ? this.xLimitR : this.xScrSize,
			w = this.xScrSize, 
			h = this.yScrSize;
		if (oFloor.imageData === null) {
			var oFlat = O876.CanvasFactory.getCanvas();
			oFlat.width = oFloor.image.width;
			oFlat.height = oFloor.image.height;
			var oCtx = oFlat.getContext('2d');
			oCtx.drawImage(oFloor.image, 0, 0);
			oFloor.image = oFlat;
			oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
			oFloor.renderSurface = this._oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		if (this.bFlatSky) {
			// recommencer à lire le background pour prendre le ciel en compte
			oFloor.renderSurface = this._oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		var aFloorSurf = oFloor.imageData32;
		var aRenderSurf = oFloor.renderSurface32;
		// 1 : créer la surface
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);

		var fh = (this.yTexture >> 1) - ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDelta = (wx2 - wx1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var yDelta = (wy2 - wy1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var xDeltaFront;
		var yDeltaFront;
		var ff = this.yScrSize << 1; // focale
		var fx, fy; // coordonnée du texel finale
		var dFront; // distance "devant caméra" du pixel actuellement pointé
		var ofsDst; // offset de l'array pixel de destination (plancher)
		var wy;
		
		var fhCeil = (this.yTexture >> 1) + ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDeltaFrontCeil = 0;
		var yDeltaFrontCeil = 0;
		var fxCeil = 0, fyCeil = 0; // coordonnée du texel finale
		var dFrontCeil; // distance "devant caméra" du pixel actuellement pointé
		var ofsDstCeil; // offset de l'array pixel de destination (plafon) 
		var wyCeil = 0;

		var xCam = this.oCamera.x; // coord caméra x
		var yCam = this.oCamera.y; // coord caméra y
		var nFloorWidth = oFloor.image.width; // taille pixel des tiles de flats
		var ofsSrc; // offset de l'array pixel source
		var xOfs = 0; // code du block flat à afficher
		var yOfs = 0; // luminosité du block flat à afficher
		var ps = this.nPlaneSpacing;
		var nBlock;
		var xyMax = this.nMapSize * ps;
		var st = this.nShadingThreshold;
		var sf = this.nShadingFactor;
		var aMap = this.aMap;
		var F = this.oFloor.codes;
		var aFBlock;
		
		
		var bCeil = this.bCeil;
		
		// aFloorSurf -> doit pointer vers XMap.get(x, y)[4].imageData32
		// test : if XMap.get(x, y)[4]
		
		var fy64, fx64;
		var oXMap = this.oXMap;
		var oXBlock, oXBlockCeil, oXBlockImage;
		var fBx, fBy, yOfsCeil;
		
		
		for (y = 1; y < h; ++y) {
			fBx = wx1;
			fBy = wy1;
			
			// floor
			dFront = fh * ff / y; 
			fy = wy1 * dFront + yCam;
			fx = wx1 * dFront + xCam;
			xDeltaFront = xDelta * dFront;
			yDeltaFront = yDelta * dFront;
			wy = w * (h + y);
			yOfs = Math.min(st, dFront / sf | 0);

			// ceill
			if (bCeil) {
				dFrontCeil = fhCeil * ff / y; 
				fyCeil = wy1 * dFrontCeil + yCam;
				fxCeil = wx1 * dFrontCeil + xCam;
				xDeltaFrontCeil = xDelta * dFrontCeil;
				yDeltaFrontCeil = yDelta * dFrontCeil;
				wyCeil = w * (h - y);
				yOfsCeil = Math.min(st, dFrontCeil / sf | 0);
			}
			for (x = 0; x < w; ++x) {
				ofsDst = wy + x;
				ofsDstCeil = wyCeil + x;
				fy64 = fy / ps | 0;
				fx64 = fx / ps | 0;
				if (x >= xStart && x <= xEnd && fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
					oXBlock = oXMap.get(fx64, fy64, 4);
					if (oXBlock.imageData32) {
						oXBlockImage = oXBlock.imageData32;
						ofsSrc = (((fy  % ps) + yOfs * ps | 0) * ps + (((fx % ps) | 0)));
						aRenderSurf[ofsDst] = oXBlockImage[ofsSrc];
					} else {
						nBlock = aMap[fy64][fx64] & 0xFFF; // **code12** code
						aFBlock = F[nBlock];
						if (aFBlock !== null) {
							xOfs = aFBlock[0];
							if (xOfs >= 0) {
								ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
								aRenderSurf[ofsDst] = aFloorSurf[ofsSrc];
							}
						}
					}
				}
				if (bCeil && fxCeil >= 0 && fyCeil >= 0 && fxCeil < xyMax && fyCeil < xyMax) {
					fy64 = fyCeil / ps | 0;
					fx64 = fxCeil / ps | 0;
					oXBlockCeil = oXMap.get(fx64, fy64, 5);
					if (oXBlockCeil.imageData32) {
						oXBlockImage = oXBlockCeil.imageData32;
						ofsSrc = (((fyCeil  % ps) + yOfs * ps | 0) * ps + (((fxCeil % ps) | 0)));
						aRenderSurf[ofsDstCeil] = oXBlockImage[ofsSrc];
					} else {
						nBlock = aMap[fy64][fx64] & 0xFFF; // **code12** code
						aFBlock = F[nBlock];
						if (aFBlock !== null) {
							xOfs = aFBlock[1];
							if (xOfs >= 0) {
								ofsSrc = (((fyCeil % ps) + yOfs * ps | 0) * nFloorWidth + (((fxCeil % ps) + xOfs * ps | 0)));
								aRenderSurf[ofsDstCeil] = aFloorSurf[ofsSrc];
							}
						}
					}
				}
				if (bCeil) {
					fyCeil += yDeltaFrontCeil;
					fxCeil += xDeltaFrontCeil;
				}
				fy += yDeltaFront;
				fx += xDeltaFront;
			}
		}
		this._oRenderContext.putImageData(oFloor.renderSurface, 0, 0);
	},

	drawLine : function(x, z, nTextureBase, nPos, bDim, oWalls, nPanel, nLight) {
		if (z < 0.1) {
			z = 0.1;
		}
		//var dz = (this.yTexture / (z / this.yScrSize) + 0.5) | 0;
		var ytex = this.yTexture;
		var xtex = this.xTexture;
		var yscr = this.yScrSize;
		var shf = this.nShadingFactor;
		var sht = this.nShadingThreshold;
		var dmw = this.nDimmedWall;
		var dz = ytex * yscr / z;
		var fvh = this.fViewHeight;
		dz = dz + 0.5 | 0;
		var dzy = yscr - (dz * fvh);
		var nPhys = (nPanel >> 12) & 0xF;  // **code12** phys
		var nOffset = (nPanel >> 16) & 0xFF; // **code12** offs
		var nOpacity = z / shf | 0;
		if (bDim) {
			nOpacity = (sht - dmw) * nOpacity / sht + dmw - nLight | 0;
		} else {
			nOpacity -= nLight;
		}
		nOpacity = Math.max(0, Math.min(sht, nOpacity));
		var aData = [
				oWalls, // image 0
				nTextureBase + nPos, // sx  1
				ytex * nOpacity, // sy  2
				1, // sw  3
				ytex, // sh  4
				x, // dx  5
				dzy - 1, // dy  6
				1, // dw  7
				(2 + dz * 2), // dh  8
				z, // z 9
				bDim ? RC.FX_DIM0 : 0
		];

		// Traitement des portes
		switch (nPhys) {
			case this.PHYS_DOOR_SLIDING_UP: // porte coulissant vers le haut
				aData[2] += nOffset;
				if (nOffset > 0) {
					aData[4] = ytex - nOffset;
					aData[8] = ((aData[4] / (z / yscr) + 0.5)) << 1;
				}
				break;

			case this.PHYS_CURT_SLIDING_UP: // rideau coulissant vers le haut
				if (nOffset > 0) {
					aData[8] = (((ytex - nOffset) / (z / yscr) + 0.5)) << 1;
				}
				break;

			case this.PHYS_CURT_SLIDING_DOWN: // rideau coulissant vers le bas
				aData[2] += nOffset; // no break here 
				// suite au case 4...
				/** @fallthrough */

			case this.PHYS_DOOR_SLIDING_DOWN: // Porte coulissant vers le bas
				if (nOffset > 0) {
					// 4: sh
					// 6: dy
					// 8: dh 
					// on observe que dh est un peut trop petit, ou que dy es trop haut
					aData[4] = ytex - nOffset;
					aData[8] = ((aData[4] / (z / yscr) + 0.5));
					aData[6] += (dz - aData[8]) << 1;
					aData[8] <<= 1;
				}
				break;

			case this.PHYS_DOOR_SLIDING_LEFT: // porte latérale vers la gauche
				if (nOffset > 0) {
					if (nPos > (xtex - nOffset)) {
						aData[0] = null;
					} else {
						aData[1] = (nPos + nOffset) % xtex + nTextureBase;
					}
				}
				break;

			case this.PHYS_DOOR_SLIDING_RIGHT: // porte latérale vers la droite
				if (nOffset > 0) {
					if (nPos < nOffset) {
						aData[0] = null;
					} else {
						aData[1] = (nPos + xtex - nOffset) % xtex + nTextureBase;
					}
				}
				break;

			case this.PHYS_DOOR_SLIDING_DOUBLE: // double porte latérale
				if (nOffset > 0) {
					if (nPos < (xtex >> 1)) { // panneau de gauche
						if ((nPos) > ((xtex >> 1) - nOffset)) {
							aData[0] = null;
						} else {
							aData[1] = (nPos + nOffset) % xtex + nTextureBase;
						}
					} else {
						if ((nPos) < ((xtex >> 1) + nOffset)) {
							aData[0] = null;
						} else {
							aData[1] = (nPos + xtex - nOffset) % xtex + nTextureBase;
						}
					}
				}
				break;

			case this.PHYS_INVISIBLE_BLOCK:
				aData[0] = null;
				break;
		}
		if (this.bDoubleHeight) {
			aData[6] -= aData[8];
            aData[8] <<= 1;
		}
		if (aData[0]) {
			this.aZBuffer.push(aData);
		}
	},

	/** Rendu de l'image stackée dans le Z Buffer
	 * @param i rang de l'image
	 */
	drawImage : function(zbi) {
		var rc = this._oRenderContext;
		var aLine = zbi;
		var sGCO = '';
		var fGobalAlphaSave = 0;
		var nFx = aLine[10];
		if (nFx & 1) {
			sGCO = rc.globalCompositeOperation;
			rc.globalCompositeOperation = 'lighter';
		}
		if (nFx & 12) {
			fGobalAlphaSave = rc.globalAlpha;
			rc.globalAlpha = RC.FX_ALPHA[nFx >> 2];
		}
		var xStart = aLine[1];
		// Si xStart est négatif c'est qu'on est sur un coté de block dont la texture est indéfinie (-1)
		// Firefox refuse de dessiner des textures "négative" dont on skipe le dessin
		if (xStart >= 0) {
			try {
                rc.drawImage(
                    aLine[0],
                    aLine[1] | 0,
                    aLine[2] | 0,
                    aLine[3] | 0,
                    aLine[4] | 0,
                    aLine[5] | 0,
                    aLine[6] | 0,
                    aLine[7] | 0,
                    aLine[8] | 0);
            } catch (e) {}
		}
		if (sGCO !== '') {
			rc.globalCompositeOperation = sGCO;
		}
		if (nFx & 12) {
			rc.globalAlpha = fGobalAlphaSave;
		}
	},

	drawSquare : function(x, y, nWidth, nHeight, sColor) {
		this._oRenderContext.fillStyle = sColor;
		this._oRenderContext.fillRect(x, y, nWidth, nHeight);
	},

	drawMap : function() {
		if (this.oMinimap) {
			this.oMinimap.render();
		} else {
			this.oMinimap = new O876_Raycaster.Minimap();
			this.oMinimap.reset(this);
		}
	},

	/* sprites:
	
	1) déterminer la liste des sprite susceptible d'etre visible
	- ce qui sont dans les secteurs traversés par les rayons
	2) déterminer la distance
	3) déterminer l'angle
	4) déterminer la position X (angle)

	 */

	/** Renvoie des information concernant la case contenant le point spécifié
	 * @param x coordonnée du point à étudier
	 * @param y
	 * @param n optionnel, permet de spécifier le type d'information voulu
	 *  - undefined : tout
	 *  - 0: le code texture 0-0xFF
	 *  - 1: le code physique
	 *  - 2: le code offset
	 *  - 3: le tag
	 * @return code de la case.
	 */
	clip : function(x, y, n) {
		if (n === undefined) {
			n = 0;
		}
		var ps = this.nPlaneSpacing;
		var xm = x / ps | 0;
		var ym = y / ps | 0;
		switch (n) {
			case 0:
				return this.getMapCode(xm, ym);
			case 1:
				return this.getMapPhys(xm, ym);
			case 2:
				return this.getMapOffs(xm, ym);
			default:
				return this.aMap[ym][xm];
		}
	},
	
	/**
	 * Animation des textures
	 * Toutes les textures déclarée dans walls.animated subissent un cycle d'animation
	 * Cette fonction n'est pas appelée automatiquement
	 */
	textureAnimation: function() {
		// Animation des textures
		var oAnim, w = this.oWall, wc = w.codes, wcn, wa = w.animated;
		var i, l, x;
		for (var iAnim in wa) {
			wcn = wc[iAnim | 0];
			oAnim = wa[iAnim];
			if ('animate' in oAnim) {
				oAnim.animate(this.TIME_FACTOR);
				for (i = 0, l = oAnim.__start.length; i < l; ++i) {
					x = oAnim.__start[i];
					wcn[i] = x + oAnim.nFrame;
				}
			}
		}
	},
	
	buildAnimatedTextures: function() {
		// animation des textures
		var w = this.oWall;
		if (!('animated' in w)) {
			w.animated = {};
		}
		var wc = w.codes, wcc, wa = w.animated;
		var oAnim;
		var wcStart, wcDur, wcCount, wcLoop;
		for (var nCode = 0; nCode < wc.length; ++nCode) {
			wcc = wc[nCode];
			if (wcc) {
				if (Array.isArray(wcc[0])) { // Une animation de texture ?
					if (wcc[0].length === 2) {
						// convertir en mure à 4 coté
						wcc[0].push(wcc[0][0]);
						wcc[0].push(wcc[0][1]);
					}
					wcStart = wcc[0];
					wcCount = wcc[1];
					wcDur = wcc[2];
					wcLoop = wcc[3];
					// Enregistrer l'animation de texture dans la propriété "animated"
					oAnim = new O876_Raycaster.Animation();
					oAnim.nCount = wcCount;
					oAnim.nDuration = wcDur;
					oAnim.nLoop = wcLoop;
					oAnim.__start = wcStart;
					wa[nCode] = oAnim;
				} else if (wcc.length === 2) { // mur 2 ou 4
					// répéter les code 0 et 1 en 2 et 3
					wcc.push(wcc[0]);
					wcc.push(wcc[1]);
				}
			}
		}
	}
});

/**
 * @class O876_Raycaster.Scheduler
 * Temporise et retarde l'exécution de certaines commandes
 */
O2.createClass('O876_Raycaster.Scheduler', {
	aCommands: null,
	bInvalid: true,
	nTime: 0,

	
	__construct: function() {
		this.aCommands = [];
	},

	/** 
	 * Retarde l'exécution de la function passée en paramètre
	 * la fonction doit etre une méthode de l'instance défini dans le
	 * constructeur
	 * @param pCommand methode à appeler
	 * @param nDelay int delai d'exécution
	 */
	delay: function(pCommand, nDelay) {
		if (nDelay === undefined) {
			throw new Error('need delay parameter');
		}
		this.aCommands.push({
			time: nDelay + this.nTime,
			command: pCommand
		});
		this.bInvalid = true;
	},

	clear: function() {
		this.aCommands = [];
	},

	/** 
	 * Appelée à chaque intervale de temps, cette fonction détermine 
	 * quelle sont les fonctions à appeler.
	 * @param nTime int temps
	 */ 
	schedule: function(nTime) {
		this.nTime = nTime;
		if (this.bInvalid) { // trier en cas d'invalidité
			this.aCommands.sort(function(a, b) { return a.time - b.time; });
			this.bInvalid = false;
		}
		while (this.aCommands.length && this.aCommands[0].time <= nTime) {
			this.aCommands.shift().command();
		}
	}
});

/**
 * Un sprite est une image pouvant être placée et déplacée à l'écran O876
 * Raycaster project
 * 
 * @date 2012-01-01
 * @author Raphaël Marandet Le sprite a besoin d'un blueprint pour récupérer ses
 *         données initiales Le sprite est utilisé par la classe Mobile pour
 *         donner une apparence aux objet ciruclant dans le laby
 */
O2.createClass('O876_Raycaster.Sprite',  {
	oBlueprint : null, // Référence du blueprint
	oAnimation : null, // Pointeur vers l'animation actuelle
	nAnimation : -1, // Animation actuelle
	nFrame : 0, // Frame affichée
	nLight : 0,
	nAngle8 : 0, // Angle 8 modifiant l'animation en fonction de la
	// caméra
	nAnimationType : 0,
	sCompose : '',
	bVisible : true,
	oOverlay: null,
	nOverlayFrame: null,
	bTranslucent: false, // active alpha
	nAlpha: 2, // 1=75% 2=50% 3=25%
	aLastRender: null, // mémorise les dernier paramètres de rendu


	/**
	 * Change l'animation en cours
	 * 
	 * @param n {Number} numero de la nouvelle animation
	 */
	playAnimation : function(n) {
		if (n === this.nAnimation) {
			return;
		}
		var aBTA = this.oBlueprint.oTile.aAnimations;
		this.nAnimation = n;
		if (n < aBTA.length) {
			// transfere les timers et index d'une animation à l'autre
			if (this.oAnimation === null) {
				this.oAnimation = new O876_Raycaster.Animation();
			}
			if (aBTA[n]) {
				this.oAnimation.assign(aBTA[n]);
				this.bVisible = true;
			} else {
				this.bVisible = false;
			}
			this.oAnimation.nDirLoop = 1;
		} else {
			throw new Error('sprite animation out of range: ' + n + ' max: ' + aBTA.length);
		}
	},

	/**
	 * Permet de jouer une animation
	 * 
	 * @param nAnimationType
	 *            Type d'animation à jouer
	 * @param bReset reseter une animation
	 */
	playAnimationType : function(nAnimationType, bReset) {
		this.nAnimationType = nAnimationType;
		this.playAnimation(this.nAnimationType * 8 + this.nAngle8);
		if (bReset) {
			this.oAnimation.reset();
		}
	},

	setDirection : function(n) {
		this.nAngle8 = n;
		var nIndex = 0;
		if (this.oAnimation !== null) {
			nIndex = this.oAnimation.nIndex;
		}
		this.playAnimationType(this.nAnimationType); // rejouer l'animation en
		// cas de changement de
		// point de vue
		this.oAnimation.nIndex = nIndex; // conserver la frame actuelle
	},

/**
 * Calcule une nouvelle frame d'animation, mise à jour de la propriété
 * nFrame
 */
	animate : function(nInc) {
		if (this.oAnimation) {
			this.nFrame = this.oAnimation.animate(nInc);
		}
	}
});

/** Classe de déplacement automatisé et stupidité artificielle des mobiles
 * O876 Raycaster project
 * @class O876_Raycaster.Thinker
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Classe de base pouvant être étendue
 */
O2.createClass('O876_Raycaster.Thinker', {
	oMobile: null,
	oGame: null,
	think: function() {}
});


/**
 * This class deals with thinkers
 * it can produce instance of thinker by giving a thinker name
 */
O2.createClass('O876_Raycaster.ThinkerManager', {
	oGameInstance : null,

	createThinker : function(sThinker) {
		// Les thinkers attaché a un device particulier ne peuvent pas être initialisé
		// transmettre la config du raycaster ? 
		if (sThinker === undefined || sThinker === null) {
			return null;
		}
		var pThinker = O2.loadObject(sThinker + 'Thinker');
		if (pThinker !== null) {
			var oThinker = new pThinker();
			oThinker.oGame = this.oGameInstance;
			return oThinker;
		} else {
			throw new Error('ThinkerManager : ' + sThinker + ' class not found.');
		}
	}
});

/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Fait bouger le mobile de manière aléatoire
 */
O2.extendClass('O876_Raycaster.WanderThinker', O876_Raycaster.Thinker, {
	nTime: 0,
	aAngles: null,
	nAngle: 0,

	__construct: function() {
		this.aAngles = [0, 0.25 * PI, 0.5 * PI, 0.75 * PI, PI, -0.75 * PI, -0.5 * PI, -0.25 * PI];
		this.nTime = 0;
		this.think = this.thinkInit;
	},
  
	think: function() {},

	thinkInit: function() {
		this.oMobile.fSpeed = 2;
		this.think = this.thinkGo;
	},

	thinkGo: function() {
		if (this.nTime <= 0) { // changement d'activité si le timer tombe à zero
			this.nAngle = MathTools.rnd(0, 7);
			this.oMobile.fTheta = this.aAngles[this.nAngle];
			this.nTime = MathTools.rnd(15, 25) * 4;
		} else {
			--this.nTime;
			this.oMobile.moveForward();
			if (this.oMobile.oWallCollision.x !== 0 || this.oMobile.oWallCollision.y !== 0) {
				this.nTime = 0;
			}
		}
	}
});


/** Gestion d'un ensemble de Tiles stockées dans la même image
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * L'objet Tile permet de renseigner le raycaster sur la séquence d'image à charger
 */
O2.createClass('O876_Raycaster.Tile',  {
	oImage : null, // Objet image contenant toutes les Tiles
	nWidth : 0, // Largeur d'une Tile en pixel (!= oImage.width)
	nHeight : 0, // Hauteur d'une Tile en pixel
	sSource : null, // Url source de l'image
	nFrames : 0, // Nombre de Tiles
	aAnimations : null, // Liste des animations
	bShading : true,
	nScale: 1,

	__construct : function(oData) {
		if (oData !== undefined) {
			this.sSource = oData.src;
			this.nFrames = oData.frames || 1;
			this.nWidth = oData.width;
			this.nHeight = oData.height;
			this.bShading = true;
			this.nScale = oData.scale || 1;
			if ('noshading' in oData && oData.noshading) {
				this.bShading = false;
			}
			// animations
			if (oData.animations) {
				var oAnimation, iFrame;
				this.aAnimations = [];
				for ( var iAnim = 0; iAnim < oData.animations.length; iAnim++) {
					if (oData.animations[iAnim] === null) {
						for (iFrame = 0; iFrame < 8; iFrame++) {
							this.aAnimations.push(null);
						}
					} else {
						for (iFrame = 0; iFrame < 8; iFrame++) {
							oAnimation = new O876_Raycaster.Animation();
							oAnimation.nStart = oData.animations[iAnim][0][iFrame];
							oAnimation.nCount = oData.animations[iAnim][1];
							oAnimation.nDuration = oData.animations[iAnim][2];
							oAnimation.nLoop = oData.animations[iAnim][3];
							this.aAnimations.push(oAnimation);
						}
					}
				}
			}
		}
	}
});

/** ArrayTools Boîte à outil pour les tableau (Array)
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */


O2.createObject('ArrayTools', {
	
	/** Retire un élément d'un Array
	 * @param aArray élément à traiter
	 * @param nItem index de l'élément à retirer
	 */
	removeItem: function(aArray, nItem) {
		var aItem = Array.prototype.splice.call(aArray, nItem, 1);
		return aItem[0];
	},
	
	isArray: function(o) {
		return Array.isArray(o);
	},
	
	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
	shuffle: function(o){ //v1.0
		for(var j, x, i = o.length; i; j = (Math.random() * i | 0), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},
	
	// renvoie l'indice du plus grand élément
	theGreatest: function(a) {
		if (!a) {
			return null;
		}
		var nGreater = a[0], iGreater = 0;
		for (var i = 1; i < a.length; ++i) {
			if (a[i] > nGreater) {
				nGreater = a[iGreater = i];
			}
		}
		return iGreater;
	},
	
	unique: function(aInput) {
		var u = {}, a = [];
		for (var i = 0, l = aInput.length; i < l; ++i) {
			if (!u.hasOwnProperty(aInput[i])) {
				a.push(aInput[i]);
				u[aInput[i]] = 1;
			}
		}
		return a;
	}
});

/** GfxTools Boîte à outil graphique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */

O2.createObject('GfxTools', {
	/**
	 * Dessine un halo lumine sur la surface du canvas
	 */
	drawCircularHaze: function(oCanvas, sOptions) {
		sOptions = sOptions || '';
		var aOptions = sOptions.split(' ');
		var w = oCanvas.width;
		var h = oCanvas.height;
		var wg = Math.max(w, h);

		// gradient noir
		var c3 = O876.CanvasFactory.getCanvas();
		c3.width = c3.height = wg;
		var ctx3 = c3.getContext('2d');
		var oRadial = ctx3.createRadialGradient(
			wg >> 1, wg >> 1, wg >> 2,
			wg >> 1, wg >> 1, wg >> 1
		);
		oRadial.addColorStop(0, 'rgba(0, 0, 0, 0)');
		oRadial.addColorStop(1, 'rgba(0, 0, 0, 1)');
		ctx3.fillStyle = oRadial;
		ctx3.fillRect(0, 0, wg, wg);

		// gradient lumière
		var c2 = O876.CanvasFactory.getCanvas();
		c2.width = w;
		c2.height = h;
		var ctx2 = c2.getContext('2d');
		ctx2.fillStyle = 'rgb(0, 0, 0)';
		ctx2.drawImage(oCanvas, 0, 0);
		if (aOptions.indexOf('top') >= 0) {
			ctx2.drawImage(c3, 0, 0, wg, wg, 0, 0, w, w);
			ctx2.fillRect(0, w, w, h - w);
		} else if (aOptions.indexOf('bottom') >= 0) {
			ctx2.fillRect(0, 0, w, h - w);
			ctx2.drawImage(c3, 0, 0, wg, wg, 0, h - w, w, w);
		} else if (aOptions.indexOf('middle') >= 0) {
			ctx2.fillRect(0, 0, w, (h - w) >> 1);
			ctx2.drawImage(c3, 0, 0, wg, wg, 0, (h - w) >> 1, w, w);
			ctx2.fillRect(0, ((h - w) >> 1) + w, w, (h - w) >> 1);
		} else {
			ctx2.drawImage(c3, 0, 0, wg, wg, 0, 0, w, h);
		}
		
		var oContext = oCanvas.getContext('2d');
		var gco = oContext.globalCompositeOperation;
		oContext.globalCompositeOperation = 'lighter';
		oContext.drawImage(c2, 0, 0);
		if (aOptions.indexOf('strong') >= 0) {
			oContext.drawImage(c2, 0, 0);
		}
		oContext.globalCompositeOperation = gco;
	}	
});

/**
 * @class O876_Raycaster.ImageListLoader
 * Précharge une liste d'image
 * Surveille le chargement des images
 * Envoie un évènement final lorsque les images sont toutes chargées
 */
O2.createClass('O876_Raycaster.ImageListLoader', {
	aImg: null,
	bAllLoaded: false,

	__construct: function() {
		this.aImg = [];
	},

    /**
	 * Ajoute une image à la liste
     * @param sSrc url de l'image
     */
	addImage: function(sSrc) {
		this.aImg.push({
			src: sSrc,
			img: null
		});
	},

    /**
	 * Chargement d'une image
     * @param oImgItem.src source de l'image
	 * @param oImgItem.img HTMLImage qui recevra le cojntenu de l'image (quand celle ci sera chargée)
     */
	loadOne: function(oImgItem) {
		let sSrc = oImgItem.src;
		let oImg;
		if (sSrc instanceof HTMLImageElement) {
			oImg = sSrc;
		} else if (sSrc instanceof HTMLCanvasElement) {
			oImg = sSrc;
			oImg.complete = true;
		} else {
			oImg = new Image();
			oImg.src = sSrc; 
		}
		oImgItem.img = oImg;
		if (!oImg.complete) {
			oImg.addEventListener('load', e => this.imageLoaded(e));
		}
	},

    /**
	 * Charge toutes les images précédement ajoutée par addImage
     */
	loadAll: function() {
		this.aImg.forEach(i => this.loadOne(i));
		this.imageLoaded();
	},

    /**
	 * Callback appelé quand une image est chargée
     * @param oEvent
     */
	imageLoaded: function(oEvent) {
		if (this.bAllLoaded) {
			return;
		}
		if (this.aImg.every(i => i.img.complete)) {
			this.bAllLoaded = true;
			this.trigger('load', this.aImg.map(x => x.img));
		}
	}
});

O2.mixin(O876_Raycaster.ImageListLoader, O876.Mixin.Events);
/**
 * Cette classe permet de définir des cartes 2D
 * ou plus généralement des tableau 2D d'entier.
 * On entre une description texturelle composé 
 * d'un tableau de chaines de caractères.
 * Chacun de ces caractère sera remplacé par un entier
 * pour donner un tableau de tableau d'entiers
 * @param aMap tableau deux dimension contenant la carte
 * @oDic dictionnaire faisan correspondre les symbole de la carte à la valeur numérique finale
 */
O2.createObject('MapTranslater', {
	translate: function(aMap, oDic) {
		var x, y, aRow;
		var aOutput = [];
		var aRowOutput;
		
		for (y = 0; y < aMap.length; ++y) {
			if (Array.isArray(aMap[y])) {
				aRow = aMap[y];
			} else if (typeof aMap[y] === 'string') {
				aRow = aMap[y].split('');
			} else {
				throw new Error('wtf is this row ?');
			}
			aRowOutput = [];
			for (x = 0; x < aRow.length; ++x) {
				aRowOutput.push(oDic[aRow[x]]);
			}
			aOutput.push(aRowOutput);
		}
		return aOutput;
	}
});

O2.createObject('Marker', {
	
	/**
	 * Execute a callback function for each value of the given object
	 * The callback will accept 3 parameters : x, y, and v
	 */
	iterate: function(o, f) {
		o.forEach(function(aRow, x) {
			if (aRow) {
				if (!aRow.forEach) {
					throw new Error('not a marker !');
				}
				aRow.forEach(function(v, y) {
					if (v) {
						f(x, y, v);
					}
				});
			}
		});
	},
	
	/**
	 * Serialize the registry
	 * each cell outputs a structure like : {x:...,  y:...,  v:...}
	 */
	serialize: function(o) {
		var a = [];
		Marker.iterate(o, function(x, y, v) {
			a.push({x: x, y: y, v: v});
		});
		return a;
	},
	
	unserialize: function(d) {
		var o = Marker.create();
		d.forEach(function(dx) {
			if (dx) {
				Marker.markXY(o, dx.x, dx.y, dx.v);
			}
		});
		return o;
	},
	
	create: function() {
		return [];
	},
	
	getMarkXY : function(o, x, y) {
		if (o[x]) {
			return o[x][y];
		} else {
			return false;
		}
	},

	markXY : function(o, x, y, v) {
		if (!o[x]) {
			o[x] = Marker.create();
		}
		if (v === undefined) {
			v = true;
		}
		o[x][y] = v;
	},
	
	clearXY : function(o, x, y) {
		if (!o[x]) {
			return;
		}
		o[x][y] = false;
	},


	markBlock : function(o, x1, y1, x2, y2, v) {
		var xFrom = Math.min(x1, x2);
		var yFrom = Math.min(y1, y2);
		var xTo = Math.max(x1, x2);
		var yTo = Math.max(y1, y2);
		var x, y;
		for (x = xFrom; x <= xTo; x++) {
			for (y = yFrom; y <= yTo; y++) {
				Marker.markXY(o, x, y, v);
			}
		}
	},
	
	clearBlock : function(o, x1, y1, x2, y2) {
		var xFrom = Math.min(x1, x2);
		var yFrom = Math.min(y1, y2);
		var xTo = Math.max(x1, x2);
		var yTo = Math.max(y1, y2);
		var x, y;
		for (x = xFrom; x <= xTo; x++) {
			for (y = yFrom; y <= yTo; y++) {
				Marker.clearXY(o, x, y);
			}
		}
	}
});

/** MathTools Boîte à outil mathématique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */

var PI = Math.PI;
var MathTools = {
	aQuadrans : [ -PI / 2, -PI / 4, 0, PI / 4, PI / 2 ],
	fToDeg : 180 / PI,
	fToRad : PI / 180,
	
	pRndFunc: Math.random,

	sBASE64 : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

	iRndTable : 0,
	nRndSeed: Date.now() % 2147483647,
	
	aRndTable : [ 0, 8, 109, 220, 222, 241, 149, 107, 75, 248, 254, 140, 16,
			66, 74, 21, 211, 47, 80, 242, 154, 27, 205, 128, 161, 89, 77, 36,
			95, 110, 85, 48, 212, 140, 211, 249, 22, 79, 200, 50, 28, 188, 52,
			140, 202, 120, 68, 145, 62, 70, 184, 190, 91, 197, 152, 224, 149,
			104, 25, 178, 252, 182, 202, 182, 141, 197, 4, 81, 181, 242, 145,
			42, 39, 227, 156, 198, 225, 193, 219, 93, 122, 175, 249, 0, 175,
			143, 70, 239, 46, 246, 163, 53, 163, 109, 168, 135, 2, 235, 25, 92,
			20, 145, 138, 77, 69, 166, 78, 176, 173, 212, 166, 113, 94, 161,
			41, 50, 239, 49, 111, 164, 70, 60, 2, 37, 171, 75, 136, 156, 11,
			56, 42, 146, 138, 229, 73, 146, 77, 61, 98, 196, 135, 106, 63, 197,
			195, 86, 96, 203, 113, 101, 170, 247, 181, 113, 80, 250, 108, 7,
			255, 237, 129, 226, 79, 107, 112, 166, 103, 241, 24, 223, 239, 120,
			198, 58, 60, 82, 128, 3, 184, 66, 143, 224, 145, 224, 81, 206, 163,
			45, 63, 90, 168, 114, 59, 33, 159, 95, 28, 139, 123, 98, 125, 196,
			15, 70, 194, 253, 54, 14, 109, 226, 71, 17, 161, 93, 186, 87, 244,
			138, 20, 52, 123, 251, 26, 36, 17, 46, 52, 231, 232, 76, 31, 221,
			84, 37, 216, 165, 212, 106, 197, 242, 98, 43, 39, 175, 254, 145,
			190, 84, 118, 222, 187, 136, 120, 163, 236, 249 ],

	/** Calcule le sign d'une valeur
	 * @param x valeur à tester
	 * @return -1 si x < 0, +1 si y > 0, 0 si x = 0
	 */
	sign : function(x) {
		if (x === 0) {
			return 0;
		}
		return x > 0 ? 1 : -1;
	},

	/** Calcul de la distance entre deux point séparés par dx, dy
	 * @param dx delta x
	 * @param dy delta y
	 * @return float
	 */
	distance : function(dx, dy) {
		return Math.sqrt((dx * dx) + (dy * dy));
	},

	/**
	 * Normalize le vecteur donnée
	 * @param dx  {number}
	 * @param dy  {number}
	 * @return {number}
	 */
	normalize: function(dx, dy) {
		var dist = MathTools.distance(dx, dy);
		return {
			x: dx / dist,
			y: dy / dist
		};
	},

    /**
	 * Limit le nombre aux deux bornes spécifiées
	 * @param n {number} nombre
     * @param nMin {number} min
     * @param nMax {number} max
     */
	bound: function(nMin, n, nMax) {
		return Math.min(nMax, Math.max(nMin, n));
	},
	
	/**
	 * Détermine si un point (xTarget, yTarget) se situe à l'intérieur de l'angle 
	 * formé par le sommet (xCenter, yCenter) et l'ouverture fAngle.
	 * @param float xCenter, yCenter sommet de l'angle
	 * @param float fAperture ouverture de l'angle
	 * @param float fBissect direction de la bissectrice de l'angle
	 * @param float xTarget, yTarget point à tester
	 * @return boolean
	 */
	isPointInsideAngle: function(xCenter, yCenter, fBissect, fAperture, xTarget, yTarget) {
		var xPoint = xTarget - xCenter;
		var yPoint = yTarget - yCenter;
		var dPoint = MathTools.distance(xPoint, yPoint);
		xPoint /= dPoint;
		yPoint /= dPoint;
		var xBissect = Math.cos(fBissect);
		var yBissect = Math.sin(fBissect);
		var fDot = xPoint * xBissect + yPoint * yBissect;
		return Math.acos(fDot) < (fAperture / 2);
	},

	/** Renvoie, pour un angle donnée, le code du cadran dans lequel il se trouve
	 *	-PI/2...cadran 0...-PI/4...cadran 1...0...cadran 2...PI/4...cadran 3...PI/2
	 * @return entier entre 0 et 4 : la valeur 4 indique que l'angle est hors cadran
	 */
	quadran : function(a) {
		var i = 0;
		while (i < (MathTools.aQuadrans.length - 1)) {
			if (a >= MathTools.aQuadrans[i] && a < MathTools.aQuadrans[i + 1]) {
				break;
			}
			i++;
		}
		return i;
	},

	// conversion radians degres
	toDeg : function(fRad) {
		return fRad * MathTools.fToDeg;
	},

	// Conversion degres radians
	toRad : function(fDeg) {
		return fDeg * MathTools.fToRad;
	},

	
	/**
	 * Défini la graine du générateur 8 bits
	 * @param int n nouvelle graine
	 */
	rndSeed8: function(n) {
		MathTools.iRndIndex = n % MathTools.aRndTable.length;
	},

	/**
	 * Générateur de nombre pseudo-aléatoire sur 8 bits.
	 * Générateur sur table très faible. A n'utiliser que pour des truc vraiment pas importants.
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int
	 */
	rnd8 : function(nMin, nMax) {
		var r = MathTools.aRndTable[MathTools.iRndIndex];
		MathTools.iRndIndex = (MathTools.iRndIndex + 1) & 0xFF;
		var d = nMax - nMin + 1;
		return (r * d / 256 | 0) + nMin;
	},
	
	/**
	 * Défini la nouvelle graine du générateur de nombre pseudo aléatoire sur 31 bits;
	 * @param int n nouvelle graine
	 */
	rndSeed31: function(n) {
		var v = n % 2147483647;
		if (v == 0) {
			v = 1;
		}
		return this.nRndSeed = v;
	},

	/** 
	 * Générateur de nombre aléatoire sur 31 bits;
	 * Si les paramètre ne sont pas précisé on renvoie le nombre sur 31 bits;
	 * sinon on renvoie une valeur redimensionné selon les borne min et max définies
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int
	 */ 
	rnd31: function(nMin, nMax) {
		var nRnd = this.rndSeed31(16807 * this.nRndSeed);
		if (nMin === undefined) {
			return nRnd;
		} else {
			return nRnd * (nMax - nMin + 1) / 2147483647 + nMin | 0;
		}
	},
	
	
	/**
	 * Générateur aléatoire standar de JS
	 * Si aucun paramètre n'est spécifié, renvoie un nombre floatant entre 0 et 1
	 * si non renvoie un nombre entier entre les bornes spécifiées
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int / float
	 */
	rndJS: function(nMin, nMax) {
		var fRnd = Math.random();
		if (nMin === undefined) {
			return fRnd;
		} else {
			return (fRnd * (nMax - nMin + 1) | 0) + nMin;
		}
	},

	/**
	 * Fonction abstraite 
	 * nombre aléatoire entre deux bornes
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int
	 */
	rnd : null,
	
	benchmarkRnd: function() {
		var x, i, a = [];
		console.time('rnd js');
		for (i = 0; i < 1000000; ++i) {
			x = MathTools.rnd(0, 10);
			if (a[x] === undefined) {
				a[x] = 1;
			} else {
				++a[x];
			}
		}
		console.timeEnd('rnd js');
		console.log(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10]);

		a = [];
		console.time('rnd 31');
		for (i = 0; i < 1000000; ++i) {
			x = MathTools.rnd31(0, 10);
			if (a[x] === undefined) {
				a[x] = 1;
			} else {
				++a[x];
			}
		}
		console.timeEnd('rnd 31');
		console.log(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10]);
	},

	// Relance plusieur fois un dé, aditionne et renvoie les résultats
	rollDice : function(nFaces, nCount) {
		if (nCount > 3) {
			return (nCount - 3) * ((1 + nFaces) / 2) + MathTools.rollDice(nFaces, 3) | 0;
		}
		var n = 0;
		for ( var i = 0; i < nCount; i++) {
			n += MathTools.rnd(1, nFaces);
		}
		return n;
	},

	// Choix d'un éléments dans un tableau
	rndChoose : function(a) {
		if (a.length) {
			return a[MathTools.rnd(0, a.length - 1)];
		} else {
			return null;
		}
	},

	// Converti n (decimal) en base 64 
	base64Encode : function(n, l) {
		var s = '';
		if (l === undefined) {
			l = 0;
		}
		while (n > 0) {
			s = MathTools.sBASE64.charAt(n & 63) + s;
			l--;
			n >>= 6;
		}
		while (l > 0) {
			s = 'A' + s;
			l--;
		}
		return s;
	},

	base64Decode : function(s64) {
		var n = 0, nLen = s64.length;
		for ( var i = 0; i < nLen; i++) {
			n = (n << 6) | MathTools.sBASE64.indexOf(s64.charAt(i));
		}
		return n;
	}
};


MathTools.rnd = MathTools.rndJS;
/**
 * @class O876_Raycaster.Transistate
 */
O2.createClass('O876_Raycaster.Transistate', {
	nInterval : 160,
	oInterval : null,
	oRafInterval: null,
	pDoomloop : null,
	sDefaultDoomloopType: 'interval',
	bPause : false,
	nTimeModulo : 0,
	_sState : '',
	bBound: false,


	/** Definie la procédure à lancer à chaque doomloop
	 * @param sProc nom de la méthode de l'objet à lancer
	 */
	setDoomloop : function(sProc) {
		if (!(sProc in this)) {
			throw new Error('"' + sProc + '" is not a valid timer proc');
		}
		try {
            this.pDoomloop = this[this._sState = sProc].bind(this);
        } catch (e) {
			console.log(sProc, this[this._sState = sProc]);
		}
		this.stopTimers();
		this.oInterval = window.setInterval(this.pDoomloop, this.nInterval);
	},

	/**
	 * Returns the timer proc name
	 * (defined with setDoomloop)
	 * @return string
	 */
	getDoomLoop : function() {
		return this._sState;
	},

	doomloop : function() {
		this.pDoomloop();
	},


	/**
	 * Stop all timer procedure
	 */
	stopTimers: function() {
		if (this.oInterval) {
			window.clearInterval(this.oInterval);
			this.oInterval = null;
		}
		if (this.oRafInterval) {
			window.cancelAnimationFrame(this.oRafInterval);
			this.oRafInterval = null;
		}
	},

	/** 
	 * Met la machine en pause
	 * Le timer est véritablement coupé
	 */
	pause : function() {
		if (!this.bPause) {
			this.bPause = true;
			this.stopTimers();
		}
	},

	/** 
	 * Remet la machine en route après une pause
	 * Le timer est recréé.
	 */
	resume : function() {
		if (this.bPause) {
			this.setDoomloop(this.getDoomLoop());
			this.bPause = false;
		}
	}
});

O2.createClass('O876_Raycaster.WeaponLayer', {
	// x, y
	x: 0,
	y: 0,
	canvas: null,
	context: null,
	running: false,
	xBase: 0,
	yBase: 0,
	xDown: 0,
	yDown: 100, // position du layer lorsque l'arme est baissée
	tile: null,
	time: 0,
	firetime: 0,
	animation: 0,
	easing: null,
	changing: 0,  // 0 = up, 1 = going down, 2 = down, change, 3 = going up
	onSheated: null,

	RADIUS: 20,

	base: function(x, y, yDown) {
		this.x = x;
		this.y = y;
		this.xBase = x;
		this.yBase = y;
		this.xDown = x;
		this.yDown = yDown;
	},


	/**
	 * Baisse l'arme
	 * Change le Tile, et remonte l'arme
	 */
	sheat: function(cb) {
		this.changing = 1;
		this.easing = new O876.Easing();
		this.easing.from(this.yBase).to(this.yDown).during(10).use('squareAccel');
		this.onSheated = cb;
	},

	unsheat: function() {
		this.x = this.xDown;
		this.y = this.yDown;
		this.changing = 2;
		this.easing = new O876.Easing();
		this.easing.from(this.yDown).to(this.yBase).during(10).use('squareDeccel');
	},

	isReady: function() {
		return this.changing === 0;
	},

	processChanging() {
		switch (this.changing) {
			case 1:
				if (this.easing.next().over()) {
					if (this.onSheated) {
						this.onSheated();
					}
				}
				break;

			case 2:
				if (this.easing.next().over()) {
					this.changing = 0;
					this.easing = null;
				}
				break;
		}
		return this.easing ? this.easing.val() : this.yBase;
	},

	fire: function() {
		this.firetime = this.time + 700;
		this.playAnimation(8);
	},

	playAnimation: function(n) {
		if (this.tile.aAnimations[n]) {
			this.animation = new O876_Raycaster.Animation();
            this.animation.assign(this.tile.aAnimations[n]);
		} else {
			throw new Error('bad anim : ' + n);
		}
	},

	process: function(nTime, oMobile) {
        var x = 0, y = 0;
		this.time += nTime;
        var t = this.time;
		this.running = oMobile.isMoving();
		if (this.running && this.firetime < t) {
            x = this.RADIUS * Math.sin(t / 170) | 0;
            y = Math.abs(this.RADIUS * Math.cos(t / 170)) | 0;
		}
		if (this.animation) {
			this.animation.animate(nTime);
			if (this.animation.bOver) {
				this.playAnimation(0);
			}
		}
		this.x = x + this.xBase;
		if (this.changing) {
			this.y = this.processChanging();
		} else {
			this.y = y + this.yBase;
		}
	},

	render: function(ctx) {
		var t = this.tile;
		var x = 0;
		if (this.animation) {
			x = this.animation.nFrame * this.tile.nWidth;
		}
		ctx.drawImage(t.oImage,
			x,
			0,
			t.nWidth,
			t.nHeight,
			this.x,
			this.y,
        	t.nWidth,
            t.nHeight,
		);
	}
});
/**
 * Classe de personnalisation des 4 face d'un block Cette classe permet de
 * personaliser l'apparence ou les fonctionnalité d'une face d'un mur
 * Actuellement cette classe gène la personnalisation des texture du mur
 */
O2.createClass('O876_Raycaster.XMap', {
	aMap : null,
	nWidth : 0,
	nHeight : 0,
	nBlockWidth : 0,
	nBlockHeight : 0,
	nShadeFactor : 0,

	/*
	 * attributs de bloc utilisés Il y a 4 groupe d'attribut 1 pourt chaque face
	 * ... par cloneWall : la fonctionnalité de personalisation de la texture -
	 * bWall : flag à true si la texture du mur est personnalisé - oWall :
	 * canvas de la nouvelle texture - x - y ...
	 */

	setSize : function(w, h) {
		this.aMap = [];
		var aBlock, aRow, x, y, nSide;
		this.nWidth = w;
		this.nHeight = h;
		for (y = 0; y < h; ++y) {
			aRow = [];
			for (x = 0; x < w; ++x) {
				aBlock = [];
				for (nSide = 0; nSide < 6; ++nSide) {
					aBlock.push({
						x : x,
						y : y,
						surface: null,
						diffuse: 0
					});
				}
				aRow.push(aBlock);
			}
			this.aMap.push(aRow);
		}
	},

	get : function(x, y, nSide) {
		if (x < 0 || y < 0) {
			throw new Error('x or y out of bound ' + x + ', ' + y);
		}
		return this.aMap[y][x][nSide];
	},

	set : function(x, y, nSide, xValue) {
		this.aMap[y][x][nSide] = xValue;
	},

	/**
	 * Permet de faire tourner les textures additionnel générée avec cloneTexture
	 * Cela permet d'avoir 4 états de textures aditionnelle
	 * Par exemple on peut créer une texture additionnelle et la camoufler par 
	 * rotation puis la faire réapparaitre.
	 * Cette opération est plus rapide que de tout redessiner
	 * @param x coordonnée bloc à tourner
	 * @param y
	 * @param n sens de rotation true ou false
	 * true : 0 devient 3, 1 devient 0...
	 * false : 0 devient 1, 1 devient 2, 2 devient 3, 3 devient 0
	 */
	rotateWallSurfaces: function(x, y, n) {
		var mxy = this.aMap[y][x];
		var a = mxy.slice(0, 4).map(function(m) {
			return m.surface;
		});
		if (n) {
			a.push(a.shift());
		} else {
			a.unshift(a.pop());
		}
		a.forEach(function(m, i) {
			mxy[i].surface = m;
		});
	},

	setBlockSize: function(w, h) {
		this.nBlockHeight = h;
		this.nBlockWidth = w;
	},

	/**
	 * créer une copie de la texture du mur spécifié.
	 * Renvoie le canvas nouvellement créé pour qu'on puisse dessiner dessus.
	 * Note : cette fonction est pas très pratique mais elle est utilisée par Raycaster.cloneWall
	 * @param oTextures textures murale du laby
	 * @param iTexture numéro de la texture murale
	 * @param x
	 * @param y position du mur (pour indexation)
	 * @param nSide face du block concernée.
	 */
	cloneTexture: function(oTextures, iTexture, x, y, nSide) {
		var oCanvas;
		var oBlock = this.get(x, y, nSide);
		if (oBlock.surface === null) {
			oBlock.surface = oCanvas = O876.CanvasFactory.getCanvas();
		} else {
			oCanvas = oBlock.surface;
			delete oCanvas.__shaded;
		}
		var w = this.nBlockWidth;
		var h;
		if (nSide < 4) {
			h = this.nBlockHeight;
		} else {
			// flat texture
			h = w;
			oBlock.imageData = null;
			oBlock.imageData32 = null;
			
			//oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			//oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
		}
		oCanvas.width = w;
		oCanvas.height = h;
		oCanvas.getContext('2d').drawImage(oTextures, iTexture * w, 0, w, h, 0, 0, w, h);
		return oCanvas;
	},
	
	removeClone: function(x, y, nSide) {
		this.get(x, y, nSide).surface = null;
	}
});

/**
 * @const RC raycaster constants
 */
O2.createObject('RC', {
    /**
     * @property OBJECT_TYPE_NONE
     * Mobiles with this type are undefined
     * This property is not used by the framework
     * and should not be used
     */
    OBJECT_TYPE_NONE: 0,

    /**
     * @property OBJECT_TYPE_MOB
     * Mobiles with this type are creatures that roam in the labyrinth
     * They usually got a Thinker procedure and several animation frames.
     */
    OBJECT_TYPE_MOB: 1,

    /**
     * @property OBJECT_TYPE_PLAYER
     * Mobiles with this type are human players.
     * They are assigned a Thinker which is generally controlled by
     * input devices (mouse or keyboard)
     */
    OBJECT_TYPE_PLAYER: 2,

    /**
     * @property OBJECT_TYPE_PLACEABLE
     * Mobiles with this type are considered static objects and are
     * kicked out of the Mobile list and added to the Static list
     * (furniture, trees, structures are generally placeable)
     */
    OBJECT_TYPE_PLACEABLE: 3,

    /**
     * @property OBJECT_TYPE_MISSILE
     * Mobiles with this type are missiles,
     * Generally short lived mobile with a simple thinker and an owner
     * The owner is the mobile (PLAYER or MOB that fired the missile.
     */
    OBJECT_TYPE_MISSILE: 4,

    /**
     * @property OBJECT_TYPE_ITEM
     * A Mobile with this type is an item which can be added to an inventory.
     * Behave like placeable, have no collision, can be picked up
     */
    OBJECT_TYPE_ITEM: 5,

    /**
     * @property FX_NONE
     * No effect assigned to the sprite
     */
    FX_NONE: 0,

    /**
     * @property FX_LIGHT_ADD
     * The sprite will be translucent with an "add" composite drawing operation
     */
    FX_LIGHT_ADD: 1,

    /**
     * @property FX_LIGHT_SOURCE
     * The sprite is a light source, and will not be drawn darker when far
     * from player's point of view
     */
    FX_LIGHT_SOURCE: 2,			// Le sprite ne devien pas plus sombre lorsqu'il s'éloigne de la camera

    /**
     * @property FX_ALPHA_75
     * The sprite opacity is 75%
     */
    FX_ALPHA_75: 1 << 2,

    /**
     * @property FX_ALPHA_50
     * The sprite opacity is 50%
     */
    FX_ALPHA_50: 2 << 2,

    /**
     * @property FX_ALPHA_25
     * The sprite opacity is 25%, almost invisible
     */
    FX_ALPHA_25: 3 << 2,

    /**
     * @property FX_DIM0
     * Undocumented. Used for optimisation.
     */
    FX_DIM0: 0x10,

    /**
     * @property FX_ALPHA
     * This array is internally used by the framework
     */
    FX_ALPHA: [1, 0.75, 0.50, 0.25, 0],


	/**
     * @property TIME_DOOR_DOUBLE
     * Time (in milliseconds) during a double panel door opening
	 */
	TIME_DOOR_DOUBLE: 600,

	/**
	 * @property TIME_DOOR_DOUBLE
	 * Time (in milliseconds) during a single panel door opening (horizontally)
	 */
	TIME_DOOR_SINGLE_HORIZ: 800,

	/**
	 * @property TIME_DOOR_DOUBLE
	 * Time (in milliseconds) during a single panel door opening (vertically)
	 */
	TIME_DOOR_SINGLE_VERT: 800,

	/**
	 * @property TIME_DOOR_DOUBLE
	 * Time (in milliseconds) during a secret passage opening
	 */
	TIME_DOOR_SECRET: 2000,

	/**
	 * @property TIME_DOOR_AUTOCLOSE
	 * Time (in milliseconds) during an autoclose door stays open
	 */
	TIME_DOOR_AUTOCLOSE: 3000,


});


/** Liste des code clavier javascript
 * 2012-01-01 Raphaël Marandet
 */

var KEYS = {
  MOUSE: {
    KEY: 0,
    X: 0,
    Y: 1,
    BUTTONS: {
      LEFT: 2,
      RIGHT: 3,
      MIDDLE: 4
    },
    SCROLLUP: 5,
    SCROLLDOWN: 6
  },
  BACKSPACE:     8,
  TAB:           9,
  ENTER:        13,
  SHIFT:        16,
  CTRL:         17,
  ALT:          18,
  PAUSE:        19,
  CAPSLOCK:     20,
  ESCAPE:       27,
  SPACE:        32,
  PAGEUP:       33,
  PAGEDOWN:     34,
  END:          35,
  HOME:         36,
  LEFT:         37,
  UP:           38,
  RIGHT:        39,
  DOWN:         40,
  INSERT:       45,
  DELETE:       46,
  ALPHANUM: {
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90
  },
  NUMPAD:       {
    0:  96,
    1:  97,
    2:  98,
    3:  99,
    4: 100,
    5: 101,
    6: 102,
    7: 103,
    8: 104,
    9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBSTRACT: 109,
    POINT: 110,
    DIVIDE: 111
  },
  F1:        112,
  F2:        113,
  F3:        114,
  F4:        115,
  F5:        116,
  F6:        117,
  F7:        118,
  F8:        119,
  F9:        120,
  F10:       121,
  F11:       122,
  F12:       123,
  NUMLOCK:   144,
  SCROLLLOCK:145,
  SEMICOLON: 186,
  EQUAL:     187,
  COMMA:     188,
  DASH:      189,
  PERIOD:    190,
  SLASH:     191,
  GRAVE:     192,
  OPENBRACKET:219,
  BACKSLASH: 220,
  CLOSEBRACKET:221,
  QUOTE:     222
};


/* globals O2, H5UI */

O2.extendClass('H5UI.Box', H5UI.WinControl, {
	_sClass : 'Box',
	_sColor : '#FFFFFF',
	_sColorOutside : '#FF6666',
	_sColorInside : '#FFBBBB',
	_sColorBorder : '#000000',
	_sColorBorderOutside : '#000000',
	_sColorBorderInside : '#000000',
	_nBorderWidth : 8,

	_xGradStart : 0,
	_yGradStart : 0,
	_xGradEnd : 0,
	_yGradEnd : 0,
	_nGradOrientation : 0,
	
	
	__construct: function() {
		__inherited();
		this.on('mousein', this.onMouseIn.bind(this));
		this.on('mouseout', this.onMouseOut.bind(this));
	},

	setColor : function(sNormal, sHighlight) {
		if (sHighlight === undefined) {
			sHighlight = sNormal;
		}
		this._sColorInside = sHighlight;
		this._set('_sColor', this._sColorOutside = sNormal);
	},

	setBorder : function(n, sOut, sIn) {
		if (sOut === undefined) {
			sOut = '#000000';
		}
		if (sIn === undefined) {
			sIn = sOut;
		}
		if (n) {
			this._set('_sColorBorderOutside', sOut);
			this._set('_sColorBorderInside', sIn);
			this._set('_sColorBorder', sOut);
		}
		this._set('_nBorderWidth', n);
	},

	/**
	 * Triggered when the mouse overlaps the control
	 * @param x mouse position x (pixels)
	 * @param y mouse position y (pixels)
	 * @param b clicked button mask
	 */
	onMouseIn : function(oEvent) {
		var oSender = oEvent.target;
		var x = oEvent.x;
		var y = oEvent.y;
		var b = oEvent.button;
		this._set('_sColorBorder', this._sColorBorderInside);
		this._set('_sColor', this._sColorInside);
	},

	/**
	 * Triggered when the mouse exits the control's bounding rect
	 * @param x mouse position x (pixels)
	 * @param y mouse position y (pixels)
	 * @param b clicked button mask
	 */
	onMouseOut : function(oEvent) {
		var oSender = oEvent.target;
		var x = oEvent.x;
		var y = oEvent.y;
		var b = oEvent.button;
		this._set('_sColorBorder', this._sColorBorderOutside);
		this._set('_sColor', this._sColorOutside);
	},

	computeGradientOrientation : function() {
		switch (this._nGradOrientation) {
		case 1: // Vertical
			this._xGradStart = 0;
			this._yGradStart = 0;
			this._xGradEnd = 0;
			this._yGradEnd = this.height() - 1;
			break;

		case 2: // Horiz
			this._xGradStart = 0;
			this._yGradStart = 0;
			this._xGradEnd = this.width() - 1;
			this._yGradEnd = 0;
			break;
	
		case 3: // Diag 1
			this._xGradStart = 0;
			this._yGradStart = 0;
			this._xGradEnd = this.width() - 1;
			this._yGradEnd = this.width() - 1;
			break;
	
		case 4: // Diag 2
			this._xGradStart = this.width() - 1;
			this._yGradStart = 0;
			this._xGradEnd = 0;
			this._yGradEnd = this.width() - 1;
			break;
		}
	},

	getFillStyle : function() {
		var s = this.getSurface();
		var aGrad = this._sColor.split(' ');
		var xFillStyle;
		if (aGrad.length === 1) {
			xFillStyle = this._sColor;
		} else {
			// Le gradient contient il un mot clé permettant d'influencer le
			// type de gradient ?
			switch (aGrad[0]) {
				case 'hgrad':
					this._nGradOrientation = 2;
					break;
	
				case 'vgrad':
					this._nGradOrientation = 1;
					break;
	
				case 'd1grad':
					this._nGradOrientation = 3;
					break;
	
				case 'd2grad':
					this._nGradOrientation = 4;
					break;
	
				default:
					this._nGradOrientation = 0;
					break;
			}
			if (this._nGradOrientation) {
				aGrad.shift();
			}
			this.computeGradientOrientation();
			var oGrad = s.createLinearGradient(this._xGradStart, this._yGradStart,
					this._xGradEnd, this._yGradEnd);
			for ( var iGrad = 0; iGrad < aGrad.length; iGrad++) {
				oGrad.addColorStop(iGrad / (aGrad.length - 1), aGrad[iGrad]);
			}
			xFillStyle = oGrad;
		}
		return xFillStyle;
	},
	
	renderSelf : function() {
		this._oContext.fillStyle = this.getFillStyle();
		this._oContext.fillRect(0, 0, this.width(), this.height());
		if (this._nBorderWidth) {
			this._oContext.strokeStyle = this._sColorBorder;
			this._oContext.lineWidth = this._nBorderWidth;
			this._oContext.strokeRect(0, 0, this.width(), this.height());
		}
	}
});

/* globals O2, H5UI */
/**
 * Ce composant est un bouton cliquable avec un caption de texte Le bouton
 * change de couleur lorsque la souris passe dessus Et il possède 2 état
 * (normal/surbrillance)
 */
O2.extendClass('H5UI.Button', H5UI.Box, {
	oText : null,
	_sColorNormal : '#999',
	_sColorOver : '#BBB',
	_sColorSelect : '#DDD',
	_sColorBorder : '#000',

	__construct : function() {
		__inherited();
		this.setSize(64, 24);
		this.setColor(this._sColorNormal, this._sColorOver);
		this.setBorder(1, this._sColorBorder);
		this.oText = this.linkControl(new H5UI.Text());
		this.oText.moveTo(4, 4);
		this.oText.setCaption('Button');
		this.oText.align('center');
	},

	setCaption : function(sCaption) {
		this.oText.setCaption(sCaption);
		this._realignControls();
	},

	getCaption : function() {
		return this.oText._sCaption;
	},

	highlight : function(b) {
		if (b) {
			this.setColor(this._sColorSelect, this._sColorOver);
		} else {
			this.setColor(this._sColorNormal, this._sColorOver);
		}
	}
});

O2.extendClass('H5UI.Image', H5UI.WinControl, {
	_oTexture: null,
	_bAutosize: true,
	_sColorBorder : '#000000',
	_nBorderWidth : 0,
	
	_loadEvent: function(oEvent) {
		this.invalidate();
	},
	
	setSource: function(sSrc) {
		if (sSrc instanceof HTMLImageElement) {
			this._oTexture = sSrc;
		} else {
			if (!this._oTexture) {
				this._oTexture = new Image();
			}
			this._oTexture.src = sSrc;
		}
		if (this._oTexture.complete) {
			this.invalidate();
		} else {
			this._oTexture.addEventListener('load', this._loadEvent.bind(this), true);
		}
	},
	
	renderSelf: function() {
		var s = this.getSurface();
		if (this._oTexture && this._oTexture.complete) {
			if (this._bAutosize) {
				this.setSize(this._oTexture.width, this._oTexture.height);
				s.drawImage(this._oTexture,	0, 0);						
			} else {
				s.clearRect(0, 0, this.width(), this.height());
				s.drawImage(
					this._oTexture,
					0, 
					0, 
					this._oTexture.width, 
					this._oTexture.height,
					0, 
					0, 
					this.width(),
					this.height()
				);
			}
		}
		if (this._nBorderWidth) {
			this._oContext.strokeStyle = this._sColorBorder;
			this._oContext.lineWidth = this._nBorderWidth;
			this._oContext.strokeRect(0, 0, this.width(), this.height());
		}
	}
});


/**
 * Scrollbar Barre de défilement horizontal ou vertical
 */
O2.extendClass('H5UI.ScrollBar', H5UI.WinControl, {
	_sClass : 'ScrollBar',
	_sColorBar : '#888',
	_sColorBarBorder : '#222',
	_sColorBackground : '#CCC',

	_nStepCount : 100, // zone couverte par la scrollbar
	_nPosition : 0, // Position de la scrollbar
	_nLength : 20, // Longueur de la scrollbar

	ySize : 0, // Taille en pixel du pad
	yRange : 0, // Zone dans laquelle le pad peut se déplacer
	yPos : 0, // Position du pad

	// Flags internes
	bDragging : false,
	yDragDock : 0,
	yDragging : 0,
	_bDragHandler: true,

	_bVertical : false,

	__construct: function() {
		__inherited();
		// marche plus :'(
		// pas le temps de réparer
		// 2016-12-17
		//this.registerMouseEventHandlers();
	},

	getAxisValue : function(x, y) {
		return this._bVertical ? y : x;
	},

	/**
	 * Définit l'orientation
	 * 
	 * @param n
	 *            1: Vertical, 0: Horizontal
	 */
	setOrientation : function(n) {
		this._bVertical = n != 0;
	},

	/**
	 * Modifie la taille logique de la barre
	 * 
	 * @param n
	 *            Nouvelle taille
	 */
	setStepCount : function(n) {
		this._set('_nStepCount', n);
	},

	/**
	 * Modifie la position logique de la scrollbar
	 * 
	 * @param n
	 *            Nouvelle position
	 */
	setPosition : function(n) {
		if (n < 0) {
			n = 0;
		}
		if ((n + this._nLength) > this._nStepCount) {
			n = this._nStepCount - this._nLength;
		}
		this._set('_nPosition', n);
	},

	/**
	 * Renvoie la position logique de la scrollbar
	 * 
	 * @return entier
	 */
	getPosition : function() {
		return this._nPosition;
	},

	/**
	 * Modifie la longueur logique de la scrollbar Par exemple si la scrollbar
	 * est associé à une zone de texte de 30 lignes affichable, et que cette
	 * zone contient un fichier texte de 500 lignes et qu'on souhaire voir les
	 * lignes 100 à 129. on fait : sb.setStepCount(500); sb.setLength(30);
	 * sb.setPosition(100);
	 */
	setLength : function(n) {
		this._set('_nLength', n);
	},

	/**
	 * Défini une nouvelle position en pixel
	 */
	setPixelPosition : function(y) {
		this.setPosition(y * this._nStepCount / this.getAxisValue(this.width(), this.height()) | 0);
	},

	registerMouseEventHandlers: function() {
		this.on('mousedown', this.onMouseDown.bind(this));
		this.on('mouseup', this.onMouseUp.bind(this));
	},

	// MD Déterminer la zone cliquée
	// Top : Page Up
	// Bottom Page Down
	// Mid : Initier drag du pad

	onMouseDown : function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		var b = oEvent.button;
		y = this.getAxisValue(x, y);
		if (y < this.yPos) {
			// Page Up
			this.setPixelPosition(this.yPos - this.ySize);
			this.doScroll();
		}
		if (y > (this.yPos + this.ySize)) {
			// Page Dn
			this.setPixelPosition(this.yPos + this.ySize);
			this.doScroll();
		}
		if (y >= this.yPos && y <= (this.yPos + this.ySize)) {
			// Start drag
			this.dragStart(x, y, b);
		}
		this.invalidate();
	},

	onMouseUp : function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		var b = oEvent.button;
		if (this.bDragging) {
			this.bDragging = false;
			this.stopDrag();
		}
	},

	onStartDragging : function(x, y, b) {
		// Start drag
		y = this.getAxisValue(x, y);
		this.yDragging = y;
		this.yDragDock = this.yPos;
	},

	onDragging : function(x, y, b) {
		y = this.getAxisValue(x, y);
		this.setPixelPosition(y - this.yDragging + this.yDragDock);
		this.doScroll();
		this.invalidate();
	},

	onEndDragging : function(x, y, b) {
	},


	doScroll : function() {
		if ('onScroll' in this) {
			this.onScroll();
		}
	},

	renderSelf : function() {
		var s = this.getSurface();
		s.fillStyle = this._sColorBackground;
		s.fillRect(0, 0, this.width(), this.height());
		this.ySize = this._nLength *
				this.getAxisValue(this.width(), this.height()) /
				this._nStepCount | 0;
		this.yRange = this.getAxisValue(this.width(), this.height())
				- this.ySize;
		this.yPos = this._nPosition * this.yRange / (this._nStepCount - this._nLength) | 0;
		s.fillStyle = this._sColorBar;
		s.strokeStyle = this._sColorBarBorder;
		if (this._bVertical) {
			s.fillRect(0, this.yPos, this.width(), this.ySize);
			s.strokeRect(0, this.yPos, this.width(), this.ySize);
		} else {
			s.fillRect(this.yPos, 0, this.ySize, this.height());
			s.strokeRect(0, this.yPos, this.width(), this.ySize);
		}
	}
});

/**
 * Ce composant est une surface qui peut afficher une partie d'une surface plus
 * grande que lui. On appellera "conteneur interne" le composant de grande
 * taille dont on affiche une partie. On utilise des methode de scroll pour
 * déplacer la fenetre d'affichage afin de voir d'autre parties du container
 * interne. Le conteneur interne se redimensionne en fonction de la taille et de
 * la position des objets qu'il contient.
 */
O2.extendClass('H5UI.ScrollBox', 'H5UI.WinControl', {
	_sClass : 'ScrollBox',
	_oContainer : null,
	_xScroll : 0,
	_yScroll : 0,
	_bgColor: '',

	/**
	 * Methode modifiée qui linke le controle transmis en paramètre directement
	 * dans le conteneur interne
	 * 
	 * @param o
	 *            control à linker
	 * @param bParent, -
	 *            true: on link le controle sur la scrollbox (ce control ne se
	 *            déplacera donc pas par scrolling puisse qu'il ne fera pas
	 *            partie du conteneur inter. - false: on link le controle dans
	 *            le conteneur interne, le controle sera sujet au scrolling le
	 *            conteneur interne s'agrrandi en cas de besoin
	 */
	linkControl : function(o, bParent) {
		if (bParent === undefined) {
			bParent = false;
		}
		if (bParent) {
			__inherited(o);
		} else {
			this.getContainer().linkControl(o);
			o.invalidate();
		}
		return o;
	},

	clear: function() {
		this.getContainer().clear();
	},

	/**
	 * Renvoie l'instance du controleur interne Construit le conteneur interne
	 * on the fly en cas de besoin
	 * 
	 * @return ScrollBoxContainer
	 */
	getContainer : function() {
		if (this._oContainer === null) {
			this._oContainer = this.linkControl(new H5UI.ScrollBoxContainer(), true);
		}
		return this._oContainer;
	},

	/**
	 * Déplace la position de scrolling
	 * 
	 * @param x nouvelle position de scroll
	 * @param y nouvelle position de scroll
	 */
	scrollTo : function(x, y) {
		if (x != this._xScroll || y != this._yScroll) {
			var yContSize = this.getContainer().height();
			var yThisSize = this.height();
			var yMax = Math.max(0, yContSize - yThisSize);
			var xContSize = this.getContainer().width();
			var xThisSize = this.width();
			var xMax = Math.max(0, xContSize - xThisSize);
			this._xScroll = x = Math.max(0, Math.min(x, xMax));
			this._yScroll = y = Math.max(0, Math.min(y, yMax));
			this.getContainer().moveTo(-x, -y);
			if (this.getContainer()._bInvalid) {
				this.invalidate();
			}
		}
	},

	/**
	 * Renvoie la position X de la fenetre d'affichage
	 * 
	 * @return int (pixels)
	 */
	getScrollX : function() {
		return this._xScroll;
	},

	/**
	 * Renvoie la position Y de la fenetre d'affichage
	 * 
	 * @return int (pixels)
	 */
	getScrollY : function() {
		return this._yScroll;
	},

	/**
	 * Couleur de fond
	 */
	setColor: function(sColor) {
		this._set('_bgColor', sColor);
	},

	// la première errer de non transmission d'évènement souris était du a une
	// Height mal calculée
	// cette deuxième erreur est également du au fait d'une mauvaise redimension
	// de controle

	renderSelf : function() {
		// Le container doit être assez grand pour tout contenir
		var w = 0, h = 0, o;
		var c = this.getContainer();
		for ( var i = 0; i < c._aControls.length; i++) {
			o = c.getControl(i);
			w = Math.max(w, o._x + o.width());
			h = Math.max(h, o._y + o.height());
		}
		c.setSize(w, h);
		if (this._bgColor) {
			var s = this.getSurface();
			var sColor = s.fillStyle;
			s.fillStyle = this._bgColor;
			s.fillRect(0, 0, this.width(), this.height());
			s.fillStyle = sColor;
		} else {
			this.getSurface().clearRect(0, 0, this.width(), this.height());
		}
	}
});

/* globals O2, H5UI */

O2.extendClass('H5UI.ScrollBoxContainer', H5UI.WinControl, {
	_sClass : 'ScrollBoxContainer',
	
	renderSelf : function() {
		this._oContext.clearRect(0, 0, this.width(), this.height());
	}
});


/**
 * Un composant simple qui affiche un texte Penser à redimensionner correctement
 * le controle, sinon le texte sera invisible
 */
O2.extendClass('H5UI.Text', H5UI.WinControl, {
	_sClass : 'Text',
	_sCaption : '',
	_bAutosize : true,
	_bWordWrap: false,
	_nTextWidth: 0,	
	_nLineHeight: 0,
	_yLastWritten: 0,
	_bUseColorCodes: false,

	// propriété publique
	font : null,

	__construct : function() {
		__inherited();
		O876.CanvasFactory.setImageSmoothing(this.getSurface(), true);
		this.font = new H5UI.Font(this);
	},
	
	setFontStyle: function(sStyle) {
		this.font.setStyle(sStyle);
		this.invalidate();
	},

	setFontSize: function(nSize) {
		this.font.setSize(nSize);
		this.invalidate();
	},

	setFontColor: function(sColor, sOutline) {
		this.font.setColor(sColor, sOutline);
		this.invalidate();
	},

	setFontFace: function(sName) {
		this.font.setFont(sName);
		this.invalidate();
	},

	/**
	 * Modification du caption
	 * 
	 * @param s
	 *            nouveau caption
	 */
	setCaption : function(s) {
		this._set('_sCaption', s);
		this.font.update();
		if (this._bAutosize && this._bInvalid && !this._bWordWrap) {
			var oMetrics = this.getSurface().measureText(this._sCaption);
			this.setSize(oMetrics.width, this.font._nFontSize);
		} else {
			this.renderSelf();
		}
	},


	/**
	 * Définition du flag autosize quand ce flag est actif, le control prend la
	 * dimension du texte qu'il contient
	 */
	setAutosize : function(b) {
		this._set('_bAutosize', b);
	},

	/**
	 * Définition du flag wordwrap, quand ce flag est actif, la taille est fixe
	 * et le texte passe à la ligne si celui-ci est plus long que la longeur.
	 */
	setWordWrap : function(b) {
		this._set('_bWordWrap', b);
	},

	multiColorLineRender: function (oSurface, sLine, x, y) {
		// découper la chaine en tronçons
		var i = 0, segm, color = '{#000}', t, r = /\{#[0-9A-Fa-f]+\}/g;
		var aResult = [];
		do {
			t = r.exec(sLine);
			if (t) {
				segm = {
					i: i,
					t: sLine.substr(i, t.index - i),
					c: color.substr(1, color.length - 2)
				};
				color = t[0];
				i = t.index + color.length;
			} else {
				segm = {
					i: i,
					t: sLine.substr(i),
					c: color.substr(1, color.length - 2)
				};
			}
			aResult.push(segm);
		} while (t);
		i = 0;
		aResult.forEach((function(s) {
			var w = oSurface.measureText(s.t).width;
			oSurface.fillStyle = s.c;
			oSurface.fillText(s.t, x + i, y);
			i += w;
		}).bind(this));
		return aResult;
	},



	renderSelf : function() {
		var oSurface = this.getSurface();
		var oMetrics;
		// Redimensionnement du texte
		oSurface.clearRect(0, 0, this.width(), this.height());
		if (this._bWordWrap){
			var aRenderLines = [];
			this.font.update();
			var aWords;
			var sLine = '', sWord, x = 0, y = 0;
			var sSpace;
			oSurface.textBaseline = 'top';
			var aParas = this._sCaption.split('\n');
			for (var iPara = 0, nParaCount = aParas.length; iPara < nParaCount; ++iPara) {
				aWords = aParas[iPara].split(' ');
				while (aWords.length) {
					sWord = aWords.shift();
					sSpace = sLine ? ' ' : '';
					oMetrics = oSurface.measureText(sLine + sSpace + sWord);
					if (oMetrics.width >= this.width()) {
						// flush
						x = 0;
						aRenderLines.push(sLine);
						y += this.font._nFontSize + this._nLineHeight;
						sLine = sWord;
					} else {
						sLine += sSpace + sWord;
						x += oMetrics.width;
					}
				}
				x = 0;
				aRenderLines.push(sLine);
				y += this.font._nFontSize + this._nLineHeight;
				sLine = '';
				this._yLastWritten = y;
			}
			if (this._bAutosize) {
				this.setSize(this.width(), y + this.font._nFontSize);
			}

			aRenderLines.forEach((function(s, i) {
				var x = 0, y = i * (this.font._nFontSize + this._nLineHeight);
				if (this.font._bOutline) {
					oSurface.strokeText(s, x, y);
				}
				if (this._bUseColorCodes) {
					this.multiColorLineRender(oSurface, s, x, y);
				} else {
					oSurface.fillText(s, x, y);
				}
			}).bind(this));
		} else {
			if (this._bAutosize) {
				this.font.update();
				oMetrics = oSurface.measureText(this._sCaption);
				this.setSize(oMetrics.width, this.font._nFontSize);
			} else {
			}
			oSurface.textBaseline = 'middle';
			if (this.font._bOutline) {
				oSurface.strokeText(this._sCaption, 0, this.height() / 2);
			}
			oSurface.fillText(this._sCaption, 0, this.height() / 2);
		}
	}
});


/**
 * Grille d'image (petites images)
 * 
 */
O2.extendClass('H5UI.TileGrid', H5UI.WinControl, {
	_oTexture : null,
	
	_nCellWidth: 8,
	_nCellHeight: 8,
	_nCellPadding: 0,
	
	_aCells: null,
	_aInvalidCells: null,
	
	_bTransparent: true,  // true: considère les Tile comme transparentes (nécessitant un clearRect)
	
	
	/** Modification de la taille de la grille
	 * @param w int largeur (nombre de cellule en X)
	 * @param h int hauteur (nombre de cellule en Y)
	 */
	setGridSize: function(w, h, nPadding) {
		this._nCellPadding = nPadding | 0;
		this._aCells = [];
		var x, y, aRow;
		for (y = 0; y < h; y++) {
			aRow = [];
			for (x = 0; x < w; x++) {
				aRow.push(-1);
			}
			this._aCells.push(aRow);
		}
		this._aInvalidCells = {};
		var wTotal = (this._nCellWidth + this._nCellPadding) * w;
		var hTotal = (this._nCellHeight + this._nCellPadding) * h;
		this.setSize(wTotal, hTotal);
	},
	
	/** Fabrique une clé à partir des coordonnées transmise
	 * utilisé pour déterminer la liste des case qui ont été modifiées
	 * @param x
	 * @param y coordonnée de la celluel dont on cherche la clé
	 * @return string
	 */
	getCellKey: function(x, y) {
		return x.toString() + ':' + y.toString(); 
	},
	
	
	/** Modifie le code d'une cellule
	 * @param x 
	 * @param y coordonnées de la cellule
	 * @param n nouveau code de la cellule
	 */
	setCell: function(x, y, n) {
		if (this._aCells[y][x] !== n) {
			this._aCells[y][x] = n;
			var sKey = this.getCellKey(x, y);
			if (!(sKey in this._aInvalidCells)) {
				this._aInvalidCells[sKey] = [x, y];
				this.invalidate();
			}
		}
	},
	
	renderCell: function(x, y, n) {
		this.getSurface().drawImage(
			this._oTexture, 
			n * this._nCellWidth, 
			0, 
			this._nCellWidth, 
			this._nCellHeight, 
			x * (this._nCellWidth + this._nCellPadding), 
			y * (this._nCellHeight + this._nCellPadding), 
			this._nCellWidth, 
			this._nCellHeight
		);
	},
	
	renderSelf: function() {
		var h = this._aCells.length; 
		if (h === 0) {
			return;
		}
		var w = this._aCells[0].length;
		if (w === 0) {
			return;
		}
		if (this._nCellWidth * this._nCellHeight === 0) {
			return;
		}
		if (this._oTexture === null) {
			return;
		}
		var oCell, n, x, y;
		var s = this.getSurface();
		var b = false;
		for (var sKeyCell in this._aInvalidCells) {
			b = true;
			oCell = this._aInvalidCells[sKeyCell];
			x = oCell[0];
			y = oCell[1];
			n = this._aCells[y][x];
			if (this._bTransparent) {
				s.clearRect(x * (this._nCellWidth + this._nCellPadding), y * (this._nCellHeight + this._nCellPadding), this._nCellWidth + this._nCellPadding, this._nCellHeight + this._nCellPadding);
			}
			this.renderCell(x, y, n);
		}
		if (b) {
			this._aInvalidCells = {};			
		}
	}
});

/**
 * @class O876_Raycaster.Engine
 * @extends O876_Raycaster.Transistate
 */
O2.extendClass('O876_Raycaster.Engine', O876_Raycaster.Transistate, {
	// Juste une copie du TIME_FACTOR du raycaster
	TIME_FACTOR : 50, // Doit être identique au TIME_FACTOR du raycaster

	// public
	oRaycaster : null,
	oKbdDevice : null,
	oMouseDevice : null,
	oMotionDevice: null,
	oThinkerManager : null,
	
	// protected
	_oFrameCounter: null,
	_nTimeStamp : 0,
	_nShadedTiles : 0,
	_nShadedTileCount : 0,
	_oConfig: null,
	
	__construct : function(oConfig) {
		if (!O876.Browser.checkHTML5('O876 Raycaster Engine')) {
			throw new Error('browser is not full html 5');
		}
		this.setConfig(oConfig);
        this._callGameEvent('onInitialize');
	},

	/**
	 * Définition du fichier de configuration
	 */
	setConfig: function(c) {
		this._oConfig = c;
	},

	getConfig: function() {
		return this._oConfig;
	},

	initRaycaster: function(oData) {
        this.TIME_FACTOR = this.nInterval = this._oConfig.game.interval;
        this._oConfig.game.doomloop = this._oConfig.game.doomloop || 'raf';
        if (this.oRaycaster) {
            this.oRaycaster.finalize();
        } else {
            this.oRaycaster = new O876_Raycaster.Raycaster();
            this.oRaycaster.TIME_FACTOR = this.TIME_FACTOR;
        }
        this.oRaycaster.setConfig(this._oConfig.raycaster);
        this.oRaycaster.initialize();
        this.oThinkerManager = this.oRaycaster.oThinkerManager;
        this.oThinkerManager.oGameInstance = this;
        this._callGameEvent('onLoading', 'lvl', 0, 2);
        this.oRaycaster.defineWorld(oData);
        this.setDoomloop('stateBuildLevel');
	},


	/**
	 * Déclenche un évènement
	 * 
	 * @param sEvent
	 *            nom de l'évènement
	 * @param oParam
	 *            paramètre optionnels à transmettre à l'évènement
	 * @return retour éventuel de la fonction évènement
	 */
	_callGameEvent : function(sEvent) {
		if (sEvent in this && this[sEvent]) {
			var pFunc = this[sEvent];
			var aParams = Array.prototype.slice.call(arguments, 1);
			return pFunc.apply(this, aParams);
		}
		return null;
	},

	/**
	 * Arret du moteur et affichage d'une erreur
	 * 
	 * @param sError
	 *            Message d'erreur
	 */
	_halt : function(sError, oError) {
		if (('console' in window) && ('log' in window.console) && (sError)) {
			console.error(sError);
			if (oError) {
				console.error(oError.toString());
			}
		}
		this.pause();
		this.setDoomloop('stateEnd');
		if (this.oKbdDevice) {
			this.oKbdDevice.unplugHandlers();
		}
		if (this.oMouseDevice) {
			this.oMouseDevice.unplugHandlers();
		}
        this.oRaycaster.finalize();
	},

	/**
	 * Renvoie une instance du périphérique clavier
	 * 
	 * @return KeyboardDevice
	 */
	getKeyboardDevice : function() {
		if (this.oKbdDevice === null) {
			var kbd = null;
			var cfgGame = this._oConfig.game;
			if ('devices' in cfgGame) {
				var cfgDev = cfgGame.devices;
				if (typeof cfgDev !== 'object') {
					throw new Error('config.game.devices must be an object');
				}
				if (!cfgDev) {
                    throw new Error('config.game.devices must not be null');
				}
				if ('keyboard' in cfgDev) {
                    var pClass = new O2.loadObject(cfgDev.keyboard);
                    kbd = new pClass();
				}
			}
			if (!kbd) {
				kbd = new O876_Raycaster.KeyboardDevice();
			}
            kbd.plugHandlers();
			this.oKbdDevice = kbd;
		}
		return this.oKbdDevice;
	},

	getMouseDevice : function(oElement) {
		if (this.oMouseDevice === null) {
			if (oElement === undefined) {
				throw new Error('no target element specified for the mouse device');
			}
			this.oMouseDevice = new O876_Raycaster.MouseDevice();
			this.oMouseDevice.plugHandlers(oElement);
		}
		return this.oMouseDevice;
	},
	
	getMotionDevice: function() {
		if (this.oMotionDevice === null) {
			this.oMotionDevice = new O876_Raycaster.MotionDevice();
			this.oMotionDevice.plugHandlers();
		}
		return this.oMotionDevice;
	},
	
	/**
	 * Renvoie le temps actuel en millisecondes
	 * @return {int}
	 */
	getTime: function() {
		return this._nTimeStamp;
	},

	/**
	 * Define time
	 * May be usefull whn using pause, to update the last time stamp
	 * and avoid a large amount of compensating calc.
	 */
	setTime: function(n) {
		this._nTimeStamp = n;
	},

	// ////////// METHODES PUBLIQUES API ////////////////


	/**
	 * Returns true if the block at the specified coordinates
	 * is a door or a secret passage
	 * @param x
	 * @param y coordinates
	 * @return bool
	 */
	isDoor: function(x, y) {
		var nPhys = this.oRaycaster.getMapPhys(x, y);
		return nPhys >= 2 && nPhys <= 9;
	},

	/**
	 * Active un effet d'ouverture de porte ou passage secret sur un block
	 * donné. L'effet d'ouverture inclue la modification temporaire de la
	 * propriété du block permettant ainsi le libre passage des mobiles le temps
	 * d'ouverture (ce comportement est codé dans le GXDoor). Le bloc doit
	 * comporte un code physique correspondant à une porte : Un simple mur (code
	 * 1) ne peut pas faire office de porte
	 * 
	 * @param x
	 *            coordonnées du bloc-porte
	 * @param y
	 *            coordonnées du bloc-porte
	 * @param bStayOpen
	 *            désactive autoclose et garde la porte ouverte
	 * 
	 */
	openDoor : function(x, y, bStayOpen) {
		var rc = this.oRaycaster;
		var nPhys = rc.getMapPhys(x, y);
		var o = null;
		switch (nPhys) {
			case 2: // Raycaster::PHYS_FIRST_DOOR
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8: // Raycaster::PHYS_LAST_DOOR
				if (!Marker.getMarkXY(rc.oDoors, x, y)) {
					o = rc.addGXEffect(O876_Raycaster.GXDoor);
					o.x = x;
					o.y = y;
					if (bStayOpen) {
						o.setAutoClose(0);
					}
				}
				break;
	
			case 9: // Raycaster::PHYS_SECRET_BLOCK
				if (!Marker.getMarkXY(this.oRaycaster.oDoors, x, y)) {
					o = rc.addGXEffect(O876_Raycaster.GXSecret);
					o.x = x;
					o.y = y;
				}
				break;
		}
		return o;
	},

	/**
	 * Fermeture manuelle d'une porte à la position X Y Utilisé avec les portes
	 * sans autoclose. S'il n'y a pas de porte ouverte en X Y -> aucun effet
	 * 
	 * @param x
	 *            coordonnées du bloc-porte
	 * @param y
	 *            coordonnées du bloc-porte
	 * @param bForce
	 *            force la fermeture même en case de présence de mobile
	 */
	closeDoor : function(x, y, bForce) {
		var oDoor = Marker.getMarkXY(this.oRaycaster.oDoors, x, y);
		if (oDoor) {
			oDoor.setAutoClose(1);
			oDoor.close();
		}
		return oDoor;
	},


	/**
	 * Création d'un nouveau mobile à la position spécifiée
	 * 
	 * @param sBlueprint
	 *            blueprint de l'objet à créer
	 * @param x
	 *            coordonnées initiales
	 * @param y
	 * @param fAngle
	 *            angle initial
	 * @return objet créé
	 */
	spawnMobile : function(sBlueprint, x, y, fAngle) {
		return this.oRaycaster.oHorde.spawnMobile(sBlueprint, x, y, fAngle);
	},
	
	// /////////// EVENEMENTS /////////////

	// onInitialize: null,

	// onRequestLevelData: null,

	// onLoading: null,

	// onEnterLevel: null,

	// onDoomLoop: null,

	// onFrameRendered: null,

	// ////////////// ETATS ///////////////


	/**
	 * Prépare le chargement du niveau. RAZ de tous les objets.
	 */
	stateBuildLevel : function() {
		// Evènement chargement de niveau
		try {
			this.oRaycaster.buildLevel();
		} catch (e) {
			console.log(e.stack);
			this._halt('invalid world data (' + e.message + ')');
			return;
		}

		// calculer le nombre de shading à faire
		this._nShadedTileCount = 0;
		var iStc = '';
		for (iStc in this.oRaycaster.oHorde.oTiles) {
			if (this.oRaycaster.oHorde.oTiles[iStc].bShading) {
				++this._nShadedTileCount;
			}
		}
		this.setDoomloop('stateLoadComplete');
	},

	/**
	 * Patiente jusqu'à ce que les ressource soient chargée
	 */
	stateLoadComplete : function() {
		this._callGameEvent('onLoading', 'gfx', this.oRaycaster.oImages.countLoaded(), this.oRaycaster.oImages.countLoading() + this._nShadedTileCount);
		if (this.oRaycaster.oImages.complete()) {
			this.oRaycaster.backgroundRedim();
			this._nShadedTiles = 0;
			this.setDoomloop('stateShading');
		}
	},

	/**
	 * Procède à l'ombrage des textures
	 */
	stateShading : function() {
		this._callGameEvent('onLoading', 'shd', this.oRaycaster.oImages.countLoaded() + this._nShadedTiles, this.oRaycaster.oImages.countLoading() + this._nShadedTileCount);
		++this._nShadedTiles;
		if (!this.oRaycaster.shadeProcess()) {
			return;
		}
		// this._callGameEvent('onLoading', 'shd', 1, 1);
		this._oFrameCounter = new O876_Raycaster.FrameCounter();
		this.setDoomloop('stateRunning', 'interval');
		this._callGameEvent('onLoading', 'end', 1, 1);
		this._callGameEvent('onEnterLevel');
	},

    stateRunning: function() {
        this.setDoomloop('stateUpdate', 'interval');
	},

    stateUpdate: function() {
		var nTime = performance.now();
        var nFrames = 0;
        var rc = this.oRaycaster;
        if (this._nTimeStamp === null) {
            this._nTimeStamp = nTime;
        }
        while (this._nTimeStamp < nTime) {
            rc.frameProcess();
            this._callGameEvent('onDoomLoop');
            this._nTimeStamp += this.nInterval;
            nFrames++;
            if (nFrames > 10) {
                // too many frames, the window has been minimized for too long
                // restore time stamp
                this._nTimeStamp = nTime;
            }
        }
        if (nFrames) {
            rc.frameRender();
            this._callGameEvent('onFrameRendered');
            requestAnimationFrame(function() {
                rc.flipBuffer();
            });
        }
	},



	/**
	 * Fin du programme
	 * 
	 */
	stateEnd : function() {
		this.pause();
	},

	/**
	 * If the boolean parameter is false : it will stop the timer, 
	 * effectively freezing all activities.
	 * If the boolean parameter is true : it will only pause the raycaster
	 * rendering process.
	 */
	pause: function(bSoft) {
		if (bSoft) {
			if (this.oRaycaster) {
				this.oRaycaster.bPause = true;
			}
		} else {
			__inherited();
		}
	},

	resume: function() {
		if (this.oRaycaster) {
			this.oRaycaster.bPause = false;
		}
		__inherited();
	}
});

/** Effet graphique temporisé
 * O876 Raycaster project
 * @class O876_Raycaster.GXAmbientLight
 * @extends O876_Raycaster.GXEffect
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * Change graduellement le gradient de luminosité ambiente.
 */
O2.extendClass('O876_Raycaster.GXAmbientLight', O876_Raycaster.GXEffect, {
	sClass: 'AmbientLight',
	_oEasing: null,
	_bOver: false,
	_x: 0,
	
	__construct: function(rc) {
		__inherited(rc);
		this._oEasing = new O876.Easing();
	},
	
	setLight: function(x, t) {
		console.log(x, t);
		if (x > 0 && t > 0) {
			var rc = this.oRaycaster;
			this._bOver = false;
			this._oEasing
				.from(rc.nShadingFactor)
				.to(x)
				.during(t * rc.TIME_FACTOR / 1000 | 0)
				.use('smoothstep');
		}
		return this;
	},
	
	isOver: function() {
		return this._bOver;
	},

	process: function() {
		var e = this._oEasing;
		e.next();
		this._bOver = e.over();
	},

	render: function() {
		var x = this._oEasing.val();
		if (x > 0) {
			var rc = this.oRaycaster;
			this._bOver = false;
			rc.nShadingFactor = x | 0;
			if (rc.oUpper) {
				rc.oUpper.nShadingFactor = x | 0;
			}
		}
	},

	terminate: function() {
		this._bOver = true;
	}
});

/** Effet spécial temporisé
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * Cet effet gère l'ouverture et la fermeture des portes, ce n'est pas un effet visuel a proprement parlé
 * L'effet se sert de sa référence au raycaster pour déterminer la présence d'obstacle génant la fermeture de la porte
 * C'est la fonction de temporisation qui est exploitée ici, même si l'effet n'est pas visuel.
 */
O2.extendClass('O876_Raycaster.GXDoor', O876_Raycaster.GXEffect, {
	sClass : 'Door',
	nPhase : 0, // Code de phase : les porte ont 4 phases : 0: fermée(init), 1: ouverture, 2: ouverte et en attente de fermeture, 3: en cours de fermeture, 4: fermée->0
	oRaycaster : null, // Référence au raycaster        
	x : 0, // position de la porte
	y : 0, // ...
	fOffset : 0, // offset de la porte
	
	nMaxTime : 3000, // temps d'ouverture max en ms
	nTime : 3000, // temps restant avant fermeture
	nAutoClose : 0, // Flag autoclose 1: autoclose ; 0: stay open

	fSpeed : 0, // vitesse d'incrémentation/décrémentation de la porte
	nLimit : 0, // limite d'incrément de l'offset (reduit par 2 pour les porte double)
	nCode : 0, // Code physique de la porte

	oEasing: null,

	__construct: function(r) {
		__inherited(r);
		this.oEasing = new O876.Easing();
		this.nMaxTime = this.nTime = RC.TIME_DOOR_AUTOCLOSE; // temps restant avant fermeture
		this.setAutoClose(true);
	},
	
	isOver : function() {
		return this.nPhase > 3;
	},

	process : function() {
		var r = this.oRaycaster;
		switch (this.nPhase) {
			case 0: // init
				Marker.markXY(r.oDoors, this.x, this.y, this);
				this.nCode = r.getMapPhys(this.x, this.y);
				switch (this.nCode) {
					case r.PHYS_DOOR_SLIDING_DOUBLE:
						this.fSpeed = RC.TIME_DOOR_DOUBLE / r.TIME_FACTOR;
						this.nLimit = r.nPlaneSpacing >> 1;
						this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('smoothstep');
						break;
			
					case r.PHYS_DOOR_SLIDING_LEFT:
					case r.PHYS_DOOR_SLIDING_RIGHT:
						this.fSpeed = RC.TIME_DOOR_SINGLE_HORIZ / r.TIME_FACTOR;
						this.nLimit = r.nPlaneSpacing;
						this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('smoothstep');
						break;
			
					default:
						this.fSpeed = RC.TIME_DOOR_SINGLE_VERT / r.TIME_FACTOR;
						this.nLimit = r.yTexture;
						this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('smoothstep');
						break;
				}
				this.nPhase++;	/** no break on the next line */
				/** @fallthrough */

			case 1: // la porte s'ouvre jusqu'a : offset > limite
				if (this.oEasing.next().over()) {
					this.fOffset = this.nLimit - 1;
					r.setMapPhys(this.x, this.y, 0);
					this.nPhase++;
					this.oEasing.from(this.fOffset).to(0).during(this.fSpeed);
				}
				this.fOffset = this.oEasing.val() | 0;
				break;

			case 2: // la porte attend avant de se refermer   
				this.nTime -= this.nAutoclose;
				if (this.nTime <= 0) {
					// Recherche de sprites solides empechant de refermer la porte
					if (r.oMobileSectors.get(this.x, this.y).length) {
						this.nTime = this.nMaxTime >> 1;
					} else {
						r.setMapPhys(this.x, this.y, this.nCode);
						this.nPhase++;
					}
				}
				break;
		
			case 3: // la porte se referme
				if (this.oEasing.next().over()) {
					this.terminate();
				}
				this.fOffset = this.oEasing.val();
				break;
		}
		r.setMapOffs(this.x, this.y, this.fOffset | 0);
	},

	/** Fermeture de la porte
	 * @param bForce force la fermeture en cas de présence de mobile
	 */
	close : function(bForce) {
		this.nTime = 0;
		if (bForce && this.nPhase === 2) {
			this.nPhase++;
		}
	},
	
	/** Position le flag autoclose
	 * @param n nouvelle valeur du flag
	 * 0: pas d'autoclose : la porte reste ouverte
	 * 1: autoclose : la porte se referme après le délai normal imparti
	 */
	setAutoClose : function(n) {
		this.nAutoclose = n ? this.oRaycaster.TIME_FACTOR : 0;
	},
	
	terminate : function() {
		// en phase 0 rien n'a vraiment commencé : se positionner en phase 4 et partir
		if (this.nPhase === 0) {
			this.nPhase = 4;
			Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
			return;
		}
		this.fOffset = 0;
		Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
		this.nPhase = 4;
		this.oRaycaster.setMapOffs(this.x, this.y, 0);
		this.oRaycaster.setMapPhys(this.x, this.y, this.nCode);
	}
});

/* globals O2, O876, O876_Raycaster, CONFIG, Marker */
/**
 * @class O876_Raycaster.GameAbstract
 * @extends O876_Raycaster.Engine
 *
 *
 *
 *
 *
 * EVENTS :

 init
 - pas de paramètre
 Appelé au démarrage du jeu


 error
 - message : libellé du message
 - data : exception ayant déclenché l'erreur
 Appelé dès qu'une exception non gérée est déclenchée




 leveldata
 - data : objet à remplir contenant le niveau qu'il faut charger


 load
 - phase : numéro de phase
 - progress : progression de la phase
 - max : maximuml de la valeur de progression possible


 enter
 - pas de paramètre
 se lance lorsqu'on entre dans le niveau.
 tout les objets sont chargés/instanciés à ce niveau.


 doomloop
 - pas de paramètre
 se lance à chaque update des entités.


 frame
 - pas de paramètre
 se lance chaque fois qu'une frame est rendue.


 framecount
 - fps : nombre d'image par seconde actuellement calculé
 - avg : moyenne des images par secondes
 - time : temps écoulé
 permet d'obtenir des information sur les performances.


 key.down & key.up
 - k : code de la touche
 permet de déterminer facilement lorsqu'une touche est appuyée ou relachée.


 door
 - x & y : position de la porte
 - door : effet permettant de refermer manuellement la porte
 se déclenche à l'ouverture d'une porte.



 *
 */
O2.extendClass('O876_Raycaster.GameAbstract', O876_Raycaster.Engine, {
	_oScreenShot: null,
	_oTagData: null,
	_sTag: '',
	_xTagProcessing: 0,
	_yTagProcessing: 0,
	_oMapData: null,

	/** 
	 * Evènement apellé lors de l'initialisation du jeu
	 * Appelé une seule fois.
	 */
	onInitialize: function() {
		this.on('tag', this.onTagTriggered.bind(this));
		if ('init' in this) {
			this.init();
		}
		this.trigger('init');
	},

	
	_halt: function(sError, oError) {
		__inherited(sError, oError);
		if (sError) {
			this.trigger('error', {message: sError, data: oError});
		}
	},

	
	/**
	 * Evènement appelé lors du chargement d'un niveau,
	 * cet évènement doit renvoyer des données au format du Raycaster.
	 * @return object
	 */
	onRequestLevelData: function() {
		var wd = {data: {}};
		this.trigger('leveldata', wd);
		return wd.data;
	},


	
	/**
	 * Evènement appelé quand une ressource et chargée
	 * sert à faire des barres de progressions
	 */
	onLoading: function(sPhase, nProgress, nMax) {
		this.trigger('load', { phase: sPhase, progress: nProgress, max: nMax });
	},
	
	/**
	 * Evènement appelé lorsqu'un niveau a été chargé
	 * Permet l'initialisation des objet nouvellement créés (comme la caméra)
	 */
	onEnterLevel: function() {
		this.getMouseDevice(this.oRaycaster.getScreenCanvas());
		this.oRaycaster.bSky = true;
		this.oRaycaster.bFlatSky = true;
		var oCT;
		if (('controlThinker' in this._oConfig.game) && (this._oConfig.game.controlThinker)) {
			var ControlThinkerClass = O2.loadObject(this._oConfig.game.controlThinker);
			oCT = new ControlThinkerClass();
		} else {
			if (this._oConfig.game.fpsControl) {
				oCT = new O876_Raycaster.FirstPersonThinker();
			} else {
				oCT = new O876_Raycaster.CameraKeyboardThinker();
			}
			oCT.on('use.down', (function() {
				this.oGame.activateWall(this.oMobile);    
			}).bind(oCT));
		}
		oCT.oGame = this;
		var oCamera = this.oRaycaster.oCamera;
		oCamera.setThinker(oCT);
		oCamera.setXY(oCamera.x, oCamera.y);
		// Tags data
		var iTag, oTag;
		var aTags = this.oRaycaster.aWorld.tags;
		this._oMapData = Marker.create();
		this._oTagData = Marker.create();
		for (iTag = 0; iTag < aTags.length; ++iTag) {
			oTag = aTags[iTag];
			Marker.markXY(this._oTagData, oTag.x, oTag.y, oTag.tag);
		}
		// decals
		var oRC = this.oRaycaster;
		if ('decals' in oRC.aWorld) {
			oRC.aWorld.decals.forEach(function(d) {
				var x = d.x;
				var y = d.y;
				var nSide = d.side;
				var sImage = d.tile;
				oRC.cloneWall(x, y, nSide, function(rc, oCanvas, xw, yw, sw) {
					var oImage = rc.oHorde.oTiles[sImage].oImage;
					var wt = rc.oHorde.oTiles[sImage].nWidth;
					var ht = rc.oHorde.oTiles[sImage].nHeight;
					oCanvas.getContext('2d').drawImage(
						oImage,
						0,
						0,
						wt,
						ht,
						(rc.xTexture - wt) >> 1, 
						(rc.yTexture - ht) >> 1, 
						wt,
						ht
					);
				});
			});
		}
		this.oRaycaster.oCamera.fSpeed = 6;
		this.setDoomloop('stateTagProcessing');
	},

	stateTagProcessing: function() {
		var nSize = this.oRaycaster.nMapSize;
		var x = this._xTagProcessing;
		var y = this._yTagProcessing;
		var nStart = Date.now();
		var nStepMax = 10;
		var nStep = 0;
		var tf = this.TIME_FACTOR;
		while (y < nSize) {
			while (x < nSize) {
				this.triggerTag(x, y, this.getBlockTag(x, y), true);
				++x;
				nStep = (nStep + 1) % nStepMax;
				if (nStep === 0 && (Date.now() - nStart) >= tf) {
					this._xTagProcessing = x;
					this._yTagProcessing = y;
					this.onLoading('tag', y * nSize + x, nSize * nSize);
					return;
				}
			}
			++y;
			x = 0;
		}
		this.setDoomloop('stateRunning', this._oConfig.game.doomLoop);
		this.trigger('enter');
	},


	/**
	 * Evènement appelé par le processeur
	 * Ici on lance les animation de textures
	 */
	onDoomLoop: function() {
		this._processKeys();
		this.oRaycaster.textureAnimation();
		this.trigger('doomloop');
	},
	
	
	/** 
	 * Evènement appelé à chaque changement de tag
	 * Si on entre dans une zone non taggée, la valeur du tag sera une chaine vide
	 * @param int x
	 * @param int y position du tag
	 * @param string sTag valeur du tag 
	 */
	onTagTriggered: function(x, y, sTag) {
		if (sTag) {
			var rc = this.oRaycaster;
			var oMsg = rc.addGXEffect(O876_Raycaster.GXMessage);
			oMsg.setMessage(sTag);
		}
	},
	
	
	/**
	 * Evènement appelé à chaque rendu de frame
	 */
	onFrameRendered: function() {
		this._detectTag();
		this.trigger('frame');
	},
	
	onFrameCount: function(nFPS, nAVG, nTime) {
		this.trigger('framecount', {
			fps: nFPS, 
			avg: nAVG, 
			time: nTime
		});
	},




	////// PROTECTED FUNCTIONS ////// PROTECTED FUNCTIONS ////// PROTECTED FUNCTIONS //////
	////// PROTECTED FUNCTIONS ////// PROTECTED FUNCTIONS ////// PROTECTED FUNCTIONS //////
	////// PROTECTED FUNCTIONS ////// PROTECTED FUNCTIONS ////// PROTECTED FUNCTIONS //////

	/**
	 * Reads key from keyborad device
	 * and trigger events
	 */
	_processKeys: function() {
		var nKey = this.getKeyboardDevice().inputKey();
		if (nKey > 0) {
			this.trigger('key.down', {k: nKey});
		} else if (nKey < 0) {
			this.trigger('key.up', {k: -nKey});
		}
	},

	/**
	 * Effectue une vérification du block actuellement traversé
	 * Si on entre dans une zone taggée (ensemble des blocks contigüs portant le même tag), on déclenche l'évènement.
	 */
	_detectTag: function() {
		var rc = this.oRaycaster;
		var rcc = rc.oCamera;
		var x = rcc.xSector;
		var y = rcc.ySector;
		var sTag = this.getBlockTag(x, y);
		if (sTag && sTag !== this._sTag) {
			sTag = this.triggerTag(x, y, sTag);
		}
		this._sTag = sTag;
	},
	

	////// RAYCASTER PUBLIC API ////// RAYCASTER PUBLIC API ////// RAYCASTER PUBLIC API //////
	////// RAYCASTER PUBLIC API ////// RAYCASTER PUBLIC API ////// RAYCASTER PUBLIC API //////
	////// RAYCASTER PUBLIC API ////// RAYCASTER PUBLIC API ////// RAYCASTER PUBLIC API //////
	
	/**
	 * Affiche un message popup
	 * @param string sMessage contenu du message
	 */
	popupMessage: function(sMessage, oVariables) {
		var rc = this.oRaycaster;
		var r;
		if (oVariables !== undefined) {
			for (var v in oVariables) {
				r = new RegExp('\\' + v, 'g');
				sMessage = sMessage.replace(r, oVariables[v]);
			}
		}
		// suppression des ancien messages;
		rc.oEffects.removeEffect(function(e) {
			return e.sClass === 'Message';
		});

		var oMsg = rc.addGXEffect(O876_Raycaster.GXMessage);
		oMsg.setMessage(sMessage);
		this._sLastPopupMessage = sMessage;
		return oMsg;
	},
	
	/**
	 * permet de définir l'apparence des popups
	 * l'objet spécifié peut contenir les propriété suivantes :
	 * - background : couleur de fond
	 * - border : couleur de bordure
	 * - text : couleur du texte
	 * - shadow : couleur de l'ombre du texte
	 * - width : taille x
	 * - height : taille y
	 * - speed : vitesse de frappe
	 * - font : propriété de police
	 * - position : position y du popup
	 */
	setPopupStyle: function(oProp) {
		var sProp = '';
		var gmxp = O876_Raycaster.GXMessage.prototype.oStyle;
		for (sProp in oProp) {
			gmxp[sProp] = oProp[sProp];
		}
	},


	/**
	 * Effectue un screenshot de l'écran actuellement rendu
	 * L'image (canvas) générée est stockée dans la propriété _oScreenShot
	 * @param bPure si true, alors l'image est redessinée (sans les effect GX et sans la 3D)
	 */
	screenShot: function(w, h) {
		if (w === undefined) {
			w = 192;
		}
		this.oRaycaster.drawScreen();
		var oCanvas = O876.CanvasFactory.getCanvas();
		var wr = this.oRaycaster.xScrSize;
		var hr = this.oRaycaster.yScrSize << 1;
		h = h || (hr * w / wr | 0);
		oCanvas.width = w;
		oCanvas.height = h;
		var oContext = oCanvas.getContext('2d');
		oContext.drawImage(this.oRaycaster.getRenderCanvas(), 0, 0, wr, hr, 0, 0, w, h);
		return this._oScreenShot = oCanvas;
	},

	/**
	 * TriggerTag
	 * Active volontaire le tag s'il existe à la position spécifiée
	 */
	triggerTag: function(x, y, sTag, bInit) {
		if (sTag) {
			var aTags = sTag.split(';');
			var sNewTag = aTags.filter(function(s) {
				var aTag = s.replace(/^ +/, '').replace(/ +$/, '').split(' ');
				var sCmd = aTag.shift();
				var oData = {x: x, y: y, data: aTag.join(' '), remove: false};
				var aEvent = [(bInit ? 'i' : '') + 'tag', sCmd];
				this.trigger(aEvent.join('.'), oData);
				return !oData.remove;
			}, this).join(';');
			if (this.getBlockTag(x, y) != sTag) {
				throw new Error('tag modification is not allowed during trigger phase... [x: ' +x + ', y: ' + y + ', tag: ' + this.getBlockTag(x, y) + ']');
			}
			this.setBlockTag(x, y, sNewTag);
			return sNewTag;
		} else {
			return sTag;
		}
	},


	/**
	 * Répond à l'évènement : le player à activé un block mural (celui en face de lui) 
	 * Si le block mural activé est porteur d'un tag : déclencher l'evènement onTagTriggered
	 * Si le block est une porte : ouvrir la porte 
	 */
	activateWall: function(m) {
		var oBlock = m.getFrontCellXY();
		var x = oBlock.x;
		var y = oBlock.y;
		if (this.isDoor(x, y)) {
			var oEffect = this.openDoor(x, y);
			if (oEffect) {
				this.trigger('door', {x: x, y: y, door: oEffect});
			}
		}
		this.triggerTag(x, y, this.getBlockTag(x, y));
	},

	/**
	 * Renvoie le tag associé au block
	 * @param int x
	 * @param int y position du block qu'on interroge
	 */
	getBlockTag: function(x, y, sSeek) {
		var s = this.oRaycaster.nMapSize;
		if (x >= 0 && y >= 0 && x < s && y < s) {
			var sTag = Marker.getMarkXY(this._oTagData, x, y);
			if (sTag === undefined) {
				return '';
			}
			if (sSeek !== undefined) {
				var sFound = null;
				sTag.split(';').some(function(t) {
					var a = t.split(' ');
					var s = a.shift();
					if (s == sSeek) {
						sFound = a.join(' ');
						return true;
					}
					return false;
				});
				return sFound;
			} else {
				return sTag;
			}
		} else {
			return null;
		}
	},

	/**
	 * Ajoute un tag de block
	 * si le tag est null on le vire
	 * @param int x
	 * @param int y position du block
	 * @param string sTag tag
	 */
	setBlockTag: function(x, y, sTag) {
		var s = this.oRaycaster.nMapSize;
		if (x >= 0 && y >= 0 && x < s && y < s) {
			Marker.markXY(this._oTagData, x, y, sTag);
		} else {
			return null;
		}		
	},

	/**
	 * sets or gets values from the map data array
	 * @param x {int} block coordinates
	 * @param y {int}
	 * @param sVariable {string} variable name
	 * @param xValue {*} variable value
	 */
	mapData: function(x, y, sVariable, xValue) {
		var s = this.oRaycaster.nMapSize;
		var md = this._oMapData;
		var oVars, bDefined;
		if (x >= 0 && y >= 0 && x < s && y < s) {
			oVars = Marker.getMarkXY(md, x, y);
			bDefined = typeof oVars === 'object';
			if (xValue === undefined) {
				// getting variable
				if (bDefined) {
					return oVars[sVariable];
				} else {
					return null;
				}
			} else {
				// setting variable
				if (bDefined) {
					oVars[sVariable] = xValue;
				} else {
					oVars = {};
					oVars[sVariable] = xValue;
					Marker.markXY(md, x, y, oVars);
				}
			}
		}
	}
});

O2.mixin(O876_Raycaster.GameAbstract, O876.Mixin.Events);

/**
 * Ce thinker permet de bouger un mobile en définissant un vecteur de vitesse.
 * Il ne dispose d'aucune intelligence artificielle Ce thinker a été conçu pour
 * être utilisé comme Thinker de base dans un environnement réseau. Le thinker
 * propose les fonction suivantes : - setSpeed(x, y) : définiiton de la vitesse
 * du mobile selon les axes X et Y - die() : le mobile passe à l'état DEAD (en
 * jouant l'animation correspondante - disable() : le mobile disparait -
 * restore() : le mobile réapparait dans la surface de jeux
 */
O2.extendClass('O876_Raycaster.CommandThinker', O876_Raycaster.Thinker, {

	fma : 0, // Moving Angle
	fms : 0, // Moving Speed

	nDeadTime : 0,

	ANIMATION_STAND : 0,
	ANIMATION_WALK : 1,
	ANIMATION_ACTION : 2,
	ANIMATION_DEATH : 3,

	setMovement : function(a, s) {
		if (this.fma !== a || this.fms !== s) {
			this.fma = a;
			this.fms = s;
			var oSprite = this.oMobile.oSprite;
			var nAnim = oSprite.nAnimationType;
			var bStopped = s === 0;
			switch (nAnim) {
				case this.ANIMATION_ACTION:
				case this.ANIMATION_STAND:
					if (!bStopped) {
						oSprite.playAnimationType(this.ANIMATION_WALK);
					}
				break;
				
				case this.ANIMATION_WALK:
					if (bStopped) {
						oSprite.playAnimationType(this.ANIMATION_STAND);
					}
				break;
			}
		}
	},

	die : function() {
		this.setMovement(this.fma, 0);
		this.oMobile.oSprite.playAnimationType(this.ANIMATION_DEATH);
		this.oMobile.bEthereal = true;
		this.nDeadTime = this.oMobile.oSprite.oAnimation.nDuration * this.oMobile.oSprite.oAnimation.nCount;
		this.think = this.thinkDying;
	},

	disable : function() {
		this.thinkDisable();
	},

	restore : function() {
		this.oMobile.bEthereal = false;
		this.think = this.thinkAlive;
	},

	think : function() {
		this.restore();
	},

	thinkAlive : function() {
		var m = this.oMobile;
		m.move(this.fma,this.fms);
		if (this.oGame.oRaycaster.clip(m.x, m.y, 1)) {
			m.rollbackXY();
		}
	},

	thinkDisable : function() {
		this.oMobile.bEthereal = true;
		this.nDeadTime = 0;
		this.think = this.thinkDying;
	},

	thinkDying : function() {
		this.nDeadTime -= this.oGame.TIME_FACTOR;
		if (this.nDeadTime <= 0) {
			this.oMobile.gotoLimbo();
			this.think = this.thinkDead;
		}
	},

	thinkDead : function() {
		this.oMobile.bActive = false;
	}
});

/**
 * @class O876_Raycaster.FirstPersonThinker
 */
O2.extendClass('O876_Raycaster.FirstPersonThinker', O876_Raycaster.Thinker,
{
    aCommands : null,
    oBinds: null,
    aKeyBindings: null, // binds keycodes to symbolic events
    aKeyBoundList: null, // keeps a list of bound key
	nMouseSensitivity: 166,
	_bFrozen: false,

	__construct : function() {
		this.defineKeys( {
			forward : [KEYS.ALPHANUM.Z, KEYS.ALPHANUM.W],
			backward : KEYS.ALPHANUM.S,
			left : [KEYS.ALPHANUM.Q, KEYS.ALPHANUM.A],
			right : KEYS.ALPHANUM.D,
			use : KEYS.SPACE
		});
		this.on('forward.command', (function() {
			this.oMobile.moveForward();
			this.checkCollision();
		}).bind(this));
		this.on('left.command', (function() {
			this.oMobile.strafeLeft();
			this.checkCollision();
		}).bind(this));
		this.on('right.command', (function() {
			this.oMobile.strafeRight();
			this.checkCollision();
		}).bind(this));
		this.on('backward.command', (function() {
			this.oMobile.moveBackward();
			this.checkCollision();
		}).bind(this));
		MAIN.pointerlock.on('mousemove', this.readMouseMovement.bind(this));
	},

    bindKey: function(nKey, sEvent) {
        if (this.aKeyBindings === null) {
            this.aKeyBindings = [];
        }
        if (this.aKeyBoundList === null) {
            this.aKeyBoundList = [];
        }
        if (this.aCommands === null) {
            this.aCommands = [];
        }
        this.aKeyBindings[nKey] = [sEvent, 0];
        this.aCommands[sEvent] = false;
        if (this.aKeyBoundList.indexOf(nKey) < 0) {
            this.aKeyBoundList.push(nKey);
        }
    },

    /**
     * Define keys that will be used to control the mobile on which is applied this Thinker
     * @param a is an object matching KEY CODES and Event names
     */
    defineKeys : function(a) {
        var i, l;
        for (var sEvent in a) {
            if (Array.isArray(a[sEvent])) {
                l = a[sEvent].length;
                for (i = 0; i < l; ++i) {
                    this.bindKey(a[sEvent][i], sEvent);
                }
            } else {
                this.bindKey(a[sEvent], sEvent);
            }
        }
    },

    getCommandStatus : function(sEvent) {
        return this.aCommands[sEvent];
    },

    updateKeys : function() {
        var sKey = '', nKey, sProc, aButton;
        var aCmds = this.aCommands;
        var oKbd = this.oGame.getKeyboardDevice();
        var aKeyData;
        var sEvent;
        var kbl = this.aKeyBoundList;
        var kb = this.aKeyBindings;
        for (var iKey = 0, l = kbl.length; iKey < l; ++iKey) {
            nKey = kbl[iKey];
            aKeyData = kb[nKey];
            sEvent = aKeyData[0];
            sProc = '';
            switch (oKbd.getKey(nKey)) {
                case 1: // down
                    if (aKeyData[1] === 0) {
                        sProc = sEvent + '.down';
                        aCmds[sEvent] = true;
                        aKeyData[1] = 1;
                    }
                    break;

                case 2: // Up
                    if (aKeyData[1] === 1) {
                        sProc = sEvent + '.up';
                        aCmds[sEvent] = false;
                        aKeyData[1] = 0;
                    }
                    break;
                default:
                    sProc = '';
                    break;
            }
            if (sProc) {
                this.trigger(sProc);
            }
        }
        var oMouse = this.oGame.getMouseDevice();
        while (aButton = oMouse.readMouse()) {
            nKey = aButton[3];
            sEvent = 'button' + nKey;
            sProc = '';
            switch (aButton[0]) {
                case 1: // button down
                    sProc = sEvent + '.down';
                    this.aCommands[sEvent] = true;
                    break;

                case 0: // button up
                    sProc = sEvent + '.up';
                    this.aCommands[sEvent] = false;
                    break;

                case 3:
                    sProc = 'wheel.up';
                    break;

                case -3:
                    sProc = 'wheel.down';
                    break;

                default:
                    sProc = '';
                    break;
            }
            if (sProc) {
                this.trigger(sProc);
            }
        }
        for (sEvent in this.aCommands) {
            if (this.aCommands[sEvent]) {
                sProc = sEvent + '.command';
                if (sProc) {
                    this.trigger(sProc);
                }
            }
        }
    },


	readMouseMovement: function(oEvent) {
		if (!this._bFrozen) {
			this.oMobile.rotate(oEvent.x / this.nMouseSensitivity);
		}
	},

	/**
	 * Freezes all movement and rotation
	 */
	freeze: function() {
		this._bFrozen = true;
	},

	/**
	 * if frozen then back to normal
	 */
	thaw: function() {
		this._bFrozen = false;
	},

	think: function() {
		if (!this._bFrozen) {
			this.updateKeys();
		}
	},

	checkCollision: function() {
		if (this.oMobile.oMobileCollision !== null) {
			var oTarget = this.oMobile.oMobileCollision;
			if (oTarget.oSprite.oBlueprint.nType !== RC.OBJECT_TYPE_MISSILE) {
				this.oMobile.rollbackXY();
			}
		}
	}
});

O2.mixin(O876_Raycaster.FirstPersonThinker, O876.Mixin.Events);
/** Interface de controle des mobile par clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Se sert d'un device keyboard pour bouger le mobile
 */
O2.extendClass('O876_Raycaster.KeyboardThinker', O876_Raycaster.Thinker, {
	aCommands : null,
	oBinds: null,
	aKeyBindings: null, // binds keycodes to symbolic events
	aKeyBoundList: null, // keeps a list of bound key
	
	
	bindKey: function(nKey, sEvent) {
		if (this.aKeyBindings === null) {
			this.aKeyBindings = [];
		}
		if (this.aKeyBoundList === null) {
			this.aKeyBoundList = [];
		}
		if (this.aCommands === null) {
			this.aCommands = [];
		}
		this.aKeyBindings[nKey] = [sEvent, 0];
		this.aCommands[sEvent] = false;
		if (this.aKeyBoundList.indexOf(nKey) < 0) {
			this.aKeyBoundList.push(nKey);
		}
	},

	/**
	 * Define keys that will be used to control the mobile on which is applied this Thinker
	 * @param a is an object matching KEY CODES and Event names
	 */
	defineKeys : function(a) {
		var sEvent, i, l;
		for (var sEvent in a) {
			if (Array.isArray(a[sEvent])) {
				l = a[sEvent].length;
				for (i = 0; i < l; ++i) {
					this.bindKey(a[sEvent][i], sEvent);
				}
			} else {
				this.bindKey(a[sEvent], sEvent);
			}
		}
	},
	
	getCommandStatus : function(sEvent) {
		return this.aCommands[sEvent];
	},

	updateKeys : function() {
		var sKey = '', nKey, sProc, pProc, aButton;
		var aKeys = this.oKeys;
		var aCmds = this.aCommands;
		var oKbd = this.oGame.getKeyboardDevice();
		var aKeyData;
		var sEvent;
		var kbl = this.aKeyBoundList;
		var kb = this.aKeyBindings;
		for (var iKey = 0, l = kbl.length; iKey < l; ++iKey) {
			nKey = kbl[iKey];
			aKeyData = kb[nKey];
			sEvent = aKeyData[0];
			sProc = '';
			switch (oKbd.getKey(nKey)) {
				case 1: // down
					if (aKeyData[1] === 0) {
						sProc = sEvent + '.down';
						aCmds[sEvent] = true;
						aKeyData[1] = 1;
					}
					break;
		
				case 2: // Up
					if (aKeyData[1] == 1) {
						sProc = sEvent + '.up';
						aCmds[sEvent] = false;
						aKeyData[1] = 0;
					}
					break;
				default:
					sProc = '';
					break;
			}
			if (sProc) {
				this.trigger(sProc);
			}
		}
		for (sEvent in this.aCommands) {
			if (this.aCommands[sEvent]) {
				sProc = sEvent + '.command';
				if (sProc) {
					this.trigger(sProc);
				}
			}
		}
	}
});

O2.mixin(O876_Raycaster.KeyboardThinker, O876.Mixin.Events);

/** Classe de déplacement automatisé et stupidité artificielle des mobiles
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * 
 * Classe spécialisée dans le déplacement des missile
 * Un missile possède deux animation 0: die 1: go
 * Ce thinker gère le dispenser.
 * Réécrire les methode advance et thinkHit pour personnaliser les effets
 */
O2.extendClass('O876_Raycaster.MissileThinker', O876_Raycaster.Thinker, {
  oOwner: null,				// Mobile a qui appartient ce projectile
  nExplosionTime: 0,		// Compteur d'explosion
  nExplosionMaxTime: 4,		// Max du compteur d'explosion (recalculé en fonction de la durée de l'anim)
  bExiting: true,			// Temoin de sortie du canon pour eviter les fausse collision avec le tireur
  oLastHitMobile: null,		// Dernier mobile touché
  nStepSpeed: 4,			// Nombre de déplacement par frame

  ANIMATION_MOVING: 0,
  ANIMATION_EXPLOSION: 1,

  nLifeOut: 0,
  
  __construct: function() {
    this.think = this.thinkIdle;
  },

  /** Renvoie true si le missile collisionne un objet ou un mur
   */
  isCollisioned: function() {
    var bWallCollision = this.oMobile.bWallCollision;  // collision murale
    var bMobileCollision = this.oMobile.oMobileCollision !== null;                        // collision avec un mobile
    var nTargetType = bMobileCollision ? this.oMobile.oMobileCollision.getType() : 0;
    var bOwnerCollision = this.oMobile.oMobileCollision === this.oOwner;                   // collision avec le tireur
    var bSolidCollision = bMobileCollision &&                                             // collision avec un mobile solide (non missile, et non item)
      nTargetType !== RC.OBJECT_TYPE_MISSILE &&
      nTargetType !== RC.OBJECT_TYPE_ITEM;

    if (bWallCollision) {
      this.oMobile.oMobileCollision = null;
      return true;
    }

    if (bOwnerCollision && !this.bExiting) {
      return true;
    }

    if (this.bExiting) {
      this.bExiting = bOwnerCollision;
      return false;
    }

    if (bSolidCollision) {
      return true;
    }
    return false;
  },
  
  advance: function() {
    this.oMobile.moveForward();
  },
  
  explode: function() {
    this.oLastHitMobile = this.oMobile.oMobileCollision;
    this.oMobile.rollbackXY();
    this.oMobile.oSprite.playAnimationType(this.ANIMATION_EXPLOSION);
    this.nExplosionTime = 0;
    this.nExplosionMaxTime = this.oMobile.oSprite.oAnimation.nDuration * this.oMobile.oSprite.oAnimation.nCount;
    this.oMobile.bEthereal = true;
    this.think = this.thinkHit;
  },

  extinct: function() {
    this.oMobile.bEthereal = true;
    this.oMobile.gotoLimbo();
    this.oMobile.oSprite.playAnimationType(-1);
    this.think = this.thinkIdle;
  },

  fire: function(oMobile) {
    this.bExiting = true;
    this.oOwner = oMobile;
    this.oMobile.oSprite.playAnimationType(this.ANIMATION_MOVING);
    this.oMobile.bSlideWall = false;
    this.oMobile.bEthereal = false;
    this.think = this.thinkGo;
    this.advance();
  },

  thinkGo: function() {
	if (this.nLifeOut < this.oGame.nTime) {
      this.extinct();
      return;
	}
    //for (var i = 0; i < this.nStepSpeed; i++) {
      this.advance();
      if (this.isCollisioned()) {
        this.explode();
        //break;
      }
    //}
  },

  thinkHit: function() {
    this.nExplosionTime += this.oGame.TIME_FACTOR;
    if (this.nExplosionTime >= this.nExplosionMaxTime) {		
      this.oMobile.gotoLimbo();
      this.think = this.thinkIdle;
    }
  },

  thinkIdle: function() {
    this.oMobile.bActive = false;
  }
});

/**
 * This thinker uses DeviceMotion event to control the player point of view
 */
O2.extendClass('O876_Raycaster.MotionThinker', O876_Raycaster.Thinker,
{
	
	oMotionDevice: null,
	
	__construct : function() {
		var md = new O876_Raycaster.MotionDevice();
		var nMin = 1;
		var nMax = 4;
		md.getAngleRange('alpha', 0).setRange(-nMin, -nMax, true);
		md.getAngleRange('alpha', 1).setRange(nMin, nMax, false);
		md.getAngleRange('beta', 0).setRange(-nMin, -nMax, true);
		md.getAngleRange('beta', 1).setRange(nMin, nMax, false);
		md.getAngleRange('gamma', 0).setRange(-nMin, -nMax, true);
		md.getAngleRange('gamma', 1).setRange(nMin, nMax, false);
		md.plugHandlers();
		this.oMotionDevice = md;
	},

	think: function() {
		var alpha = this.oMotionDevice.getAngleValue('alpha');
		var beta = this.oMotionDevice.getAngleValue('beta');
		var gamma = this.oMotionDevice.getAngleValue('gamma');
		if (gamma < 0) {
			// backward
			this.oMobile.fSpeed = Math.abs(gamma) * 4;
			this.oMobile.moveBackward();
			this.checkCollision();
		} else if (gamma > 0) {
			// forward
			this.oMobile.fSpeed = Math.abs(gamma) * 4;
			this.oMobile.moveForward();
			this.checkCollision();
		}
		if (beta != 0) {
			if (Math.abs(beta) < 0.5) {
				this.oMobile.fSpeed = Math.abs(beta) * 4;
				if (beta < 0) {
					this.oMobile.strafeLeft();
					this.checkCollision();
				} else {
					this.oMobile.strafeRight();
					this.checkCollision();
				}
			} else {
				this.oMobile.rotate(beta / 20);
			}
		}
	},

	checkCollision: function() {
		if (this.oMobile.oWallCollision.x || this.oMobile.oWallCollision.y) {
			var fc = this.oMobile.getFrontCellXY();
			this.oGame.openDoor(fc.x, fc.y);
		}
		if (this.oMobile.oMobileCollision !== null) {
			var oTarget = this.oMobile.oMobileCollision;
			if (oTarget.oSprite.oBlueprint.nType != RC.OBJECT_TYPE_MISSILE) {
				this.oMobile.rollbackXY();
			}
		}
	}
});


O2.mixin(O876_Raycaster.MotionThinker, O876.Mixin.Events);

/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger le mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 */
O2.extendClass('O876_Raycaster.NonLinearThinker', O876_Raycaster.Thinker, {
	_oEasingX: null,
	_oEasingY: null,
	_oEasingA: null,

	_aStart: 0,

	/**
	 * Initie un déplacement
	 * @param x coord de départ
	 * @param y ...
	 * @param a angle départ
	 * @param dx coord relative arrivée
	 * @param dy ...
	 * @param t temps requies pour effectué le déplacement
	 * @param s fonction easing
	 */
	setMove: function(x, y, a, dx, dy, fa, t, s) {
		if (x === null || x === undefined) {
			x = this.oMobile.x;
		}
		if (y === null || y === undefined) {
			y = this.oMobile.y;
		}
		if (a === null || a === undefined) {
			a = this.oMobile.fTheta;
		}
		if (fa === null || fa === undefined) {
			fa = this.oMobile.fTheta;
		}
		this._oEasingX = this._oEasingX || new O876.Easing();
		this._oEasingY = this._oEasingY || new O876.Easing();
		this._oEasingA = this._oEasingA || new O876.Easing();
		var tf = this.oGame.oRaycaster.TIME_FACTOR;
		this._oEasingX.from(x).to(x + dx).during(t / tf | 0).use(s || 'smoothstep');
		this._oEasingY.from(y).to(y + dy).during(t / tf | 0).use(s || 'smoothstep');
		this._oEasingA.from(a).to(fa).during(t / tf | 0).use(s || 'smoothstep');
	},

	think : function() {
		this.think = this.thinkInit;
	},

	// Déplacement à la position de départ
	thinkInit : function() {
		this.think = this.thinkMove;
	},
	
	thinkMove: function() {
		if (this._oEasingX && this._oEasingY) {
			var bx = this._oEasingX.next().over();
			var by = this._oEasingY.next().over();
			var x = this._oEasingX.val();
			var y = this._oEasingY.val();
			var a = this._oEasingA.next().val();
			this.oMobile.setXY(x, y);
			this.oMobile.setAngle(a);
			if (bx && by) {
				this.think = this.thinkStop;
			}
		}
	},

	thinkStop: function() {
	},
	
	thinkIdle: function() {
	}
});

O2.extendClass('O876_Raycaster.CameraKeyboardThinker', O876_Raycaster.KeyboardThinker,
{
	nRotationTime : 0,
	nRotationMask : 0,
	nRotationLeftTime : 0,
	nRotationRightTime : 0,
	
	fRotationSpeed: 0.1,

	ROTATION_MASK_LEFT : 0,
	ROTATION_MASK_RIGHT : 1,
	ROTATION_MASK_FORWARD : 2,
	ROTATION_MASK_BACKWARD : 3,

	__construct : function() {
		this.defineKeys( {
			forward : KEYS.UP,
			backward : KEYS.DOWN,
			left : KEYS.LEFT,
			right : KEYS.RIGHT,
			use : KEYS.SPACE,
			strafe : KEYS.ALPHANUM.C
		});
		this.on('forward.command', this.forwardCommand.bind(this));
		this.on('left.command', this.leftCommand.bind(this));
		this.on('right.command', this.rightCommand.bind(this));
		this.on('strafe.down', this.strafeDown.bind(this));
		this.on('strafe.up', this.strafeUp.bind(this));
		this.on('backward.command', this.backwardCommand.bind(this));
		this.on('forward.down', this.forwardDown.bind(this));
		this.on('backward.down', this.backwardDown.bind(this));
		this.on('left.down', this.leftDown.bind(this));
		this.on('right.down', this.rightDown.bind(this));
		this.on('forward.up', this.forwardUp.bind(this));
		this.on('backward.up', this.backwardUp.bind(this));
		this.on('left.up', this.leftUp.bind(this));
		this.on('right.up', this.rightUp.bind(this));
	},

	setRotationMask : function(nBit, bValue) {
		var nMask = 1 << nBit;
		var nNotMask = 255 ^ nMask;
		if (bValue) {
			this.nRotationMask |= nMask;
		} else {
			this.nRotationMask &= nNotMask;
			if (this.nRotationMask === 0) {
				this.nRotationTime = 0;
			}
		}
	},

	think: function() {
		this.updateKeys();
	},

	checkCollision: function() {
		if (this.oMobile.oMobileCollision !== null) {
			var oTarget = this.oMobile.oMobileCollision;
			if (oTarget.oSprite.oBlueprint.nType != RC.OBJECT_TYPE_MISSILE) {
				this.oMobile.rollbackXY();
			}
		}
	},

	forwardCommand: function() {
		this.processRotationSpeed();
		this.oMobile.moveForward();
		this.checkCollision();
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},

	leftCommand: function() {
		this.processRotationSpeed();
		this.setRotationMask(this.ROTATION_MASK_LEFT, true);
		if (this.bStrafe) {
			this.oMobile.strafeLeft();
			this.checkCollision();
		} else {
			this.oMobile.rotateLeft();
		}
	},

	rightCommand: function() {
		this.processRotationSpeed();
		this.setRotationMask(this.ROTATION_MASK_RIGHT, true);
		if (this.bStrafe) {
			this.oMobile.strafeRight();
			this.checkCollision();
		} else {
			this.oMobile.rotateRight();
		}
	},

	strafeDown: function() {
		this.bStrafe = true;
	},

	strafeUp: function() {
		this.bStrafe = false;
	},

	backwardCommand: function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
		this.oMobile.moveBackward();
		this.checkCollision();
	},

	forwardDown: function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},
	
	backwardDown: function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},
	
	leftDown: function() {
		this.setRotationMask(this.ROTATION_MASK_LEFT, true);
	},
	
	rightDown: function() {
		this.setRotationMask(this.ROTATION_MASK_RIGHT, true);
	},

	forwardUp : function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, false);
	},

	backwardUp : function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, false);
	},

	leftUp : function() {
		this.setRotationMask(this.ROTATION_MASK_LEFT, false);
	},

	rightUp : function() {
		this.setRotationMask(this.ROTATION_MASK_RIGHT, false);
	},

	processRotationSpeed : function() {
		if (this.nRotationMask !== 0) {
			this.nRotationTime++;
			switch (this.nRotationTime) {
			case 1:
				this.oMobile.fRotSpeed = this.fRotationSpeed / 4;
				break;

			case 4:
				this.oMobile.fRotSpeed = this.fRotationSpeed / 2;
				break;

			case 8:
				this.oMobile.fRotSpeed = this.fRotationSpeed;
				break;
			}
		}
	}
});
