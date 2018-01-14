const RC_CONST = {
    rc_plane_spacing: 64,
    rc_time_factor: 40,
    rc_texture_height: 96,


    // laby phys properties
    phys_none : 0x00,
    phys_wall : 0x01,

    // laby door properties
    phys_first_door : 0x02,
    phys_door_sliding_up : 0x02,
    phys_curt_sliding_up : 0x03,
    phys_door_sliding_down : 0x04,
    phys_curt_sliding_down : 0x05,
    phys_door_sliding_left : 0x06,
    phys_door_sliding_right : 0x07,
    phys_door_sliding_double : 0x08,

    phys_last_door : 0x08,

    phys_secret_block : 0x09,
    phys_transparent_block : 0x0a,
    phys_invisible_block : 0x0b,
    phys_offset_block : 0x0c,
    phys_door_d : 0x0d,
    phys_door_e : 0x0e,
    phys_door_f : 0x0f,

};

module.exports = RC_CONST;