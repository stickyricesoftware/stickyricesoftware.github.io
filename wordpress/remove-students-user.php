<?php
/*
Plugin Name: Remove Student Users
Description: Adds a Tools page to bulk remove all users with the Student role.
Version: 1.0
Author: Sunny
*/

if ( ! defined( 'ABSPATH' ) ) exit; // No direct access

// Add menu page under "Tools"
add_action('admin_menu', function() {
    add_management_page(
        'Remove Student Users',
        'Remove Student Users',
        'manage_options', // admin capability
        'bulk-remove-students', // safe slug (no "delete")
        'rsu_render_page'
    );
});

function rsu_render_page() {
    if ( ! current_user_can('manage_options') ) {
        wp_die('You do not have permission to access this page.');
    }

    echo '<div class="wrap"><h1>Remove Student Users</h1>';

    // Get all student users
    $args = [
        'role'    => 'student', // Role slug (check in WP if different)
        'fields'  => ['ID', 'user_login', 'user_email']
    ];
    $users = get_users($args);
    $student_count = count($users);

    if ( isset($_POST['rsu_confirm']) && check_admin_referer('rsu_remove_action', 'rsu_nonce') ) {
        if ( empty($users) ) {
            echo '<p>No users with role <strong>student</strong> found.</p></div>';
            return;
        }

        $removed_count = 0;

        echo '<div style="background:#fff;border:1px solid #ccc;padding:10px;max-height:300px;overflow:auto;">';
        foreach ( $users as $user ) {
            wp_delete_user($user->ID);
            $removed_count++;
            echo '<p>Removed user: <strong>' . esc_html($user->user_login) . '</strong> (' . esc_html($user->user_email) . ')</p>';
            flush();
            ob_flush();
        }
        echo '</div>';

        echo '<p><strong>Finished!</strong> Removed ' . $removed_count . ' student user(s).</p>';

    } else {
        echo '<p>There are currently <strong>' . $student_count . '</strong> user(s) with the role <strong>Student</strong>.</p>';

        if ( $student_count > 0 ) {
            echo '<p>This will permanently remove all of them. This action cannot be undone.</p>';
            echo '<form method="post">';
            wp_nonce_field('rsu_remove_action', 'rsu_nonce');
            echo '<p><input type="submit" name="rsu_confirm" class="button button-primary" value="Yes, Remove All Student Users" onclick="return confirm(\'Are you absolutely sure? This cannot be undone.\')"></p>';
            echo '</form>';
        } else {
            echo '<p>No Student users found — nothing to remove.</p>';
        }
    }

    echo '</div>';
}
