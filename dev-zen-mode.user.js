// ==UserScript==
// @name         DEV Zen mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable noise for zen reading (press Shift+Z to toggle)
// @author       detunized
// @match        https://dev.to/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // From https://stackoverflow.com/a/18950690/362938
    var H = window.history;
    var oldPushState = H.pushState;
    H.pushState = function (state) {
        if (typeof H.onpushstate == "function") {
            H.onpushstate ({state: state} );
        }
        return oldPushState.apply (H, arguments);
    }

    window.onpopstate = history.onpushstate = function (evt) {
        if ($dev_zen_mode_on) {
            toggleZen();
        }
    }

    var $dev_zen_mode_on = false;

    function isArticle() {
        return !!document.getElementById("article-show-container");
    }

    function toggleZen(key) {
        var display = $dev_zen_mode_on ? "" : "none";

        var ids = ["top-bar", "article-reaction-actions", "article-show-primary-sticky-nav", "additional-content-area", "footer-container"];
        ids.forEach(id => {
            var e = document.getElementById(id);
            if (e) {
                e.style.display = display;
            }
        });

        var classes = ["show-page-content-display", "more-articles"];
        classes.forEach(cls => {
            for (let e of document.getElementsByClassName(cls)) {
                e.style.display = display;
            }
        });

        $dev_zen_mode_on = !$dev_zen_mode_on;
    }

    function handleKeyEvent(key) {
        if (key.key == "Z" && key.shiftKey && isArticle()) {
            toggleZen();
        }
    }

    document.addEventListener("keydown", handleKeyEvent, false);
})();
