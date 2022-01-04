<?php

$userUbiEmail = urlencode(htmlspecialchars($_POST["mail"]));
$userUbiPassword = urlencode(htmlspecialchars($_POST["password"]));

$getUser = json_decode(file_get_contents('https://' . $_SERVER['HTTP_HOST'] . '/getStats/loginUbiGet.php?email=' . $userUbiEmail . '&password=' . $userUbiPassword), true);
