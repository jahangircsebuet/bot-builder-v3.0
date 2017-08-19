/* each node contains 2 rect element, this function checks on which rect mousedown event occurs */
function check_which_rect() {
    var elem = d3.select(this); // get the svg the main container of all svg elements nodes, lines etc
    which_rect = elem.attr('class');
    if(which_rect.indexOf('content') != -1)
        which_rect = 'content';
    else if(which_rect.indexOf('move') != -1)
        which_rect = 'header';
}

/* drag event changes the co-ordinate of a particular node */
var in_editor_drag = d3.behavior.drag()
    .origin(function() {
        var g = this;
        translate = d3.transform(g.getAttribute("transform")).translate;
        clickX = translate[0];
        clickY = translate[1];

        return {x: d3.transform(g.getAttribute("transform")).translate[0],
        y: d3.transform(g.getAttribute("transform")).translate[1]};
    })
    .on("drag", function(d,i) {
        if(which_rect != 'content' && which_rect != 'on_connector' && which_rect == 'header') {
            g = this;

            translate = d3.transform(g.getAttribute("transform")).translate;
            // set (d.x, d.y) not less than (10, 10)
            d.x = d3.event.dx + translate[0] > 10 ? d3.event.dx + translate[0]: 10;
            d.y = d3.event.dy + translate[1] > 10 ? d3.event.dy + translate[1]: 10;


            // set (d.x, d.y) not more than window size
            //d.x = d3.event.dx + translate[0] > 10 ? d3.event.dx + translate[0]: 10;
            //d.y = d3.event.dy + translate[1] > $(window).height() - 115 ? $(window).height() - 115 + translate[1]: 10;

            var node_id = d3.select(this).attr('id');
            var node = node_list[node_id];
            //var line_len = node.connected_lines.length;

            // update node top left (x, y)
            node.node_pos_x = d.x;
            node.node_pos_y = d.y;

            var line_ids = [];

            // get the lines (which add this nodes parent node) end point node for the dragging node
            for(var i=0;i<node_list[node_id].in_ctx.length;i++) {
                var in_ctx_node = node_list[node_id].in_ctx[i];
                line_ids.push({'n1': node_id.substr(4, node_id.length), 'n2': in_ctx_node.substr(4, in_ctx_node.length)});
            }

            // get the lines (which add this nodes child node) end point node for the dragging node
            for(var j=0;j<Object.keys(node_list).length;j++) {
                var n_id = Object.keys(node_list)[j];
                for(var k=0;k<node_list[n_id].in_ctx.length;k++) {
                    if(node_list[n_id].in_ctx[k] == node_id) {
                        var in_ctx_node = node_list[n_id].in_ctx[k];
                        line_ids.push({'n1': in_ctx_node.substr(4, in_ctx_node.length), 'n2': n_id.substr(4, n_id.length)});
                    }
                }
            }

            console.log("line_ids: ");
            console.log(line_ids);

            for(var i=0;i<line_ids.length;i++) { // iterate over line_ids which are connected with the dragging node
                console.log("outer loop line id: "+ line_ids[i]);

                for(var j=0;j<line_node_connection_list.length;j++) { // iterate over line_node_connection_list list
                    if(("line"+line_ids[i].n1+line_ids[i].n2 == line_node_connection_list[j].line_id) || ("line"+line_ids[i].n2+line_ids[i].n1 == line_node_connection_list[j].line_id)) { // match line id and node id to know (x1, y1) or (x2, y2) connected
                        console.log('line id found in line_node_connection_list....');
                        console.log("line_ids[i] == line_node_connection_list[j].line_id: "+line_node_connection_list[j].line_id+"  "+"line_ids[i]: "+line_ids[i]);
                        if(line_node_connection_list[j].source_id == node_id) { // if the node is source of the line then that end is (x1, y1)
                            if(line_node_connection_list[j].source_connector == 'top') {
                                connector_offset_x = top_connector_offset_x;
                                connector_offset_y = top_connector_offset_y;
                            } else if(line_node_connection_list[j].source_connector == 'bottom') {
                                connector_offset_x = bottom_connector_offset_x;
                                connector_offset_y = bottom_connector_offset_y;
                            }
                            console.log("source node: "+node_id);
                            d3.select('#'+line_node_connection_list[j].line_id).attr('x1', parseInt(d.x + connector_offset_x) );
                            d3.select('#'+line_node_connection_list[j].line_id).attr('y1', parseInt(d.y + connector_offset_y));
                        } else if(line_node_connection_list[j].dest_id == node_id) { // if the node is dest of the line then that end is (x2, y2)
                             if(line_node_connection_list[j].dest_connector == 'top') {
                                connector_offset_x = top_connector_offset_x;
                                connector_offset_y = top_connector_offset_y;
                            } else if(line_node_connection_list[j].dest_connector == 'bottom') {
                                connector_offset_x = bottom_connector_offset_x;
                                connector_offset_y = bottom_connector_offset_y;
                            }
                            console.log("dest node: "+node_id);
                            d3.select('#'+line_node_connection_list[j].line_id).attr('x2', parseInt(d.x + connector_offset_x) );
                            d3.select('#'+line_node_connection_list[j].line_id).attr('y2', parseInt(d.y + connector_offset_y));
                        }
                    }
                }
            }
            d3.select(g).attr("transform", "translate(" + d.x + "," + d.y + ")");
        }
    })
    .on("dragend", function(d) {
        if(which_rect != 'content' && which_rect != 'on_connector' && which_rect == 'header') {
            //node_list[d3.select(this).attr('id')].co_ordinate = {'x': d.x, 'y': d.y};
            which_rect = null;
        }
    });

