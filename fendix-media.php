<?php

/*
Plugin Name: Mixd Plugins - Fendix Media
Description: Adds support for <a href="https://www.fendixmedia.co.uk/" rel="nofollow" target="_blank">Fendix Media</a> adverts to WordPress.
Version: 1.0.0
Author: Mixd
Author URI: https://www.mixd.co.uk
*/

namespace Mixd\Plugins\Fendix;

use WP_User;

add_action('admin_menu', function () {
    add_submenu_page(
        'options-general.php',
        "Fendix Media",
        "Fendix Media",
        "manage_options",
        'fendix',
        function () {
            require trailingslashit(__DIR__) . 'screen.php';
        }
    );
});

add_action('admin_init', function () {
    // Register new settings for fendix
    register_setting('fendix', 'fendix_options');

    add_settings_section(
        "mixd_fendix",
        "Options",
        '__return_empty_string',
        'fendix'
    );

    add_settings_field(
        'fendix_urn',
        "Trust URN",
        function () {
            require trailingslashit(__DIR__) . 'fields.php';
        },
        'fendix',
        'mixd_fendix',
        ['label_for' => 'fendix_urn']
    );
});

add_action('wp_enqueue_scripts', function () {
    $fendix_src = 'src/fendix.js';
    $src_url = plugin_dir_url(__FILE__) . $fendix_src;
    $src_path = trailingslashit(__DIR__) . $fendix_src;

    wp_register_script(
        '@mixd\fendix\postscribe',
        'https://cdnjs.cloudflare.com/ajax/libs/postscribe/2.0.8/postscribe.min.js',
        [],
        '2.0.8',
        true
    );

    wp_register_script(
        '@mixd\fendix\sjcl',
        'https://cdnjs.cloudflare.com/ajax/libs/sjcl/1.0.8/sjcl.min.js',
        [],
        '1.0.8',
        true
    );

    wp_register_script(
        '@mixd\fendix',
        $src_url,
        ['jquery', '@mixd\fendix\postscribe', '@mixd\fendix\sjcl'],
        filemtime($src_path),
        true
    );

    $user = wp_get_current_user();

    if (is_a($user, WP_User::class)) {
        $email = $user->data->user_email;
    } else {
        $email = "";
    }

    $value = get_option('fendix_options');
    $urn = "";
    if (!empty($value) && isset($value['urn'])) {
        $urn = $value['urn'];
    }
    if (defined("FENDIX_TRUST_URN")) {
        $urn = FENDIX_TRUST_URN;
    }

    wp_localize_script('@mixd\fendix', 'fendix', [
        'user_email' => $email,
        'trust_urn' => $urn
    ]);

    if (empty($urn)) {
        trigger_error("Fendix Media: Trust URN is not defined. Please add it within the 'Settings > Fendix Media' admin page or define it using the PHP constant 'FENDIX_TRUST_URN'", E_USER_NOTICE);
    } else {
        wp_enqueue_script('@mixd\fendix');
    }
});

add_action('fendix_media', function () {
    echo '<div id="fendix" class="fendix-ad"></div>';
});
