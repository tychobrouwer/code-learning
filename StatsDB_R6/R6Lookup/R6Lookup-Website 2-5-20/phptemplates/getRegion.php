<?php

// Finding your region from IP address
$ip_address = $_SERVER['REMOTE_ADDR'];
$geoplugin = 'http://www.geoplugin.net/php.gp?ip='.$ip_address;
$geoReturn = unserialize(file_get_contents($geoplugin));
$contryCode = $geoReturn['geoplugin_countryCode'];
$continentCode = $geoReturn['geoplugin_continentCode'];

// Continent code to ubisoft region
if ($continentCode == 'AF' || $continentCode == 'EU' || $continentCode == 'AN') {
    $region = 'emea';
} elseif ($continentCode == 'NA' || $continentCode == 'SA') {
    $region = 'ncsa';
} elseif ($continentCode == 'AS' || $continentCode == 'OC') {
    $region = 'apac';
}
