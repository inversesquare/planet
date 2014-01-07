// Functions relating to gravity interactions

// This describes the gravity between ships and MOBs
function gravity(xm, ym, xp, yp, attenuation) {
    var ret = { 'ax' : 0.0, 'ay' : 0.0 };
    var dx = xp - xm;
    var dy = yp - ym;

    // If we are too close to the ship, cut the acceleration
    if (Math.abs(dx) < 5.0 && Math.abs(dy) < 5.0) {
        return ret;
    }

    var r = Math.sqrt((dx * dx) + (dy * dy));
    // If the MOB is too far from the ship, no tractor beam
    if (r > (belt_r_px / 2.0)) {
        return ret;
    }
    // Ok, so it isn't exactly 1/r^2, but this has better gameplay
    var a = attenuation * acc_scale / Math.pow(r, 0.75);

    var theta = Math.atan2(dx, dy);
    // Adding a twist to the force is fun
//        ret.ax = (a * Math.sin(theta)) + (0.5 * a * Math.cos(theta));
//        ret.ay = (a * Math.cos(theta)) + (-0.5 * a * Math.sin(theta));
    ret.ax = (a * Math.sin(theta));
    ret.ay = (a * Math.cos(theta));
    return ret;
}

// This describes gravity between the asteroid belt and MOBs
function gravity_belt(xm, ym) {
    var ret = { 'ax' : 0.0, 'ay' : 0.0 };
    
    var x = xm - (ccc_width / 2.0);
    var y = ym - (ccc_height / 2.0);
    var r = Math.sqrt((x * x) + (y * y) + 0.01);
    // Belt gravity does not affect MOBs outside of the belt
    if (r < belt_min_px) {
        return ret;
    }
    var theta = Math.atan2(x, y);
    var dr = belt_r_px - r;
    var adr = Math.abs(dr);
    // If the MOB is close to the middle of the belt, let it coast past
    if (adr < 20.0) {
        return ret;
    }
    var a = (dr * belt_acc_scale) / (adr * Math.pow(adr, 0.75));
    ret.ax = a * Math.sin(theta);
    ret.ay = a * Math.cos(theta);
    return ret;
}

// This describes gravity between the MOBs and the planet
function gravity_planet(xm, ym, xp, yp) {
    var ret = { 'ax' : 0.0, 'ay' : 0.0 };
    
    var x = xp - xm;
    var y = yp - ym;
    var r = Math.sqrt((x * x) + (y * y) + 0.01);
    // Planet gravity does not affect MOBs in belt
//        if (r > belt_min_px) {
//            return ret;
//        }
    var theta = Math.atan2(x, y);
    // If the MOB is close to the planet, let it coast past
    if (r < 20.0) {
        return ret;
    }
    var a = planet_acc_scale / (Math.pow(r, 0.75));
    ret.ax = (a * Math.sin(theta)) + (0.75 * a * Math.cos(theta));
    ret.ay = (a * Math.cos(theta)) + (-0.75 * a * Math.sin(theta));
    return ret;
}

function bound_v(vo, max_v) {
    var v = vo;
    var d = Math.abs(drag * vo);

    // Do not drag if velocity is small
    if (Math.abs(vo) > 0.5) {
        if (vo > 0) {
            v = vo - d;
            if (v < 0)
                v = 0.0;
        }

        if (vo < 0) {
            v = vo + d;
            if (v > 0)
                v = 0.0;
        }
    }

    if (Math.abs(v) < max_v) {
        return v;
    }
    return (max_v * (v / Math.abs(v)));
}

function bound_a(a) {
    if (Math.abs(a) < max_a) {
        return a;
    }
    return (max_a * (a / Math.abs(a)));
}

