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

    // Format today's date as stored in DB (dd-mm-YYYY)
    $today = date('d-m-Y');

    $current_time = time();
    $midnight = strtotime('tomorrow');

    // Fetch today's hangman word
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

    // Start session if needed
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    // Initialize session for today's game
    if (!isset($_SESSION['hangman']) || $_SESSION['hangman']['date'] != $today) {
        $_SESSION['hangman'] = [
            'date' => $today,
            'word' => $word,
            'guessed' => [],
            'attempts' => 6,
            'locked' => false
        ];
    }

    $game = &$_SESSION['hangman'];

    // Handle user guess only if input is allowed
    if (!$game['locked'] && isset($_POST['letter'])) {
        $letter = strtoupper(substr($_POST['letter'], 0, 1));

        if (!in_array($letter, $game['guessed'])) {
            $game['guessed'][] = $letter;
            if (strpos($game['word'], $letter) === false) {
                $game['attempts']--;
            }
        }
    }

    // Prepare the display word
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

    // Check game over
    $lost = $game['attempts'] <= 0;

    // Lock the game if it's finished
    if (!$game['locked'] && ($won || $lost)) {
        $game['locked'] = true;
        setcookie('hangman_played', $today, $midnight, COOKIEPATH, COOKIE_DOMAIN);
    }

    // Determine message
    $message = '';
    if ($game['locked']) {
        if ($won) {
            $message = "🎉 You did it! The word was {$game['word']}.";
        } elseif ($lost) {
            $message = "😢 Better luck next time! The word was {$game['word']}.";
        } elseif (isset($_COOKIE['hangman_played']) && $_COOKIE['hangman_played'] == $today) {
            $message = "⏳ You already played today! The word was: {$game['word']}.";
        }
    }

    // Time left until next word
    $hours_left = floor(($midnight - $current_time) / 3600);
    $minutes_left = floor((($midnight - $current_time) % 3600) / 60);
    $time_left_msg = "⏳ Come back in {$hours_left}h {$minutes_left}m for the next word.";

    // Determine if user can guess
    $can_guess = !$game['locked'] && !(isset($_COOKIE['hangman_played']) && $_COOKIE['hangman_played'] == $today);

    // Output HTML
    ob_start();
    ?>
    <div style="font-family: monospace; padding: 20px; border: 1px solid #ccc; width: 350px;">
        <h2>Hangman Game</h2>
        <p>Word: <?php echo $display_word; ?></p>
        <p>Attempts left: <?php echo $game['attempts']; ?></p>
        <p>Guessed Letters: <?php echo implode(', ', $game['guessed']); ?></p>

        <?php if ($can_guess): ?>
            <form method="post">
                <input type="text" name="letter" maxlength="1" required style="width: 50px;">
                <button type="submit">Guess</button>
            </form>
        <?php else: ?>
            <?php if ($message): ?>
                <p><strong><?php echo $message; ?></strong></p>
            <?php endif; ?>
            <p><?php echo $time_left_msg; ?></p>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('hangman_game', 'wp_hangman_game');
