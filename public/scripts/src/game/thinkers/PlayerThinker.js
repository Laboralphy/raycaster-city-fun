/**
 * Thinker du personnage controlé par le joueur
 */

O2.extendClass('MW.PlayerThinker', O876_Raycaster.MouseKeyboardThinker, {
	fLastMovingAngle: 0,
	fLastMovingSpeed: 0,
	fLastTheta: 0,
	nLastUpdateTime: 0,
	xLast: 0,
	yLast: 0,

	fNormalSpeed: 0,
	nDeadTime: 0,

	bActive: true,

	__construct : function() {
		this.defineKeys( {
			forward : [KEYS.ALPHANUM.Z, KEYS.ALPHANUM.W],
			backward : KEYS.ALPHANUM.S,
			left : [KEYS.ALPHANUM.Q, KEYS.ALPHANUM.A],
			right : [KEYS.ALPHANUM.D, KEYS.ALPHANUM.E],
			use : KEYS.SPACE
		});
		this.think = this.thinkAlive;
		this.on('button0.up', this.button0Up.bind(this));
		this.on('button0.down', this.button0Down.bind(this));
		this.on('button0.command', this.button0Command.bind(this));
		this.on('button2.down', this.button2Down.bind(this));
		this.on('use.down', this.useDown.bind(this));
		this.on('wheel.up', this.wheelUp.bind(this));
		this.on('wheel.down', this.wheelDown.bind(this));
	},

	readMouseMovement: function(x, y) {
		this.oMobile.rotate(x / 166);
	},

	/**
	 * Retransmet les mouvements au Game
	 * Pour qu'il les renvoie au serveur
	 */
	transmitMovement: function() {
		var bUpdate = false;
		var m = this.oMobile;
		// angle de caméra
		var f = m.fTheta;
		// position
		var x = m.x;
		var y = m.y;
		// vitesse
		var fms = m.fMovingSpeed;
		var fma = m.fMovingAngle;
		var nLUD = this.oGame.getTime() - this.nLastUpdateTime;
		if (nLUD > 500) {
			if (x !== this.xLast || y !== this.yLast) {
				this.xLast = x;
				this.yLast = y;
				bUpdate = true;
			}
		}
		if (bUpdate || this.fLastMovingSpeed !== fms || this.fLastMovingAngle !== fma || this.fLastTheta !== f) {
			this.fLastMovingSpeed = fms;
			this.fLastMovingAngle = fma;
			this.fLastTheta = f;
			bUpdate = true;
		}
		if (bUpdate) {
			this.oGame.gm_movement(f, x, y, fma, fms);
			this.nLastUpdateTime = this.oGame.getTime();
		}
	},

	thinkAlive: function() {
		var m = this.oMobile;
		if (this.bActive) {
			this.updateKeys();
		}
		var nMask =
			(this.aCommands.forward || this.aCommands.forward_w ? 8 : 0) |
			(this.aCommands.backward ? 4 : 0) |
			(this.aCommands.right || this.aCommands.right_e ? 2 : 0) |
			(this.aCommands.left || this.aCommands.left_a ? 1 : 0);
		if (nMask) {
			if (this.isHeld()) {
				this.wtfHeld();
				nMask = 0;
			} else if (this.isRooted()) {
				this.wtfRoot();
				nMask = 0;
			}
		}
		m.fMovingSpeed = 0;
		switch (nMask) {
			case 1: // left
				m.move(m.fTheta - PI / 2, m.fSpeed);
				this.checkCollision();
				break;

			case 2: // right
				m.move(m.fTheta + PI / 2, m.fSpeed);
				this.checkCollision();
				break;

			case 4: // backward
			case 7:
				m.move(m.fTheta, -m.fSpeed);
				this.checkCollision();
				break;

			case 5: // backward left
				m.move(m.fTheta - 3 * PI / 4, m.fSpeed);
				this.checkCollision();
				break;

			case 6: // backward right
				m.move(m.fTheta + 3 * PI / 4, m.fSpeed);
				this.checkCollision();
				break;

			case 8: // forward
			case 11:
				m.move(m.fTheta, m.fSpeed);
				this.checkCollision();
				break;

			case 9: // forward-left
				m.move(m.fTheta - PI / 4, m.fSpeed);
				this.checkCollision();
				break;

			case 10: // forward-right
				m.move(m.fTheta + PI / 4, m.fSpeed);
				this.checkCollision();
				break;
		}
		this.transmitMovement();
	},

	/**
	 * Gestion des collision inter-mobile
	 */
	checkCollision: function() {
		if (this.oMobile.oMobileCollision !== null) {
			var oTarget = this.oMobile.oMobileCollision;
			if (oTarget.getType() !== RC.OBJECT_TYPE_MISSILE) {
				this.oMobile.rollbackXY();
				// augmenter la distance entre les mobiles qui collisionnent
				var me = this.oMobile;
				var mo = this.oMobile.oMobileCollision;
				var xme = me.x;
				var yme = me.y;
				var xmo = mo.x;
				var ymo = mo.y;
				var dx = xme - xmo;
				var dy = yme - ymo;
				var a = Math.atan2(dy, dx);
				var sdx = me.xSpeed;
				var sdy = me.ySpeed;
				me.move(a, 1);
				me.xSpeed += sdx;
				me.ySpeed += sdy;
			}
		}
	},



	button0Down: function() {
		if (this.isFree()) {
			this.oGame.gm_attack(0);
		} else {
			this.wtfHeld();
		}
		this.nChargeStartTime = this.oGame.getTime();
	},

	button0Up: function() {
		// attack
	},

	button0Command: function() {
		// attack
	},

	button2Down: function() {
		// use item
	},

	useDown: function() {
	},

	wheelUp: function() {
	},

	wheelDown: function() {
	},


	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////

	die : function() {
		this.oMobile.xSpeed = 0;
		this.oMobile.ySpeed = 0;
		this.oMobile.bEthereal = true;
		this.think = this.thinkDying;
		this.nDeadTime = 18;
		var oFadeOut = new O876_Raycaster.GXFade(this.oGame.oRaycaster);
		oFadeOut.oColor = {
			r : 128,
			g : 0,
			b : 0
		};
		oFadeOut.fAlpha = 0;
		oFadeOut.fAlphaFade = 0.05;
		this.oGame.oRaycaster.oEffects.addEffect(oFadeOut);
	},

	revive: function() {
		this.oMobile.bEthereal = false;
		this.think = this.thinkAlive;
		this.aCommands[KEYS.MOUSE.BUTTONS.LEFT] = false;
		this.oGame.gm_charge(0);
	},

	thinkDying : function() {
		--this.nDeadTime;
		if (this.nDeadTime <= 0) {
			this.think = this.thinkDead;
			this.nDeadTime = 40;
		}
	},

	thinkDead : function() {
		--this.nDeadTime;
		if (this.nDeadTime <= 0) {
			this.think = this.thinkWaitForRespawn;
		}
	},

	thinkWaitForRespawn : function() {
	},
});
