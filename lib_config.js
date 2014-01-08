var fps = 24;  // 30 works well, but lower for debugging
var time = 0;  // total time, an integer

var draw_id = null;

var planet_canvas;
var ccc_width;
var ccc_height;
var ccc_hw; // half width (it comes up a lot)
var ccc_hh; // half height
var ccc;
var ccc_clickstate;

var planet_console;
var con_width;
var con_height;
var con_text;
var buttons_y;
var button_height = 48;

var ships;  // Array of ship objects
var ship_r = 4;  // Radius of ship in pixels
var max_ships = 10;  // Maximum number of ships you can create by clicking
var cur_ship = 0;  // Currently available ship array index
var ship_v_scale = 0.1; // initial velocity scale from click and dragging
var max_ship_v = 10.0;  // Maximum velocity for a ship
  
var planets; // Array of planet objects
var max_planets = 10;  // Maximum number of planet objects
var cur_planet = 0;  // Currently available planet array index
var planet_acc_scale = 4.0;  // Planet acceleration scale
  
var crystals; // Tree of crystal objects
var max_branches = 4; // Max number of branches a crystal can parent
var crystal_spawn_time = 3;  // Number of seconds between spawned crystals
  
var belt_min = 0.5;  // Max and min for asteroid belt, range 0.0 - 1.0
var belt_max = 1.0;
var belt_min_px;
var belt_max_px;
var belt_r = (belt_max + belt_min) / 2.0;  // Gravitational center of the belt
var belt_r_px;
var belt_acc_scale = 4.0;  // Acceleration scale for belt gravity

var avg_mob_v = 0.0;
var bbb;        // Array of mobile objects
var num_b = 200; // Number of mobile objects
var mob_r = 4;  // Radius of mobile object in pixels
var max_mob_v = 3.0;  // Maximum velocity : 5.0 is good
var drag = 0.01;  // Velocity lost every time interval :  0.05 is good
var max_a = 3.0; // Maximum acceleration : 0.4 is good
var acc_scale = 12.0;   // Acceleration scale for mobile objects vs. ships : 10.0
var acc_scale_push = 10.0;  // Acceleration scale for near-field force : 10.0
var ship_duration = 100;  // Number of iterations before a ship disappears

var sqrt2 = Math.sqrt(2.0);
var cos30 = Math.cos(Math.PI / 6.0);
var sin30 = Math.sin(Math.PI / 6.0);