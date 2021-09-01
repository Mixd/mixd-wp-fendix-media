# Mixd Plugins - Fendix Media
This plugin can be dropped into any WordPress website to provide developers with a versatile and quick way to add support for Fendix Media Adverts

If users are logged in, their email address is one-way hashed using SHA256 and passed to Fendix Media for cross-referencing against the Trust's Electronic Staff Record (ESR).

If the user is found in ESR, the banner ad allows Fendix Media to tailor adverts to specific staff departments.

## Installation

### Github
Download a zip file from the Github repository, extract it and add it to the 'plugins' folder of your WordPress installation

### Composer
If you have access to Mixd's private composer repository you can install it quite simply with

```
composer require mixd/fendix-media
```

## Configuration
Once the plugin is installed and activated in WordPress, a new settings page will be registered in the WordPress admin sidebar called 'Fendix Media'.

Your user account needs to have the `edit_options` capability in order to access the settings page.

The only value you need to add is the Trust's URN. You can either add it to the Settings page and save it, or define it in wp-config.php

```php
define("FENDIX_TRUST_URN", "MY_URN_HERE");
```

If you choose to use the PHP constant then the settings page will be disabled.
