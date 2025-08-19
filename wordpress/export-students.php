<?php
/**
 * Plugin Name: Export Students CSV
 * Description: Export all users with the "student" role to CSV, including LearnDash group memberships (one column per group).
 * Version: 1.2
 * Author: Your Name
 */

add_action('admin_menu', function () {
    add_management_page(
        'Export Students',
        'Export Students',
        'manage_options',
        'export-students',
        'export_students_page'
    );
});

function export_students_page() {
    if (isset($_POST['export_students_csv'])) {
        export_students_csv();
    }
    ?>
    <div class="wrap">
        <h1>Export Students</h1>
        <form method="post">
            <p>This will export all users with the <strong>student</strong> role.</p>
            <input type="submit" name="export_students_csv" class="button button-primary" value="Download CSV">
        </form>
    </div>
    <?php
}

function export_students_csv() {
    if (!current_user_can('manage_options')) {
        return;
    }

    $args = [
        'role'    => 'student',
        'orderby' => 'user_email',
        'order'   => 'ASC',
        'number'  => -1
    ];

    $users = get_users($args);

    // --- Step 1: Collect all unique LearnDash groups ---
    $all_groups = [];

    foreach ($users as $user) {
        $all_meta = get_user_meta($user->ID);

        foreach ($all_meta as $meta_key => $meta_value) {
            if (strpos($meta_key, 'learndash_group_users_') === 0) {
                $group_id = str_replace('learndash_group_users_', '', $meta_key);
                $group_name = get_the_title($group_id);
                if ($group_name) {
                    $all_groups[$group_id] = $group_name;
                }
            }
        }
    }

    // Sort groups by name for readability
    asort($all_groups);

    // --- Step 2: Build CSV header ---
    $header = ['Email', 'First Name', 'Last Name', 'Year Group'];
    foreach ($all_groups as $group_id => $group_name) {
        $header[] = "Group: {$group_name} (ID {$group_id})";
    }

    // Send headers
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=students.csv');

    $output = fopen('php://output', 'w');
    fputcsv($output, $header);

    // --- Step 3: Write student rows ---
    foreach ($users as $user) {
        $first_name = get_user_meta($user->ID, 'first_name', true);
        $last_name  = get_user_meta($user->ID, 'last_name', true);
        $year_group = get_user_meta($user->ID, 'student_year_group', true);

        $row = [
            $user->user_email,
            $first_name,
            $last_name,
            $year_group
        ];

        // Check group membership
        foreach ($all_groups as $group_id => $group_name) {
            $meta_key = 'learndash_group_users_' . $group_id;
            $in_group = get_user_meta($user->ID, $meta_key, true);
            $row[] = $in_group ? 'Yes' : '';
        }

        fputcsv($output, $row);
    }

    fclose($output);
    exit;
}
