// ==UserScript==
// @name         Master refresh assignments
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.16-1
// @description  One button to delete all assignment groups on the Assignments index page; moves all assignments to a predefined group
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/assignments
// @run-at       document-idle
// @grant        none
// ==/UserScript==


function get_ag_numeral_id(ag_id) {
    let id_elements = ag_id.split('_');
    return id_elements[id_elements.length - 1];
}

// Triggered by clicking button
async function execute() {

    // By default, we have a "_Planned Assignments" and an "_Inactive Assignments" assignment group
    const skip_assignment_group_name = '_planned assignments';
    const move_to_assignment_group_name = '_inactive assignments';
    let skip_assignment_group_id = null;
    let move_to_assignment_group_id = null;

    let deleted_count = 0;
    let manual_delete_count = 0;

    // Gather all assignment groups (div.assignment_group)
    const assignment_groups = document.querySelectorAll('div.assignment_group');

    // TEMP: The approach to working off of assignment_groups did not work; this approach collect IDs and work that way instead
    let assignment_group_ids = []
    for (const ag of assignment_groups) {
        let ag_id = get_ag_numeral_id(ag.id);
        assignment_group_ids.push(ag_id);

        // We don't want to do anything with assignments in the "_Planned Assignments" group, and want to move the rest of the assignments to "_Inactive Assignments"
        // So, we need to get their IDs first
        let h2 = ag.querySelector('h2.ig-header-title');
        let h2_text = (h2 !== null) ? h2.innerText.toLowerCase().trim() : '';

        // Save these ids if they match the specified assignment groups
        if (h2_text === skip_assignment_group_name) {
            skip_assignment_group_id = ag_id;
        } else if (h2_text === move_to_assignment_group_name) {
            move_to_assignment_group_id = ag_id;
        }
    }

    for (const ag_id of assignment_group_ids) {
        // If it's either of the skip or move to assignment groups do nothing
        if (ag_id === skip_assignment_group_id || ag_id === move_to_assignment_group_id) { continue ; }

        // Get the assignment group
        let ag = document.querySelector(`div[id='assignment_group_${ag_id}']`);
        console.log(ag);

        // Check if the module is empty
        let module_is_empty = (ag.querySelector('li.no-items') !== null);

        // If module is empty, manual confirmation is needed
        if (module_is_empty) {
            manual_delete_count += 1;
            continue;
        } else {
            // For the confirmation dialog
            deleted_count += 1;

            // First, open the delete dialog
            let module_delete_group_button = ag.querySelector('a.delete_group');
            module_delete_group_button.click()
            // Wait for the dialog to load first
            await new Promise(resolve => setTimeout(resolve, 500));

            // Get UI elements of the modal dialog
            let modal_dialog = document.querySelector('div.ui-dialog[aria-hidden="false"');
            let modal_dialog_close_button = modal_dialog.querySelector('button.ui-dialog-titlebar-close');
            let modal_dialog_delete_group_button = modal_dialog.querySelector('button.delete_group');

            // Then, select the "Move to" option of the dialog for the module
            let move_to_select = modal_dialog.querySelector(`label[id='ag_move_${ag_id}'] input.assignment_group_move`);
            move_to_select.click();

            // Then, change value of the "Move to" select
            let move_to_dropdown = modal_dialog.querySelector(`select[aria-labelledby='ag_move_${ag_id}']`);
            move_to_dropdown.value = move_to_assignment_group_id;

            // Then, commit change.
            modal_dialog_delete_group_button.click()
            // Waiting 0.25 secs just in case
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    alert(`${deleted_count} non-empty assignment group(s) were removed with their contents moved into the ${move_to_assignment_group_name} group. ${manual_delete_count} empty assignment group(s) need to be manually deleted.`);

}

(function() {
    'use strict';

    // Adding the new button as the first item in #content
    const div_content = document.querySelector('#content-wrapper');

    const button_new = document.createElement('button');
    button_new.onclick = execute;
    button_new.innerHTML = 'Master Refresh Assignments';
    button_new.classList.add('btn');
    button_new.setAttribute('type', 'button');
    button_new.setAttribute('tabIndex', '0');
    button_new.setAttribute('id', 'refresh_btn');
    // button_select_all.style.float = 'right';
    button_new.style.margin = '.5em';

    div_content.insertBefore(button_new, div_content.childNodes[1]);
})();
