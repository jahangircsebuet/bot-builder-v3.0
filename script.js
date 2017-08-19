// node and connection line container
var node_list = {};
var connection_list = {};
var start_connector_x;
var start_connector_y;
var connection_list_size;

// canvas configuration values
var margin = {top: -5, right: -5, bottom: -5, left: -5}
//width = window.width - margin.left - margin.right,
//height = window.height - margin.top - margin.bottom;

var diff_x;
var diff_y;
var new_x;
var new_y;

// line drawing variables
var line_svg;
var line;
var source_node = null;



$(document).ready(function() {

    drawCanvas(w, h);

    $('#addNode').on('click', function() {
        addNode();
    });

    $('#clearNodes').on('click', function() {
        clearNodes();
    });

    $('#redrawNodes').on('click', function() {
        redrawNodes();
    });

    $('.edge').on('click', function() {
        alert('line clicked..');
    });

    $(window).scroll(function(){
        if ($(window).scrollTop() == $(document).height()-$(window).height()){
            update_canvas();
        }
    });
});
