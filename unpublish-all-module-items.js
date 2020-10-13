// ==UserScript==
// @name         Unpublish all items in module
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.12-1
// @description  One button to select all pages in a given module
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/modules
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// Triggered by clicking button
async function execute() {
    if (window.confirm("Do you really want to unpublish all module items?")) {
        // Getting the module number from the button
        const module_id_number = this.id.split('_').pop();
        // Select the module that the button is for
        const module_id = `context_module_${module_id_number}`;
        const module = document.querySelector(`#${module_id}`);
        // Select all module items
        const module_items = module.querySelectorAll('li.context_module_item');

        for (const module_item of module_items) {
            let class_list = module_item.classList;
            // We're doing this with only published module items
            let publish_icon = module_item.querySelector('i.icon-publish');
            if (publish_icon !== null) {
                if (class_list.contains('attachment')) {
                    publish_icon.click();
                    // Needed a time out for the form to load first
                    await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 sec
                    let unpublish_option = document.querySelector('.permissions-dialog-form i.icon-unpublish');

                    let update_button = document.querySelector('.permissions-dialog-form button[type="submit"]');
                    unpublish_option.click();
                    update_button.click();
                    // Waiting 0.25 secs just in case
                    await new Promise(resolve => setTimeout(resolve, 250));
                } else {
                    publish_icon.click();
                }
            }
        }

        alert("Task completed!");
    }
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
        new_button.id = `unpublish_all_items_btn_${module_id}`;
        header_admin_bar.insertBefore(new_button, header_admin_bar.childNodes[1]);
    }
}

// Create a new "unpublish all items" button
function create_button() {
    const button = document.createElement('button');
    button.onclick = execute;
    button.innerHTML = 'Unpublish All Items';
    button.classList.add('btn');
    button.classList.add('unpublish_all_items_btn');
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
