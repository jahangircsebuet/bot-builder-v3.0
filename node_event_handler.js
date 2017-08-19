var node_event_handlers = {

    'handle_node_delete' : function () {
        alert('Delete');
    },

    'handle_node_edit' : function () {
        alert('Edit');
    }
}
var intentList = ["greetings", "sim_replacement", "nid_no", "mobile_no", "yes", "no", "fnf_no"];
var entityList = ["mob_no", "fnf_no", "nid_no", "location", "check_in", "check_out", "room_no"];

function node_edit() {
    var node_id = d3.select(this.parentNode).attr('id');
    /*
        shows modal for the clicked node with its saved data if previously saved, otherwise shows blank form

        the same modal is used for every node edit action
        so, after adding slots and other field values during editing another node
        the elements have to be removed from the modal div
        and populate with the data of the clicked node or shown as blank if it is a new node
    */
    $('#nodeForm').modal("show");
    $('#modalTitle').html(node_id);

    var node_info = null;
    // returns node with node_id if exists otherwise null, helper.check_if_exists_in_story
    node_info = check_if_exists_in_story(node_id)

    console.log("node_info after check_if_exists_in_story function call.. ");
    console.log(check_if_exists_in_story);

    var intent = null;
    var slots = null;
    var node_reply = null;
    var action_string = null;

    if(node_info != null) {
        intent = node_info.nodeValue.intent;
        node_reply = node_info.nodeValue.node_reply;
        action_string = node_info.nodeValue.action_string;
        slots = node_info.nodeValue.slots;
    }

    var selectedIntentValue = -1;
    var options = $("#intentName");
    $("#intentName").find('option').remove();
    $.each(intentList, function(i, elem) {
        options.append(new Option(elem, i));
        // get the selectedIntentValue of the saved intent for the clicked node
        if(intent == elem) {
            selectedIntentValue = i;
        }
    });

    // set the option selected property according to selectedIntentValue value
    if(intent != null) {
        $('#intentName option[value='+selectedIntentValue+']').prop('selected', 'selected');
    }

    if(slots != null) {
        populate_slots_with_saved_data(slots);
    } else {
        generate_blank_slot_field();
    }

    // set the node reply field
    // set blank if a new node or set with saved data if node already exists
    if(node_reply != null) {
        $('#nodeReply').val(node_reply);
    } else {
        $('#nodeReply').val('');
    }

    // set the action string field
    // set blank if a new node or set with saved data if node already exists
    if(action_string != null) {
        $('#actionString').val(action_string);
    } else {
        $('#actionString').val('');
    }
}

function removeSlotByName(node_id, slot_name) {
    var slots = story[0].nodeValue.slots;
    for(var i=0;i<slots.length;i++) {
        if(slot_name == slots[i].entity) {
            console.log('inside if...');
            delete story[0].nodeValue.slots[i];
            break;
        }
    }
}

function generate_blank_slot_field() {
    // this is a new node , so remove the previously added elements from modal div and generate a modal with blank fields
        $('.slot-field').each(function(i, elem) {
            if(i == 0) {
                $(elem).find('.slot .slot-name').val('');
                $.each(entityList, function(j, element) {
                    $('.slot-field').find('.slot-entity').append(new Option(element, j));
                });
                $(elem).find('.slot .slot-prompt').val('');
            }
            if(i > 0) {
                $(elem).remove();
            }
        });

        $('.slot-field .add-slot').removeClass('btn-remove-slot');
        $('.slot-field .add-slot').removeClass('btn-add-slot');
        $('.slot-field .add-slot').addClass('btn-add-slot');
        $('.slot-field .add-slot').text('Add Slot');

        var slot_select = $('.slot-entity');
        $(".slot-entity").find('option').remove();
        $.each(entityList, function(i, elem) {
            slot_select.append(new Option(elem, i));
        });
}

function populate_slots_with_saved_data(slots) {
        var slot_field_element = null;
        // remove the previously added slot fields from slot field in modal
        $('.slot-field').each(function(i, elem) {
            if(i == 0) {
                $(elem).find('.slot .slot-name').val('');
                $.each(entityList, function(j, element) {
                    $('.slot-field').find('.slot-entity').append(new Option(element, j));
                });
                $(elem).find('.slot .slot-prompt').val('');
                slot_field_element = $(elem).clone();
            }
            if(i > 0) {
                $(elem).remove();
            }
        });

        // populate the saved node slots{slot_name, entity, slot_prompt}
        $.each(slots, function(i, elem) {
        console.log("insdie populate the saved node slots....")
            if(i == 0) {
                $('.slot-field .slot .slot-name').val(elem.slot_name);
                $(".slot-field .slot .slot-entity").find('option').remove();
                $.each(entityList, function(j, element) {
                    $('.slot-field').find('.slot-entity').append(new Option(element, j));
                    if(element == elem.entity) {
                        $('.slot-field').find('.slot-entity').find('option[value='+j+']').prop('selected', 'selected');
                    }
                });
                $('.slot-field .slot .slot-prompt').val(elem.slot_prompt);
            } else {
                // make a clone of the last slot field to create next slot field
                var clone = $('.slot-field:last').clone();
                $(clone).find('.slot .slot-name').val(elem.slot_name);
                $(clone).find('.slot .slot-entity option').remove();
                $.each(entityList, function(j, element) {
                    $(clone).find('.slot .slot-entity').append(new Option(element, j));
                    if(element == elem.entity) {
                        $(clone).find('.slot .slot-entity').find('option[value='+j+']').prop('selected', 'selected');
                    }
                });
                $(clone).find('.slot .slot-prompt').val(elem.slot_prompt);
                $(clone).insertAfter('.slot-field:last');
            }
        });
        $('.slot-field').each(function(i, element) {
            $(element).find('.add-slot')
                .removeClass('btn-remove-slot')
                .removeClass('btn-add-slot')
                .addClass('btn-remove-slot')
                .html('Remove');
        });
        $('.slot-field:last').find('.add-slot')
                .removeClass('btn-remove-slot')
                .removeClass('btn-add-slot')
                .addClass('btn-add-slot')
                .html('Add Slot');
}

function wrap_intent_name(node_txt_id) {
    //console.log('inside wrap_intent_name function....');
    var text = d3.select(node_txt_id).text();
    var textLength = text.length;

    //console.log("text: "+text);
    //console.log("textLength: "+textLength);

    //console.log("node_intent_character_length: "+node_intent_character_length);

    if(textLength > node_intent_character_length) d3.select(node_txt_id).attr("x", 20);

    while (textLength > node_intent_character_length && text.length > 0) {
        //console.log('inside while loop start...');
        text = text.slice(0, -1);
        d3.select(node_txt_id).text(text + '...');

        textLength = d3.select(node_txt_id).text().length;
        //console.log("text: "+text);
        //console.log("textLength: "+textLength);

        //console.log('inside while loop end...');
    }
}