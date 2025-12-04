<?php
/**
 * Plugin Name: Link in Bio
 * Plugin URI: https://example.com/link-in-bio
 * Description: Create customizable "link in bio" pages with custom links, colors, and profile images. Users can create their own bio pages via a frontend form using the [create_bio_page] shortcode.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: link-in-bio
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

// ============================================
// AJAX HANDLER - DELETE LINK
// ============================================
add_action( 'wp_ajax_lib_delete_link', 'lib_ajax_delete_link' );
function lib_ajax_delete_link() {
    // Verify nonce
    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'lib_delete_link_nonce' ) ) {
        wp_send_json_error( array( 'message' => 'Security check failed' ) );
    }
    
    // Check if user is logged in
    if ( ! is_user_logged_in() ) {
        wp_send_json_error( array( 'message' => 'You must be logged in' ) );
    }
    
    $link_id = isset( $_POST['link_id'] ) ? sanitize_text_field( $_POST['link_id'] ) : '';
    
    if ( empty( $link_id ) ) {
        wp_send_json_error( array( 'message' => 'Invalid link ID' ) );
    }
    
    $user_id = get_current_user_id();
    
    // Find user's bio page
    $args = array(
        'post_type'      => 'link_in_bio',
        'author'         => $user_id,
        'posts_per_page' => 1,
        'post_status'    => array( 'publish', 'draft' ),
    );
    
    $query = new WP_Query( $args );
    
    if ( ! $query->have_posts() ) {
        wp_send_json_error( array( 'message' => 'Bio page not found' ) );
    }
    
    $post_id = $query->posts[0]->ID;
    wp_reset_postdata();
    
    // Get current links
    $links = get_post_meta( $post_id, '_lib_links', true );
    
    if ( ! is_array( $links ) ) {
        $links = array();
    }
    
    // Filter out the deleted link
    $updated_links = array();
    foreach ( $links as $link ) {
        if ( isset( $link['id'] ) && $link['id'] !== $link_id ) {
            $updated_links[] = $link;
        }
    }
    
    // Save updated links
    update_post_meta( $post_id, '_lib_links', $updated_links );
    
    wp_send_json_success( array( 
        'message' => 'Link deleted successfully',
        'remaining_links' => count( $updated_links )
    ) );
}

// ============================================
// AJAX HANDLER - UPDATE TEAM ID
// ============================================
add_action( 'wp_ajax_lib_update_team_id', 'lib_ajax_update_team_id' );
function lib_ajax_update_team_id() {
    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'lib_update_meta_nonce' ) ) {
        wp_send_json_error( array( 'message' => 'Security check failed' ) );
    }
    
    if ( ! is_user_logged_in() ) {
        wp_send_json_error( array( 'message' => 'You must be logged in' ) );
    }
    
    $team_id = isset( $_POST['team_id'] ) ? absint( $_POST['team_id'] ) : '';
    
    if ( empty( $team_id ) ) {
        wp_send_json_error( array( 'message' => 'Team ID is required' ) );
    }
    
    $user_id = get_current_user_id();
    
    // Save to user meta for global access
    update_user_meta( $user_id, 'lib_team_id', $team_id );
    
    // Get user's bio page
    $user_page = new WP_Query( array(
        'post_type'      => 'link_in_bio',
        'author'         => $user_id,
        'posts_per_page' => 1,
        'post_status'    => 'any',
    ) );
    
    if ( $user_page->have_posts() ) {
        $user_page->the_post();
        $post_id = get_the_ID();
        wp_reset_postdata();
        
        // Save as post meta too
        update_post_meta( $post_id, '_lib_team_id', $team_id );
        
        wp_send_json_success( array( 
            'message' => 'Team ID updated successfully',
            'team_id' => $team_id
        ) );
    } else {
        // Even if no page exists yet, we saved it to user meta
        wp_send_json_success( array( 
            'message' => 'Team ID saved to profile',
            'team_id' => $team_id
        ) );
    }
}

// ============================================
// AJAX HANDLER - UPDATE PAGE TITLE
// ============================================
add_action( 'wp_ajax_lib_update_title', 'lib_ajax_update_title' );
function lib_ajax_update_title() {
    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'lib_update_meta_nonce' ) ) {
        wp_send_json_error( array( 'message' => 'Security check failed' ) );
    }
    
    if ( ! is_user_logged_in() ) {
        wp_send_json_error( array( 'message' => 'You must be logged in' ) );
    }
    
    $title = isset( $_POST['title'] ) ? sanitize_text_field( $_POST['title'] ) : '';
    
    if ( empty( $title ) ) {
        wp_send_json_error( array( 'message' => 'Page title is required' ) );
    }
    
    // Check if title is in reserved list
    $reserved_titles = array(
        'fplstatistics',
        'fpltoolbox',
        'fplraptor',
        'fplsalah',
        'fplharry',
        'letstalkfpl',
        'fplfocal',
        'allaboutfpl',
        'fplmatters',
        'samfpltips',
        'sunny',
        'stuart',
        'cunt',
        'fuck',
        'shit',
        'bastard',
    );
    
    if ( in_array( strtolower( $title ), $reserved_titles ) ) {
        wp_send_json_error( array( 'message' => 'This page title is reserved and cannot be used' ) );
    }
    
    // Check if another user already has a page with this title
    $title_check = new WP_Query( array(
        'post_type'      => 'link_in_bio',
        'title'          => $title,
        'posts_per_page' => 1,
        'post_status'    => 'any',
        'author__not_in' => array( get_current_user_id() ),
    ) );
    
    if ( $title_check->have_posts() ) {
        wp_reset_postdata();
        wp_send_json_error( array( 'message' => 'This page title is already taken by another user' ) );
    }
    wp_reset_postdata();
    
    $user_id = get_current_user_id();
    
    $args = array(
        'post_type'      => 'link_in_bio',
        'author'         => $user_id,
        'posts_per_page' => 1,
        'post_status'    => array( 'publish', 'draft' ),
    );
    
    $query = new WP_Query( $args );
    
    if ( ! $query->have_posts() ) {
        wp_send_json_error( array( 'message' => 'Bio page not found' ) );
    }
    
    $post_id = $query->posts[0]->ID;
    wp_reset_postdata();
    
    wp_update_post( array(
        'ID' => $post_id,
        'post_title' => $title,
        'post_name' => sanitize_title( $title ),
    ) );
    
    wp_send_json_success( array( 
        'message' => 'Page title updated successfully',
        'title' => $title
    ) );
}

// ============================================
// AJAX HANDLER - SAVE/UPDATE LINK
// ============================================
add_action( 'wp_ajax_lib_save_link', 'lib_ajax_save_link' );
function lib_ajax_save_link() {
    // Verify nonce
    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'lib_save_link_nonce' ) ) {
        wp_send_json_error( array( 'message' => 'Security check failed' ) );
    }
    
    // Check if user is logged in
    if ( ! is_user_logged_in() ) {
        wp_send_json_error( array( 'message' => 'You must be logged in' ) );
    }
    
    $user_id = get_current_user_id();
    
    // Find user's bio page
    $args = array(
        'post_type'      => 'link_in_bio',
        'author'         => $user_id,
        'posts_per_page' => 1,
        'post_status'    => array( 'publish', 'draft' ),
    );
    
    $query = new WP_Query( $args );
    
    if ( ! $query->have_posts() ) {
        wp_send_json_error( array( 'message' => 'Please fill in the Page Title and click "Create / Update Bio Page" first before adding links.' ) );
    }
    
    $post_id = $query->posts[0]->ID;
    wp_reset_postdata();
    
    // Get current links
    $links = get_post_meta( $post_id, '_lib_links', true );
    if ( ! is_array( $links ) ) {
        $links = array();
    }
    
    // Get link data from POST
    $link_id = isset( $_POST['link_id'] ) ? sanitize_text_field( $_POST['link_id'] ) : '';
    $platform = isset( $_POST['platform'] ) ? sanitize_text_field( $_POST['platform'] ) : '';
    $username = isset( $_POST['username'] ) ? sanitize_text_field( $_POST['username'] ) : '';
    $title = isset( $_POST['title'] ) ? sanitize_text_field( $_POST['title'] ) : '';
    $custom_url = isset( $_POST['custom_url'] ) ? esc_url_raw( $_POST['custom_url'] ) : '';
    $color = isset( $_POST['color'] ) ? sanitize_hex_color( $_POST['color'] ) : '#0073aa';
    
    // Validate required fields
    if ( empty( $platform ) ) {
        wp_send_json_error( array( 'message' => 'Platform is required' ) );
    }
    
    if ( $platform === 'custom' ) {
        if ( empty( $title ) || empty( $custom_url ) ) {
            wp_send_json_error( array( 'message' => 'Title and URL are required for custom links' ) );
        }
    } else {
        if ( empty( $username ) ) {
            wp_send_json_error( array( 'message' => 'Username is required' ) );
        }
    }
    
    // Build link data
    $link_data = array(
        'platform' => $platform,
        'color' => $color,
    );
    
    if ( $platform === 'custom' ) {
        $link_data['title'] = $title;
        $link_data['url'] = $custom_url;
    } else {
        $link_data['username'] = $username;
        
        // Generate URL based on platform
        $platform_urls = array(
            'instagram' => 'https://instagram.com/',
            'facebook' => 'https://facebook.com/',
            'youtube' => 'https://youtube.com/@',
            'tiktok' => 'https://tiktok.com/@',
            'twitter' => 'https://twitter.com/',
        );
        
        $platform_titles = array(
            'instagram' => 'Instagram',
            'facebook' => 'Facebook',
            'youtube' => 'Youtube',
            'tiktok' => 'TikTok',
            'twitter' => 'Twitter / X',
        );
        
        $link_data['url'] = isset( $platform_urls[$platform] ) ? $platform_urls[$platform] . $username : '';
        $link_data['title'] = isset( $platform_titles[$platform] ) ? $platform_titles[$platform] : ucfirst( $platform );
    }
    
    // Check if this is an update (existing link) or new link
    $is_update = false;
    if ( ! empty( $link_id ) ) {
        // Update existing link
        foreach ( $links as $idx => $link ) {
            if ( isset( $link['id'] ) && $link['id'] === $link_id ) {
                $link_data['id'] = $link_id;
                $links[$idx] = $link_data;
                $is_update = true;
                break;
            }
        }
    }
    
    if ( ! $is_update ) {
        // New link - generate ID and add
        $link_data['id'] = uniqid( 'link_', true );
        $links[] = $link_data;
    }
    
    // Save updated links
    update_post_meta( $post_id, '_lib_links', $links );
    
    wp_send_json_success( array( 
        'message' => $is_update ? 'Link updated successfully' : 'Link added successfully',
        'link' => $link_data,
        'is_update' => $is_update
    ) );
}

// ============================================
// AJAX HANDLER - UPDATE THEME
// ============================================
add_action( 'wp_ajax_lib_update_theme', 'lib_ajax_update_theme' );
function lib_ajax_update_theme() {
    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'lib_update_meta_nonce' ) ) {
        wp_send_json_error( array( 'message' => 'Security check failed' ) );
    }
    
    if ( ! is_user_logged_in() ) {
        wp_send_json_error( array( 'message' => 'You must be logged in' ) );
    }
    
    $theme = isset( $_POST['theme'] ) ? sanitize_text_field( $_POST['theme'] ) : '';
    
    if ( empty( $theme ) ) {
        wp_send_json_error( array( 'message' => 'Theme is required' ) );
    }
    
    // Validate theme is one of the allowed values
    $allowed_themes = array( 'default', 'football-pitch', 'dark-mode', 'gradient-dream', 'midnight-aurora', 'sunset-breeze', 'neon-nights', 'forest-whisper', 'ocean-depth', 'bubblegum-pop', 'golden-hour' );
    if ( ! in_array( $theme, $allowed_themes ) ) {
        wp_send_json_error( array( 'message' => 'Invalid theme selected' ) );
    }
    
    $user_id = get_current_user_id();
    
    $args = array(
        'post_type'      => 'link_in_bio',
        'author'         => $user_id,
        'posts_per_page' => 1,
        'post_status'    => array( 'publish', 'draft' ),
    );
    
    $query = new WP_Query( $args );
    
    if ( ! $query->have_posts() ) {
        wp_send_json_error( array( 'message' => 'Bio page not found' ) );
    }
    
    $post_id = $query->posts[0]->ID;
    wp_reset_postdata();
    
    update_post_meta( $post_id, '_lib_theme', $theme );
    
    wp_send_json_success( array( 
        'message' => 'Theme updated successfully',
        'theme' => $theme
    ) );
}

// ============================================
// LINK IN BIO - FRONTEND FORM SHORTCODE
// ============================================

// 1. Register Custom Post Type (same as before)
function lib_register_link_in_bio_cpt() {
    $args = array(
        'labels' => array(
            'name'               => 'Link in Bio',
            'singular_name'      => 'Link in Bio Page',
            'menu_name'          => 'Link in Bio',
            'all_items'          => 'All Bio Pages',
            'add_new_item'       => 'Add New Bio Page',
            'edit_item'          => 'Edit Bio Page',
        ),
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_admin_bar'   => true,
        'show_in_rest'        => true,
        'query_var'           => true,
        'rewrite'             => array(
            'slug'       => 'bio',
            'with_front' => false
        ),
        'capability_type'     => 'post',
        'has_archive'         => false,
        'hierarchical'        => false,
        'menu_position'       => 20,
        'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail', 'author' ),
        'taxonomies'          => array(),
        'map_meta_cap'        => true,
    );
    
    register_post_type( 'link_in_bio', $args );
}
add_action( 'init', 'lib_register_link_in_bio_cpt' );

// Prevent users from creating multiple bio pages via admin
function lib_limit_bio_pages_per_user() {
    global $pagenow, $typenow;
    
    // Only apply to link_in_bio post type on the new post screen
    if ( 'post-new.php' === $pagenow && 'link_in_bio' === $typenow ) {
        $current_user = wp_get_current_user();
        
        // Check if user already has a bio page (skip for admins)
        if ( ! current_user_can( 'manage_options' ) ) {
            $existing_page = new WP_Query( array(
                'post_type'      => 'link_in_bio',
                'author'         => $current_user->ID,
                'posts_per_page' => 1,
                'post_status'    => 'any',
            ) );
            
            if ( $existing_page->have_posts() ) {
                wp_die(
                    '<h1>Limit Reached</h1><p>You can only create one Link in Bio page. Please edit your existing page instead.</p>',
                    'Link in Bio Limit',
                    array( 'back_link' => true )
                );
            }
        }
    }
}
add_action( 'load-post-new.php', 'lib_limit_bio_pages_per_user' );

// Flush rewrite rules on activation
function lib_flush_rewrite_rules() {
    lib_register_link_in_bio_cpt();
    flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'lib_flush_rewrite_rules' );
add_action( 'after_switch_theme', 'lib_flush_rewrite_rules' );

/*
// 2. Add meta box for storing links - DISABLED (using frontend form instead)
function lib_add_meta_box() {
    add_meta_box(
        'lib_links_meta',
        'Links & Buttons',
        'lib_render_meta_box',
        'link_in_bio',
        'normal',
        'default'
    );
}
add_action( 'add_meta_boxes', 'lib_add_meta_box' );

function lib_render_meta_box( $post ) {
    $links = get_post_meta( $post->ID, '_lib_links', true );
    if ( ! is_array( $links ) ) {
        $links = array();
    }
    
    wp_nonce_field( 'lib_save_links', 'lib_links_nonce' );
    ?>
    <div id="lib-links-container" style="margin-bottom: 20px;">
        <?php foreach ( $links as $index => $link ) : ?>
            <div class="lib-link-row" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 4px;">
                <p>
                    <label for="lib_link_title_<?php echo $index; ?>">Link Title:</label><br>
                    <input type="text" name="lib_link_title[]" id="lib_link_title_<?php echo $index; ?>" 
                           value="<?php echo esc_attr( $link['title'] ?? '' ); ?>" 
                           style="width: 100%; padding: 8px;" placeholder="e.g., My Blog">
                </p>
                <p>
                    <label for="lib_link_url_<?php echo $index; ?>">URL:</label><br>
                    <input type="url" name="lib_link_url[]" id="lib_link_url_<?php echo $index; ?>" 
                           value="<?php echo esc_url( $link['url'] ?? '' ); ?>" 
                           style="width: 100%; padding: 8px;" placeholder="https://example.com">
                </p>
                <p>
                    <label for="lib_link_color_<?php echo $index; ?>">Button Color:</label><br>
                    <input type="color" name="lib_link_color[]" id="lib_link_color_<?php echo $index; ?>" 
                           value="<?php echo esc_attr( $link['color'] ?? '#0073aa' ); ?>" 
                           style="width: 60px; height: 40px; cursor: pointer;">
                </p>
                <p>
                    <button type="button" class="button button-link-delete" onclick="this.parentElement.parentElement.remove();" 
                            style="color: #dc3545;">
                        Remove Link
                    </button>
                </p>
            </div>
        <?php endforeach; ?>
    </div>
    
    <button type="button" id="lib-add-link" class="button button-primary">+ Add Link</button>
    
    <script>
    document.getElementById('lib-add-link').addEventListener('click', function() {
        const container = document.getElementById('lib-links-container');
        const index = container.children.length;
        const newRow = `
            <div class="lib-link-row" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 4px;">
                <p>
                    <label for="lib_link_title_${index}">Link Title:</label><br>
                    <input type="text" name="lib_link_title[]" id="lib_link_title_${index}" 
                           style="width: 100%; padding: 8px;" placeholder="e.g., My Blog">
                </p>
                <p>
                    <label for="lib_link_url_${index}">URL:</label><br>
                    <input type="url" name="lib_link_url[]" id="lib_link_url_${index}" 
                           style="width: 100%; padding: 8px;" placeholder="https://example.com">
                </p>
                <p>
                    <label for="lib_link_color_${index}">Button Color:</label><br>
                    <input type="color" name="lib_link_color[]" id="lib_link_color_${index}" 
                           value="#0073aa" style="width: 60px; height: 40px; cursor: pointer;">
                </p>
                <p>
                    <button type="button" class="button button-link-delete" onclick="this.parentElement.parentElement.remove();" 
                            style="color: #dc3545;">
                        Remove Link
                    </button>
                </p>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newRow);
    });
    </script>
    <?php
}
*/

