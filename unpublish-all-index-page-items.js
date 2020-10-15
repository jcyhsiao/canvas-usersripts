// ==UserScript==
// @name         Unpublish all items on index page
// @namespace    https://github.com/jcyhsiao/canvas-usersripts
// @version      2020.10.15-1
// @description  One button to unpublish all items on the Quizzes, Assignments, or Discussions index page
// @author       Chih-Yu (Jay) Hsiao
// @include      https://*.*instructure.com/courses/*/discussion_topics
// @include      https://*.*instructure.com/courses/*/quizzes
// @include      https://*.*instructure.com/courses/*/assignments
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// Triggered by clicking button
function execute() {
    // Gather all unpublish icons
    // This is handled differently for Quizzes and Assignments vs. Discussions
    // - For Discussions, unpublished icon is svg[name="IconUnpublished], and published icon is svg[name="IconPublish"], which is wrapped in a span, which is in turn wrapped in a button
    // - For Quizzes and Discussions, unpublished icon is i.icon-unpublish, and published icon is i.icon-publish

    let is_discussions = false;
    let progress_count = 0;
    let not_unpublishable_count = 0;

    // First, check if we're on either Assignments or Quizzes
    let unpublish_buttons = document.querySelectorAll('i.icon-publish');
    if (unpublish_buttons.length === 0) {
        unpublish_buttons = document.querySelectorAll('svg[name="IconPublish');
        is_discussions = true;
    }

    const published_count = unpublish_buttons.length;

    // User confirmation
    if (window.confirm("Do you really want to unpublish all published items?")) {
        for (const button of unpublish_buttons) {
            // If we're on the discussions page, we actually want the button which wraps the span that wraps the button; otherwise, we've already got the right element
            let actual_button = is_discussions ? button.parentElement.parentElement : button;
            // If an item cannot be unpublished, clicking it would do nothing
            // - For Discussions, the button element would have attribute of disabled = true
            // - For Quizzes and Discussions, the span that wraps it would have a "disabled" class
            let cannot_unpublish = is_discussions ? (actual_button.disabled === true) : actual_button.parentElement.classList.contains('disabled');
            // If unpublishable, click it
            if (!cannot_unpublish) {
                actual_button.click();
                progress_count += 1;
            } else {
                not_unpublishable_count += 1;
            }
        }
    }

    let unpublishable_count = published_count - not_unpublishable_count;

    // Report task results
    alert(`${unpublishable_count} of ${published_count} items were unpublishable and have been unpublished!`);


}

(function() {
    'use strict';

    // Adding the new button as the first item in #content
    const div_content = document.querySelector('#content-wrapper');

    const button_select_all = document.createElement('button');
    button_select_all.onclick = execute;
    button_select_all.innerHTML = 'Unpublish All Items';
    button_select_all.classList.add('btn');
    button_select_all.setAttribute('type', 'button');
    button_select_all.setAttribute('tabIndex', '0');
    button_select_all.setAttribute('id', 'unpublish_all_btn');
    // button_select_all.style.float = 'right';
    button_select_all.style.margin = '.5em';

    div_content.insertBefore(button_select_all, div_content.childNodes[1]);
})();
