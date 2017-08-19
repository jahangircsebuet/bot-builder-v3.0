(function ($) {
    $(function () {

        var addFormGroup = function (event) {
            event.preventDefault();

            var $formGroup = $(this).closest('.form-group');
            var $multipleFormGroup = $formGroup.closest('.multiple-form-group');
            var $formGroupClone = $formGroup.clone();

            $(this)
            .removeClass('btn-add-slot')
            .addClass('btn-remove-slot')
            .html("Remove");

            //$formGroupClone.find('input').val('');
            $formGroupClone.insertAfter($formGroup);

            /*
            var $lastFormGroupLast = $multipleFormGroup.find('.form-group:last');
            if ($multipleFormGroup.data('max') <= countFormGroup($multipleFormGroup)) {
                $lastFormGroupLast.find('.btn-add').attr('disabled', true);
            }
            */
        };

        var removeFormGroup = function (event) {
            event.preventDefault();

            var $formGroup = $(this).closest('.form-group');
            var $multipleFormGroup = $formGroup.closest('.multiple-form-group');

            var $lastFormGroupLast = $multipleFormGroup.find('.form-group:last');
            /*
            if ($multipleFormGroup.data('max') >= countFormGroup($multipleFormGroup)) {
                $lastFormGroupLast.find('.btn-add').attr('disabled', false);
            }
            */
            console.log('delete slot: ' + $($formGroup).find('.slot-name').val());
            $($formGroup).remove();
            var node_id = $('#modalTitle').html();
            var slot_name = $formGroup.find('.slot-name').val();
            removeSlotByName(node_id, slot_name);
            console.log("slot-name: "+ slot_name);
        };

        var countFormGroup = function ($form) {
            return $form.find('.form-group').length;
        };

        $('#saveNode').on('click', function(event) {
            event.preventDefault();
            var nodeValue = {
                'intent': null,
                'slots': null,
                'node_reply': null,
                'action_string': null
            };

            var node_id = $('#modalTitle').html();

            // returns node with node_id if exists otherwise null, helper.check_if_exists_in_story
            var isExists = check_if_exists_in_story(node_id);
            console.log("isExists inside saveNode action handler...");
            console.log(isExists);

            var intent = $("#intentName option:selected").text();
            var nodeReply = $('#nodeReply').val();
            var actionString = $('#actionString').val();

            var node_txt_id = "#node_txt"+node_id.substr(4, node_id.length);
            d3.select(node_txt_id).text(intent);

            var slots;
            var slot_name_temp = [];
            var slot_entity_temp = [];
            var slot_prompt_temp = [];

            // fetch the slot names store in temp
            $(".slot-field .slot-name").each(function() {
                slot_name_temp.push($(this).val());
            });
            // fetch the entities and store in temp
            $(".slot-field .slot .slot-entity :selected").each(function(index, element) {
                slot_entity_temp.push($(element).text());
            });
            // fetch the slot prompts and store in temp
            $(".slot-field .slot-prompt").each(function() {
                slot_prompt_temp.push($(this).val());
            });
            // get 3 value tuples{'slot_name': , 'entity': , 'slot_prompt': } from the above 3 temp
            slots = getSlotTuple(slot_name_temp, slot_entity_temp, slot_prompt_temp);

            nodeValue.intent = intent;
            nodeValue.slots = slots;
            nodeValue.node_reply = nodeReply;
            nodeValue.action_string = actionString;

            if(isExists != null) { // helper.update_story_node
                update_story_node(node_id, nodeValue);
            } else {
                story.push({'node_id': node_id, 'nodeValue': nodeValue});
            }

            d3.select("text#"+node_id).text(intent);
            console.log('before wrap_intent_name function call....');
            wrap_intent_name(node_txt_id);

            console.log("nodeValue....");
            console.log(nodeValue);
        });

        $(document).on('click', '.btn-add-slot', addFormGroup);
        $(document).on('click', '.btn-remove-slot', removeFormGroup);
    });
})(jQuery);