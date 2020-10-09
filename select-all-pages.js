// ==UserScript==
// @name         Select all pages
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.09-1
// @description  One button to select all pages on the Pages index page
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/pages
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// NOTE: Before you trigger the script, first scroll down the page a couple of times to make sure all pages are loaded.
// TODO: Account for additional pages that are only loaded upon infinite scrolling.

/* User Configuration */
const trigger_delete = false; // Whether or not to automatically trigger delete. DEFAULT: false
const select_by_criteria = false; // Whether or not to select by criteria. DEFAULT: false
const selection_criteria = ''; // Selection criteria. DEFAULT: ''

// Using timeout for a hacky implementation for now
function execute() {
    show_all_pages()
    setTimeout(function() {
        select_all_pages();
    }, 3500);

}

// Keep scrolling until no more results can be loaded
// 'async' because this step needs to be completed before next step can start
function show_all_pages() {
    // A hacky implementation for now
    function scroll(timeout) {
        setTimeout(function() {
            if (document.querySelector('.loading-more') !== null) {
                document.querySelector('.loading-more').scrollIntoView();
                console.log('scrolling...');
            }
        }, timeout * 500);
    }

    scroll(1);
    scroll(2);
    scroll(3);
    scroll(4);
    scroll(5);
}

// Select all pages
function select_all_pages() {
    // Select all checkboxes. For each checkbox, fire its click event if it's not already checked.
    const checkboxes = document.querySelectorAll('input[type=checkbox].select-page-checkbox');
    for (const checkbox of checkboxes) {
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
}


(function() {
    'use strict';

    // For now, we're adding the new button as the first item in #content, because header-bar-right refreshes after table load and the button will be lost
    const div_content = document.querySelector('#content');

    const button_select_all = document.createElement('button');
    button_select_all.onclick = execute;
    button_select_all.innerHTML = 'Select All Pages';
    button_select_all.classList.add('btn');
    button_select_all.setAttribute('type', 'button');
    button_select_all.setAttribute('tab-index', '0');
    button_select_all.setAttribute('id', 'select_all_btn');
    button_select_all.style.float = 'right';
    button_select_all.style.marginBottom = '0.5em';

    div_content.insertBefore(button_select_all, div_content.childNodes[1]);
})();
