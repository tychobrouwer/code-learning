<?php
include $_SERVER['DOCUMENT_ROOT'] . "/getStats/UbiAPI.php";

$uapi = new UbiAPI($config["ubi-email"], $config["ubi-password"]);

//////////////////////////////////////////////////////////////////////////
$serverStatus = $uapi->getServerStatus();
