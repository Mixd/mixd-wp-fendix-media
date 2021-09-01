<?php

namespace Mixd\Plugins\Fendix;

$disabled = false;
if (defined("FENDIX_TRUST_URN")) {
    $disabled = true;
}

$value = get_option('fendix_options');
$urn = "";
if (!empty($value) && isset($value['urn'])) {
    $urn = $value['urn'];
}
if (defined("FENDIX_TRUST_URN")) {
    $urn = FENDIX_TRUST_URN;
}
?>
<input type="text" id="fendix_urn" required name="fendix_options[urn]" <?php disabled(true, $disabled); ?> value="<?php echo esc_attr($urn); ?>">
<p class="description">Enter the URN provided by Fendix Media. <br>If you are not sure, please contact support@fendixmedia.co.uk</p>
