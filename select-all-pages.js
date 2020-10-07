// ==UserScript==
// @name         Select all pages
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.07-2
// @description  One button to select all pages on the Pages index page
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/pages
// @run-at       context-menu
// @grant        none
// ==/UserScript==

// ==User Configuration==//
// Whether or not to automatically trigger delete
const trigger_delete = true;

// In Chrome-based browsers, access via the right click context menu.
// NOTE: Before you trigger the script, first scroll down the page a couple of times to make sure all pages are loaded.
// TODO: Add a button.
// TODO: Account for additional pages that are only loaded upon infinite scrolling.


(function() {
    'use strict';

    // Select all checkboxes. For each checkbox, fire its click event if it's not already checked.
    const checkboxes = document.querySelectorAll('input[type=checkbox].select-page-checkbox');
    for (const checkbox of checkboxes) {
        if (checkbox.checked === false) {
            checkbox.click();
        }
    }

    // Then, "click" the delete button if trigger_delete is true.
    if (trigger_delete === true) {
        const delete_button = document.querySelector('button.delete_pages');
        delete_button.click();
    }

})();
