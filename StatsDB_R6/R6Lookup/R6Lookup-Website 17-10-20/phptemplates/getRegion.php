<?php
session_start();

// Finding your region from IP address
$ip_address = htmlspecialchars($_SERVER['REMOTE_ADDR']);
$geoplugin = 'http://www.geoplugin.net/php.gp?ip='.$ip_address;
$geoReturn = unserialize(file_get_contents($geoplugin));
$continentCode = $geoReturn['geoplugin_continentCode'];

// Continent code to ubisoft region
if ($continentCode == 'AF' || $continentCode == 'EU' || $continentCode == 'AN') {
    $region = 'emea';
} elseif ($continentCode == 'NA' || $continentCode == 'SA') {
    $region = 'ncsa';
} elseif ($continentCode == 'AS' || $continentCode == 'OC') {
    $region = 'apac';
}

if (empty(htmlspecialchars($_SESSION['region']))) {
    $_SESSION['region'] = htmlspecialchars($region);
} elseif (!empty(htmlspecialchars($_POST['submitRegion']))) {
    $_SESSION['region'] = htmlspecialchars($_POST['submitRegion']);
}

$sesRegion = htmlspecialchars($_SESSION['region']);
