<?php
/*
Plugin Name: Hangman Game
Description: A simple hangman game implemented as a WordPress plugin. Use shortcode [hangman_game] to display the game.
Version: 2.0.0
Author: Sunny
*/

function wp_hangman_render_game($letter = null) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'game_database';
    $today = date('d-m-Y');
    $current_time = time();
    $midnight = strtotime('tomorrow');

    // Fetch today's word
    $row = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT answer FROM $table_name WHERE game_name = %s AND game_date = %s",
            'Hangman',
            $today
        )
    );

    if (!$row) {
        return "<p>No Hangman game found for today.</p>";
    }

    $word = strtoupper(trim($row->answer));

    // Start session
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    // Initialise session if new day
    if (!isset($_SESSION['hangman']) || $_SESSION['hangman']['date'] != $today) {
        $_SESSION['hangman'] = [
            'date' => $today,
            'word' => $word,
            'guessed' => [],
            'attempts' => 6,
            'locked' => false,
            'start_time' => time(),
            'end_time'   => null
        ];
    }

    $game = &$_SESSION['hangman'];

    // Handle guess
    if (!$game['locked'] && $letter) {
        $letter = strtoupper(substr($letter, 0, 1));
        if (!in_array($letter, $game['guessed'])) {
            $game['guessed'][] = $letter;
            if (strpos($game['word'], $letter) === false) {
                $game['attempts']--;
            }
        }
    }

    // Build display word
    $display_word = '';
    $won = true;
    for ($i = 0; $i < strlen($game['word']); $i++) {
        $char = $game['word'][$i];
        if (in_array($char, $game['guessed'])) {
            $display_word .= $char . ' ';
        } else {
            $display_word .= '_ ';
            $won = false;
        }
    }

    $lost = $game['attempts'] <= 0;

    // End game logic
    if (!$game['locked'] && ($won || $lost)) {
        $game['locked'] = true;
        $game['end_time'] = time();
        setcookie('hangman_played', $today, $midnight, COOKIEPATH, COOKIE_DOMAIN);

        if (is_user_logged_in()) {
            $user_id = get_current_user_id();
            $played_games = get_user_meta($user_id, 'hangman_games', true);
            if (!is_array($played_games)) $played_games = [];

            $played_games[] = [
                'game_name' => 'Hangman',
                'date'      => $today,
                'word'      => $game['word'],
                'won'       => $won,
                'duration'  => $game['end_time'] - $game['start_time']
            ];
            update_user_meta($user_id, 'hangman_games', $played_games);

// ✅ Handle streak logic (store current + longest in one array)
$streaks = get_user_meta($user_id, 'hangman_streaks', true);

if (!is_array($streaks)) {
    $streaks = [
        'current' => 0,
        'longest' => 0
    ];
}

if ($won) {
    $streaks['current']++;
    if ($streaks['current'] > $streaks['longest']) {
        $streaks['longest'] = $streaks['current'];
    }
} else {
    $streaks['current'] = 0;
}

update_user_meta($user_id, 'hangman_streaks', $streaks);
        }
    }

    // Message
    $message = '';
    if ($game['locked']) {
        $elapsed = '';
        if (!empty($game['end_time']) && !empty($game['start_time'])) {
            $duration = $game['end_time'] - $game['start_time'];
            $minutes = floor($duration / 60);
            $seconds = $duration % 60;
            $elapsed = " You completed this in {$minutes}m {$seconds}s.";
        }

        if ($won) {
            $message = "🎉 You did it! The word was {$game['word']}." . $elapsed;
            if (is_user_logged_in()) {
                $streaks = get_user_meta(get_current_user_id(), 'hangman_streaks', true);
				        $current = isset($streaks['current']) ? $streaks['current'] : 0;
        $longest = isset($streaks['longest']) ? $streaks['longest'] : 0;
				        $message .= '<br>🔥 Current Streak: ' . $current;
        $message .= '<br>🏆 Longest Streak: ' . $longest;
            }
        } elseif ($lost) {
            $message = "😢 Better luck next time! The word was {$game['word']}." . $elapsed;
        } elseif (isset($_COOKIE['hangman_played']) && $_COOKIE['hangman_played'] == $today) {
            $message = "⏳ You already played today! The word was: {$game['word']}." . $elapsed;
        }
    }

    $hours_left = floor(($midnight - $current_time) / 3600);
    $minutes_left = floor((($midnight - $current_time) % 3600) / 60);
    $time_left_msg = "⏳ Come back in {$hours_left}h {$minutes_left}m for the next word.";

    $can_guess = !$game['locked'] && !(isset($_COOKIE['hangman_played']) && $_COOKIE['hangman_played'] == $today);

    // HTML
    ob_start(); ?>
    <div class="hangman-container">
        <h2>Hangman Game</h2>
        <div class="word"><?php echo $display_word; ?></div>
        <div class="attempts">Attempts left: <?php echo $game['attempts']; ?></div>
        <p>Guessed Letters: <?php echo $game['guessed'] ? implode(', ', $game['guessed']) : 'None yet'; ?></p>

        <?php if ($can_guess): ?>
            <form id="hangman-form">
                <input type="text" name="letter" maxlength="1" pattern="[A-Za-z]" required
                    style="text-transform: uppercase; text-align: center; width: 40px; font-size: 20px;">
                <button type="submit">Guess</button>
            </form>
        <?php else: ?>
            <p><?php echo $time_left_msg; ?></p>
        <?php endif; ?>
    </div>

    <?php if ($message): ?>
    <div id="hangmanPopup" class="hangman-popup active">
        <div class="popup-content">
            <span class="popup-close" id="hangmanPopupClose">&times;</span>
            <p><?php echo $message; ?></p>
        </div>
    </div>
    <?php endif; ?>

    <style>
        .hangman-container { font-family: Arial; max-width: 400px; margin: 30px auto; padding: 20px;
            border-radius: 12px; background: #f9f9f9; box-shadow: 0 6px 15px rgba(0,0,0,0.1); text-align: center; }
        .hangman-container .word { font-size: 22px; letter-spacing: 5px; font-weight: bold; margin: 15px 0; }
        .hangman-container .attempts { margin: 10px 0; font-weight: bold; }
        .hangman-container form { display: flex; justify-content: center; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
        .hangman-container form button { min-width: 100px; font-size: 16px; padding: 8px; background: blue; color: #fff; }
        .hangman-container form button:hover { background: red; }
        .hangman-popup { position: fixed; top:0;left:0;right:0;bottom:0; background: rgba(0,0,0,0.85); color:#fff;
            display:flex; align-items:center; justify-content:center; z-index:9999; }
        .hangman-popup .popup-content { background:#222; padding:20px; border-radius:12px; position:relative; }
        .popup-close { position:absolute; top:10px; right:15px; font-size:28px; cursor:pointer; }
    </style>
    <?php
    return ob_get_clean();
}

/**
 * AJAX: Load game (fresh each time)
 */
add_action('wp_ajax_hangman_game_ajax', 'wp_hangman_game_ajax');
add_action('wp_ajax_nopriv_hangman_game_ajax', 'wp_hangman_game_ajax');
function wp_hangman_game_ajax() {
    $letter = isset($_POST['letter']) ? sanitize_text_field($_POST['letter']) : null;
    echo wp_hangman_render_game($letter);
    wp_die();
}

/**
 * Shortcode: Just outputs container + JS
 */
function wp_hangman_game_loader() {
    ob_start(); ?>
    <div id="hangman-game-container"><p>Loading game...</p></div>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        function loadGame(letter = null) {
            let formData = new FormData();
            if (letter) formData.append("letter", letter);

            fetch("<?php echo admin_url('admin-ajax.php'); ?>?action=hangman_game_ajax", {
                method: "POST",
                credentials: "same-origin",
                body: formData
            })
            .then(res => res.text())
            .then(html => {
                document.getElementById("hangman-game-container").innerHTML = html;
                bindForm();
                bindPopup();
            });
        }

        function bindForm() {
            const form = document.querySelector("#hangman-form");
            if (form) {
                form.addEventListener("submit", function(e) {
                    e.preventDefault();
                    const letter = form.querySelector("input[name=letter]").value;
                    loadGame(letter);
                });
            }
        }

        function bindPopup() {
            const closeBtn = document.getElementById("hangmanPopupClose");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    document.getElementById("hangmanPopup").remove();
                });
            }
        }

        loadGame(); // initial load
    });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('hangman_game', 'wp_hangman_game_loader');
