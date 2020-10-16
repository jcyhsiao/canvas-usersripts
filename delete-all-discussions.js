// ==UserScript==
// @name         Delete all discussions on the Discussions index page
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.09-2
// @description  One button to delete all items on the Discussions index page
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/discussion_topics
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// Triggered by clicking button
function execute() {
    let is_discussions = false;

    // Gather all discussion delete buttons
    // Check if we're on either Assignments or Quizzes
    // NOTE: Just in case - currently it's not possible to automate this for the quizzes page
    let manage_menu_buttons = document.querySelectorAll('div.ig-admin i.icon-more');
    if (manage_menu_buttons.length === 0) {
        manage_menu_buttons = document.querySelectorAll('span.ic-discussion-content-container span.discussions-index-manage-menu button');
        is_discussions = true;
    }

    // User confirmation
    if (window.confirm("Do you really want to delete all items?")) {
        for (const button of manage_menu_buttons) {
            if (is_discussions) {
                button.click();
                let menu_option_delete = document.querySelector('#delete-discussion-menu-option');
                // Click delete button in management menu
                menu_option_delete.click();
                // Which brings up a confirmation dialog
                let confirm_delete = document.querySelector('#confirm_delete_discussions');
                // Click delete confirmation button to delete
                confirm_delete.click();
            }
            else {
                // This is not implemented
                return;
            }
        }
    }


}

(function() {
    'use strict';

    // Adding the new button as the first item in #content
    const div_content = document.querySelector('#content-wrapper');

    const new_button = document.createElement('button');
    new_button.onclick = execute;
    new_button.innerHTML = 'Delete All Items';
    new_button.classList.add('btn');
    new_button.setAttribute('type', 'button');
    new_button.setAttribute('tabIndex', '0');
    new_button.setAttribute('id', 'delete_all_btn');
    // button_select_all.style.float = 'right';
    new_button.style.margin = '.5em';

    div_content.insertBefore(new_button, div_content.childNodes[1]);
})();
