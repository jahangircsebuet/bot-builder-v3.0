var line;
// create node function creates a node
function createNode(classname, node_pos_x, node_pos_y, node_width, node_height, redraw=false, node_id = 0)
{
    var node_count;// = d3.selectAll('g.node').size();

    if(Object.keys(node_list).length > 0) {
        var node_list_idx =  parseInt(Object.keys(node_list).length - 1);
        console.log("node_list_len: "+node_list_idx);
        var last_node_id = parseInt(parseInt(Object.keys(node_list)[node_list_idx].substr(4, Object.keys(node_list)[node_list_idx].length)) + 1);
        node_count = last_node_id;
        console.log("node_count: "+ node_count);
    } else {
        node_count = 0;
    }

    if(redraw) {node_count = node_id;}

    // adds a g svg element to the canvas (svg with id charts) with its (x, y) cocordinate and draggable behavior
    var container = d3.select("#charts")
        .append("g")
        .data([ {"x":node_pos_x, "y":node_pos_y} ])
        .attr("width", node_width)
        .attr("height", node_height)
        .attr("class", classname)
        .attr("id", "node"+node_count)
        .attr("transform", "translate(" + node_pos_x + "," + node_pos_y + ")")
        .call(in_editor_drag)
        ;

    // adds node id in node_list dict
    if(!redraw)
        node_list["node"+node_count] = {'node_pos_x': node_pos_x,'node_pos_y': node_pos_y,'intent': null, 'node_reply': null, 'action_string': null,'in_ctx': [],'out_ctx': "node"+node_count, 'connected_lines': []};

    var node_header = container.append("svg:rect")
        .attr("class", "node-header")
        .attr("stroke", "#616161")
        .style("fill", "#E6E2E1")
        .attr("stroke-width", 1)
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("width", node_width)
        .attr("height", 20);

    var node_move_btn = container.append("svg:image")
        .attr("xlink:href", "img/node_move.png")
        .attr('class', 'node-move-btn')
        .attr("width", 12)
        .attr("height", 12)
        .attr("x", 5)
        .attr("y",3)
        .on('mouseover', function() {node_icon_mouseover(this);})
        .on('mouseleave', function() {node_icon_mouseleave(this);})
        .on('mousedown', check_which_rect);

    var node_edit_btn = container.append("svg:image")
        .attr("xlink:href", "img/node_edit.png")
        .attr('class', 'node-edit-btn')
        .attr("width", 12)
        .attr("height", 12)
        .attr("x", 60)
        .attr("y",3)
        .on('mouseover', function() {node_icon_mouseover(this);})
        .on('mouseleave', function() {node_icon_mouseleave(this);})
        .on('mousedown', node_edit)
        ;

    var node_delete_btn = container.append("svg:image")
        .attr("xlink:href", "img/node_delete.png")
        .attr('class', 'node-delete-btn')
        .attr("width", 12)
        .attr("height", 12)
        .attr("x", 80)
        .attr("y", 3)
        .on('mouseover', function() {node_icon_mouseover(this);})
        .on('mouseleave', function() {node_icon_mouseleave(this);})
        .on('mousedown', node_delete);

    var node_content = container.append("svg:rect")
        .attr("class", "node-content")
        .attr("stroke", "#616161")
        .attr("stroke-width", 1)
        .style("fill", "#E6E2E1")
        .attr("transform", "translate(" + 0 + "," + 20 + ")")
        .attr("width", node_width)
        .on('mousedown', check_which_rect)
        .attr("height", node_height - 20);

    var top_connector = container.append('path')
        .attr("d", d3.svg.symbol().type("circle").size(connector_size))
        .attr("transform", "translate(" + top_connector_offset_x + "," + top_connector_offset_y + ")")
        .style("fill", "#4682B4") //#E6E2E1
        .attr("class", "node-connector-top node-connector")
        .on('mousedown', mousedown)
        ;

    var bottom_connector = container.append('path')
        .attr("d", d3.svg.symbol().type("circle").size(connector_size))
        .attr("transform", "translate(" + bottom_connector_offset_x + "," + bottom_connector_offset_y + ")")
        .style("fill", "#4682B4") //#E6E2E1
        .attr("class", "node-connector-bottom node-connector")
        .on('mousedown', mousedown)
        ;


    var node_txt = container.append("svg:text")
        .attr('x', 30)
        .attr('y', 50)
        //.attr("dy", .35)
        .attr("stroke", "#4682B4")
        .attr("stroke-width", 1)
        .style("font-size", "12px")
        .attr("id", "node_txt"+node_count)
        //.append('tspan')
        .text("node "+node_count);
 //       .call(wrap);
        //.call(wrap, 5);

    //.html("<div class='node-header node_prop_container' style='background-color:gray;'><h1>Node Name</h1><div class='edit'><a href='#'><i class='fa fa-pencil fa-lg'></i></a></div><input type='button' class='node_edit' value='Edit' onclick='node_event_handlers.handle_node_edit();'><input type='button' class='node_delete' value='Delete' onclick='node_event_handlers.handle_node_delete();'></div>");

    start_connector_x = null;
    start_connector_y = null;
}

