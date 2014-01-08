// Main entry point for planet game.

// Generate a random MOB in the belt
function rnd_belt() {
    var ret = { 'x' : 0.0, 'y' : 0.0, 'vx' : 0.0, 'vy' : 0.0 };
    var theta = Math.random() * 2.0 * Math.PI;
    var rmax = Math.min(ccc_hh, ccc_hw);
    var r = ((Math.random() * (belt_max - belt_min)) + belt_min) * rmax;
    ret.x = (r * Math.cos(theta)) + ccc_hw;
    ret.y = (r * Math.sin(theta)) + ccc_hh;
    ret.vx = -2.0 * Math.sin(theta);
    ret.vy = -2.0 * -Math.cos(theta);
    return ret;
}
  
function spawn_crystals() {
    // Only spawn crystals every crystal_spawn_time seconds
    if ((time % Math.ceil(fps * crystal_spawn_time)) != (Math.ceil(fps * crystal_spawn_time) - 1)) {    
        return;
    }
    
    // Spawn new crystals by walking down tree and seeing if there's room
    crystal_made_one = 0;
    recurse_crystals(crystals, 5);
}

function draw_grid() {
    clear_space();
    
    // Draw crystals
    draw_crystals(crystals);

    // Draw ships
    for (var i = 0; i < max_ships; i++) {
        if (ships[i].on == 0)
            continue;
        var c = getRainbow(ships[i].z);
        draw_ship(ships[i].x, ships[i].y, get_pt_color(c));
    }

    // Draw MOBs
    for (var n = 0; n < num_b; n++) {
        draw_circle(bbb[n].x, bbb[n].y, mob_r, bbb[n].color);
    }

//	    for (var i = 0; i < 4; i++) {
//	        draw_console(i, con_text[i]);
//	    }

    draw_buttons();
}

function init_grid() {
    // Initialize crystals
    crystals = new_crystal(new_point(ccc_hw, ccc_hh, 0.0, 0.0),
                                             crystal_init_size,
                                                           0.0,
                                                  Math.random()
                          );    
    ////////////////////////////////////////
    // Initialize the planet array
    planets = Array(max_planets);
    for (var i = 0; i < max_planets; i++) {
        planets[i] = { 'on' : 0 };
    }
    // For now, there is only one planet
    planets[0].on = 1;
    planets[0].x = ccc_width / 2.0;
    planets[0].y = ccc_height / 2.0;
    /////////////////////////////////////////
    
    // Initialize the ship array
    ships = Array(max_ships);
    for (var i = 0; i < max_ships; i++) {
        ships[i] = { 'on' : 0 };
    }
    /////////////////////////////////////////
    
    // Initialize belt parameters
    var rmax = Math.min(ccc_height, ccc_width) / 2.0;
    belt_max_px = belt_max * rmax;
    belt_min_px = belt_min * rmax;
    belt_r_px = (belt_max_px + belt_min_px) / 2.0;
    
    /////////////////////////////////////////
    // Initialize the list of mobile objects
    bbb = Array(num_b);
    for (var n = 0; n < num_b; n++) {
        var tmp = rnd_belt();
        bbb[n] = { 'x' : tmp.x,
                   'y' : tmp.y,
                  'vx' : tmp.vx,
                  'vy' : tmp.vy,
                  'ax' : 0.0,
                  'ay' : 0.0,
                  'color' : get_draw_color(Math.random())
                };
    }

    draw_grid();
}

function update_grid() {
    con_text[0] = "Cp: " + cur_ship;
    
    // Update crystals
    spawn_crystals();

    var attenuation = 1.0;
    // Update the ships
    for (var i = 0; i < max_ships; i++) {
        if (ships[i].on == 0)
            continue;
        attenuation = Math.exp(-(time - ships[i].time)/(ship_duration*1.0));
        ships[i].z = ships[i].zo * attenuation;
        // If the clicked point has run out of energy, turn it off
        if (attenuation < 0.05) {
            ships[i].on = 0;
        }
        
        // Calculate acceleration for ships
        var ax = 0.0;
        var ay = 0.0;
        ships[i].ax = bound_a(ax);
        ships[i].ay = bound_a(ay);
        ships[i].vx = bound_v(ships[i].vx + ships[i].ax, max_ship_v);
        ships[i].vy = bound_v(ships[i].vy + ships[i].ay, max_ship_v);
        ships[i].x = wrap_x(ships[i].x + ships[i].vx);
        ships[i].y = wrap_y(ships[i].y + ships[i].vy);
    }

    // update the mobile points
    var ret;
    var current_v = 0.0;
    avg_mob_v = 0.0;
    for (var n = 0; n < num_b; n++) {
        // Calculate acceleration on MOB from ships
        var ax = 0.0;
        var ay = 0.0;
        for (var i = 0; i < max_ships; i++) {
            if (ships[i].on == 0)
                continue;
            ret = gravity(bbb[n].x, bbb[n].y, ships[i].x, ships[i].y, ships[i].z);
            ax += ret.ax;
            ay += ret.ay;
        }
        
        // Calculate accleration on MOB from belt
        ret = gravity_belt(bbb[n].x, bbb[n].y);
        ax += ret.ax;
        ay += ret.ay;
        
        // Calculate accleration on MOB from planet(s)
        for (var i = 0; i < max_planets; i++) {
            if (planets[i].on == 0)
                continue;
            ret = gravity_planet(bbb[n].x, bbb[n].y, planets[i].x, planets[i].y);
            ax += ret.ax;
            ay += ret.ay;
        }

        bbb[n].ax = bound_a(ax);
        bbb[n].ay = bound_a(ay);

        bbb[n].vx = bound_v(bbb[n].vx + bbb[n].ax, max_mob_v);
        bbb[n].vy = bound_v(bbb[n].vy + bbb[n].ay, max_mob_v);

        current_v = Math.sqrt(bbb[n].vx * bbb[n].vx + bbb[n].vy * bbb[n].vy);
        avg_mob_v += current_v;

        bbb[n].x = wrap_x(bbb[n].x + bbb[n].vx);
        bbb[n].y = wrap_y(bbb[n].y + bbb[n].vy);
    }
    avg_mob_v /= num_b > 0 ? num_b : 1;
    con_text[2] = "Avg.V: " + avg_mob_v.toFixed(2);

    time += 1;
}

function draw() {
    init_canvas();
    init_grid();
}
