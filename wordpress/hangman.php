<?php

/*
Plugin Name: Hangman Game
Description: A simple hangman game implemented as a WordPress plugin. Use shortcode [hangman_game] to display the game.
Version: 1.0.0
Author: Sunny
*/
function wp_hangman_game() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'game_database';
    $today = date('d-m-Y');
    $current_time = time();
    $midnight = strtotime('tomorrow');

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

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['hangman']) || $_SESSION['hangman']['date'] != $today) {
        $_SESSION['hangman'] = [
            'date' => $today,
            'word' => $word,
            'guessed' => [],
            'attempts' => 6,
            'locked' => false,
            'start_time' => time(), // Start timer
            'end_time'   => null
        ];
    }

    $game = &$_SESSION['hangman'];

    if (!$game['locked'] && isset($_POST['letter'])) {
        $letter = strtoupper(substr($_POST['letter'], 0, 1));
        if (!in_array($letter, $game['guessed'])) {
            $game['guessed'][] = $letter;
            if (strpos($game['word'], $letter) === false) {
                $game['attempts']--;
            }
        }
    }

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

    if (!$game['locked'] && ($won || $lost)) {
        $game['locked'] = true;
        $game['end_time'] = time();
        setcookie('hangman_played', $today, $midnight, COOKIEPATH, COOKIE_DOMAIN);

        // ✅ Save game record to user meta if logged in
        if (is_user_logged_in()) {
            $user_id = get_current_user_id();
            $played_games = get_user_meta($user_id, 'hangman_games', true);

            if (!is_array($played_games)) {
                $played_games = [];
            }

            $played_games[] = [
                'game_name' => 'Hangman',
                'date'      => $today,
                'word'      => $game['word'],
                'won'       => $won,
                'duration'  => $game['end_time'] - $game['start_time']
            ];

            update_user_meta($user_id, 'hangman_games', $played_games);
			
			// ✅ Handle streak logic
            $current_streak = (int) get_user_meta($user_id, 'hangman_streak', true);
            if ($won) {
                $current_streak++;
            } else {
                $current_streak = 0;
            }
            update_user_meta($user_id, 'hangman_streak', $current_streak);
        }
    }

    $message = '';
    if ($game['locked']) {
        // Work out elapsed time
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
            $streak = (int) get_user_meta(get_current_user_id(), 'hangman_streak', true);
            $message .= '<br>🔥 Current Streak: ' . $streak;
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

    ob_start();
    ?>
    <style>
        .hangman-container {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 30px auto;
            padding: 20px;
            border-radius: 12px;
            background: #f9f9f9;
            box-shadow: 0 6px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        .hangman-container h2 {
            margin-bottom: 15px;
        }
        .hangman-container .word {
            font-size: 22px;
            letter-spacing: 5px;
            font-weight: bold;
            margin: 15px 0;
        }
        .hangman-container .attempts {
            margin: 10px 0;
            font-weight: bold;
        }
.hangman-container form {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap; /* allows wrapping on small screens */
}

.hangman-container form input[type="text"] {
    flex: 0 0 60px; /* fixed width input */
    text-align: center;
    font-size: 20px;
    padding: 5px;
}

.hangman-container form button {
    flex: 1; /* button fills remaining space */
    min-width: 100px;
    font-size: 16px;
    padding: 8px;
    background: blue;
}

        .hangman-container form button:hover {
            background: red;
			
        }

        /* Popup modal */
        .hangman-popup {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.85);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 30px;
            font-size: 24px;
            transform: translateY(100%);
            transition: transform 0.5s ease-in-out;
            z-index: 9999;
        }

        .hangman-popup.active {
            transform: translateY(0);
        }

        .hangman-popup .popup-content {
            position: relative;
            max-width: 500px;
            padding: 20px;
            background: #222;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .popup-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 28px;
            cursor: pointer;
            color: #fff;
        }

        .popup-close:hover {
            color: #ff5555;
        }
    </style>

    <div class="hangman-container">
        <h2>Hangman Game</h2>
        <div class="word"><?php echo $display_word; ?></div>
        <div class="attempts">Attempts left: <?php echo $game['attempts']; ?></div>
        <p>Guessed Letters: <?php echo $game['guessed'] ? implode(', ', $game['guessed']) : 'None yet'; ?></p>

        <?php if ($can_guess): ?>
            <form method="post">
               <input 
    type="text" 
    name="letter" 
    maxlength="1" 
    inputmode="text" 
    pattern="[A-Za-z]" 
    required
    style="text-transform: uppercase; text-align: center; width: 40px; font-size: 20px;"
>
                <button type="submit">Guess</button>
            </form>
        <?php else: ?>
            <p><?php echo $time_left_msg; ?></p>
        <?php endif; ?>
    </div>

    <?php if ($message): ?>
    <div id="hangmanPopup" class="hangman-popup">
        <div class="popup-content">
            <span class="popup-close" id="hangmanPopupClose">&times;</span>
            <p><?php echo $message; ?></p>
        </div>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const popup = document.getElementById("hangmanPopup");
            const closeBtn = document.getElementById("hangmanPopupClose");

            // Show popup
            setTimeout(() => {
                popup.classList.add("active");
            }, 300);

            // Close popup on X click
            closeBtn.addEventListener("click", () => {
                popup.classList.remove("active");
            });
        });
    </script>
    <?php endif; ?>
    <?php
    return ob_get_clean();
}
add_shortcode('hangman_game', 'wp_hangman_game');