// Meta box save function - DISABLED (using frontend form instead)
/*
function lib_save_meta_box_data( $post_id ) {
    if ( ! isset( $_POST['lib_links_nonce'] ) || ! wp_verify_nonce( $_POST['lib_links_nonce'], 'lib_save_links' ) ) {
        return;
    }
    
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }
    
    $links = array();
    
    if ( isset( $_POST['lib_link_title'] ) && is_array( $_POST['lib_link_title'] ) ) {
        $titles = array_map( 'sanitize_text_field', $_POST['lib_link_title'] );
        $urls = array_map( 'esc_url_raw', $_POST['lib_link_url'] ?? array() );
        $colors = array_map( 'sanitize_hex_color', $_POST['lib_link_color'] ?? array() );
        
        foreach ( $titles as $index => $title ) {
            if ( ! empty( $title ) && ! empty( $urls[ $index ] ) ) {
                $links[] = array(
                    'title' => $title,
                    'url'   => $urls[ $index ],
                    'color' => $colors[ $index ] ?? '#0073aa'
                );
            }
        }
    }
    
    update_post_meta( $post_id, '_lib_links', $links );
}
add_action( 'save_post', 'lib_save_meta_box_data' );
*/

// 3. FRONTEND FORM SHORTCODE - Main Creation
function lib_create_bio_page_form( $atts ) {
    // Parse shortcode attributes (kept for backward compatibility but will use PMPro check)
    $atts = shortcode_atts( array(
        'premium' => 'false',
    ), $atts );
    
    // Check premium status using Paid Memberships Pro
    $user_id = get_current_user_id();
    $is_premium = function_exists( 'pmpro_hasMembershipLevel' ) && pmpro_hasMembershipLevel( array( '10', '12' ), $user_id );
    $max_links = $is_premium ? 999 : 5; // Premium = unlimited, Free = 5 links
    
    ob_start();

    // Prepare bio page link if it exists (after $bio_page_exists is set)
    $bio_page_url = '';
    
    // Check if user is logged in
    if ( ! is_user_logged_in() ) {
        return '<p style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">You must be logged in to create a link in bio page.</p>';
    }
    
    $current_user = wp_get_current_user();
    $user_id = $current_user->ID;
    
    // Check if user already has a bio page
    $existing_page = new WP_Query( array(
        'post_type'      => 'link_in_bio',
        'author'         => $user_id,
        'posts_per_page' => 1,
        'post_status'    => 'any',
    ) );
    
    // Get team_id from user meta first, then post meta as fallback
    $user_team_id = get_user_meta( $user_id, 'lib_team_id', true );
    if ( empty( $user_team_id ) && $existing_page->have_posts() ) {
        $existing_page->the_post();
        $user_team_id = get_post_meta( get_the_ID(), '_lib_team_id', true );
        wp_reset_postdata();
    }
    
    // Re-query for existing page data
    $existing_page = new WP_Query( array(
        'post_type'      => 'link_in_bio',
        'author'         => $user_id,
        'posts_per_page' => 1,
        'post_status'    => 'any',
    ) );
    
    // Get existing page data for pre-populating form
    $existing_data = array(
        'title'       => '',
        'description' => '',
        'links'       => array(),
        'image_url'   => '',
        'theme'       => 'default',
        'fpl_stats'   => array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' ),
    );
    
    $bio_page_exists = false; // Track if bio page exists
    
    if ( $existing_page->have_posts() ) {
        $bio_page_exists = true;
        $existing_page->the_post();
        $existing_post_id = get_the_ID();
        $bio_page_url = get_permalink( $existing_post_id );
        $existing_data['title'] = get_the_title();
        $existing_data['description'] = get_the_content();
        $existing_data['links'] = get_post_meta( $existing_post_id, '_lib_links', true );
        $existing_data['theme'] = get_post_meta( $existing_post_id, '_lib_theme', true ) ?: 'default';
        $existing_data['fpl_stats'] = get_post_meta( $existing_post_id, '_lib_fpl_stats', true );
        if ( ! is_array( $existing_data['fpl_stats'] ) || empty( $existing_data['fpl_stats'] ) ) {
            $existing_data['fpl_stats'] = array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' );
        }
        if ( ! is_array( $existing_data['links'] ) ) {
            $existing_data['links'] = array();
        }
        // Add unique IDs to existing links if they don't have them and save immediately
        $needs_save = false;
        foreach ( $existing_data['links'] as $idx => &$link ) {
            if ( ! isset( $link['id'] ) ) {
                $link['id'] = uniqid( 'link_', true );
                $needs_save = true;
            }
        }
        unset( $link );
        // Save the IDs back to database if we added any
        if ( $needs_save ) {
            update_post_meta( $existing_post_id, '_lib_links', $existing_data['links'] );
        }
        if ( has_post_thumbnail( $existing_post_id ) ) {
            $existing_data['image_url'] = get_the_post_thumbnail_url( $existing_post_id, 'medium' );
        }
        wp_reset_postdata();
    }
    
    // Handle form submission
    $message = '';
    $post_id = null;
    
    // DEBUG: Log every page load
    error_log( '=== ADMIN PAGE LOAD ===' );
    error_log( 'REQUEST_METHOD: ' . $_SERVER['REQUEST_METHOD'] );
    error_log( 'POST isset: ' . ( isset( $_POST ) ? 'YES' : 'NO' ) );
    error_log( 'POST keys: ' . ( ! empty( $_POST ) ? implode( ', ', array_keys( $_POST ) ) : 'EMPTY' ) );
    error_log( 'lib_bio_nonce isset: ' . ( isset( $_POST['lib_bio_nonce'] ) ? 'YES' : 'NO' ) );
    
    if ( $_SERVER['REQUEST_METHOD'] === 'POST' && isset( $_POST['lib_bio_nonce'] ) ) {
        if ( ! wp_verify_nonce( $_POST['lib_bio_nonce'], 'lib_create_bio_page' ) ) {
            $message = '<p style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">Security check failed. Please try again.</p>';
        } else {
            $title = sanitize_text_field( $_POST['bio_title'] ?? '' );
            $bio_description = wp_strip_all_tags( $_POST['bio_description'] ?? '' );
            $team_id = absint( $_POST['team_id'] ?? 0 );
            $theme = sanitize_text_field( $_POST['bio_theme'] ?? 'default' );
            $links = array();
            
            // Validate team_id if user doesn't have one
            if ( empty( $user_team_id ) && empty( $team_id ) ) {
                $message = '<p style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">Team ID is required.</p>';
            } elseif ( empty( $title ) ) {
                $message = '<p style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">Page title is required.</p>';
            } else {
                // Check if title is in reserved list
                $reserved_titles = array(
                    'fplstatistics',
                    'fpltoolbox',
                    'fpltool',
                    'toolbox',
                    'fpl',
                    'fantasy',
                    'football',
                    'fplraptor',
                    'fplsalah',
                    'fplharry',
                    'letstalkfpl',
                    'fplfocal',
                    'allaboutfpl',
                    'fplmatters',
                    'samfpltips',
                );
                
                if ( in_array( strtolower( $title ), $reserved_titles ) ) {
                    $message = '<p style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">⚠️ This page title is unavailable. Please choose a different title.</p>';
                } else {
                // Check if another user already has a page with this exact title
                $title_check = new WP_Query( array(
                    'post_type'      => 'link_in_bio',
                    'title'          => $title,
                    'posts_per_page' => 1,
                    'post_status'    => 'any',
                    'author__not_in' => array( $user_id ), // Exclude current user
                ) );
                
                if ( $title_check->have_posts() ) {
                    $message = '<p style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">⚠️ This page title is already taken by another user. Please choose a different title.</p>';
                    wp_reset_postdata();
                } else {
                    wp_reset_postdata();
                // SIMPLIFIED APPROACH: Only save what's submitted in the form
                // Get list of deleted link IDs to exclude
                $deleted_ids = array();
                if ( isset( $_POST['deleted_link_ids'] ) && is_array( $_POST['deleted_link_ids'] ) ) {
                    $deleted_ids = array_map( 'sanitize_text_field', $_POST['deleted_link_ids'] );
                }
                
                // Start with existing links that weren't deleted AND weren't edited
                $existing_links_map = array();
                if ( ! empty( $existing_data['links'] ) && is_array( $existing_data['links'] ) ) {
                    foreach ( $existing_data['links'] as $link ) {
                        if ( isset( $link['id'] ) && ! in_array( $link['id'], $deleted_ids ) ) {
                            $existing_links_map[ $link['id'] ] = $link;
                        }
                    }
                }
                
                // Track which existing links are being edited via form submission
                $submitted_link_ids = array();
                if ( isset( $_POST['link_id'] ) && is_array( $_POST['link_id'] ) ) {
                    $submitted_link_ids = array_map( 'sanitize_text_field', $_POST['link_id'] );
                }
                
                // Add existing links that are NOT being edited or deleted
                foreach ( $existing_links_map as $link_id => $link ) {
                    if ( ! in_array( $link_id, $submitted_link_ids ) ) {
                        $links[] = $link;
                    }
                }
                
                // Process submitted links (new AND edited)
                if ( isset( $_POST['link_platform'] ) && is_array( $_POST['link_platform'] ) ) {
                    $link_platforms = array_map( 'sanitize_text_field', $_POST['link_platform'] );
                    $link_titles = array_map( 'sanitize_text_field', $_POST['link_title'] ?? array() );
                    $link_usernames = array_map( 'sanitize_text_field', $_POST['link_username'] ?? array() );
                    $link_custom_urls = array_map( 'esc_url_raw', $_POST['link_custom_url'] ?? array() );
                    $link_colors = array_map( 'sanitize_hex_color', $_POST['link_color'] ?? array() );
                    $link_ids = array_map( 'sanitize_text_field', $_POST['link_id'] ?? array() );
                    
                    $allowed_platforms = array( 'instagram', 'facebook', 'youtube', 'tiktok', 'twitter' );
                    if ( $is_premium ) {
                        $allowed_platforms[] = 'custom';
                    }
                    
                    // Platform URL templates
                    $platform_urls = array(
                        'instagram' => 'https://instagram.com/',
                        'facebook'  => 'https://facebook.com/',
                        'youtube'   => 'https://youtube.com/@',
                        'tiktok'    => 'https://tiktok.com/@',
                        'twitter'   => 'https://twitter.com/',
                    );
                    
                    foreach ( $link_platforms as $index => $platform ) {
                        if ( empty( $platform ) ) {
                            continue;
                        }
                        
                        if ( ! in_array( $platform, $allowed_platforms ) ) {
                            continue;
                        }
                        
                        $link_id = ! empty( $link_ids[ $index ] ) ? $link_ids[ $index ] : uniqid( 'link_', true );
                        
                        $link_data = array(
                            'id'       => $link_id,
                            'platform' => $platform,
                            'color'    => $link_colors[ $index ] ?? '#0073aa'
                        );
                        
                        if ( $platform === 'custom' ) {
                            if ( ! empty( $link_titles[ $index ] ) && ! empty( $link_custom_urls[ $index ] ) ) {
                                $link_data['title'] = $link_titles[ $index ];
                                $link_data['url'] = $link_custom_urls[ $index ];
                                $link_data['username'] = '';
                            } else {
                                continue;
                            }
                        } else {
                            if ( ! empty( $link_usernames[ $index ] ) ) {
                                $username = $link_usernames[ $index ];
                                $link_data['username'] = $username;
                                $link_data['url'] = $platform_urls[ $platform ] . $username;
                                $link_data['title'] = ucfirst( $platform );
                            } else {
                                continue;
                            }
                        }
                        
                        // Always add submitted links (whether new or edited)
                        $links[] = $link_data;
                    }
                }
                
                error_log( '=== REACHED LINKS VALIDATION ===' );
                error_log( 'Links count: ' . count( $links ) );
                error_log( 'Deleted IDs count: ' . count( $deleted_ids ) );
                
                // CRITICAL: Allow empty links array if there are deletions
                // This allows users to delete their last link
                if ( empty( $links ) && empty( $deleted_ids ) ) {
                    error_log( 'VALIDATION FAILED: No links and no deletions' );
                    $message = '<p style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">You must add at least one link.</p>';
                } else {
                    error_log( '=== VALIDATION PASSED - STARTING IMAGE UPLOAD ===' );
                    error_log( '$_FILES array: ' . print_r( $_FILES, true ) );
                    
                    // Handle featured image upload
                    
                    $attachment_id = false;
                    if ( ! empty( $_FILES['bio_image']['name'] ) ) {
                        require_once( ABSPATH . 'wp-admin/includes/image.php' );
                        require_once( ABSPATH . 'wp-admin/includes/file.php' );
                        require_once( ABSPATH . 'wp-admin/includes/media.php' );
                        
                        error_log( 'Attempting to upload image: ' . $_FILES['bio_image']['name'] );
                        
                        $attachment_id = media_handle_upload( 'bio_image', 0 );
                        
                        error_log( 'Upload result: ' . print_r( $attachment_id, true ) );
                        
                        if ( is_wp_error( $attachment_id ) ) {
                            $error_message = $attachment_id->get_error_message();
                            error_log( 'Image upload error: ' . $error_message );
                            $message = '<p style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">Error uploading image: ' . esc_html( $error_message ) . '</p>';
                            $attachment_id = false;
                        } else {
                            error_log( 'Image uploaded successfully. Attachment ID: ' . $attachment_id );
                        }
                    } else {
                        error_log( 'No image file in upload' );
                    }
                    
                    if ( empty( $message ) ) {
                        // Note: team_id will be saved as post meta below
                        
                        // Create or update post - ENFORCE ONE PAGE PER USER
                        // Re-query to ensure we have the latest state
                        $check_existing = new WP_Query( array(
                            'post_type'      => 'link_in_bio',
                            'author'         => $user_id,
                            'posts_per_page' => 1,
                            'post_status'    => 'any',
                        ) );
                        
                        if ( $check_existing->have_posts() ) {
                            // Update existing page
                            $check_existing->the_post();
                            $post_id = get_the_ID();
                            
                            $post_data = array(
                                'ID'           => $post_id,
                                'post_title'   => $title,
                                'post_name'    => sanitize_title( $title ),
                                'post_content' => $bio_description,
                                'post_status'  => 'publish'
                            );
                            
                            wp_update_post( $post_data );
                            wp_reset_postdata();
                            
                            $message = '<p style="color: #5cb85c; padding: 15px; background: #dff0d8; border-radius: 4px;">✓ Bio page updated successfully! <a href="' . get_permalink( $post_id ) . '" target="_blank">View your page →</a></p>';
                        } else {
                            // Create new page (only if user has no existing page)
                            $post_data = array(
                                'post_type'    => 'link_in_bio',
                                'post_title'   => $title,
                                'post_name'    => sanitize_title( $title ),
                                'post_content' => $bio_description,
                                'post_author'  => $user_id,
                                'post_status'  => 'publish'
                            );
                            
                            $post_id = wp_insert_post( $post_data );
                            
                            if ( ! is_wp_error( $post_id ) ) {
                                $message = '<p style="color: #5cb85c; padding: 15px; background: #dff0d8; border-radius: 4px;">✓ Bio page created successfully! <a href="' . get_permalink( $post_id ) . '" target="_blank">View your page →</a></p>';
                            } else {
                                $message = '<p style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">Error creating page.</p>';
                            }
                        }
                        
                        // Save links meta
                        if ( ! is_wp_error( $post_id ) && ! empty( $post_id ) ) {
                            // DEBUG: Log what we're saving
                            error_log( 'Saving links: ' . print_r( $links, true ) );
                            error_log( 'Deleted IDs: ' . print_r( $deleted_ids, true ) );
                            
                            update_post_meta( $post_id, '_lib_links', $links );
                            update_post_meta( $post_id, '_lib_theme', $theme );
                            
                            // Save FPL stats selection
                            $fpl_stats = isset( $_POST['fpl_stats'] ) && is_array( $_POST['fpl_stats'] ) ? array_map( 'sanitize_text_field', $_POST['fpl_stats'] ) : array();
                            update_post_meta( $post_id, '_lib_fpl_stats', $fpl_stats );
                            
                            // Save team_id to both post meta and user meta
                            if ( ! empty( $team_id ) ) {
                                update_post_meta( $post_id, '_lib_team_id', $team_id );
                                update_user_meta( $user_id, 'lib_team_id', $team_id );
                            }
                            
                            // Set featured image if uploaded
                            if ( $attachment_id && is_numeric( $attachment_id ) ) {
                                error_log( 'Setting featured image for post ' . $post_id . ' with attachment ' . $attachment_id );
                                $result = set_post_thumbnail( $post_id, $attachment_id );
                                error_log( 'set_post_thumbnail result: ' . ( $result ? 'SUCCESS' : 'FAILED' ) );
                            } else {
                                error_log( 'Not setting thumbnail. attachment_id: ' . print_r( $attachment_id, true ) );
                            }
                        }
                        
                        // Redirect to avoid form resubmission
                        $redirect_url = add_query_arg( 'lib_status', 'success', $_SERVER['REQUEST_URI'] );
                        if ( ! headers_sent() ) {
                            wp_safe_redirect( $redirect_url );
                            exit;
                        } else {
                            echo '<div style="color: #d9534f; padding: 15px; background: #f2dede; border-radius: 4px;">';
                            echo 'Page saved, but could not redirect. <a href="' . esc_url( $redirect_url ) . '">Click here to continue</a>.';
                            echo '</div>';
                        }
                    }
                }
                } // Close duplicate check else
                } // Close reserved title check else
            }
        }
    }
    
    // Check for success message from redirect
    if ( isset( $_GET['lib_status'] ) && $_GET['lib_status'] === 'success' ) {
        // Re-query to get updated data after redirect
        $existing_page = new WP_Query( array(
            'post_type'      => 'link_in_bio',
            'author'         => $user_id,
            'posts_per_page' => 1,
            'post_status'    => 'any',
        ) );
        
        // Update existing data for form pre-population
        if ( $existing_page->have_posts() ) {
            $existing_page->the_post();
            $existing_post_id = get_the_ID();
            $existing_data['title'] = get_the_title();
            $existing_data['description'] = get_the_content();
            $existing_data['links'] = get_post_meta( $existing_post_id, '_lib_links', true );
            $existing_data['theme'] = get_post_meta( $existing_post_id, '_lib_theme', true ) ?: 'default';
            if ( ! is_array( $existing_data['links'] ) ) {
                $existing_data['links'] = array();
            }
            if ( has_post_thumbnail( $existing_post_id ) ) {
                $existing_data['image_url'] = get_the_post_thumbnail_url( $existing_post_id, 'medium' );
            }
            
            $message = '<p style="color: #5cb85c; padding: 15px; background: #dff0d8; border-radius: 4px;">✓ Bio page saved successfully! <a href="' . get_permalink( $existing_post_id ) . '" target="_blank">View your page →</a></p>';
            wp_reset_postdata();
        }
    }
    
    ?>
    <?php if ( $bio_page_exists && ! empty( $bio_page_url ) ) : ?>
    <div style="max-width:600px; margin: 0 auto 18px auto;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <p style="margin: 0; color: #333;"><strong>Your unique FPL Bio page link</strong></p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
            <input type="text" id="bio-link-url" value="<?php echo esc_url( $bio_page_url ); ?>" readonly style="flex:1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; background: #f8f9fa; color: #333;">
            <button type="button" id="copy-bio-link-btn" style="padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Copy Link</button>
            <span id="copy-bio-link-msg" style="color: #28a745; font-size: 13px; margin-left: 8px; display: none;">Copied!</span>
        </div>
    </div>
    <script>
    (function() {
        var copyBtn = document.getElementById('copy-bio-link-btn');
        var input = document.getElementById('bio-link-url');
        var msg = document.getElementById('copy-bio-link-msg');
        if (copyBtn && input && msg) {
            copyBtn.addEventListener('click', function() {
                input.select();
                input.setSelectionRange(0, 99999);
                try {
                    var successful = document.execCommand('copy');
                    if (successful) {
                        msg.style.display = 'inline';
                        setTimeout(function() { msg.style.display = 'none'; }, 1500);
                    }
                } catch (err) {}
            });
        }
    })();
    </script>
    <?php endif; ?>
    <style>
        .lib-form-wrapper {
            max-width: 600px;
            margin: 30px auto;
            background: #f9f9f9;
            padding: 30px;
            border-radius: 8px;
            border: 1px solid #e9e9e9;
        }
        
        .lib-form-group {
            margin-bottom: 20px;
        }
        
        .lib-form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
        }
        
        .lib-form-group input[type="text"],
        .lib-form-group input[type="url"],
        .lib-form-group textarea,
        .lib-form-group input[type="file"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
        }
        
        .lib-form-group textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .lib-form-group input[type="file"] {
            padding: 8px;
        }
        
        .lib-links-section {
            background: white;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
        }
        
        #lib-links-container {
            margin-bottom: 15px;
        }
        
        .lib-link-item {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 10px;
            border: 1px solid #e0e0e0;
        }
        
        .lib-link-item input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .lib-link-item .lib-color-input {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .lib-link-item input[type="color"] {
            width: 60px;
            height: 40px;
            cursor: pointer;
            border-radius: 4px;
        }
        
        .lib-btn {
            background: #0073aa;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.3s;
        }
        
        .lib-btn:hover {
            background: #005a87;
        }
        
        .lib-btn-secondary {
            background: #6c757d;
            margin-right: 10px;
        }
        
        .lib-btn-secondary:hover {
            background: #5a6268;
        }
        
        .lib-btn-delete {
            background: #dc3545;
            padding: 6px 12px;
            font-size: 12px;
        }
        
        .lib-btn-delete:hover {
            background: #c82333;
        }
        
        .lib-button-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
        }
        
        .lib-button-group button {
            width: 100%;
        }
        
        .lib-button-group p {
            margin: 0;
        }
        
        .lib-existing-page {
            background: #e8f4f8;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            border-left: 4px solid #0073aa;
        }
        
        .lib-existing-page p {
            margin: 0 0 10px 0;
        }
        
        .lib-existing-page a {
            color: #0073aa;
            text-decoration: none;
        }
        
        .lib-existing-page a:hover {
            text-decoration: underline;
        }
    </style>
    
    <div class="lib-form-wrapper">
        <h2 style="margin-bottom: 10px; color: #333;">

            Create Your FPL Bio Page
        </h2>
        <p style="color: #666; margin-bottom: 20px;">
            Customise your personal FPL Bio page with links, colors, and a profile image.
            <?php if ( ! $is_premium ) : ?>
                <br><strong>Free Version:</strong> Up to <?php echo $max_links; ?> links. 
                <a href="https://fpltoolbox.com/membership-account/membership-levels/" style="color: #0073aa;">Upgrade to Pro/Max</a> for unlimited links!
            <?php else : ?>
                <br><span style="color: #667eea;">★ Pro/Max: Unlimited links & features</span>
            <?php endif; ?>
        </p>
        
        <form id="lib-bio-form" method="POST" enctype="multipart/form-data">
            <?php wp_nonce_field( 'lib_create_bio_page', 'lib_bio_nonce' ); ?>
            <div id="lib-deleted-inputs"></div>
            
            <!-- DEBUG: Team ID = <?php echo esc_html( $user_team_id ); ?> | Empty? <?php echo empty( $user_team_id ) ? 'YES' : 'NO'; ?> -->
            
            <?php if ( empty( $user_team_id ) ) : ?>
                <div class="lib-form-group">
                    <label for="team_id">Team ID * <span style="color: #999; font-weight: 400;">(Required - one time only)</span></label>
                    <input type="text" id="team_id" name="team_id" placeholder="Enter your Team ID" required>
                    <small style="color: #666;">This will be saved to your profile and is required to create your bio page.</small>
                </div>
            <?php else : ?>
                <input type="hidden" name="team_id" id="team_id_hidden" value="<?php echo esc_attr( $user_team_id ); ?>">
                
                <div id="team-id-display" style="padding: 12px; background: #e8f4f8; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #0073aa; display: flex; align-items: center; justify-content: space-between;">
                    <p style="margin: 0; color: #333;"><strong>FPL Team ID:</strong> <span id="team-id-value"><?php echo esc_html( $user_team_id ); ?></span></p>
                    <button type="button" id="edit-team-id-btn" style="padding: 5px 10px; background: #0073aa; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">✏️ Edit</button>
                </div>
                <div id="team-id-edit" class="lib-form-group" style="display: none;">
                    <label for="team_id_input">FPL Team ID *</label>
                    <div style="display: flex; gap: 8px; align-items: flex-start;">
                        <input type="text" id="team_id_input" value="<?php echo esc_attr( $user_team_id ); ?>" placeholder="Enter your Team ID" required style="flex: 1;">
                        <button type="button" id="save-team-id-btn" style="padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap; height: 42px;">💾 Save</button>
                        <button type="button" id="cancel-team-id-btn" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; height: 42px;">✕</button>
                    </div>
                    <small style="color: #666;">Your FPL Team ID will be used to display your stats on your bio page.</small>
                </div>
            <?php endif; ?>
            
            <?php if ( ! empty( $existing_data['title'] ) ) : ?>
                <!-- Hidden field to preserve title during form submission -->
                <input type="hidden" name="bio_title" id="bio_title_hidden" value="<?php echo esc_attr( $existing_data['title'] ); ?>">
                
                <div id="title-display" style="padding: 12px; background: #e8f4f8; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #0073aa; display: flex; align-items: center; justify-content: space-between;">
                    <p style="margin: 0; color: #333;"><strong>Page Title:</strong> <span id="title-value"><?php echo esc_html( $existing_data['title'] ); ?></span></p>
                    <button type="button" id="edit-title-btn" style="padding: 5px 10px; background: #0073aa; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">✏️ Edit</button>
                </div>
                <div id="title-edit" style="padding: 12px; background: #e8f4f8; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #0073aa; display: none;">
                    <label style="font-weight: 600; margin-bottom: 5px; display: block;">Page Title / Display Name:</label>
                    <div style="display: flex; gap: 8px; align-items: flex-end;">
                        <input type="text" id="title-input" value="<?php echo esc_attr( $existing_data['title'] ); ?>" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <button type="button" id="save-title-btn" style="padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap;">💾 Save</button>
                        <button type="button" id="cancel-title-btn" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">✕ Cancel</button>
                    </div>
                </div>
            <?php else : ?>
                <div class="lib-form-group">
                    <label for="bio_title">Page Title / Display Name *</label>
                    <input type="text" id="bio_title" name="bio_title" placeholder="Your Name or Username" value="<?php echo esc_attr( $existing_data['title'] ); ?>" required>
                </div>
            <?php endif; ?>
            
            <div class="lib-form-group">
                <label for="bio_image">Profile Image (Optional)</label>
                <?php if ( ! empty( $existing_data['image_url'] ) ) : ?>
                    <div style="margin-bottom: 10px;">
                        <img src="<?php echo esc_url( $existing_data['image_url'] ); ?>" alt="Current profile image" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #ddd;">
                        <p style="color: #666; font-size: 12px; margin-top: 5px;">Current image (upload a new one to replace)</p>
                    </div>
                <?php endif; ?>
                <div style="display: flex; gap: 8px; align-items: flex-end;">
                    <div style="flex: 1;">
                        <input type="file" id="bio_image" name="bio_image" accept="image/*">
                        <small style="color: #999;">JPG, PNG, or GIF. Recommended size: 500x500px</small>
                    </div>
                    <button type="button" id="save-image-btn" style="padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap; height: 42px;">💾 Save Image</button>
                </div>
            </div>
            
            <div class="lib-form-group">
                <label for="bio_description">Bio Description (Optional)</label>
                <textarea id="bio_description" name="bio_description" placeholder="Tell visitors about yourself..."><?php echo esc_textarea( $existing_data['description'] ); ?></textarea>
            </div>
            
            <div class="lib-form-group">
                <label for="bio_theme">Choose Your Theme 🎨</label>
                <select id="bio_theme" name="bio_theme" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" <?php if ( ! $bio_page_exists ) echo 'disabled'; ?>>
                    <option value="default" <?php selected( $existing_data['theme'], 'default' ); ?>>⚽ Default - FPL cyan to purple</option>
                    <option value="football-pitch" <?php selected( $existing_data['theme'], 'football-pitch' ); ?>>⚽️ Football Pitch - Classic green field</option>
                    <option value="dark-mode" <?php selected( $existing_data['theme'], 'dark-mode' ); ?>>🌑 Dark Mode - Sleek & modern</option>
                    <?php if ( $is_premium ) : ?>
                        <option value="gradient-dream" <?php selected( $existing_data['theme'], 'gradient-dream' ); ?>>✨ Gradient Dream - Purple & Pink vibes</option>
                        <option value="midnight-aurora" <?php selected( $existing_data['theme'], 'midnight-aurora' ); ?>>🌌 Midnight Aurora - Dark & mysterious</option>
                        <option value="sunset-breeze" <?php selected( $existing_data['theme'], 'sunset-breeze' ); ?>>🌅 Sunset Breeze - Warm & cozy</option>
                        <option value="neon-nights" <?php selected( $existing_data['theme'], 'neon-nights' ); ?>>⚡ Neon Nights - Cyberpunk electric</option>
                        <option value="forest-whisper" <?php selected( $existing_data['theme'], 'forest-whisper' ); ?>>🌲 Forest Whisper - Natural & earthy</option>
                        <option value="ocean-depth" <?php selected( $existing_data['theme'], 'ocean-depth' ); ?>>🌊 Ocean Depth - Deep sea blues</option>
                        <option value="bubblegum-pop" <?php selected( $existing_data['theme'], 'bubblegum-pop' ); ?>>🍭 Bubblegum Pop - Sweet & playful</option>
                        <option value="golden-hour" <?php selected( $existing_data['theme'], 'golden-hour' ); ?>>☀️ Golden Hour - Luxe & elegant</option>
                    <?php endif; ?>
                </select>
                <?php if ( ! $bio_page_exists ) : ?>
                <small style="color: #c77c00; display: block; margin-top: 6px;">You can customise your theme after your page is created!</small>
                <?php else : ?>
                <small style="color: #666;">
                    <?php if ( $is_premium ) : ?>
                        Premium: 8 exclusive themes! ✨
                    <?php else : ?>
                        <a href="https://fpltoolbox.com/membership-account/membership-levels/" style="color: #0073aa;">Upgrade to Pro/Max</a> for 8 exclusive themes!
                    <?php endif; ?>
                </small>
                <?php endif; ?>
            </div>
            
            <?php if ( $is_premium ) : ?>
            <div class="lib-form-group">
                <label>FPL Stats Display ⚽ <span style="color: #667eea; font-weight: 400;">(Pro/Max Feature)</span></label>
                <p style="color: #666; font-size: 14px; margin: 5px 0 10px 0;">Choose which FPL statistics to show on your bio page:</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; cursor: pointer;">
                        <input type="checkbox" name="fpl_stats[]" value="overall_points" <?php echo in_array( 'overall_points', $existing_data['fpl_stats'] ?? array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' ) ) ? 'checked' : ''; ?>>
                        <span>Overall Points</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; cursor: pointer;">
                        <input type="checkbox" name="fpl_stats[]" value="overall_rank" <?php echo in_array( 'overall_rank', $existing_data['fpl_stats'] ?? array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' ) ) ? 'checked' : ''; ?>>
                        <span>Overall Rank</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; cursor: pointer;">
                        <input type="checkbox" name="fpl_stats[]" value="event_points" <?php echo in_array( 'event_points', $existing_data['fpl_stats'] ?? array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' ) ) ? 'checked' : ''; ?>>
                        <span>GW Points</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; cursor: pointer;">
                        <input type="checkbox" name="fpl_stats[]" value="event_rank" <?php echo in_array( 'event_rank', $existing_data['fpl_stats'] ?? array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' ) ) ? 'checked' : ''; ?>>
                        <span>GW Rank</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; cursor: pointer;">
                        <input type="checkbox" name="fpl_stats[]" value="team_value" <?php echo in_array( 'team_value', $existing_data['fpl_stats'] ?? array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' ) ) ? 'checked' : ''; ?>>
                        <span>Team Value</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; cursor: pointer;">
                        <input type="checkbox" name="fpl_stats[]" value="bank" <?php echo in_array( 'bank', $existing_data['fpl_stats'] ?? array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' ) ) ? 'checked' : ''; ?>>
                        <span>Bank</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; cursor: pointer;">
                        <input type="checkbox" name="fpl_stats[]" value="total_transfers" <?php echo in_array( 'total_transfers', $existing_data['fpl_stats'] ?? array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' ) ) ? 'checked' : ''; ?>>
                        <span>Total Transfers</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; cursor: pointer;">
                        <input type="checkbox" name="fpl_stats[]" value="years_active" <?php echo in_array( 'years_active', $existing_data['fpl_stats'] ?? array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' ) ) ? 'checked' : ''; ?>>
                        <span>Years Active</span>
                    </label>
                </div>
                <small style="color: #666; margin-top: 8px; display: block;">Select at least one stat to display on your page</small>
            </div>
            <?php else : ?>
            <!-- Hidden inputs to ensure all stats are always shown for free users -->
            <input type="hidden" name="fpl_stats[]" value="overall_points">
            <input type="hidden" name="fpl_stats[]" value="overall_rank">
            <input type="hidden" name="fpl_stats[]" value="event_points">
            <input type="hidden" name="fpl_stats[]" value="event_rank">
            <input type="hidden" name="fpl_stats[]" value="team_value">
            <input type="hidden" name="fpl_stats[]" value="bank">
            <input type="hidden" name="fpl_stats[]" value="total_transfers">
            <input type="hidden" name="fpl_stats[]" value="years_active">
            
            <!-- Blurred preview for free users -->
            <div class="lib-form-group" style="position: relative;">
                <label>FPL Stats Display ⚽ <span style="color: #d9534f; font-weight: 600;">🔒 Pro/Max Only</span></label>
                <p style="color: #666; font-size: 14px; margin: 5px 0 10px 0;">Upgrade to customise which FPL statistics appear on your bio page!</p>
                <div style="position: relative;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; filter: blur(3px); pointer-events: none; user-select: none;">
                        <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                            <input type="checkbox" checked disabled>
                            <span>Overall Points</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                            <input type="checkbox" checked disabled>
                            <span>Overall Rank</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                            <input type="checkbox" checked disabled>
                            <span>GW Points</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                            <input type="checkbox" checked disabled>
                            <span>GW Rank</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                            <input type="checkbox" checked disabled>
                            <span>Team Value</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                            <input type="checkbox" checked disabled>
                            <span>Bank</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                            <input type="checkbox" checked disabled>
                            <span>Total Transfers</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                            <input type="checkbox" checked disabled>
                            <span>Years Active</span>
                        </label>
                    </div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 10;">
                        <a href="https://fpltoolbox.com/membership-account/membership-levels/" target="_blank" rel="noopener" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                            ⭐ Upgrade to Pro
                        </a>
                    </div>
                </div>
                <small style="color: #666; margin-top: 8px; display: block;">Premium members can choose which stats to display</small>
            </div>
            <?php endif; ?>
            
            <div class="lib-links-section">
                <h3 style="margin-top: 0; color: #333;">Add Links *</h3>
                <p style="color: #666; font-size: 14px; margin-top: 0;">
                    <?php if ( ! $is_premium ) : ?>
                        Free version: Add social media links (Instagram, Facebook, YouTube, TikTok, Twitter/X)
                    <?php else : ?>
                        Add social media links and unlimited custom links
                    <?php endif; ?>
                </p>
                
                <?php if ( ! $bio_page_exists ) : ?>
                <div style="margin-bottom: 15px; padding: 12px; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                        💡 <strong>First time setup:</strong> Click "+ Add Another Link" below, fill in your details, then click "Create Bio Page" to save everything.
                    </p>
                </div>
                <?php endif; ?>
                
                <?php if ( ! empty( $existing_data['links'] ) ) : ?>
                <div style="margin-bottom: 20px; padding: 15px; background: #e8f4f8; border-radius: 4px; border-left: 4px solid #0073aa;">
                    <h4 style="margin: 0 0 10px 0; color: #333;">📋 Your Saved Links</h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <?php 
                        // Social media icon emojis
                        $platform_icons = array(
                            'instagram' => '📷',
                            'facebook' => '👤',
                            'youtube' => '▶️',
                            'tiktok' => '🎵',
                            'twitter' => '🐦',
                            'custom' => '🔗',
                        );
                        
                        foreach ( $existing_data['links'] as $link ) : 
                            $platform = $link['platform'] ?? 'custom';
                            $icon = isset( $platform_icons[$platform] ) ? $platform_icons[$platform] : '🔗';
                        ?>
                            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd;" data-link-id="<?php echo esc_attr( $link['id'] ?? '' ); ?>">
                                <div style="flex: 1;">
                                    <strong style="color: #0073aa;"><?php echo $icon . ' ' . esc_html( ucfirst( $link['platform'] ?? 'Link' ) ); ?></strong>
                                    <?php if ( ! empty( $link['username'] ) ) : ?>
                                        <span style="color: #666;">@<?php echo esc_html( $link['username'] ); ?></span>
                                    <?php elseif ( ! empty( $link['title'] ) ) : ?>
                                        <span style="color: #666;"><?php echo esc_html( $link['title'] ); ?></span>
                                    <?php endif; ?>
                                </div>
                                <div style="display: flex; gap: 5px;">
                                    <button type="button" class="lib-edit-link" data-link-id="<?php echo esc_attr( $link['id'] ?? '' ); ?>" style="padding: 5px 10px; background: #0073aa; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">✏️ Edit</button>
                                    <button type="button" class="lib-remove-link" data-link-id="<?php echo esc_attr( $link['id'] ?? '' ); ?>" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">✕</button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
                
                <div id="lib-links-container">
                    <!-- Editing forms will be added here dynamically when user clicks Edit -->
                </div>
                
                <button type="button" class="lib-btn lib-btn-secondary" id="lib-add-link-btn">+ Add Another Link</button>
                <?php if ( ! $is_premium ) : ?>
                    <p style="color: #999; font-size: 12px; margin-top: 10px;">
                        Free version: Social media platforms only. 
                        <a href="#" style="color: #0073aa;">Upgrade to Pro</a> for custom links!
                    </p>
                <?php endif; ?>
            </div>
            
            <div class="lib-button-group">
                <button type="submit" class="lib-btn">
                    <?php if ( empty( $existing_data['title'] ) ) : ?>
                        ✓ Create Bio Page
                    <?php else : ?>
                        ✓ Update Bio Page
                    <?php endif; ?>
                </button>
            </div>
            <?php echo $message; ?>
        </form>
    </div>
    
    <script>
    (function() {
    // Store existing links data in JavaScript (indexed by ID)
    const existingLinksArray = <?php echo json_encode( $existing_data['links'] ?? array() ); ?>;
    const existingLinks = {};
    existingLinksArray.forEach(link => {
        if (link.id) existingLinks[link.id] = link;
    });
    
    const isPremium = <?php echo $is_premium ? 'true' : 'false'; ?>;
    const bioPageExists = <?php echo $bio_page_exists ? 'true' : 'false'; ?>;
    const deletedIds = new Set(); // Track which link IDs are deleted
    
    // Handle editing existing links
    document.addEventListener('click', function(e) {
        // Edit link button
        if (e.target.classList.contains('lib-edit-link')) {
            const linkId = e.target.getAttribute('data-link-id');
            const link = existingLinks[linkId];
            
            // Don't allow editing deleted links
            if (deletedIds.has(linkId) || !link) return;
            
            // Check if edit form already exists
            let linkItem = document.querySelector(`[data-edit-link-id="${linkId}"]`);
            
            if (!linkItem) {
                // Create the edit form dynamically
                linkItem = document.createElement('div');
                linkItem.className = 'lib-link-item';
                linkItem.setAttribute('data-edit-link-id', linkId);
                
                const platform = link.platform || '';
                const username = link.username || '';
                const title = link.title || '';
                const url = link.url || '';
                const color = link.color || '#0073aa';
                const linkIdValue = link.id || '';
                
                if (isPremium) {
                    // Premium version
                    linkItem.innerHTML = `
                        <input type="hidden" name="link_id[]" value="${linkIdValue}">
                        <label style="font-weight: 600; margin-bottom: 5px; display: block;">Platform:</label>
                        <select class="link-platform" name="link_platform[]" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;" required>
                            <option value="instagram" ${platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                            <option value="facebook" ${platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                            <option value="youtube" ${platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                            <option value="tiktok" ${platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
                            <option value="twitter" ${platform === 'twitter' ? 'selected' : ''}>Twitter / X</option>
                            <option value="custom" ${platform === 'custom' ? 'selected' : ''}>Custom Link</option>
                        </select>
                        <input type="text" class="link-title" name="link_title[]" placeholder="Link Title (e.g., My Blog)" value="${title}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; display: ${platform === 'custom' ? 'block' : 'none'};" data-custom-title>
                        <input type="text" class="link-username" name="link_username[]" placeholder="Username or Handle (e.g., yourname)" value="${username}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; display: ${platform === 'custom' ? 'none' : 'block'};" data-username-field>
                        <input type="url" class="link-custom-url" name="link_custom_url[]" placeholder="Full URL (e.g., https://example.com)" value="${url}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; display: ${platform === 'custom' ? 'block' : 'none'};" data-custom-url>
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <button type="button" class="lib-btn lib-btn-secondary lib-save-edit" data-link-id="${linkIdValue}" style="flex: 1;">✓ Save Changes</button>
                            <button type="button" class="lib-btn lib-btn-delete" onclick="this.parentElement.parentElement.remove();">✕ Cancel</button>
                        </div>
                    `;
                } else {
                    // Free version
                    linkItem.innerHTML = `
                        <input type="hidden" name="link_id[]" value="${linkIdValue}">
                        <label style="font-weight: 600; margin-bottom: 5px; display: block;">Platform:</label>
                        <select class="link-platform" name="link_platform[]" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;" required>
                            <option value="instagram" ${platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                            <option value="facebook" ${platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                            <option value="youtube" ${platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                            <option value="tiktok" ${platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
                            <option value="twitter" ${platform === 'twitter' ? 'selected' : ''}>Twitter / X</option>
                        </select>
                        <input type="text" class="link-username" name="link_username[]" placeholder="Username or Handle (e.g., yourname)" value="${username}" required style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <button type="button" class="lib-btn lib-btn-secondary lib-save-edit" data-link-id="${linkIdValue}" style="flex: 1;">✓ Save Changes</button>
                            <button type="button" class="lib-btn lib-btn-delete" onclick="this.parentElement.parentElement.remove();">✕ Cancel</button>
                        </div>
                    `;
                }
                
                document.getElementById('lib-links-container').appendChild(linkItem);
            }
            
            linkItem.style.display = 'block';
            linkItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Remove link button
        if (e.target.classList.contains('lib-remove-link')) {
            if (confirm('Are you sure you want to remove this link? This will delete it immediately.')) {
                const linkId = e.target.getAttribute('data-link-id');
                const button = e.target;
                
                // Disable button during request
                button.disabled = true;
                button.textContent = '⏳ Deleting...';
                
                // Make AJAX request to delete link
                fetch('<?php echo admin_url( "admin-ajax.php" ); ?>', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'lib_delete_link',
                        nonce: '<?php echo wp_create_nonce( "lib_delete_link_nonce" ); ?>',
                        link_id: linkId
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Mark this ID as deleted
                        deletedIds.add(linkId);
                        
                        // Remove the edit form if it exists
                        const editForm = document.querySelector(`[data-edit-link-id="${linkId}"]`);
                        if (editForm) {
                            editForm.remove();
                        }
                        
                        // Remove the saved link display element
                        const linkCard = document.querySelector(`[data-link-id="${linkId}"]`);
                        if (linkCard) {
                            linkCard.remove();
                        }
                        
                        // Show success message
                        alert('✓ Link deleted successfully!');
                    } else {
                        alert('Error: ' + (data.data?.message || 'Could not delete link'));
                        button.disabled = false;
                        button.textContent = '✕';
                    }
                })
                .catch(error => {
                    console.error('Delete error:', error);
                    alert('Error deleting link. Please try again.');
                    button.disabled = false;
                    button.textContent = '✕';
                });
            }
        }
        
        // Save edit button
        if (e.target.classList.contains('lib-save-edit')) {
            const linkId = e.target.getAttribute('data-link-id');
            const linkItem = document.querySelector(`[data-edit-link-id="${linkId}"]`);
            
            if (linkItem) {
                const button = e.target;
                
                // Get form data
                const platform = linkItem.querySelector('.link-platform')?.value || '';
                const username = linkItem.querySelector('.link-username')?.value || '';
                const title = linkItem.querySelector('.link-title')?.value || '';
                const customUrl = linkItem.querySelector('.link-custom-url')?.value || '';
                const color = linkItem.querySelector('.link-color')?.value || '#0073aa';
                
                // Validate
                if (!platform) {
                    alert('Please select a platform');
                    return;
                }
                
                if (platform === 'custom') {
                    if (!title || !customUrl) {
                        alert('Please enter both title and URL for custom links');
                        return;
                    }
                } else {
                    if (!username) {
                        alert('Please enter a username');
                        return;
                    }
                }
                
                // Disable button during save
                button.disabled = true;
                button.textContent = '⏳ Saving...';
                
                // Make AJAX request
                fetch('<?php echo admin_url( "admin-ajax.php" ); ?>', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'lib_save_link',
                        nonce: '<?php echo wp_create_nonce( "lib_save_link_nonce" ); ?>',
                        link_id: linkId || '',
                        platform: platform,
                        username: username,
                        title: title,
                        custom_url: customUrl,
                        color: color
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Update the existing links object
                        if (data.data.link && data.data.link.id) {
                            existingLinks[data.data.link.id] = data.data.link;
                        }
                        
                        // Hide the edit form
                        linkItem.style.display = 'none';
                        
                        // Show success and reload to display the saved link
                        alert('✓ Link saved successfully!');
                        location.reload();
                    } else {
                        alert('Error: ' + (data.data?.message || 'Could not save link'));
                        button.disabled = false;
                        button.textContent = '✓ Save Changes';
                    }
                })
                .catch(error => {
                    console.error('Save error:', error);
                    alert('Error saving link. Please try again.');
                    button.disabled = false;
                    button.textContent = '✓ Save Changes';
                });
            }
        }
        
        // Save new link button
        if (e.target.classList.contains('lib-save-new-link')) {
            const linkItem = e.target.closest('.lib-link-item');
            
            if (linkItem) {
                const button = e.target;
                
                // Get form data
                const platform = linkItem.querySelector('.link-platform')?.value || '';
                const username = linkItem.querySelector('.link-username')?.value || '';
                const title = linkItem.querySelector('.link-title')?.value || '';
                const customUrl = linkItem.querySelector('.link-custom-url')?.value || '';
                const color = linkItem.querySelector('.link-color')?.value || '#0073aa';
                
                // Validate
                if (!platform) {
                    alert('Please select a platform');
                    return;
                }
                
                if (platform === 'custom') {
                    if (!title || !customUrl) {
                        alert('Please enter both title and URL for custom links');
                        return;
                    }
                } else {
                    if (!username) {
                        alert('Please enter a username');
                        return;
                    }
                }
                
                // Disable button during save
                button.disabled = true;
                button.textContent = '⏳ Saving...';
                
                // Make AJAX request (no link_id for new links)
                fetch('<?php echo admin_url( "admin-ajax.php" ); ?>', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'lib_save_link',
                        nonce: '<?php echo wp_create_nonce( "lib_save_link_nonce" ); ?>',
                        link_id: '',
                        platform: platform,
                        username: username,
                        title: title,
                        custom_url: customUrl,
                        color: color
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success and reload to display the new link
                        alert('✓ Link added successfully!');
                        location.reload();
                    } else {
                        alert('Error: ' + (data.data?.message || 'Could not save link'));
                        button.disabled = false;
                        button.textContent = '💾 Save';
                    }
                })
                .catch(error => {
                    console.error('Save error:', error);
                    alert('Error saving link. Please try again.');
                    button.disabled = false;
                    button.textContent = '💾 Save';
                });
            }
        }
    });
    
    // Handle platform selection for premium users (show/hide custom fields)
    <?php if ( $is_premium ) : ?>
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('link-platform')) {
            const linkItem = e.target.closest('.lib-link-item');
            const customTitle = linkItem.querySelector('[data-custom-title]');
            const usernameField = linkItem.querySelector('[data-username-field]');
            const customUrl = linkItem.querySelector('[data-custom-url]');
            
            if (e.target.value === 'custom') {
                // Show custom link fields
                if (customTitle) {
                    customTitle.style.display = 'block';
                    customTitle.required = true;
                }
                if (customUrl) {
                    customUrl.style.display = 'block';
                    customUrl.required = true;
                }
                if (usernameField) {
                    usernameField.style.display = 'none';
                    usernameField.required = false;
                }
            } else {
                // Show username field for social platforms
                if (customTitle) {
                    customTitle.style.display = 'none';
                    customTitle.required = false;
                }
                if (customUrl) {
                    customUrl.style.display = 'none';
                    customUrl.required = false;
                }
                if (usernameField) {
                    usernameField.style.display = 'block';
                    usernameField.required = true;
                }
            }
        }
    });
    <?php endif; ?>
    
    const addLinkBtn = document.getElementById('lib-add-link-btn');
    console.log('Add link button found:', addLinkBtn);
    if (addLinkBtn && !addLinkBtn.dataset.listenerAttached) {
        addLinkBtn.dataset.listenerAttached = 'true';
        addLinkBtn.addEventListener('click', function(e) {
            console.log('Add link button clicked!');
            e.preventDefault();
            e.stopPropagation();
            const container = document.getElementById('lib-links-container');
            console.log('Container found:', container);
            const itemCount = container.children.length;
            
            // Get already used platforms from existing saved links AND edit forms
            const usedPlatforms = new Set();
            
            // Check saved links (from existingLinks object)
            Object.values(existingLinks).forEach(link => {
                if (link.platform && link.platform !== 'custom') {
                    usedPlatforms.add(link.platform);
                }
            });
            
            // Also check any edit forms currently open
            document.querySelectorAll('.link-platform').forEach(select => {
                if (select.value && select.value !== 'custom') {
                    usedPlatforms.add(select.value);
                }
            });
            
            console.log('Used platforms:', Array.from(usedPlatforms));
        
            const newItem = document.createElement('div');
            newItem.className = 'lib-link-item';
            
            let platforms, availablePlatforms, platformOptions;
            
            <?php if ( ! $is_premium ) : ?>
            // Free version - social platforms only
            platforms = [
                {value: 'instagram', label: 'Instagram'},
                {value: 'facebook', label: 'Facebook'},
                {value: 'youtube', label: 'YouTube'},
                {value: 'tiktok', label: 'TikTok'},
                {value: 'twitter', label: 'Twitter / X'}
            ];
            availablePlatforms = platforms.filter(p => !usedPlatforms.has(p.value));
            
            if (availablePlatforms.length === 0) {
                alert('You have already added all available social media platforms!');
                return;
            }
            
            platformOptions = availablePlatforms.map(p => `<option value="${p.value}">${p.label}</option>`).join('');
            
            const saveButtonHtml = bioPageExists ? '<button type="button" class="lib-btn lib-btn-secondary lib-save-new-link" style="white-space: nowrap; margin: 0; padding: 8px 16px;">💾 Save</button>' : '';
            
            newItem.innerHTML = `
                <label style="font-weight: 600; margin-bottom: 5px; display: block;">Platform:</label>
                <select class="link-platform" name="link_platform[]" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" required>
                    ${platformOptions}
                </select>
                <div style="display: flex; gap: 8px; align-items: flex-end; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <input type="text" class="link-username" name="link_username[]" placeholder="Username or Handle (e.g., yourname)" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                    </div>
                    ${saveButtonHtml}
                </div>
                <button type="button" class="lib-btn lib-btn-delete" onclick="this.parentElement.remove();">✕ Remove</button>
            `;
            <?php else : ?>
            // Premium version - includes custom option
            platforms = [
                {value: 'instagram', label: 'Instagram'},
                {value: 'facebook', label: 'Facebook'},
                {value: 'youtube', label: 'YouTube'},
                {value: 'tiktok', label: 'TikTok'},
                {value: 'twitter', label: 'Twitter / X'},
                {value: 'custom', label: 'Custom Link'}
            ];
            availablePlatforms = platforms.filter(p => p.value === 'custom' || !usedPlatforms.has(p.value));
            platformOptions = availablePlatforms.map(p => `<option value="${p.value}">${p.label}</option>`).join('');
            
            const saveButtonHtml = bioPageExists ? '<button type="button" class="lib-btn lib-btn-secondary lib-save-new-link" style="white-space: nowrap; margin: 0; padding: 8px 16px;">💾 Save</button>' : '';
            
            newItem.innerHTML = `
                <label style="font-weight: 600; margin-bottom: 5px; display: block;">Platform:</label>
                <select class="link-platform" name="link_platform[]" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" required>
                    ${platformOptions}
                </select>
                <div style="display: flex; gap: 8px; align-items: flex-end; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <input type="text" class="link-title" name="link_title[]" placeholder="Link Title (e.g., My Blog)" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; display: none;" data-custom-title>
                        <input type="text" class="link-username" name="link_username[]" placeholder="Username or Handle (e.g., yourname)" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; display: block;" data-username-field>
                        <input type="url" class="link-custom-url" name="link_custom_url[]" placeholder="Full URL (e.g., https://example.com)" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; display: none;" data-custom-url>
                    </div>
                    ${saveButtonHtml}
                </div>
                <button type="button" class="lib-btn lib-btn-delete" onclick="this.parentElement.remove();">✕ Remove</button>
            `;
            <?php endif; ?>
            
            container.appendChild(newItem);
        });
    }
    
    // Debug form submission
    const form = document.getElementById('lib-bio-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const deletedInputs = document.querySelectorAll('.lib-deleted-id');
            console.log('=== FORM SUBMISSION DEBUG ===');
            console.log('Deleted IDs in Set:', Array.from(deletedIds));
            console.log('Deleted hidden inputs count:', deletedInputs.length);
            deletedInputs.forEach((input, index) => {
                console.log(`Deleted input ${index}:`, input.name, '=', input.value);
            });
            console.log('===========================');
        });
    }
    
    // Team ID inline editing
    const editTeamIdBtn = document.getElementById('edit-team-id-btn');
    const saveTeamIdBtn = document.getElementById('save-team-id-btn');
    const cancelTeamIdBtn = document.getElementById('cancel-team-id-btn');
    const teamIdDisplay = document.getElementById('team-id-display');
    const teamIdEdit = document.getElementById('team-id-edit');
    
    if (editTeamIdBtn) {
        editTeamIdBtn.addEventListener('click', function() {
            teamIdDisplay.style.display = 'none';
            teamIdEdit.style.display = 'block';
        });
    }
    
    if (cancelTeamIdBtn) {
        cancelTeamIdBtn.addEventListener('click', function() {
            // Reset to original value
            const originalValue = document.getElementById('team_id_hidden').value;
            document.getElementById('team_id_input').value = originalValue;
            teamIdDisplay.style.display = 'flex';
            teamIdEdit.style.display = 'none';
        });
    }
    
    if (saveTeamIdBtn) {
        saveTeamIdBtn.addEventListener('click', function() {
            const newTeamId = document.getElementById('team_id_input').value.trim();
            
            if (!newTeamId) {
                alert('Team ID is required');
                return;
            }
            
            saveTeamIdBtn.disabled = true;
            saveTeamIdBtn.textContent = '⏳ Saving...';
            
            fetch('<?php echo admin_url( "admin-ajax.php" ); ?>', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    action: 'lib_update_team_id',
                    nonce: '<?php echo wp_create_nonce( "lib_update_meta_nonce" ); ?>',
                    team_id: newTeamId
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update display and hidden field
                    document.getElementById('team-id-value').textContent = newTeamId;
                    document.getElementById('team_id_hidden').value = newTeamId;
                    
                    teamIdDisplay.style.display = 'flex';
                    teamIdEdit.style.display = 'none';
                    alert('✓ Team ID saved successfully!');
                } else {
                    alert('Error: ' + (data.data?.message || 'Could not save Team ID'));
                }
                saveTeamIdBtn.disabled = false;
                saveTeamIdBtn.textContent = '💾 Save';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error saving Team ID. Please try again.');
                saveTeamIdBtn.disabled = false;
                saveTeamIdBtn.textContent = '💾 Save';
            });
        });
    }
    
    // Page Title inline editing
    const editTitleBtn = document.getElementById('edit-title-btn');
    const saveTitleBtn = document.getElementById('save-title-btn');
    const cancelTitleBtn = document.getElementById('cancel-title-btn');
    const titleDisplay = document.getElementById('title-display');
    const titleEdit = document.getElementById('title-edit');
    
    if (editTitleBtn) {
        editTitleBtn.addEventListener('click', function() {
            titleDisplay.style.display = 'none';
            titleEdit.style.display = 'block';
        });
    }
    
    if (cancelTitleBtn) {
        cancelTitleBtn.addEventListener('click', function() {
            titleDisplay.style.display = 'flex';
            titleEdit.style.display = 'none';
        });
    }
    
    if (saveTitleBtn) {
        saveTitleBtn.addEventListener('click', function() {
            const newTitle = document.getElementById('title-input').value.trim();
            
            if (!newTitle) {
                alert('Page title is required');
                return;
            }
            
            saveTitleBtn.disabled = true;
            saveTitleBtn.textContent = '⏳ Saving...';
            
            fetch('<?php echo admin_url( "admin-ajax.php" ); ?>', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    action: 'lib_update_title',
                    nonce: '<?php echo wp_create_nonce( "lib_update_meta_nonce" ); ?>',
                    title: newTitle
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('title-value').textContent = newTitle;
                    // Update hidden field for form submission
                    const hiddenTitleField = document.getElementById('bio_title_hidden');
                    if (hiddenTitleField) {
                        hiddenTitleField.value = newTitle;
                    }
                    titleDisplay.style.display = 'flex';
                    titleEdit.style.display = 'none';
                    alert('✓ Page title updated successfully!');
                } else {
                    alert('Error: ' + (data.data?.message || 'Could not update page title'));
                }
                saveTitleBtn.disabled = false;
                saveTitleBtn.textContent = '💾 Save';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating page title. Please try again.');
                saveTitleBtn.disabled = false;
                saveTitleBtn.textContent = '💾 Save';
            });
        });
    }
    
    // Save Image button
    const saveImageBtn = document.getElementById('save-image-btn');
    if (saveImageBtn) {
        saveImageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('bio_image');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select an image to upload');
                return;
            }
            
            // Verify form has enctype for file upload
            const form = document.getElementById('lib-bio-form');
            if (!form.getAttribute('enctype')) {
                form.setAttribute('enctype', 'multipart/form-data');
            }
            
            saveImageBtn.disabled = true;
            saveImageBtn.textContent = '⏳ Uploading...';
            
            // Submit the form to upload the image
            form.submit();
        });
    }
    
    // Theme selector - auto-save on change
    const themeSelector = document.getElementById('bio_theme');
    if (themeSelector) {
        themeSelector.addEventListener('change', function() {
            const selectedTheme = this.value;
            const originalValue = this.options[this.selectedIndex].text;
            
            // Disable selector during save
            themeSelector.disabled = true;
            
            fetch('<?php echo admin_url( "admin-ajax.php" ); ?>', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    action: 'lib_update_theme',
                    nonce: '<?php echo wp_create_nonce( "lib_update_meta_nonce" ); ?>',
                    theme: selectedTheme
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message briefly
                    const successMsg = document.createElement('span');
                    successMsg.style.cssText = 'color: #5cb85c; margin-left: 10px; font-size: 12px;';
                    successMsg.textContent = '✓ Theme saved!';
                    themeSelector.parentElement.appendChild(successMsg);
                    
                    setTimeout(() => successMsg.remove(), 2000);
                } else {
                    alert('Error: ' + (data.data?.message || 'Could not update theme'));
                }
                themeSelector.disabled = false;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating theme. Please try again.');
                themeSelector.disabled = false;
            });
        });
    }
    })(); // End of IIFE
    </script>
    
    <?php
    
    wp_reset_postdata();
    return ob_get_clean();
}

