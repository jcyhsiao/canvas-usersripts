// ==UserScript==
// @name         Select all pages
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.07-1
// @description  One button to select all pages on the Pages index
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/pages
// @run-at       context-menu
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const checkboxes = document.getElementsByClassName('select-page-checkbox');
    for (const checkbox of checkboxes) {
        if (checkbox.disabled === false) {
            checkbox.checked = true;
        }
    }
    const delete_button = document.getElementsByClassName('delete_pages');
    if (delete_button.length === 1) {
        delete_button[0].disabled = false;
    }
})();
