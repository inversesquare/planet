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

// Subtract second point from first
function sub_point(ptA, ptB) {
    return new_point(ptA.x - ptB.x,
                     ptA.y - ptB.y,
                     0.0, 0.0);
}

// Distance between two points
function dist_point(ptA, ptB) {
    return Math.sqrt(((ptA.x - ptB.x) * (ptA.x - ptB.x)) + ((ptA.y - ptB.y) * (ptA.y - ptB.y)));
}

// Return a point that is (distance * scale) further along the line
// defined by ptA and ptB.  Scale == 1 returns ptB
function project_point(ptA, ptB, scale) {
    return new_point( ptA.x + (scale * (ptB.x - ptA.x)),
                      ptA.y + (scale * (ptB.y - ptA.y)),
                     0.0, 0.0);    
}

// Since ptA and ptB have no Z component
// we can just return a scalar value (z)
function cross_product(ptA, ptB) {
    return ((ptA.x * ptB.y) - (ptA.y * ptB.x));
}

// Tests if two points (pt1 and pt2) are on the same side
// of the line defined by (ptA and ptB)
// http://www.blackpawn.com/texts/pointinpoly/
function points_same_side(pt1, pt2, ptA, ptB) {
    var cross1 = cross_product(sub_point(ptB, ptA), sub_point(pt1, ptA));
    var cross2 = cross_product(sub_point(ptB, ptA), sub_point(pt2, ptA));
    return (((cross1 * cross2) >= 0.0) ? true : false);
}

// For a triangle with corners a, b, c
// test if each vertex + point are on the same side
// of the line defined by the other two verticies
function point_in_triangle(p, a, b, c) {
    return (points_same_side(p, a, b, c) &&
            points_same_side(p, b, a, c) &&
            points_same_side(p, c, a, b));
}



