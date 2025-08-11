<?php

add_action('admin_menu', function () {
    add_menu_page(
        'Animal Bulk Upload',
        'Animal Bulk Upload',
        'manage_options',
        'animal-bulk-upload',
        'animal_bulk_upload_page'
    );
});

function animal_bulk_upload_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    echo '<div class="wrap"><h1>Animal Bulk Upload</h1></div>';
	 echo '<h6 id="status-messages"></h6>';
	

    if (isset($_POST['submit']) && !empty($_FILES['animal_file']['tmp_name'])) {
        animal_process_csv($_FILES['animal_file']['tmp_name']);
    }

    echo '<form method="post" enctype="multipart/form-data">';
    echo '<input type="file" name="animal_file" accept=".csv" required>';
    submit_button('Upload');
    echo '</form></div>';
}

function animal_process_csv($file_path) {
    $created = 0;
    $updated = 0;
    $failed  = 0;

    if (($handle = fopen($file_path, "r")) !== false) {
        $row_index = 0;

		

		
		
		function send_status_message($message) {
    echo "<script>
        var el = document.getElementById('status-messages');
        if (el) {
            el.innerHTML += '" . addslashes($message) . "<br>';
            el.scrollTop = el.scrollHeight; // Auto-scroll
        }
    </script>";
    @ob_flush();
    flush();
}

while (($row = fgetcsv($handle, 0, ",")) !== false) {
    $row_index++;
    if ($row_index === 1) {
        send_status_message("Skipping CSV header row");
        continue;
    }

    list($name, $gender, $status, $dob, $age, $appearance, $medical, $vaccinations, $spayneuter, $overview, $gallery, $location) = $row;

    if (empty($name)) {
        send_status_message("Row $row_index skipped — no name provided");
        continue;
    }

    $existing_post = get_page_by_title($name, OBJECT, 'animal');

    if ($existing_post) {
        $post_id = $existing_post->ID;
        $updated++;
        send_status_message("Updating existing animal: $name");
    } else {
        $post_id = wp_insert_post([
            'post_title'   => sanitize_text_field($name),
            'post_type'    => 'animal',
            'post_status'  => 'publish'
        ]);

        if (!$post_id) {
            $failed++;
            send_status_message("Failed to create new animal: $name");
            continue;
        }
        $created++;
        send_status_message("Created new animal: $name");
    }

    // Meta fields
    update_post_meta($post_id, 'gender', sanitize_text_field($gender));
    update_post_meta($post_id, 'status', sanitize_text_field($status));
    update_post_meta($post_id, 'estimated_dob', sanitize_text_field($dob));
    update_post_meta($post_id, 'estimated_age', sanitize_text_field($age));
    update_post_meta($post_id, 'appearance', sanitize_textarea_field($appearance));
    update_post_meta($post_id, 'medical_notes', sanitize_textarea_field($medical));
    update_post_meta($post_id, 'vaccinations', sanitize_textarea_field($vaccinations));
    update_post_meta($post_id, 'spayneuter', sanitize_text_field($spayneuter));
    update_post_meta($post_id, 'overview', sanitize_textarea_field($overview));
    update_post_meta($post_id, 'location', sanitize_textarea_field($location));
    send_status_message("Meta fields updated for $name");

    // Gallery images
    if (!empty($gallery)) {
        $urls = array_map('trim', explode(',', $gallery));
        $gallery_ids = [];

        foreach ($urls as $index => $url) {
            if (filter_var($url, FILTER_VALIDATE_URL)) {
                $img_id = media_sideload_image($url, $post_id, null, 'id');
                if (!is_wp_error($img_id)) {
                    if ($index === 0) {
                        set_post_thumbnail($post_id, $img_id);
                        send_status_message("Set featured image for $name from $url");
                    }
                    $gallery_ids[] = $img_id;
                    send_status_message("Added gallery image for $name from $url");
                } else {
                    send_status_message("❌ Failed to sideload image for $name from $url");
                }
            } else {
                send_status_message("❌ Invalid image URL for $name: $url");
            }
        }

        if (!empty($gallery_ids)) {
            update_post_meta($post_id, 'gallery', $gallery_ids);
            send_status_message("Gallery updated for $name");
        } else {
            send_status_message("No valid gallery images for $name");
        }
    } else {
        send_status_message("No gallery provided for $name");
    }
}


        fclose($handle);

        echo '<div class="updated"><p>';
        echo "Upload complete — <strong>$created created</strong>, <strong>$updated updated</strong>, <strong>$failed failed</strong>.";
        echo '</p></div>';
    } else {
        echo '<div class="error"><p>Unable to open CSV file.</p></div>';
    }
}