// function to remove nodes from drawing canvas
function clearNodes(node_id=null) {
    console.log("node_id inside clear"+ node_id);

    // remove nodes from svg
    for(var i=0;i<Object.keys(node_list).length;i++) {
        var selector = "#"+Object.keys(node_list)[i];
        console.log("selector: "+selector);
        d3.select(selector).remove();
    }

    // remove lines from svg
    var clear_lines = [];
    for(var i=0;i<line_node_connection_list.length;i++) {
        d3.select("#"+line_node_connection_list[i].line_id).remove();
    }
    /*for(var i=0;i<Object.keys(node_list).length;i++) {
        var node_id = Object.keys(node_list)[i];
        for(var j=0;j<node_list[node_id].connected_lines.length;j++) {
            var line_id = node_list[node_id].connected_lines[j].id;
            if(clear_lines.indexOf(line_id) == -1) {
                clear_lines.push(line_id);
                console.log("line id: "+line_id);
                d3.select('#'+line_id).remove();
            }
        }
    }*/
}

// function to redraw flowchart from the saved nodes, lines list
function redrawNodes() {
    for(var i=0;i<Object.keys(node_list).length;i++) {
        var node = node_list[Object.keys(node_list)[i]];
        createNode('node', node.node_pos_x, node.node_pos_y, node_width, node_height, redraw=true, Object.keys(node_list)[i].substr(4, Object.keys(node_list)[i].length));
    }

    for(var i=0;i<line_node_connection_list.length;i++) {
        d3.select('#charts').insert("line", ".first-g + *") // insert line right after .first-g element
            .attr("x1", line_node_connection_list[i].line_pos_x1)
            .attr("y1", line_node_connection_list[i].line_pos_y1)
            .attr("x2", line_node_connection_list[i].line_pos_x2)
            .attr("y2", line_node_connection_list[i].line_pos_y2)
            .attr("class", "connector_line");
    }

    // redraw lines from node_list
    /*for(var i=0;i<Object.keys(node_list).length;i++) {

        var child_node_id = Object.keys(node_list)[i];

        console.log("child_node_id: "+child_node_id);
        console.log("input_context: "+node_list[child_node_id].in_ctx);

        if(node_list[child_node_id].in_ctx.length > 0) {
            for(var j=0;j<node_list[child_node_id].in_ctx.length;j++) {
                var parent_node_id = node_list[child_node_id].in_ctx[j];
                console.log("parent_node_id: "+parent_node_id);
                for(var k=0;k<node_list[child_node_id].connected_lines.length;k++) {
                    console.log("connected with(node_list[child_node_id].connected_lines[k].connected_with): "+node_list[child_node_id].connected_lines[k].connected_with);
                    if(node_list[child_node_id].connected_lines[k].connected_with == parent_node_id) {
                        console.log('inside if....');
                        x = node_list[child_node_id].connected_lines[k].connected_end.x;
                        y = node_list[child_node_id].connected_lines[k].connected_end.y;

                        console.log("connected_end x: "+ x);
                        console.log("connected_end y: "+ y);

                       if(x == 'x1' && y == 'y1') {
                            line = d3.select('#charts').insert("line", ".first-g + *") // insert line right after .first-g element
                            .attr("x1", node_list[child_node_id].node_pos_x + 50)
                            .attr("y1", node_list[child_node_id].node_pos_y)
                            .attr("x2", node_list[parent_node_id].node_pos_x + 50)
                            .attr("y2", node_list[parent_node_id].node_pos_y + 100)
                            .attr("class", "connector_line")
                            .attr("id", node_list[child_node_id].connected_lines[k].id);
                        } else if(x == 'x2' && y == 'y2') {
                            line = d3.select('#charts').insert("line", ".first-g + *") // insert line right after .first-g element
                            .attr("x1", node_list[parent_node_id].node_pos_x + 50)
                            .attr("y1", node_list[parent_node_id].node_pos_y + 100)
                            .attr("x2", node_list[child_node_id].node_pos_x + 50)
                            .attr("y2", node_list[child_node_id].node_pos_y)
                            .attr("class", "connector_line")
                            .attr("id", node_list[child_node_id].connected_lines[k].id);
                        }
                    break;
                    }
                }
            }
        }
    }*/
}

