// Color related functions

function RGBtoHSV(c) {
    var r = c.r / 255.0;
    var g = c.g / 255.0;
    var b = c.b / 255.0;
    var cmax = Math.max(r,g,b);
    var cmin = Math.min(r,g,b);
    var h, s, v = cmax;

    var delta = cmax - cmin;
    s = cmax == 0 ? 0 : delta / cmax;

    if (cmax == cmin) {
        h = 0;
    } else {
        switch (cmax) {
        case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
        case g: h = (b - r) / delta + 2; break;
        case b: h = (r - g) / delta + 4; break;
        }
        h /= 6;
    }
    return {'h' : h, 's' : s, 'v' : v };
}

function HSVtoRGB(c) {
    var r, g, b;
    var i = Math.floor(c.h * 6);
    var f = c.h * 6 - i;
    var p = c.v * (1 - c.s);
    var q = c.v * (1 - f * c.s);
    var t = c.v * (1 - (1 - f) * c.s);

    switch (i % 6) {
        case 0: r = c.v, g = t, b = p; break;
        case 1: r = q, g = c.v, b = p; break;
        case 2: r = p, g = c.v, b = t; break;
        case 3: r = p, g = q, b = c.v; break;
        case 4: r = t, g = p, b = c.v; break;
        case 5: r = c.v, g = p, b = q; break;
    }
    return { 'r' : r * 255, 'g' : g * 255, 'b' : b * 255 };
}

function fadeToHSV(base, other, fraction) {
    var hsv1 = RGBtoHSV(base);
    var hsv3 = RGBtoHSV(other);
    var h = 0.5;
    var hdelta = Math.abs(hsv1.h - hsv3.h);
    // hue wrapps around in the range [0,1], so be sure to wrap the short way
    if (hdelta > 0.5) {
        if (hsv1.h > hsv3.h)
            h = hsv1.h + hdelta*fraction;
        else
            h = hsv3.h + hdelta*fraction;
        if (h > 1.0)
            h -= 1.0;
    }
    var h = hsv1.h + (hsv3.h-hsv1.h)*fraction;
    var s = hsv1.s + (hsv3.s-hsv1.s)*fraction;
    var v = hsv1.v + (hsv3.v-hsv1.v)*fraction;
    var a = this.a + (other.a - this.a)*fraction;
    var hsv2 = {'h' : h, 's' : s, 'v' : v };
    var rgb2 = HSVtoRGB(hsv2);
    return {'r' : rgb2.r, 'g' : rgb2.g, 'b' : rgb2.b};
}

function bound_color(c) {
    c = Math.round(c);
    c = (c > 255) ? 255 : c;
    return (c < 0) ? 0 : c;
}

function getCompliment(c) {
    rn = (c.r + 128 > 255) ? c.r - 128 : c.r + 128;
    gn = (c.g + 128 > 255) ? c.g - 128 : c.g + 128;
    bn = (c.b + 128 > 255) ? c.b - 128 : c.b + 128;
    return {'r' : rn, 'g' : gn, 'b' : bn};
}

function getQuarterCompliment() {
    rn = (this.r + 64 > 255) ? this.r - 64 : this.r + 64;
    gn = (this.g + 64 > 255) ? this.g - 64 : this.g + 64;
    bn = (this.b + 64 > 255) ? this.b - 64 : this.b + 64;
    return {'r' : rn, 'g' : gn, 'b' : bn};
}

function getRainbow(fraction) {
    fraction = Math.min(1, Math.max(0, fraction));
    var ret = {'r' : 0, 'g' : 0, 'b' : 0};
    var c1 = {'r' :   0, 'g' :   0, 'b' : 255};
    var c2 = {'r' :   0, 'g' : 255, 'b' :   0};
    var c3 = {'r' : 255, 'g' :   0, 'b' :   0};

    // Linear interpolation between colors
    if (fraction <= 0.5)
        ret = fadeToHSV(c1, c2, fraction*2.0);
    else
        ret = fadeToHSV(c2, c3, 2.0*(fraction - 0.5));

    ret.r = bound_color(ret.r);
    ret.g = bound_color(ret.g);
    ret.b = bound_color(ret.b);

    return ret;
}

function get_color(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

function get_pt_color(pt) {
    return get_color(pt.r, pt.g, pt.b);
}
  
function get_draw_color(val) {
    return get_pt_color(getRainbow(val));
}

function get_sat_color(pt) {
    var mx = pt.r > pt.g ? pt.r : pt.g;
    mx = mx > pt.b ? mx : pt.b;
    mx = 255 / mx;
    var ret = get_color(bound_color(Math.round(pt.r * mx)),
                     bound_color(Math.round(pt.g * mx)),
                     bound_color(Math.round(pt.b * mx)));
    return ret;
}
