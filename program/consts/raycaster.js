const RC_CONST = {


    plane_spacing: 64,      // taille d'un block en texels
    texture_height: 96,     // hauteur d'un block en texels

    /**
     * Ces constantes sont exprimées en millisecondes
     */
    time_factor: 40,                // temps entre chaque frame
    // temps d'ouverture
    time_door_double: 600,          // d'une porte double
    time_door_single_horiz: 800,    // d'une porte simple horizontale
    time_door_single_vert: 800,     // d'une porte verticale
    time_door_secret: 2000,         // d'un passage secret
    time_door_autoclose: 3000,      // temps pendant lequel les portes reste ouverte


    // laby phys properties
    phys_none : 0x00,               // traversable
    phys_wall : 0x01,               // intraversable + textures

    // laby door properties
    phys_first_door : 0x02,
    phys_door_sliding_up : 0x02,    // porte glissant vers le haut
    phys_curt_sliding_up : 0x03,    // rideau glissant vers le haut
    phys_door_sliding_down : 0x04,  // porte glissant vers le bas
    phys_curt_sliding_down : 0x05,  // rideau ...
    phys_door_sliding_left : 0x06,  // porte coulissante gauche
    phys_door_sliding_right : 0x07, // ... et droite
    phys_door_sliding_double : 0x08, // porte double battant

    phys_last_door : 0x08,

    phys_secret_block : 0x09,           // passage secret
    phys_transparent_block : 0x0a,      // block à texture transparente ou semi
    phys_invisible_block : 0x0b,        // block invisible néanmoins bloquant
    phys_offset_block : 0x0c,           // block alcove
    phys_door_d : 0x0d,
    phys_door_e : 0x0e,
    phys_door_f : 0x0f,

};

module.exports = RC_CONST;