add_shortcode( 'create_bio_page', 'lib_create_bio_page_form' );

// 4. Single Template for Link in Bio Pages (Display)
function lib_single_template( $template ) {
    if ( is_singular( 'link_in_bio' ) ) {
        $new_template = locate_template( array( 'single-link_in_bio.php' ) );
        if ( $new_template ) {
            return $new_template;
        }
        
        // Get theme
        $theme = get_post_meta( get_the_ID(), '_lib_theme', true ) ?: 'default';
        
        // Theme configurations
        $themes = array(
            'default' => array(
                'body_bg' => 'linear-gradient(135deg, #00d9ff 0%, #7c3aed 100%)',
                'container_bg' => 'white',
                'text_color' => '#333',
                'text_secondary' => '#666',
                'btn_color' => '#7c3aed',
            ),
            'football-pitch' => array(
                'body_bg' => 'repeating-linear-gradient(0deg, #4a7c2a 0px, #4a7c2a 80px, #5a9237 80px, #5a9237 160px)',
                'container_bg' => 'rgba(255, 255, 255, 0.95)',
                'text_color' => '#1a3a0a',
                'text_secondary' => '#2d5016',
                'btn_color' => '#2d5016',
            ),
            'dark-mode' => array(
                'body_bg' => 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                'container_bg' => 'rgba(30, 30, 30, 0.95)',
                'text_color' => '#e5e5e5',
                'text_secondary' => '#a0a0a0',
                'btn_color' => '#4a4a4a',
            ),
            'gradient-dream' => array(
                'body_bg' => 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'container_bg' => 'white',
                'text_color' => '#333',
                'text_secondary' => '#666',
                'btn_color' => '#764ba2',
            ),
            'midnight-aurora' => array(
                'body_bg' => 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                'container_bg' => 'rgba(255, 255, 255, 0.95)',
                'text_color' => '#1a1a1a',
                'text_secondary' => '#4a4a4a',
                'btn_color' => '#2c5364',
            ),
            'sunset-breeze' => array(
                'body_bg' => 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)',
                'container_bg' => 'rgba(255, 255, 255, 0.98)',
                'text_color' => '#2d3436',
                'text_secondary' => '#636e72',
                'btn_color' => '#ff6b6b',
            ),
            'neon-nights' => array(
                'body_bg' => 'linear-gradient(135deg, #ff0080 0%, #7928ca 50%, #0047ff 100%)',
                'container_bg' => 'rgba(0, 0, 0, 0.85)',
                'text_color' => '#00ffff',
                'text_secondary' => '#ff00ff',
                'btn_color' => '#7928ca',
            ),
            'forest-whisper' => array(
                'body_bg' => 'linear-gradient(135deg, #134e4a 0%, #065f46 50%, #047857 100%)',
                'container_bg' => 'rgba(255, 255, 255, 0.92)',
                'text_color' => '#064e3b',
                'text_secondary' => '#047857',
                'btn_color' => '#047857',
            ),
            'ocean-depth' => array(
                'body_bg' => 'linear-gradient(135deg, #003049 0%, #005f73 50%, #0a9396 100%)',
                'container_bg' => 'rgba(255, 255, 255, 0.93)',
                'text_color' => '#001219',
                'text_secondary' => '#005f73',
                'btn_color' => '#0a9396',
            ),
            'bubblegum-pop' => array(
                'body_bg' => 'linear-gradient(135deg, #ff6fb5 0%, #ffc3e0 50%, #ffb7ff 100%)',
                'container_bg' => 'rgba(255, 255, 255, 0.96)',
                'text_color' => '#c026d3',
                'text_secondary' => '#ec4899',
                'btn_color' => '#ec4899',
            ),
            'golden-hour' => array(
                'body_bg' => 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)',
                'container_bg' => 'rgba(255, 255, 255, 0.97)',
                'text_color' => '#78350f',
                'text_secondary' => '#92400e',
                'btn_color' => '#d97706',
            ),
        );
        
        $current_theme = $themes[$theme] ?? $themes['default'];
        
        ob_start();
        ?>
        <!DOCTYPE html>
        <html <?php language_attributes(); ?>>
        <head>
            <meta charset="<?php bloginfo( 'charset' ); ?>">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title><?php wp_title(); ?></title>
            <meta property="og:title" content="<?php wp_title(); ?>">
            <meta property="og:image" content="<?php echo esc_url( get_the_post_thumbnail_url( null, 'large' ) ); ?>">
            <meta property="og:description" content="<?php echo esc_attr( get_the_excerpt() ); ?>">
            <?php wp_head(); ?>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    background: <?php echo $current_theme['body_bg']; ?>;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .lib-bio-container {
                    background: <?php echo $current_theme['container_bg']; ?>;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    backdrop-filter: blur(10px);
                }
                .lib-profile {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .lib-profile img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    margin-bottom: 15px;
                    object-fit: cover;
                    border: 3px solid rgba(255,255,255,0.8);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .lib-profile h1 {
                    font-size: 24px;
                    margin-bottom: 10px;
                    color: <?php echo $current_theme['text_color']; ?>;
                }
                .lib-profile p {
                    color: <?php echo $current_theme['text_secondary']; ?>;
                    font-size: 14px;
                    line-height: 1.6;
                }
                .lib-links {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .lib-link-btn {
                    display: block;
                    padding: 14px 20px;
                    text-align: center;
                    text-decoration: none !important;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: transform 0.2s, box-shadow 0.2s;
                    color: white !important;
                    border: none;
                    cursor: pointer;
                }
                .lib-link-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                    color: white !important;
                    text-decoration: none !important;
                }
                .lib-content {
                    margin-top: 30px;
                    padding-top: 30px;
                    border-top: 1px solid rgba(0,0,0,0.1);
                    color: <?php echo $current_theme['text_secondary']; ?>;
                    font-size: 14px;
                    line-height: 1.6;
                }
            </style>
        </head>
        <body <?php body_class(); ?>>
            <div class="lib-bio-container">
                <div class="lib-profile">
                    <?php if ( has_post_thumbnail() ) { the_post_thumbnail( 'medium' ); } ?>
                    <h1><?php the_title(); ?></h1>
                    <?php if ( get_the_excerpt() ) { echo '<p>' . wp_kses_post( get_the_excerpt() ) . '</p>'; } ?>
                </div>
                
                <?php
                // Check if page author is premium using Paid Memberships Pro
                $author_id = get_the_author_meta( 'ID' );
                $is_premium_user = function_exists( 'pmpro_hasMembershipLevel' ) && pmpro_hasMembershipLevel( array( '10', '12' ), $author_id );
                
                // FPL Stats Panel
                $team_id = get_post_meta( get_the_ID(), '_lib_team_id', true );
                
                // Debug: Always show panel for testing
                echo '<!-- DEBUG: Post ID: ' . esc_html( get_the_ID() ) . ', Team ID: ' . esc_html( $team_id ) . ' -->';
                
                if ( ! empty( $team_id ) ) {
                    // Fetch FPL data from API
                    $api_url = 'https://coolproxy.fpltoolbox.com/http://fantasy.premierleague.com/api/entry/' . intval( $team_id ) . '/';
                    $response = wp_remote_get( $api_url, array( 'timeout' => 10 ) );
                    
                    echo '<!-- DEBUG: API URL: ' . esc_html( $api_url ) . ' -->';
                    echo '<!-- DEBUG: Response Code: ' . esc_html( wp_remote_retrieve_response_code( $response ) ) . ' -->';
                    
                    if ( ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) === 200 ) {
                        $fpl_data = json_decode( wp_remote_retrieve_body( $response ), true );
                        
                        echo '<!-- DEBUG: FPL Data exists: ' . ( $fpl_data ? 'YES' : 'NO' ) . ' -->';
                        
                        if ( $fpl_data ) {
                            // Extract stats
                            $bank = isset( $fpl_data['last_deadline_bank'] ) ? number_format( $fpl_data['last_deadline_bank'] / 10, 1 ) : '0.0';
                            $team_value = isset( $fpl_data['last_deadline_value'] ) ? number_format( $fpl_data['last_deadline_value'] / 10, 1 ) : '0.0';
                            $total_transfers = isset( $fpl_data['last_deadline_total_transfers'] ) ? $fpl_data['last_deadline_total_transfers'] : 0;
                            $years_active = isset( $fpl_data['years_active'] ) ? $fpl_data['years_active'] : 0;
                            $overall_points = isset( $fpl_data['summary_overall_points'] ) ? number_format( $fpl_data['summary_overall_points'] ) : '0';
                            $overall_rank = isset( $fpl_data['summary_overall_rank'] ) ? number_format( $fpl_data['summary_overall_rank'] ) : '0';
                            $gw_points = isset( $fpl_data['summary_event_points'] ) ? $fpl_data['summary_event_points'] : 0;
                            $gw_rank = isset( $fpl_data['summary_event_rank'] ) ? number_format( $fpl_data['summary_event_rank'] ) : '0';
                            $current_gw = isset( $fpl_data['current_event'] ) ? $fpl_data['current_event'] : 0;
                            
                            // Get selected stats to display
                            $selected_stats = get_post_meta( get_the_ID(), '_lib_fpl_stats', true );
                            if ( ! is_array( $selected_stats ) || empty( $selected_stats ) ) {
                                $selected_stats = array( 'overall_points', 'overall_rank', 'event_points', 'event_rank', 'team_value', 'bank' );
                            }
                            
                            // Define all available stats
                            $all_stats = array(
                                'overall_points' => array(
                                    'label' => 'Overall Points',
                                    'value' => $overall_points,
                                    'size' => 'large'
                                ),
                                'overall_rank' => array(
                                    'label' => 'Overall Rank',
                                    'value' => $overall_rank,
                                    'size' => 'large'
                                ),
                                'event_points' => array(
                                    'label' => 'GW' . $current_gw . ' Points',
                                    'value' => $gw_points,
                                    'size' => 'large'
                                ),
                                'event_rank' => array(
                                    'label' => 'GW' . $current_gw . ' Rank',
                                    'value' => $gw_rank,
                                    'size' => 'large'
                                ),
                                'team_value' => array(
                                    'label' => 'Team Value',
                                    'value' => '£' . $team_value . 'm',
                                    'size' => 'small'
                                ),
                                'bank' => array(
                                    'label' => 'Bank',
                                    'value' => '£' . $bank . 'm',
                                    'size' => 'small'
                                ),
                                'total_transfers' => array(
                                    'label' => 'Total Transfers',
                                    'value' => $total_transfers,
                                    'size' => 'small'
                                ),
                                'years_active' => array(
                                    'label' => 'Years Active',
                                    'value' => $years_active,
                                    'size' => 'small'
                                ),
                            );
                            
                            // Filter to only selected stats
                            $large_stats = array();
                            $small_stats = array();
                            foreach ( $selected_stats as $stat_key ) {
                                if ( isset( $all_stats[$stat_key] ) ) {
                                    if ( $all_stats[$stat_key]['size'] === 'large' ) {
                                        $large_stats[$stat_key] = $all_stats[$stat_key];
                                    } else {
                                        $small_stats[$stat_key] = $all_stats[$stat_key];
                                    }
                                }
                            }
                            ?>
                            <div class="lib-fpl-stats" style="background: <?php echo esc_attr( $current_theme['container_bg'] ); ?>; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                                <button id="fpl-toggle" type="button" style="width: 100%; padding: 16px 20px; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.2s;">
                                    <h3 style="margin: 0; color: <?php echo esc_attr( $current_theme['text_color'] ); ?>; font-size: 18px; font-weight: 600;">My FPL Stats</h3>
                                    <span id="fpl-arrow" style="color: <?php echo esc_attr( $current_theme['text_color'] ); ?>; font-size: 20px; transition: transform 0.3s;">▼</span>
                                </button>
                                <div id="fpl-content" style="display: none; padding: 0 20px 20px 20px;">
                                
                                    <?php if ( ! empty( $large_stats ) ) : ?>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;<?php echo ! empty( $small_stats ) ? ' margin-bottom: 16px;' : ''; ?>">
                                        <?php foreach ( $large_stats as $stat ) : ?>
                                        <div style="background: rgba(0,0,0,0.03); padding: 12px; border-radius: 8px;">
                                            <div style="color: <?php echo esc_attr( $current_theme['text_secondary'] ); ?>; font-size: 12px; margin-bottom: 4px;"><?php echo esc_html( $stat['label'] ); ?></div>
                                            <div style="color: <?php echo esc_attr( $current_theme['text_color'] ); ?>; font-size: 20px; font-weight: 700;"><?php echo esc_html( $stat['value'] ); ?></div>
                                        </div>
                                        <?php endforeach; ?>
                                    </div>
                                    <?php endif; ?>
                                    
                                    <?php if ( ! empty( $small_stats ) ) : ?>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;<?php echo ! empty( $large_stats ) ? ' padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.1);' : ''; ?>">
                                        <?php foreach ( $small_stats as $stat ) : ?>
                                        <div>
                                            <div style="color: <?php echo esc_attr( $current_theme['text_secondary'] ); ?>; font-size: 11px; margin-bottom: 2px;"><?php echo esc_html( $stat['label'] ); ?></div>
                                            <div style="color: <?php echo esc_attr( $current_theme['text_color'] ); ?>; font-size: 14px; font-weight: 600;"><?php echo esc_html( $stat['value'] ); ?></div>
                                        </div>
                                        <?php endforeach; ?>
                                    </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <script>
                            (function() {
                                const toggle = document.getElementById('fpl-toggle');
                                const content = document.getElementById('fpl-content');
                                const arrow = document.getElementById('fpl-arrow');
                                
                                if (toggle && content && arrow) {
                                    toggle.addEventListener('click', function() {
                                        const isOpen = content.style.display !== 'none';
                                        content.style.display = isOpen ? 'none' : 'block';
                                        arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                                        toggle.style.background = isOpen ? 'transparent' : 'rgba(0,0,0,0.03)';
                                    });
                                    // Hover effect
                                    toggle.addEventListener('mouseenter', function() {
                                        if (content.style.display === 'none') {
                                            toggle.style.background = 'rgba(0,0,0,0.02)';
                                        }
                                    });
                                    toggle.addEventListener('mouseleave', function() {
                                        if (content.style.display === 'none') {
                                            toggle.style.background = 'transparent';
                                        }
                                    });
                                }
                            })();
                            </script>
                            <?php
                        }
                    }
                }
                ?>
                
                <div class="lib-links">
                    <?php
                    $links = get_post_meta( get_the_ID(), '_lib_links', true );
                    if ( is_array( $links ) && ! empty( $links ) ) {
                        // Social media icons (SVG)
                        $icons = array(
                            'instagram' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
                            'facebook' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>',
                            'youtube' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>',
                            'tiktok' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>',
                            'twitter' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
                            'custom' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
                        );
                        
                        foreach ( $links as $link ) {
                            $btn_color = ! empty( $link['color'] ) ? $link['color'] : $current_theme['btn_color'];
                            $platform = isset( $link['platform'] ) ? $link['platform'] : 'custom';
                            $icon = isset( $icons[$platform] ) ? $icons[$platform] : $icons['custom'];
                            
                            echo '<a href="' . esc_url( $link['url'] ) . '" class="lib-link-btn" style="background-color: ' . esc_attr( $btn_color ) . ' !important; color: white !important;">' . $icon . esc_html( $link['title'] ) . '</a>';
                        }
                    }
                    ?>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <a href="https://www.fpltoolbox.com" target="_blank" rel="noopener" style="color: <?php echo esc_attr( $current_theme['text_secondary'] ); ?>; text-decoration: none; font-size: 13px; opacity: 0.7; transition: opacity 0.2s;">
                        <?php if ( $is_premium_user ) : ?>
                            Made at <strong style="font-weight: 600;">FPLT</strong>
                        <?php else : ?>
                            Make your own FPL page at <strong style="font-weight: 600;">FPLToolbox</strong>
                        <?php endif; ?>
                    </a>
                </div>
            </div>
            
            <?php wp_footer(); ?>
        </body>
        </html>
        <?php
        return '';
    }
    
    return $template;
}
add_filter( 'template_include', 'lib_single_template' );

?>