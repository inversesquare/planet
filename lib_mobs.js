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
    
    // Calculate the center point
    var center = new_point( (pts[0].x + pts[1].x + pts[2].x) / 3.0,
                            (pts[0].y + pts[1].y + pts[2].y) / 3.0,
                           0.0, 0.0);
    
    return {     'pts' : pts,
              'center' : center,
         'color_value' : color_value,
            'branches' : new Array(3)
           };
}

// Shuffle a color value around a bit, but don't go out of bounds [0, 1]
function mod_color_value(color_value) {
    var ret = color_value + ((Math.random() - 0.5) * 0.3);
    if (ret < 0.0)
        ret = 1.0;
    if (ret > 1.0)
        ret = 0.0;
    return ret;
}

function recurse_crystals(crystal, lvl) {
    if (!crystal || lvl < 0 || crystal_made_one)
        return;

    var num_b = crystal.branches.length;
    var starting_branch = Math.floor((Math.random() * num_b) - 0.001);
    for (var looper = 0; looper < num_b; looper++) {
        var i = starting_branch + looper;
        // wrap around when we exceed number of branches
        i = i > num_b - 1 ? i - num_b : i;
        // Crystal already exists at this branch,
        // recurse and don't add a new one
        if (crystal.branches[i]) {
            recurse_crystals(crystal.branches[i], lvl - 1);
            continue;
        }
        var size_px = crystal_init_size * Math.exp(-0.2*(crystal_max_recursion - lvl));
        var branch_center_pt = project_point(crystal.center, crystal.pts[i], 1.4);
        crystal.branches[i] = new_crystal(branch_center_pt,
                                                 size_px,
                           Math.PI * 2.0 * Math.random(),
                     mod_color_value(crystal.color_value)
                                         );
        crystal_made_one = 1;
        recurse_crystals(crystal.branches[i], lvl - 1);
    }
}

function test_collision(crystal, pt) {
    return point_in_triangle(pt,
                             crystal.pts[0],
                             crystal.pts[1],
                             crystal.pts[2]);
}

function crystal_collision(crystal, pt) {
    if (!crystal || crystal_hit_one)
        return;
    
    for (var i = 0; i < crystal.branches.length; i++) {
        if (!(crystal.branches[i]))
            continue;
        if (test_collision(crystal.branches[i], pt)) {
            // A collision!  Kill the crystal and pop the recursion
            crystal.branches[i] = null;
            crystal_hit_one = 1;
            return;
        }
    }

}