// addNode function called for onclick event
function addNode() {
    var is_any_node_on_top_left = check_is_any_node_on_top_left();
    if(is_any_node_on_top_left) alert('Please move the node from top left corner...');
    else createNode("node", top_left_x, top_left_y, node_width, node_height);
}

function check_is_any_node_on_top_left() {
    for(var i=0;i<Object.keys(node_list).length;i++) {
        var node_id = Object.keys(node_list)[i];
        if(node_list[node_id].node_pos_x == top_left_x && node_list[node_id].node_pos_y == top_left_y) return true;
    }
    return false
}

/* deletes a particular node and its associated lines */
function node_delete() {
    console.log('node delete called....');
    d3.select(this.parentNode).on('mousedown.drag', null); // prevents mousedown event handler call
    d3.select(this.parentNode).remove(); // removes node element from svg
    var node_id_to_be_deleted = d3.select(this.parentNode).attr('id');
    var delete_lines = [];

    for(var i=0;i<line_node_connection_list.length;i++) {
        var line_id = line_node_connection_list[i].line_id;
        if(node_id_to_be_deleted == line_node_connection_list[i].source_id || node_id_to_be_deleted == line_node_connection_list[i].dest_id ) {
            d3.select('#'+line_node_connection_list[i].line_id).remove();
        }
    }

    // remove node_id_to_be_deleted from other nodes in_ctx
    for(var i=0;i<Object.keys(node_list).length;i++) {
        var node_id = Object.keys(node_list)[i];
        for(var j=0;j<node_list[node_id].in_ctx.length;j++) {
            if(node_list[node_id].in_ctx[j] == node_id_to_be_deleted) {
                node_list[node_id].in_ctx.splice(node_list[node_id].in_ctx.indexOf(node_id_to_be_deleted), 1);
            }
        }
    }

    var line_to_be_deleted = [];
    // remove line from line_node_connection_list
    for(var i=0;i<line_node_connection_list.length;i++) {
        if(node_id_to_be_deleted == line_node_connection_list[i].source_id || node_id_to_be_deleted == line_node_connection_list[i].dest_id ) {
            line_to_be_deleted.push(line_node_connection_list[i].line_id);
        }
    }

    for(var i=0;i<line_to_be_deleted.length;i++) {
        for(var j=0;j<line_node_connection_list.length;j++) {
            if(line_to_be_deleted[i] == line_node_connection_list[j].line_id) {
                line_node_connection_list.splice(j, 1);
                break;
            }
        }
    }

    /* removes the associated lines from connection_list list*/
    /*$.each(delete_lines, function(i, elem) {
        console.log('inside delete_lines...');
        console.log(elem);
        // remove lines associated with other nodes
        for(var i=0;i<Object.keys(node_list).length;i++) {
            var n_id = Object.keys(node_list)[i];
            console.log("first for loop n_id: "+ n_id);
            for(var j=0;j<node_list[n_id].connected_lines.length;j++) {
                console.log("inside second for loop line_id: "+ node_list[n_id].connected_lines[j].id);
                if(elem == node_list[n_id].connected_lines[j].id) {
                    console.log('inside if...break...');
                    // remove in_ctx from nodes which was connected to n_id
                    for(var k=0;k<Object.keys(node_list).length;k++) {
                        var connected_node_id = Object.keys(node_list)[k];
                        console.log("connected_node_id: "+connected_node_id);
                         if(node_list[connected_node_id].in_ctx.indexOf(n_id) !=-1) {
                            node_list[connected_node_id].in_ctx.splice(node_list[connected_node_id].in_ctx.indexOf(n_id), 1);
                         }
                    }

                    //delete node_list[Object.keys(node_list)[i]].connected_lines.splice(j, 1);
                    node_list[Object.keys(node_list)[i]].connected_lines.splice(j, 1);
                    break;
                }
            }
        }
        //delete connection_list[elem];
    });*/
    delete node_list[d3.select(this.parentNode).attr('id')];
}