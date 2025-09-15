<?php
/*
Plugin Name: Export User Groups to CSV
Description: Simple plugin to export user group names and IDs to a clean CSV file.
Version: 1.1
Author: Sunny
*/

add_action('admin_menu', function () {
    add_users_page(
        'Export Students CSV',
        'Export Students CSV',
        'manage_options',
        'export-students-csv',
        'export_students_csv_page'
    );
});

function export_students_csv_page() {
    ?>
    <div class="wrap">
        <h1>Export Students CSV</h1>
        <form method="post">
            <input type="hidden" name="export_students_csv" value="1">
            <?php submit_button('Download CSV'); ?>
        </form>
    </div>
    <?php

    // Run export after form submit
    if (!empty($_POST['export_students_csv'])) {
        export_students_csv();
    }
}

function export_students_csv() {
    // Ensure no extra output
    if (ob_get_length()) ob_end_clean();

    $args = [
        'role'    => 'student',
        'fields'  => ['ID', 'user_email'],
    ];
    $users = get_users($args);

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=students.csv');

    $output = fopen('php://output', 'w');

    // Header row
    fputcsv($output, ['user_id','user_email', 'first_name', 'last_name', 'student_year_group', 'learndash_group']);

    foreach ($users as $user) {
        $first_name   = get_user_meta($user->ID, 'first_name', true);
        $last_name    = get_user_meta($user->ID, 'last_name', true);
        $year_group   = get_user_meta($user->ID, 'student_year_group', true);

        // Look for LearnDash group
        $group_display = '';
        foreach (get_user_meta($user->ID) as $key => $val) {
            if (strpos($key, 'learndash_group_users_') === 0 && !empty($val[0])) {
                $group_id = str_replace('learndash_group_users_', '', $key);
                $group_post = get_post($group_id);
                $group_name = $group_post ? $group_post->post_title : '';
                $group_display = $group_name . ' (ID: ' . $group_id . ')';
                break; // first group only
            }
        }

        fputcsv($output, [
            $user->ID,
            $user->user_email,
            $first_name,
            $last_name,
            $year_group,
            $group_display
        ]);
    }

    fclose($output);
    exit; // stop WP from outputting admin HTML
}
