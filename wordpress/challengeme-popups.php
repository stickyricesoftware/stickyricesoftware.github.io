<?php
/**
 * Plugin Name: challenge me popups
 * Description: Displays warning popups
 * Version: 1.1
 * Author: Sunny
 */
// Add popup HTML + JS on pages with "/quizzes/" in the URL
// Add both popups on pages with "/quizzes/" in the URL
add_action('wp_footer', function () {
    if (strpos($_SERVER['REQUEST_URI'], '/quizzes/') !== false) {
        ?>
        <style>
            .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: none;
                /* hidden by default */
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            .popup-box {
                background: #0099CC;
                color: white;
                font-size: 14px !important;
                padding: 20px;
                margin: 10px;
                min-width: 40%;
                max-width: 90%;
                border-radius: 8px;
                text-align: center;
                position: relative;
                max-height: 80vh;
                /* limit height to 80% of viewport */
                overflow-y: auto;
            }

            .popup-box button {
                padding: 10px 20px;
                background: #0073aa;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            }

            .popup-box button:disabled {
                background: #aaa;
                cursor: not-allowed;
            }
        </style>

        <!-- Popup 1: Page load -->
        <div id="popup-load-overlay" class="popup-overlay">
            <div class="popup-box">
                <h2>🚨 challenge ME Championship - Rules 2025 - 2026</h2>
                <p>Welcome to your Quest! This year, we’ve introduced new systems to protect fairness and integrity across all
                    schools in the Championship.</p>
                <p>By continuing, you agree to the following:</p>
                <p>✅ Work independently.</p>
                <p>✅ Complete the quest at school.</p>
                <p>✅ Any attempt to cheat will result in penalties or disqualification.</p>

                <p>New Integrity Measures in Place:</p>
                <p>🔒 Right Click Disabled – trying to inspect or access developer tools will trigger a warning.</p>
                <p>📋 Copy/Paste Blocked – keyboard shortcuts like Ctrl+C / Ctrl+V are logged and warned</p>

                <p>
                    Any breach of the rules will result in immediate disqualification of the student(s) involved</p>
                <button id="dismiss-load-btn" disabled>Dismiss (10)</button>
            </div>
        </div>

        <!-- Popup 2: Right click -->
        <div id="popup-rightclick-overlay" class="popup-overlay">
            <div class="popup-box">
                <h2>⚠ Warning: Right Click Disabled</h2>

                <p>Right-clicking is not allowed during the challenge ME Maths Championship.</p>
                <p>Attempting to inspect or manipulate the page may result in disqualification.</p>
                <p>Please continue fairly. Let your maths do the talking!</p>
                <button id="dismiss-rc-btn" disabled>Dismiss (5)</button>
            </div>
        </div>

        <!-- Popup 3: Focus Intent -->
        <div id="popup-focus-intent-overlay" class="popup-overlay">
            <div class="popup-box">
                <h2>⚠ Warning: Time Deducted</h2>

                <p>You have left the challenge tab or browser. To protect fairness, 30 seconds has been deducted from your time.
                </p>
                <p>Stay focused—this is your moment to shine!</p>
                <button id="dismiss-focus-btn" disabled>Dismiss (30)</button>
            </div>
        </div>

        <script>
            document.addEventListener("DOMContentLoaded", function () {

                // --- Popup 1: Page load ---
                let countdownLoad = 10;
                let btnLoad = document.getElementById("dismiss-load-btn");
                let overlayLoad = document.getElementById("popup-load-overlay");

                overlayLoad.style.display = "flex"; // show on page load

                let timerLoad = setInterval(function () {
                    countdownLoad--;
                    btnLoad.textContent = "Dismiss (" + countdownLoad + ")";
                    if (countdownLoad <= 0) {
                        clearInterval(timerLoad);
                        btnLoad.disabled = false;
                        btnLoad.textContent = "Dismiss";
                    }
                }, 1000);

                btnLoad.addEventListener("click", function () {
                    overlayLoad.style.display = "none";
                });

                // --- Popup 2: Right click ---
                let countdownRC = 5;
                let btnRC = document.getElementById("dismiss-rc-btn");
                let overlayRC = document.getElementById("popup-rightclick-overlay");

                document.addEventListener("contextmenu", function (e) {
                    e.preventDefault(); // optional: block default right-click menu
                    overlayRC.style.display = "flex";

                    countdownRC = 5;
                    btnRC.disabled = true;
                    btnRC.textContent = "Dismiss (5)";

                    let timerRC = setInterval(function () {
                        countdownRC--;
                        btnRC.textContent = "Dismiss (" + countdownRC + ")";
                        if (countdownRC <= 0) {
                            clearInterval(timerRC);
                            btnRC.disabled = false;
                            btnRC.textContent = "Dismiss";
                        }
                    }, 1000);
                });

                btnRC.addEventListener("click", function () {
                    overlayRC.style.display = "none";
                });


                // --- Popup 3: Focus Intent ---
                let countdownFocus = 30;
                let btnFocus = document.getElementById("dismiss-focus-btn");
                let overlayFocus = document.getElementById("popup-focus-intent-overlay");
                let timerFocus = null;

                // Listen for visibility change (tab change or browser minimised)
                document.addEventListener("visibilitychange", function () {
                    if (document.visibilityState === "visible") {
                        // Show popup only if the tab was previously hidden
                        if (document.hidden === false) {
                             overlayFocus.style.display = "flex";
							
							                    countdownFocus = 30;
                   btnFocus.disabled = true;
                    btnFocus.textContent = "Dismiss (30)";

                    let timerFocus = setInterval(function () {
                         countdownFocus--;
                        btnFocus.textContent = "Dismiss (" +  countdownFocus + ")";
                        if ( countdownFocus <= 0) {
                            clearInterval(timerFocus);
                            btnFocus.disabled = false;
                            btnFocus.textContent = "Dismiss";
                        }
                    }, 1000);
                        }
                    }
                });
                btnFocus.addEventListener("click", function () {
                    overlayFocus.style.display = "none";
                });

            });
        </script>
        <?php
    }
});
