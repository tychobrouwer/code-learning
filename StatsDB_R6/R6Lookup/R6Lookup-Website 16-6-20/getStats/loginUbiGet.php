<?php
$userUbiEmail = urldecode($_GET["email"]);
$userUbiPassword = urldecode($_GET["password"]);

include "UbiAPI.php";

$uapi = new UbiAPI($userUbiEmail, $userUbiPassword);

$su = $uapi->login();

print json_encode($su);
