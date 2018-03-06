GETTERS



#UI


##ui/isVisible 
*{boolean}*
renvoie true si l'interface utilisateur est visible (masterswitch)

##ui/getSections
*{array}*
renvoie la listes des sections sous forme de tableau de chaînes.

##ui/isVisibleChat 
*{boolean}*
renvoie true si la fenêtre chat est visible

##ui/isVisibleLogin 
*{boolean}*
renvoie true si la fenêtre de login est visible





#CHAT

##chat/getActiveTab 
*{id, name}*
renvoie une strucutre décrivant l'onglet actif.
la structure contient {id, name} pour l'identifiant et le label afiché sur l'onglet





#CLIENTS

##clients/getLocalClient
*{id, name}*
renvoie une structure décrivant le client identifié sur ce poste.
