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


function new_crystal(pc, r, theta, color) {
    
    // Create the triangle at 0,0
    var p1 = new_point(0.0, -r, 0.0, 0.0);
    var p2 = new_point(-r * cos30, r * sin30, 0.0, 0.0);
    var p3 = new_point(r * cos30, r * sin30, 0.0, 0.0);

    // Translate it out to pc
    trans_point(p1, pc);
    trans_point(p2, pc);
    trans_point(p3, pc);
    
    // Now rotate the coordinates by theta
    rotate_point(p1, pc, theta);
    rotate_point(p2, pc, theta);
    rotate_point(p3, pc, theta);
    
    return {     'p1' : p1,
                 'p2' : p2,
                 'p3' : p3,
               'color': color,
       'num_branches' : 0,
           'branches' : new Array(max_branches)
           };
}
