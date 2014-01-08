// Functions related to drawing objects on the canvas

function draw_crystal(crystal) {
    ccc.fillStyle = get_draw_color(crystal.color_value);
    ccc.strokeStyle = "rgb(0,0,0)";
    ccc.lineWidth = 1;
    ccc.beginPath();
    ccc.moveTo(crystal.pts[0].x, crystal.pts[0].y);
    ccc.lineTo(crystal.pts[1].x, crystal.pts[1].y);
    ccc.lineTo(crystal.pts[2].x, crystal.pts[2].y);
    ccc.lineTo(crystal.pts[0].x, crystal.pts[0].y);
    ccc.fill();
    ccc.stroke();
    ccc.closePath();
}

function draw_crystals(crystal) {
    if (!crystal)
        return;
    draw_crystal(crystal);
    for (var i = 0; i < crystal.branches.length; i++) {
        draw_crystals(crystal.branches[i]);
    }
}
  
function draw_circle(x, y, r, c) {
    ccc.fillStyle = c;
    ccc.beginPath();
    ccc.arc(x, y, r, 0, 2.0 * Math.PI, true);
    ccc.fill();        
}

function draw_square(x, y, r, c) {
    ccc.fillStyle = "rgb(0,0,0)";
    ccc.fillRect(Math.floor(x) - r, Math.floor(y) - r, r * 2, r * 2);
    ccc.fillStyle = c;
    ccc.fillRect(Math.floor(x) - r + 1, Math.floor(y) - r + 1, (r * 2) - 2, (r * 2) - 2);
}

function draw_ship(x, y, c) {
    draw_square(x, y, ship_r, c);
}

function clear_space() {
    ccc.fillStyle = "rgb(0,0,0)";
    ccc.fillRect(0, 0, ccc_width, ccc_height);
}

function draw_buttons() {
    var x_offset = 16;
    var y_offset = ccc_height - button_height;
    ccc.font = "36px Verdana";

    // Start button
    var startColor = getRainbow(0.5);
    ccc.fillStyle = get_pt_color(startColor);
    ccc.fillRect(0, y_offset, (ccc_width * 0.333), button_height);
    ccc.fillStyle = get_pt_color(getCompliment(startColor));
    ccc.fillText("Start", x_offset, y_offset + (button_height * 0.8));

    var stopColor = getRainbow(0.95);
    ccc.fillStyle = get_pt_color(stopColor);
    ccc.fillRect((ccc_width * 0.333), y_offset, (ccc_width * 0.334), button_height);
    ccc.fillStyle = get_pt_color(getCompliment(stopColor));
    ccc.fillText("Stop", (ccc_width * 0.333) + x_offset, y_offset + (button_height * 0.8));

    var resetColor = getRainbow(0.1);
    ccc.fillStyle = get_pt_color(resetColor);
    ccc.fillRect((ccc_width * 0.666), y_offset, (ccc_width * 0.334), button_height);
    ccc.fillStyle = get_pt_color(getCompliment(resetColor));
    ccc.fillText("Reset", (ccc_width * 0.666) + x_offset, y_offset + (button_height * 0.8));
}

function draw_console(loc, s) {
    var x_offset = 8;
    var y_offset = 8;
    if (loc == 1) {
        x_offset += (con_width * 0.25);
    }
    if (loc == 2) {
        x_offset += (con_width * 0.5);
    }
    if (loc == 3) {
        x_offset += (con_width * 0.75);
    }

    ccc.fillStyle = "#000";
    ccc.fillRect(x_offset - 8, y_offset - 8, (con_width * 0.5), (con_height * 0.5));
    ccc.font="10px Verdana";
    ccc.fillStyle = "#fff";
    ccc.fillText(s, x_offset, y_offset);
}
