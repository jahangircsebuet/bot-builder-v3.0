var source_node;
var dest_node;
var source_connector;
var dest_connector;

// line drawing event handlers
function mousedown() {
    node_id = d3.select(this.parentNode).attr('id');
    source_node = node_id;
    dest_node = null;

    var elem = d3.select('svg');
    var m = d3.mouse(elem.node());
    var elem = d3.select(this.parentNode); // get the g element

    if(elem.attr("class").indexOf("node-connector") != -1) check_which_rect = 'on_connector';

    line_svg = d3.select('#charts'); // this is the same svg
    //connection_list_size = Object.keys(connection_list).length;
    //var next_line_id = parseInt(get_max_line_id()) + 1; // helper



    // initially set the starting point as the line start(x1, y1) and end point(x2, y2)
        //line = line_svg.append("line")
        line = d3.select('#charts').insert("line", ".first-g + *") // insert line right after .first-g element
            .attr("x1", m[0])
            .attr("y1", m[1])
            .attr("x2", m[0])
            .attr("y2", m[1])
            .attr("class", "connector_line")
            //.attr("id", "line"+next_line_id)
            ;

    start_connector_x = m[0];
    start_connector_y = m[1];

    var which_connector;
    if(d3.select(this).attr('class').indexOf('top') != -1) which_connector = 'top';
    else if(d3.select(this).attr('class').indexOf('bottom') != -1) which_connector = 'bottom';
    source_connector = which_connector;

    //node_list[d3.select(this.parentNode).attr('id')].connected_lines.push({'id': "line"+next_line_id, 'connected_with': '','connected_end': {'x': 'x1', 'y': 'y1'}, 'connector': which_connector});

    // call the mouse move event handler to continuous drawing of the line
    line_svg.on("mousemove", function() {mousemove(line, source_node, source_connector);});
}

function mousemove(line, source_node, source_connector) {
    // get the end(x2, y2) point from mouse co-ordinate with respect to svg
    var elem = d3.select('svg');
    var m = d3.mouse(elem.node());

    // set the line end(x2, y2) co-ordinate
    line.attr("x2", m[0])
        .attr("y2", m[1]);

    // then call the mouse up event when reach the connection end point or the second node connection point
    line_svg.on("mouseup", function() {mousmove_null(line, source_node, source_connector);});
}

function mousmove_null(line, source_node, source_connector) {
    var elem = d3.select('svg');
    var m = d3.mouse(elem.node());

    var mouse_x = m[0];
    var mouse_y = m[1];

    var node_id_connector = get_node_id_and_connector(mouse_x, mouse_y, source_connector);
    //console.log('n_id: '+ node_id_connector['node_id']);
    console.log("node_id_connector");
    console.log(node_id_connector);
    if(node_id_connector['node_id'] == null) {

        var connector_dist = get_nearest_connector_distance(source_node, source_connector, mouse_x, mouse_y);
        //console.log("connector_dist: "+ connector_dist['dist']);
        //console.log("connector_node_id: "+ connector_dist['node_id']);
        //console.log("connector_connector: "+ connector_dist['connector']);

        node_id_connector['node_id'] = connector_dist['node_id'];
        node_id_connector['connector'] = connector_dist['connector'];

        if(connector_dist['dist'] < min_dist_to_connector) {
            //console.log("node_id_connector['node_id']: "+ node_id_connector['node_id']);
            //console.log("node_id_connector['connector']: "+ node_id_connector['connector']);
            connect_node(line, source_node, node_id_connector);
        } else {
            line.remove();
        }
    } else {
        connect_node(line, source_node, node_id_connector);
    }
    source_node = null;
    dest_node = null;
    source_connector = null;
    dest_connector = null;


    line_svg.on("mousemove", null);
    line_svg.on("mouseup", null);
}

