<?php

// Change admin menu + top bar colour
add_action('admin_head', function () {
    echo '<style>
        /* Left Admin Menu */
        #adminmenu, #adminmenu .wp-submenu, #adminmenuback, #adminmenuwrap {
            background-color: #0099CC !important;
        }
        #adminmenu a {
            color: #fff !important;
        }
        #adminmenu .wp-has-current-submenu .wp-submenu,
        #adminmenu .wp-has-current-submenu .wp-submenu.sub-open,
        #adminmenu .wp-submenu-head {
            background-color: #0086B2 !important; /* Slightly darker for contrast */
        }

        /* Top Admin Bar */
        #wpadminbar {
            background-color: #0099CC !important;
        }
        #wpadminbar .ab-item, 
        #wpadminbar a.ab-item {
            color: #fff !important;
        }

/* Flashing effect */
        .backup-server-flash {
            font-weight: bold;
            color: #fff;
            animation: flashText 1s infinite;
        }
        @keyframes flashText {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    </style>';
});

// Add "BACKUP SERVER" centered in the admin bar
add_action('admin_bar_menu', function ($wp_admin_bar) {
    $args = array(
        'id'    => 'backup_server_notice',
        'title' => '<div class="backup-server-flash" style="font-weight:bold; color:#fff;">⚠ NEW BACKUP TEST SERVER ⚠</div>',
        'meta'  => array('html' => true)
    );
    $wp_admin_bar->add_node($args);
}, 999);