/* changes/toggles the line stroke on mouse over on a particular line, others are made deselected */
function line_mousedown() {
    var line_clicked = "connector_line_clicked";
    //var line_list = get_all_line_id();
    /*for(var i=0;i<Object.keys(connection_list).length;i++) {
        var id =  Object.keys(connection_list)[i];
       if(d3.select(this).attr('id') != id && d3.select("#"+id).attr('class').indexOf('connector_line_clicked') != -1) {
            d3.select("#"+id).classed(line_clicked, false);
        }
    }*/

    for(var i=0;i<line_node_connection_list.length;i++) {
        if(d3.select(this).attr('id') != line_node_connection_list[i].line_id &&
        d3.select("#"+line_node_connection_list[i].line_id).attr('class').indexOf('connector_line_clicked') != -1) {
            d3.select("#"+line_node_connection_list[i].line_id).classed(line_clicked, false);
        }
    }
    d3.select(this).classed(line_clicked, d3.select(this).classed(line_clicked) ? false : true);
    //d3.select(this).classed(line_clicked, true);
}

/* changes the move, edit, delete icon color on mouseover and onmouseleave event */
function node_icon_mouseover(elem) {
    if($(elem).attr('class') == 'node-move-btn') {
        console.log(d3.select(elem.parentNode).attr('id'));
        $(elem).attr("href", "img/node_move_hover.png");
        d3.select(elem.parentNode).attr('class', 'node node-moving')

    } else if($(elem).attr('class') == 'node-edit-btn') {
        $(elem).attr("href", "img/node_edit_hover.png");

    } else if($(elem).attr('class') == 'node-delete-btn') {
        $(elem).attr("href", "img/node_delete_hover.png");
    }
}

/* changes the move, edit, delete icon color on mouseover and onmouseleave event */
function node_icon_mouseleave(elem) {
    if($(elem).attr('class') == 'node-move-btn') {
        $(elem).attr("href", "img/node_move.png");

    } else if($(elem).attr('class') == 'node-edit-btn') {
        $(elem).attr("href", "img/node_edit.png");

    } else if($(elem).attr('class') == 'node-delete-btn') {
        $(elem).attr("href", "img/node_delete.png");
    }
}

/* deletes a particular selected line on click on delete key in keyboard */
$(document).keydown(function(e) {
    if(e.keyCode == 46) {
        console.log('inside delete key down...');

        for(var i=0;i<line_node_connection_list.length;i++) {
            var line_id = line_node_connection_list[i].line_id;
            if(d3.select("#"+line_id).attr("class").indexOf("connector_line_clicked") != -1) {
                d3.select("#"+line_id).remove();
                for(var j=0;j<Object.keys(node_list).length;j++) {
                    var line_deleted = false;
                    var node_id = Object.keys(node_list)[j];
                    if(node_list[node_id].in_ctx.length > 0) {
                        line_deleted = delete_from_in_ctx(node_id, line_id);
                    }
                    if(line_deleted) {
                        line_node_connection_list.splice(i, 1);
                        break;
                    }
                }
                break;
            }
        }
    }
});

function delete_from_in_ctx(node_id, line_id) {
    console.log("node_id: "+node_id);
    console.log("line_id: "+line_id);
    for(var i=0;i<node_list[node_id].in_ctx.length;i++) {
        var n1 = node_list[node_id].out_ctx;
        n1 = n1.substr(4, n1.length);
        var n2 = node_list[node_id].in_ctx[i];
        n2 = n2.substr(4, n2.length);

        if(line_id == "line"+n1+n2 || line_id == "line"+n2+n1) {
            console.log("inside if...");
            node_list[node_id].in_ctx.splice(i, 1);
            return true;
        }
    }
    return false;
}

function get_max_node_pos_y(node_id) {
    max = -99999;
    for(var i=0;i<Object.keys(node_list).length;i++) {
        if(Object.keys(node_list)[i] != node_id)
            max = Math.max(max, parseInt(node_list[Object.keys(node_list)[i]].node_pos_y));
        console.log("max: "+ max);
    }
    return max;
}
// TODO
/*
function on_zoomed() {
    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
*/

// TODO
// zoom behavior for whole canvas with its elements - nodes, links etc
/*var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", on_zoomed);
*/