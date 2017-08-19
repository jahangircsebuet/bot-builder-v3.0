var w = $(window).width();
var h = $(window).height();
// node top, top-left co-ord, height, width variables
var top_left_offset_x = 10;
var top_left_offset_y = 10;
var top_left_x = 0 + top_left_offset_x;
var top_left_y = 0 + top_left_offset_y;
var node_width = 100;
var node_height = 100;
var node_intent_character_length = 13;

var top_connector_offset_x = (node_width) / 2;
var top_connector_offset_y = 0;

var bottom_connector_offset_x = (node_width) / 2;
var bottom_connector_offset_y = 100;

/*
var left_connector_offset_x = 0;
var left_connector_offset_y = (node_height) / 2;

var right_connector_offset_x = 100;
var right_connector_offset_y = (node_height) / 2;
*/

var connector_size = 150;
var min_dist_to_connector = 10;
var cross_size = 100;
var which_rect;
var connection_list = [];


var storyList = [];
var story = [];

var line_node_connection_list = [];

