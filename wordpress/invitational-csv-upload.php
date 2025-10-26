<?php
/**
 * Plugin Name: Invitiational CSV Upload
 * Description: Import a CSV of students that have made it to the next stage
 * Version: 1.2
 * Author: SunnyDevelops
 */

// === Add Admin Menu ===
add_action('admin_menu', function() {
    add_menu_page(
        'Invitationals CSV Upload',    // Page title
        'Invitationals CSV Upload',    // Menu title
        'manage_options',              // Capability
        'upload-users-to-group',       // Slug
        'render_user_csv_upload_page', // Callback
        'dashicons-upload',            // Icon
        60                             // Position
    );
});

// === Render Admin Page ===
function render_user_csv_upload_page() {
    // Check for feedback messages
    if (isset($_GET['msg'])) {
        echo '<div class="notice notice-success is-dismissible"><p>' . esc_html($_GET['msg']) . '</p></div>';
    }

    ?>
    <div className="wrap">
        <h1>Upload Users to ChallengeME Invitational Stage</h1>
<div className="notice notice-info" style="padding:20px; border-left:4px solid #2271b1; margin-bottom:25px;">
    <h2 style="margin-top:0;">📘 How to Use Invitationals CSV Upload</h2>
    <p>This tool lets you bulk upload users to a ChallengeME <strong>Invitationals Stage</strong> group.</p>

    <h3 style="margin-bottom:8px;">🪜 Steps:</h3>
    <ol style="margin-left:20px; line-height:1.6;">
        <li>Download or create a CSV file using Excel, Google Sheets, or another tool.</li>
        <li>Include <strong>one email address per line</strong> (no headers required).</li>
        <li>Select the correct <strong>“Invitationals Stage”</strong> group from the dropdown below.</li>
        <li>Click <strong>Upload & Assign Users</strong> to invite users to the next stage.</li>
    </ol>

    <h3 style="margin-bottom:8px;">📂 CSV Format Example:</h3>
    <pre style="background:#f6f7f7; padding:10px; border-radius:4px; border:1px solid #ccd0d4; max-width:400px;">
john@challengeme.com
sarah@challengeme.com
mark@challengeme.com
    </pre>

    <div style="background:#dc3232; color:#fff; padding:12px 16px; border-radius:4px; margin-top:15px; font-weight:600; text-align:center;">
        ⚠️ Please refrain from uploading more than <strong>1,000 users</strong> at a time.
    </div>
</div>

        <form method="post" enctype="multipart/form-data">
            <?php wp_nonce_field('upload_user_csv_action', 'upload_user_csv_nonce'); ?>

            <table class="form-table">
                <tr>
                    <th><label for="csv_file">CSV File:</label></th>
                    <td><input type="file" name="csv_file" accept=".csv" required></td>
                </tr>
                <tr>
                    <th><label for="group_id">Select Group:</label></th>
                    <td>
                        <select name="group_id" required>
                            <option value="">-- Choose a group --</option>
                            <?php
                            $groups = get_posts([
                                'post_type' => 'groups',
                                'numberposts' => -1,
                                'post_status' => 'publish',
                                's' => 'invitational stage' // only fetch groups containing this phrase
                            ]);
                            foreach ($groups as $group) {
                                echo '<option value="' . esc_attr($group->ID) . '">' . esc_html($group->post_title) . '</option>';
                            }
                            ?>
                        </select>
                    </td>
                </tr>
            </table>
            <?php submit_button('Upload & Assign Users', 'primary', 'submit_csv'); ?>
        </form>
    </div>
    <?php
}

// === Handle Upload After Form Submission ===
add_action('admin_init', function() {
    if (isset($_POST['submit_csv']) && current_user_can('manage_options')) {
        if (!isset($_POST['upload_user_csv_nonce']) || !wp_verify_nonce($_POST['upload_user_csv_nonce'], 'upload_user_csv_action')) {
            wp_die('Security check failed.');
        }

        if (empty($_FILES['csv_file']['tmp_name']) || empty($_POST['group_id'])) {
            wp_redirect(admin_url('admin.php?page=upload-users-to-group&msg=' . urlencode('Please select a group and upload a CSV.')));
            exit;
        }

        $file_path = $_FILES['csv_file']['tmp_name'];
        $group_id  = intval($_POST['group_id']);

        $results = handle_user_csv_upload_v2($file_path, $group_id);
        $msg = sprintf(
            '✅ Upload complete: %d users processed (%d new, %d existing).',
            $results['total'],
            $results['new'],
            $results['existing']
        );

        wp_redirect(admin_url('admin.php?page=upload-users-to-group&msg=' . urlencode($msg)));
        exit;
    }
});

// === Process CSV File and Assign to Group ===
function handle_user_csv_upload_v2($csv_path, $group_id) {
    if (!file_exists($csv_path)) return;

    $handle = fopen($csv_path, 'r');
    if (!$handle) return;

    $count = $new = $existing = 0;

    while (($data = fgetcsv($handle)) !== false) {
        $username_or_email = sanitize_text_field(trim($data[0]));
        if (empty($username_or_email)) continue;

        $user = get_user_by('email', $username_or_email);
        if (!$user) {
            $user = get_user_by('login', $username_or_email);
        }

        if (!$user) {
            // Create new user
            $password = wp_generate_password();
            $user_id = wp_create_user($username_or_email, $password, $username_or_email);
            if (is_wp_error($user_id)) continue;
            $new++;
        } else {
            $user_id = $user->ID;
            $existing++;
        }

        // === Add user to LearnDash group ===
        if (function_exists('ld_update_group_access')) {
            ld_update_group_access($user_id, $group_id);
        }

        $count++;
    }

    fclose($handle);

    return [
        'total' => $count,
        'new' => $new,
        'existing' => $existing
    ];
}