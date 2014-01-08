// Functions relating to mobile objects

function new_ship(x, y, vx, vy) {
    return {   'x' : x,
               'y' : y,
              'vx' : vx,
              'vy' : vy,
              'ax' : 0.0,
              'ay' : 0.0,
               'z' : 1.0,
              'zo' : 1.0,
            'time' : time,
              'on' : 1 };
}


function new_crystal(pc, r, theta, color_value) {
    var pts = new Array(3);
    
    // Create the triangle at 0,0
    pts[0] = new_point(0.0, -r, 0.0, 0.0);
    pts[1] = new_point(-r * cos30, r * sin30, 0.0, 0.0);
    pts[2] = new_point(r * cos30, r * sin30, 0.0, 0.0);

    // Translate it out to pc
    trans_point(pts[0], pc);
    trans_point(pts[1], pc);
    trans_point(pts[2], pc);
    
    // Now rotate the coordinates by theta
    rotate_point(pts[0], pc, theta);
    rotate_point(pts[1], pc, theta);
    rotate_point(pts[2], pc, theta);
    
    return {     'pts' : pts,
         'color_value' : color_value,
            'branches' : new Array(3)
           };
}

// Shuffle a color value around a bit, but don't go out of bounds [0, 1]
function mod_color_value(color_value) {
    var ret = color_value + ((Math.random() - 0.5) * 0.3);
    if (ret < 0.0)
        ret = 0.0;
    if (ret > 1.0)
        ret = 1.0;
    return ret;
}

function recurse_crystals(crystal, lvl) {
    if (!crystal || lvl < 0 || crystal_made_one)
        return;

    for (var i = 0; i < crystal.branches.length; i++) {
        // Crystal already exists at this branch,
        // recurse and don't add a new one
        if (crystal.branches[i]) {
            recurse_crystals(crystal.branches[i], lvl - 1);
            continue;
        }
        var size_px = crystal_init_size * ((0.5 * lvl / crystal_max_recursion) + 0.05);
        crystal.branches[i] = new_crystal(crystal.pts[i],
                                                 size_px,
                           Math.PI * 2.0 * Math.random(),
                     mod_color_value(crystal.color_value)
                                         );
        crystal_made_one = 1;
        recurse_crystals(crystal.branches[i], lvl - 1);
    }
}

