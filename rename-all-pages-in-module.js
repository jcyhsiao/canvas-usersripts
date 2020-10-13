// ==UserScript==
// @name         Rename all pages in module
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.13-2
// @description  One button to rename all pages in a given module
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/modules
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// none, append, prepend, remove-prefix, remove-suffix, replace
const debug_mode = 'remove-suffix';

// Triggered by clicking button
async function execute() {
    let will_append = false;
    let will_prepend = false;
    let will_remove_prefix = false;
    let will_remove_suffix = false;
    let will_replace = false;

    let string_addition = '';
    let divider = '';
    let rename_from = '';
    let rename_to = '';

    let number_of_items_to_update = 0;
    let number_of_items_updated = 0;

    let task_selection_error = false;
    let underscore_input_error = false;

    if (debug_mode.toLowerCase() !== 'none') {
        switch (debug_mode) {
            case 'prepend':
                will_prepend = true;
                string_addition = 'zOLD';
                divider = '_';
                break;
            case 'append':
                will_append = true;
                string_addition = 'zOLD';
                divider = '_';
                break;
            case 'remove-prefix':
                will_remove_prefix = true;
                rename_from = 'zOLD_';
                break;
            case 'remove-suffix':
                will_remove_suffix = true;
                rename_from = '_zOLD';
                break;
            default:
                // Do nothing
        }
    } else {

        do {
            let rename_type = window.prompt("How would you like to rename the pages in this module? (p: prepend, a: append, rp: remove prefix, rs: remove suffix, r: replace, c: cancel)");
            // Reset error
            task_selection_error = false;

            switch (rename_type.toLowerCase()) {
                case 'p':
                    will_prepend = true;
                    break;
                case 'a':
                    will_append = true;
                    break;
                case 'rp':
                    will_remove_prefix = true;
                    break;
                case 'rs':
                    will_remove_suffix = true;
                    break;
                case 'r':
                    will_replace = true;
                    break;
                case 'c':
                    alert('Task cancelled');
                    // Stop
                    return;
                default:
                    alert('Invalid task.');
                    task_selection_error = true;
                    break;
            }
        } while (task_selection_error = true);


        if (will_append || will_prepend) {

            let task_type = will_append ? 'append' : 'prepend';

            string_addition = window.prompt(`What is the string you would like to ${task_type}?`);

            divider = window.prompt('Provide a divider to separate your addition with the original page name (leave blank if none): ');

        } else if (will_remove_prefix || will_remove_suffix) {

            let task_type = will_remove_prefix ? 'prefix' : 'suffix';
            rename_from = window.prompt(`Input the ${task_type}, including any divider; case has to match: `);

        } else if (will_replace) {
            // TODO
            alert("This is not yet implemented");
        } else {
            alert("You did not input a rename type, or input was invalid.");
            return;
        }
    }

    // Getting the module number from the button
    const module_id_number = this.id.split('_').pop();
    // Select the module that the button is for
    const module_id = `context_module_${module_id_number}`;
    const module = document.querySelector(`#${module_id}`);
    // Select all module items
    const module_pages_edit_buttons = module.querySelectorAll('li.wiki_page a.edit_item_link');

    number_of_items_to_update = module_pages_edit_buttons.length;
    string_addition = will_append ? `${divider}${string_addition}` : `${string_addition}${divider}`;

    for (const edit_button of module_pages_edit_buttons) {
        edit_button.click();
        let title_input = document.querySelector('#content_tag_title');
        let dialog_submit_button = document.querySelector('#edit_item_form').parentElement.querySelector('.button_type_submit');
        let dialog_close_button = document.querySelector('#edit_item_form').parentElement.querySelector('.ui-dialog-titlebar-close');
        let current_page_name = title_input.value;
        let updated_page_name;
        // TO DO: skip saving if not updated
        let need_to_save = true;

        let already_has_prefix_or_suffix = current_page_name.toLowerCase().includes(string_addition.toLowerCase());

        if (will_prepend) {
            updated_page_name = `${already_has_prefix_or_suffix ? '' : string_addition}${current_page_name}`;
        } else if (will_append) {
            updated_page_name = `${current_page_name}${already_has_prefix_or_suffix ? '' : string_addition}`;
        } else if (will_remove_prefix || will_remove_suffix) {
            updated_page_name = current_page_name.replaceAll(rename_from, rename_to);
        }

        need_to_save = current_page_name !== updated_page_name;

        if (!need_to_save) {
            dialog_close_button.click() ;
        }
        else {
            number_of_items_updated += 1;
            title_input.value = updated_page_name;
            dialog_submit_button.click();
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec
    }

    alert(`${number_of_items_updated} of ${number_of_items_to_update} items needed to be and were updated!`);
}

// Create "unpublish all items" button for all modules
function create_all_buttons() {
    // Getting the header_admin_bar of each module
    const header_admin_bars = document.querySelectorAll('.ig-header-admin');
    for (const header_admin_bar of header_admin_bars) {
        // Create new button
        let new_button = create_button();
        // The parentElement of the header_admin_bar is the module itself, which has a unique id
        let module_id = header_admin_bar.parentElement.id;
        // Setting this so we can refer to it later
        new_button.id = `rename_all_pages_btn_${module_id}`;
        header_admin_bar.insertBefore(new_button, header_admin_bar.childNodes[1]);
    }
}

// Create a new "unpublish all items" button
function create_button() {
    const button = document.createElement('button');
    button.onclick = execute;
    button.innerHTML = 'Rename All Pages';
    button.classList.add('btn');
    button.classList.add('rename_all_pages_btn');
    button.setAttribute('type', 'button');
    button.setAttribute('tabIndex', '0');
    button.style.marginRight = '0.25em';
    button.style.marginLeft = '0.25em';

    return button;
}

(function() {
    'use strict';

    create_all_buttons();
})();
