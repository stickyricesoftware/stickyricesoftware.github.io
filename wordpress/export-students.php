<?php
/**
 * Plugin Name: Export Students CSV
 * Description: Exports all users with role "student" into a clean CSV file.
 */

add_action('admin_menu', function () {
    add_menu_page('Export Students CSV', 'Export Students', 'manage_options', 'export-students', 'export_students_csv_page');
});

function export_students_csv_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['export_students_csv'])) {
        export_students_csv();
    }

    echo '<div class="wrap">';
    echo '<h1>Export Students</h1>';
    echo '<form method="post">';
    submit_button('Export CSV', 'primary', 'export_students_csv');
    echo '</form>';
    echo '</div>';
}

function export_students_csv() {
    if (!current_user_can('manage_options')) {
        return;
    }

    // CSV headers
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="students_export.csv"');
    header('Pragma: no-cache');
    header('Expires: 0');

    $output = fopen('php://output', 'w');

    // Column headings
    fputcsv($output, ['User ID','Email', 'First Name', 'Last Name', 'Year Group', 'Group ID', 'Group Name']);

    // Process users in batches
    $paged     = 1;
    $per_page  = 500; // adjust batch size depending on server limits

    while (true) {
        $users = get_users([
            'role'    => 'student', // adjust role if different
            'number'  => $per_page,
            'paged'   => $paged,
            'fields'  => 'all_with_meta',
        ]);

        if (empty($users)) {
            break; // no more users
        }

        foreach ($users as $user) {
            $email   = $user->user_email;
            $fname   = get_user_meta($user->ID, 'first_name', true);
            $lname   = get_user_meta($user->ID, 'last_name', true);
            $year    = get_user_meta($user->ID, 'student_year_group', true);

            // Find LearnDash group key
            $group_id = '';
            $group_name = '';
            foreach ($user->meta as $key => $val) {
                if (strpos($key, 'learndash_group_users_') === 0) {
                    $group_id = str_replace('learndash_group_users_', '', $key);
                    $group_name = get_the_title(intval($group_id));
                    break;
                }
            }

            fputcsv($output, [$user->ID, $email, $fname, $lname, $year, $group_id, $group_name]);
        }

        $paged++;
        // Clear memory between batches
        wp_cache_flush();
    }

    fclose($output);
    exit;
}