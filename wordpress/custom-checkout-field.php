<?php
/**
 * Plugin Name: Custom Checkout Field
 * Description: Request an additional email at checkout
 * Version: 1.0
 * Author: SunnyDevelops
 */
add_action( 'learndash_checkout_fields_before_submit', function() {
    ?>
    <p class="learndash-custom-field">
        <label for="secondary_email"><?php esc_html_e( 'Secondary Email Address', 'your-textdomain' ); ?></label>
        <input type="email" id="secondary_email" name="secondary_email" required placeholder="Enter a secondary email address" />
    </p>
    <?php
});

/**
 * Validate the custom field.
 */
add_filter( 'learndash_checkout_validate_fields', function( $errors ) {
    if ( empty( $_POST['secondary_email'] ) ) {
        $errors[] = __( 'Please enter a secondary email address.', 'your-textdomain' );
    } elseif ( ! is_email( $_POST['secondary_email'] ) ) {
        $errors[] = __( 'Please enter a valid email address.', 'your-textdomain' );
    }
    return $errors;
});

/**
 * Save the custom field to the LearnDash order meta.
 */
add_action( 'learndash_checkout_update_order_meta', function( $order_id ) {
    if ( isset( $_POST['secondary_email'] ) && is_email( $_POST['secondary_email'] ) ) {
        update_post_meta( $order_id, '_secondary_email', sanitize_email( $_POST['secondary_email'] ) );
    }
});
