<?php
/*
Plugin Name: Export User Groups to CSV
Description: Export student users and their group info to a downloadable CSV file.
Version: 3.0
Author: SunnyDevelops
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Prevent direct access

// ✅ Add admin page
add_action('admin_menu', function () {
    add_users_page(
        'Export Students CSV',
        'Export Students CSV',
        'manage_options',
        'export-students-csv',
        'export_students_csv_page'
    );
});

// ✅ Render admin page
function export_students_csv_page() {
    ?>
    <div class="wrap">
        <h1>Export Students CSV</h1>
        <p>Click the button below to download a CSV of all students and their group info.</p>
        <form method="post" action="<?php echo esc_url( admin_url('admin-post.php') ); ?>">
            <input type="hidden" name="action" value="export_students_csv">
            <?php submit_button('Download CSV'); ?>
        </form>
    </div>
    <?php
}

// ✅ Hook export function into admin-post
add_action('admin_post_export_students_csv', 'export_students_csv');

// ✅ CSV export logic
function export_students_csv() {

    // 🔧 Make sure no output breaks the headers
    if (ob_get_level()) {
        ob_end_clean();
    }
    ob_start();

    nocache_headers();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=students.csv');

    // 📦 Get student users
    $args = [
        'role'   => 'student',
        'fields' => 'all', // make sure we get full WP_User objects
    ];
    $users = get_users($args);

    $output = fopen('php://output', 'w');

    // 🧾 CSV header row
    fputcsv($output, ['user_id','user_email', 'first_name', 'last_name', 'student_year_group', 'learndash_group']);

    // 📊 Loop through users
    foreach ($users as $user) {
        $first_name = get_user_meta($user->ID, 'first_name', true);
        $last_name  = get_user_meta($user->ID, 'last_name', true);
        $year_group = get_user_meta($user->ID, 'student_year_group', true);

        // 🏷️ Detect LearnDash group
        $group_display = '';
        $meta = get_user_meta($user->ID);

        if (is_array($meta)) {
            foreach ($meta as $key => $val) {
                if (strpos($key, 'learndash_group_users_') === 0 && !empty($val[0])) {
                    $group_id = str_replace('learndash_group_users_', '', $key);
                    $group_post = get_post($group_id);
                    $group_name = ($group_post && isset($group_post->post_title)) ? $group_post->post_title : '';
                    $group_display = $group_name . ' (ID: ' . $group_id . ')';
                    break;
                }
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

    ob_end_flush(); // 🚀 flush CSV to browser
    exit;
}
