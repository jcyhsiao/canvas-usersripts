// ==UserScript==
// @name         Select all pages
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.08-1
// @description  One button to select all pages on the Pages index page
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/pages
// @run-at       context-menu
// @grant        none
// ==/UserScript==

// ==User Configuration==//
const trigger_delete = true; // Whether or not to automatically trigger delete. DEFAULT: true
const select_by_criteria = false; // Whether or not to select by criteria. DEFAULT: false
const selection_criteria = ''; // Selection criteria. DEFAULT: ''

// In Chrome-based browsers, access via the right click context menu.
// NOTE: Before you trigger the script, first scroll down the page a couple of times to make sure all pages are loaded.
// TODO: Add a button.
// TODO: Account for additional pages that are only loaded upon infinite scrolling.


(function() {
    'use strict';

    // Select all checkboxes. For each checkbox, fire its click event if it's not already checked.
    const checkboxes = document.querySelectorAll('input[type=checkbox].select-page-checkbox');
    for (const checkbox of checkboxes) {
        console.log(checkbox.getAttribute('aria-label'));
        if (checkbox.checked === false) {
            const checkbox_aria_label = checkbox.getAttribute('aria-label');
            // If we're not selecting by criteria; or, if we are selecting by criteria, and checkbox's aria-label includes the selection criteria
            if (select_by_criteria === false || (select_by_criteria === true && checkbox_aria_label.includes(selection_criteria))) {
                checkbox.click();
            }
        }
    }

    // Then, "click" the delete button if trigger_delete is true.
    if (trigger_delete === true) {
        const delete_button = document.querySelector('button.delete_pages');
        delete_button.click();
    }

})();
