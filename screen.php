<?php

namespace Mixd\Plugins\Fendix;

// check user capabilities
if (!current_user_can('manage_options')) {
    return;
}

// add error/update messages

// check if the user have submitted the settings
// WordPress will add the "settings-updated" $_GET parameter to the url
if (isset($_GET['settings-updated'])) {
    // add settings saved message with the class of "updated"
    add_settings_error(
        'fendix',
        'message',
        'URN Saved',
        'updated'
    );
}

// show error/update messages
settings_errors('fendix', true, true);

$disabled = false;
if (defined("FENDIX_TRUST_URN")) {
    $disabled = true;
}
?>
<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    <?php if ($disabled) : ?>
        <p>
            <span class="dashicons dashicons-info"></span>
            The Trust URN is currently being defined in <code>wp-config.php</code> using the
            <code>FENDIX_TRUST_URN</code> PHP constant.
        </p>
    <?php else : ?>
        <p>
            If you want to prevent tampering, you can define the URN in the website's <code>wp-config.php</code> using
            the <code>FENDIX_TRUST_URN</code> PHP constant.
        </p>
    <?php endif; ?>
    <form action="options.php" method="post">
        <?php
        // output security fields for the registered setting "fendix"
        settings_fields('fendix');

        // output setting sections and their fields
        // (sections are registered for "fendix", each field is registered to a specific section)
        do_settings_sections('fendix');

        // output save settings button
        if ($disabled) {
            $button_args = [
                'disabled' => 'disabled'
            ];
        } else {
            $button_args = [];
        }
        submit_button('Save Settings', 'primary', 'submit', true, $button_args);
        ?>
    </form>
    <p><em>Lovingly crafted by <a href="https://www.mixd.co.uk/" rel="nofollow">Mixd</a></em></p>
</div>
