/*function get_max_line_id() {
    //if(Object.keys(connection_list).length == 0) return 0;
    //var idx = Object.keys(connection_list).length - 1;
    //var id = Object.keys(connection_list)[idx];
    var max = -9999;
    var line_list = get_all_line_id();
    for(var i=0;i<line_list.length;i++) {
        if(line_list[i].substr(line_list[i].indexOf('line') + 4, line_list[i].length) > max)
            max = line_list[i].substr(line_list[i].indexOf('line') + 4, line_list[i].length);
    }
    if(line_list.length == 0) return 0;
    return max;
}*/

/*function get_all_line_id() {
    var line_list = [];
    for(var i=0;i<Object.keys(node_list).length;i++) {
        var node_id = Object.keys(node_list)[i];
        for(var j=0;j<node_list[node_id].connected_lines.length;j++) {
            var line_id = node_list[node_id].connected_lines[j].id;
            if(line_list.indexOf(line_id) == -1) {
                line_list.push(line_id);
            }
        }
    }
    return line_list;
}*/

function check_node_is_connected(dest_node, source_node) {
    if(dest_node['connector'] == 'bottom') {
        if(node_list[source_node].in_ctx.indexOf(dest_node['node_id']) != -1 || node_list[dest_node['node_id']].in_ctx.indexOf(source_node) != -1  ) return true;
        else return false;
    } else if(dest_node['connector'] == 'top') {
        if(node_list[dest_node['node_id']].in_ctx.indexOf(source_node) != -1 || node_list[source_node].in_ctx.indexOf(dest_node['node_id']) != -1) return true;
        else return false;
    }
}

function getSlotTuple(slot_name_temp, slot_entity_temp, slot_prompt_temp) {
    var slots = [];
    for(var i=0;i<slot_name_temp.length;i++) {
        slots.push({'slot_name': slot_name_temp[i], 'entity': slot_entity_temp[i], 'slot_prompt': slot_prompt_temp[i]});
    }
    return slots;
}

function check_if_exists_in_story(node_id) {
    for(var i=0;i<story.length;i++) {
        if(story[i].node_id == node_id) {
            return story[i];
        }
    }
    return null;
}

function update_story_node(node_id, nodeValue) {
    for(var i=0;i<story.length;i++) {
        if(story[i].node_id == node_id) {
            story[i].node_id = node_id;
            story[i].nodeValue = nodeValue;
            break;
        }
    }
}