/* returns nearest connector to add when cursor moves near any particular node connector, so that node can be connected by moving cursor aroung the connectors */
function get_nearest_connector_distance(source_node, source_connector, mouse_x, mouse_y) {
    var dest_node = null;
    var connector = null;
    var min = 99999;
    var dist = 99999;
    for(var i=0;i<Object.keys(node_list).length;i++) {
        var id = "node"+Object.keys(node_list)[i].substr(4, Object.keys(node_list)[i].length);
        var x2 = mouse_x;
        var y2 = mouse_y;
        if(id != source_node) {
        console.log("inside get_nearest_connection function if....");
        console.log("source_connector: "+source_connector);

            if(source_connector == "top") {
                var x1 = node_list[id].node_pos_x + bottom_connector_offset_x;
                var y1 = node_list[id].node_pos_y + bottom_connector_offset_y;
                connector = "bottom";
            } else if(source_connector == "bottom") {
                var x1 = node_list[id].node_pos_x + top_connector_offset_x;
                var y1 = node_list[id].node_pos_y + top_connector_offset_y;
                connector = "top";
            }
            //if(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) > 1)
            dist = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
            if(dist < min) {
                min = dist;
                dest_node = id;
            }

            console.log("dist: "+ Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
            console.log("near id: "+ id);
            console.log("x1: "+ x1+" y1: "+y1+" x2: "+x2+" y2: "+y2);
        }
    }

    return {'node_id': dest_node, 'connector': connector, 'dist': min};
}

/* connects node connectors if all conditions are satisfied including dest node is not already connected to source node */
function connect_node(line, source_node, node_id_connector) {
       // console.log('inside connect_node...');
        //console.log("node_id_connector['node_id']: "+ node_id_connector['node_id']);
        //console.log("node_id_connector['connector']: "+ node_id_connector['connector']);

        var is_connected = check_node_is_connected(node_id_connector, source_node); // helper
        dest_node = node_id_connector['node_id'];
        //console.log("is_connected: "+is_connected);

        if(source_node != null && source_node != dest_node && is_connected == false) {
            //console.log('inside connect_node....');
            //console.log("source_ndoe: "+ source_node);
            //console.log("dest_node: "+ dest_node);
            //var which_connector = get_which_connector(mouse_x, mouse_y);
            //node_list[dest_node].connected_lines.push({'id': line.attr('id'), 'connected_with': source_node, 'connected_end': {'x': 'x2', 'y': 'y2'}, 'connector': node_id_connector['connector']});

            // add the connected_with of source connector
            //var update_source = update_source_node(line.attr('id'), dest_node);

            if(node_id_connector['connector'] == 'bottom') {
                node_list[source_node].in_ctx.push(dest_node);

                line.attr("x2", node_list[dest_node].node_pos_x + parseInt(node_width/2))
                    .attr("y2", node_list[dest_node].node_pos_y + node_height)
                    .on('mousedown', line_mousedown);
                line.attr('x1', node_list[source_node].node_pos_x + parseInt(node_width/2))
                    .attr('y1', node_list[source_node].node_pos_y);
                line.attr('id', "line"+source_node.substr(4, source_node.length) + dest_node.substr(4, dest_node.length));
                line_node_connection_list.push({'source_id': source_node ,
                                                'source_connector': 'top',
                                                'dest_id': dest_node,
                                                'dest_connector': 'bottom',
                                                'line_id': line.attr('id'),
                                                'line_pos_x1': line.attr('x1'),
                                                'line_pos_y1': line.attr('y1'),
                                                'line_pos_x2': line.attr('x2'),
                                                'line_pos_y2': line.attr('y2')});
                //connection_list[line.attr('id')] = {'line_pos_x1': line.attr('x1'), 'line_pos_y1': line.attr('y1'), 'line_pos_x2': line.attr('x2'), 'line_pos_y2': line.attr('y2'), 'source': {'id':source_node, 'connector': 'top'}, 'dest': {'id': dest_node, 'connector': 'bottom'}};

            } else if(node_id_connector['connector'] == 'top') {
                node_list[dest_node].in_ctx.push(source_node);

                line.attr("x2", node_list[dest_node].node_pos_x + parseInt(node_width/2))
                    .attr("y2", node_list[dest_node].node_pos_y)
                    .on('mousedown', line_mousedown);
                line.attr('x1', node_list[source_node].node_pos_x + parseInt(node_width/2))
                    .attr('y1', node_list[source_node].node_pos_y + node_height);
                line.attr('id', "line"+source_node.substr(4, source_node.length) + dest_node.substr(4, dest_node.length));
                line_node_connection_list.push({'source_id': source_node ,
                                                'source_connector': 'bottom',
                                                'dest_id': dest_node,
                                                'dest_connector': 'top',
                                                'line_id': line.attr('id'),
                                                'line_pos_x1': line.attr('x1'),
                                                'line_pos_y1': line.attr('y1'),
                                                'line_pos_x2': line.attr('x2'),
                                                'line_pos_y2': line.attr('y2')});
                //connection_list[line.attr('id')] = {'line_pos_x1': line.attr('x1'), 'line_pos_y1': line.attr('y1'), 'line_pos_x2': line.attr('x2'), 'line_pos_y2': line.attr('y2'), 'source': {'id': source_node, 'connector': 'bottom'}, 'dest': {'id': dest_node, 'connector': 'top'}};
            }
        } else { // if mouse up on source node
            line.remove();
        }
}

function update_source_node(line_id, dest_node) {
    //console.log('inside update source node...');
    for(var i=0;i<Object.keys(node_list).length;i++) {
        var node_id = Object.keys(node_list)[i];
        //console.log("length: "+node_list[node_id].connected_lines.length);
        for(var j=0;j<node_list[node_id].connected_lines.length;j++) {
            if(node_list[node_id].connected_lines[j].id == line_id && node_list[node_id].connected_lines[j].connected_with == '') {
                //console.log("connected_with before update: "+node_list[node_id].connected_lines[j].connected_with);
                node_list[node_id].connected_lines[j].connected_with = dest_node;
                //console.log("connected_with after update: "+node_list[node_id].connected_lines[j].connected_with);
                return true;
            }
        }
    }
}

function get_node_id_and_connector(x, y, source_connector) {
    var dest_node = null;
    var connector = null;
    // by this part we get 0, 1, 2 etc from node id node0, node1, node2 etc
    var first_node_id = Object.keys(node_list)[0].substr(4, Object.keys(node_list)[0].length);
    for(var i=0;i<Object.keys(node_list).length;i++) {
        var id = "node"+Object.keys(node_list)[i].substr(4, Object.keys(node_list)[i].length);
        //console.log("(x, y): ("+ x+","+y+")")
        //console.log("node_id: "+ id);
        //console.log("node_pos_x: " + node_list[id].node_pos_x +" "+"node_pos_y: " + node_list[id].node_pos_y);
        var node_pos_x = parseInt(node_list[id].node_pos_x);
        var node_pos_y = parseInt(node_list[id].node_pos_y)
        //console.log("parseInt(node_pos_x + 100): "+ parseInt(node_pos_x + 100));
        //console.log("parseInt(node_pos_y + 100): "+ parseInt(node_pos_y + 100));
        if((x > node_pos_x && x < parseInt(node_pos_x + node_width)) && (y > node_pos_y && y < parseInt(node_pos_y + node_width)) ) {
          //  console.log('inside if...');
            //console.log("dest_node: "+ dest_node);
            if((x > node_pos_x && x < parseInt(node_pos_x + node_width)) && (y > node_pos_y && y < parseInt(node_pos_y + parseInt(node_height/2))) && source_connector == "bottom") {
                dest_node = id;
                connector = "top";
            } else if((x > node_pos_x && x < parseInt(node_pos_x + node_width)) && (y > parseInt(node_pos_y + parseInt(node_height/2)) && y < parseInt(node_pos_y + node_height)) && source_connector == "top" ) {
                dest_node = id;
                connector = "bottom";
            }
        }
    }
    return {'node_id': dest_node, 'connector': connector};
}