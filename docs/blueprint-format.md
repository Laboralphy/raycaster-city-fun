#Format des blueprints

##Description
Un blueprint est un template de mobile. 
C'est une structure écrite en JSON qui défini les caractéristique d'une entité mobile.

##Format

###Structure

```textt/json
{
  "type": int,
  "tile": string,
  "width": int,
  "height": int,
  "fx": int,
  "tangibility": {
    "self" : int,
    "mask" : int
  },
  "speed": int
}
```

###Détails
- **type**: type de l'entité. se référer au fichier de constantes __raycaster.js__  accepte comme valeur l'une des constante _mobile_type..._
- **tile**: référence de la tile utilisée pour l'aspect graphique
- **width**: taille physique de l'entité (nécessaire pour le calcul des collisions)
- **height**: hauteur physique de l'entité (inutilisé, toujours 96)
- **fx**: effet spéciaux de rendu de l'entité, c'est un masque binaire de constantes. voir le fichier de constantes raycaster.js et regarder les constante *fx..* 
- **tangibility**: la tangibilité est définie par deux nombres. (voir exemple plus loin) 
    - **self**: ce nombre qui prend la valeur d'une puissance de 2 défini quel est le canal de tangibilité du mobile
    - **mask**: ce nombre permet de détermine sur quel canal de tangibility ce mobile peux collisionner.
- **speed**: vitesse initiale du mobile, surtout utilse pour les mobile de type missile.



####Exemples sur la tangibilité
on dispose de mobiles, genre monstre, sensible à tous les type de missiles et lasers.
on dispose de fantomes qui peuvent traverser tous les objet solide, mais son sensible aux lasers.

- Monstres
    - tangibility
        - self: 1
        - mask: 1
- Fantomes
    - tangibility
        - self: 2
        - mask: 0
- Missiles
    - Tangibility
        - self: 4
        - mask: 5
- Lasers
    - Tangibility
        - self: 8
        - mask: 1 | 2 | 4

