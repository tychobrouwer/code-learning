<?php

$_GET['id'] = "92a50c74-e277-48b2-bbba-709a00e2d054";
$_GET['platform'] = "uplay";
$region = "emea";

include 'getStats/getVarPlayer.php';

// print function that actually works
function console_log($data)
{
    echo '<script>';
    echo 'console.log('.json_encode($data).')';
    echo '</script>';
}

console_log($getUser);
