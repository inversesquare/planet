// Functions relating to user actions

function handle_buttons(x, y) {
    // Start
    if (x > 0 && x < (ccc_width * 0.333)) {
        draw_id = setInterval(function() {
            update_grid();
            draw_grid();
        }, 1000/fps);
        return;
    }

    // Stop
    if (x > (ccc_width * 0.333) && x < (ccc_width * 0.666)) {
        if (draw_id) {
            clearInterval(draw_id);
        }
        return;
    }

    if (x > (ccc_width * 0.666)) {
        init_grid();
        return;
    }
}

function handle_canvas_click(x, y) {
    var vx = -ccc_clickstate.dx * ship_v_scale;
    var vy = -ccc_clickstate.dy * ship_v_scale;
    ships[cur_ship] = new_ship(x, y, vx, vy);
    cur_ship += 1;
    if (cur_ship > max_ships - 1)
        cur_ship = 0;
}
  
function get_real_xy(e) {
    var ret = { 'x' : 0, 'y' : 0 };
    e = (e || event);
    if (e.pageX || e.pageY) {
        ret.x = e.pageX;
        ret.y = e.pageY;
    } else {
        ret.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        ret.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    ret.x -= planet_canvas.offsetLeft;
    ret.y -= planet_canvas.offsetTop;
    return ret;
}

function on_ccc_mouseup(e) {
    var tmp = get_real_xy(e);
    
    // User clicked and dragged
    ccc_clickstate.x_up = tmp.x;
    ccc_clickstate.y_up = tmp.y;
    ccc_clickstate.dx = ccc_clickstate.x_up - ccc_clickstate.x_down;
    ccc_clickstate.dy = ccc_clickstate.y_up - ccc_clickstate.y_down;

    con_text[1] = "Clk.: " + tmp.x + ", " + tmp.y;

    if (tmp.y > buttons_y) {
        handle_buttons(tmp.x, tmp.y);
    } else {
        handle_canvas_click(tmp.x, tmp.y);
    }
}

function on_ccc_mousedown(e) {
    var tmp = get_real_xy(e);        
    ccc_clickstate.x_down = tmp.x;
    ccc_clickstate.y_down = tmp.y;
}

function wrap_i(i) {
    return (Math.round(i) + ccc_height) % (ccc_height);
}

function wrap_j(j) {
    return (Math.round(j) + ccc_width) % (ccc_width);
}

function wrap_y(y) {
    if (y < 0.0)
        return 1.0 * (ccc_height + y);
    if (y > ccc_height)
        return 1.0 * (y - ccc_height);
    return y;
}

function wrap_x(x) {
    if (x < 0.0)
        return 1.0 * (ccc_width + x);
    if (x > ccc_width)
        return 1.0 * (x - ccc_width);
    return x;
}

function rnd_x() {
    return Math.floor((Math.random()*(ccc_height-1))+1);
}

function rnd_y() {
    return Math.floor((Math.random()*(ccc_width-1))+1);
}

function init_canvas() {
    planet_canvas = document.getElementById("planet_canvas");
    if (planet_canvas.getContext) {
        ccc = planet_canvas.getContext("2d");
    }

    planet_canvas.width = document.body.clientWidth;
    planet_canvas.height = document.body.clientHeight;

    ccc.width = window.innerWidth;
    ccc.height = window.innerHeight;

    planet_canvas.onmousedown = on_ccc_mousedown;
    planet_canvas.onmouseup = on_ccc_mouseup;
    ccc_width = planet_canvas.width;
    ccc_height = planet_canvas.height;
    ccc_hw = ccc_width / 2.0;
    ccc_hh = ccc_height / 2.0;

    // Area at the top to draw text
    con_width = planet_canvas.width;
    con_height = 20;
    con_text = ["","","",""];

    // Y value above which is reserved for buttons
    buttons_y = ccc_height - button_height;
    
    ccc_clickstate = { 'x_down' : 0, 'y_down' : 0, 'x_up' : 0, 'y_up' : 0, 'dx' : 0, 'dy' : 0 };
}

