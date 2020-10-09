// ==UserScript==
// @name         Delete all discussions
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.09-1
// @description  One button to select all pages on the Pages index page
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/discussion_topics
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// Triggered by clicking button
function execute() {
    // Gather all discussion delete buttons
    const delete_buttons = document.querySelectorAll('.ic-discussion-content-container .discussions-index-manage-menu button');
    for (let i = 0; i < delete_buttons.length; i++) {
        console.log(`deleting button ${i + 1} of ${delete_buttons.length}`);
        let button = delete_buttons[i];
        // Click delete button to reveal management menu
        button.click();
        let menu_option_delete = document.querySelector('#delete-discussion-menu-option');
        // Click delete button in management menu
        menu_option_delete.click();
        // Which brings up a confirmation dialog
        let confirm_delete = document.querySelector('#confirm_delete_discussions');
        // Click delete confirmation button to delete
        confirm_delete.click();
    }

}

(function() {
    'use strict';

    // Adding the new button as the first item in #content
    const div_content = document.querySelector('#content-wrapper');

    const button_select_all = document.createElement('button');
    button_select_all.onclick = execute;
    button_select_all.innerHTML = 'Delete All Discussions';
    button_select_all.classList.add('btn');
    button_select_all.setAttribute('type', 'button');
    button_select_all.setAttribute('tab-index', '0');
    button_select_all.setAttribute('id', 'delete_all_btn');
    // button_select_all.style.float = 'right';
    button_select_all.style.margin = '1em';

    div_content.insertBefore(button_select_all, div_content.childNodes[1]);
})();
