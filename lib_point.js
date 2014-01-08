// Functions relating to point objects

function new_point(x, y, vx, vy) {
    return {   'x' : x,
               'y' : y,
              'vx' : vx,
              'vy' : vy,
              'ax' : 0.0,
              'ay' : 0.0
           };
}

// Rotate a point (pt) about a center point (pc) by an angle (theta)
function rotate_point(pt, pc, theta) {
    var st = Math.sin(theta);
    var ct = Math.cos(theta);
    
    var x = pt.x - pc.x;
    var y = pt.y - pc.y;
    var vx = pt.vx;
    var vy = pt.vy;
    
    pt.x = (( x * ct) + ( y * st)) + pc.x;
    pt.y = ((-x * st) + ( y * ct)) + pc.y;
    pt.vx = (( vx * ct) + ( vy * st));
    pt.vy = ((-vx * st) + ( vy * ct));
}

// Translate a point (pt) relative to another point (pc)
function trans_point(pt, pc) {
    pt.x += pc.x;
    pt.y += pc.y;
}



