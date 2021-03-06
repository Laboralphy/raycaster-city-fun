"use strict"
/**
 * Powers : classe gérant les droit d'un utilisateur dans un canal
 */
class Powers {
	constructor() {
		this.idChannel = 0;		// identifiant du canal dans lequel s'appliquent les droits
		this.nLevel = 0;			// le niveau permet de gérer les priorité de kick
		this.bSend = false;		// envoyer messages
		this.bReceive = false;	// recevoir messages
		this.bInvite = false;		// inviter d'autre utilisateurs
		this.bKick = false;		// Ejecter un utilisateur (annulation d'une invitation)
		this.bBan = false;		// Bannir un utilisateur
		this.bUnban = false;		// Lever le bannissement
		this.bPromote = false;	// Transmettre ses pouvoirs
		this.bDemote = false;		// retirer des pouvoir à un utilisateur
		this.aRanks = ['a user', 'a moderator', 'an admnistrator', 'a super-administrator'];
	}
	
	/**
	 * Tout les pouvoir à false
	 */
	reset() {
		this.nLevel = 0;
		this.bSend = false;
		this.bReceive = false;
		this.bInvite = false;
		this.bKick = false;
		this.bBan = false;
		this.bUnban = false;
		this.bPromote = false;
		this.bDemote = false;	
	}
	
	getRankStr() {
		return this.aRanks[this.nLevel];
	}
	
	/**
	 * Augmente le niveau d'un pouvoir
	 */
	promote(oPowers) {
		if (this.bPromote && this.nLevel > oPowers.nLevel) {
			oPowers.preset(Math.min(this.nLevel, oPowers.nLevel + 1));
			return true;
		} else {
			return false;
		}
	}
	
	demote(oPowers) {
		if (this.bDemote && this.nLevel > oPowers.nLevel) {
			oPowers.preset(Math.max(0, oPowers.nLevel - 1));
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Permet de configurer des pouvoir selon une config prédéfinie.
	 * @param string sProfile nom du profil
	 * user : utilisateur normal
	 * moderator : utilisateur gérant la modération d'un canal
	 * admin : gérant ou créateur de canal
	 */
	preset(nLevel) {
		this.nLevel = nLevel;
		this.bPromote = false;
		this.bDemote = false;
		this.bInvite = false;
		this.bKick = false;
		this.bUnban = false;
		this.bBan = false;
		this.bSend = false;
		this.bReceive = false;
		
		switch (nLevel) {
			case 3:
				
			case 2:
				this.bPromote = true;
				this.bDemote = true;	
			
			case 1:
				this.bInvite = true;
				this.bKick = true;
				this.bUnban = true;
				this.bBan = true;
						
			default:
				this.bSend = true;
				this.bReceive = true;
		}
	}
}

module.exports = Powers;
