// ==UserScript==
// @name         Rename all pages in module
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.15-1
// @description  One button to rename all pages in a given module
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/modules
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// TODO: document

// none, add-prefix, add-suffix, remove-prefix, remove-suffix, replace
const debug_mode = 'none';

// Triggered by clicking button
async function execute() {
    let will_add_prefix = false;
    let will_add_suffix = false;
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

    // For more savvy users and for debug purposes
    if (debug_mode.toLowerCase() !== 'none') {
        switch (debug_mode) {
            case 'add-prefix':
                will_add_prefix = true;
                string_addition = 'zOLD';
                divider = '_';
                break;
            case 'add-suffix':
                will_add_suffix = true;
                string_addition = 'zOLD';
                divider = '_';
                break;
            case 'remove-prefix':
                will_remove_prefix = true;
                rename_from = 'zOLD_';
                break;
            case 'remove-suffix':
                will_remove_suffix = true;
                rename_from = '_zTEST';
                break;
            case 'replace':
                will_replace = true;
                rename_from = '_zOLD';
                rename_to = '_zTEST';
                break;
            default:
                // Do nothing
        }
    } else {

        // First, ask for type of rename user wants to do; continue asking until user explicitly cancels
        do {
            let rename_type = window.prompt('How would you like to rename the pages in this module? (ap: add prefix, as: add suffix, rp: remove prefix, rs: remove suffix, r: replace). \n\nHit "Cancel" or the esc key at any point to cancel');
            // Reset error
            task_selection_error = false;

            switch (rename_type.toLowerCase()) {
                case 'ap':
                    will_add_prefix = true;
                    break;
                case 'as':
                    will_add_suffix = true;
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
                default:
                    alert('Invalid task.');
                    task_selection_error = true;
            }
        } while (task_selection_error === true);


        // Then, prepare depending on type of rename user has chosen
        if (will_add_prefix || will_add_suffix) {
            let addition_type = will_add_prefix ? 'prefix' : 'suffix';

            string_addition = window.prompt(`What is the string you would like to add as ${addition_type}?`);

            // Note that divider is set to be an empty string by default already
            // We can technically ask for this in the previous prompt, but people might be more likely to think about it it's a separate prompt
            divider = window.prompt('Provide a divider to separate your addition with the original page name (leave blank and select "OK" if none): ');
        } else if (will_remove_prefix || will_remove_suffix) {
            // Here, we're not explicitly asking for a divider
            let task_type = will_remove_prefix ? 'prefix' : 'suffix';
            rename_from = window.prompt(`Input the ${task_type} (case-sensitive): `);
        } else if (will_replace) {
            rename_from = window.prompt('Input the OLD string you would like to replace (case-sensitive): ');
            rename_to = window.prompt('Input the NEW string you would like to replace the OLD string with: ');
        }
        // Selecting "Cancel" or hitting the esc key on a prompt returns null
        if (string_addition === null || divider === null || rename_from === null || rename_to === null) {
            alert("Task cancelled");
            return;
        }
    }

    // Getting the module number from the button
    const module_id_number = this.id.split('_').pop();
    // Select the module that the button is for
    const module_id = `context_module_${module_id_number}`;
    const module = document.querySelector(`#${module_id}`);
    // Select the edit button (tucked under the "3-dot" options menu) of all module items that are wiki pages
    const module_pages_edit_buttons = module.querySelectorAll('li.wiki_page a.edit_item_link');

    // This part is for reviewing tasks results
    number_of_items_to_update = module_pages_edit_buttons.length;

    // If we task is adding prefix or suffic, preparing the string addition
    if (will_add_prefix || will_add_suffix) {
        string_addition = will_add_prefix ? `${string_addition}${divider}` : `${divider}${string_addition}`;
    }

    // Then, perform task on each item
    for (const edit_button of module_pages_edit_buttons) {
        // Click edit button, which reveals edit menu
        edit_button.click();

        // Get the text input
        let title_input = document.querySelector('#content_tag_title');

        // Get the close and submit buttons
        let dialog_submit_button = document.querySelector('#edit_item_form').parentElement.querySelector('.button_type_submit');
        let dialog_close_button = document.querySelector('#edit_item_form').parentElement.querySelector('.ui-dialog-titlebar-close');

        // Get current page name from the text input, and prepare the updated page name
        let current_page_name = title_input.value;
        // Since this is null, if there is an error, Canvas will convert this to "undefined"
        let updated_page_name;

        // We'll then decide whether or not we need to save, or can simply exit out of the dialog; we're defaulting to needing to save just in case
        let need_to_save = true;
        let already_has_prefix_or_suffix = current_page_name.toLowerCase().includes(string_addition.toLowerCase());

        // TODO: We might be able to refactor this, but it works well so there may not actually be a need
        if (will_add_prefix) {
            updated_page_name = `${already_has_prefix_or_suffix ? '' : string_addition}${current_page_name}`;
        } else if (will_add_suffix) {
            updated_page_name = `${current_page_name}${already_has_prefix_or_suffix ? '' : string_addition}`;
        } else if (will_remove_prefix || will_remove_suffix || will_replace) {
            updated_page_name = current_page_name.replaceAll(rename_from, rename_to);
        }

        // If the name didn't change, then we don't need to save
        need_to_save = current_page_name !== updated_page_name;

        if (!need_to_save) {
            dialog_close_button.click() ;
        }
        else {
            // This is for the task confirmation at the end
            number_of_items_updated += 1;

            title_input.value = updated_page_name;
            dialog_submit_button.click();
        }
        // Waiting 1 sec just in case
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
