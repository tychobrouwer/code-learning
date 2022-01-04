<?php

$userUbiEmail = urlencode(htmlspecialchars($_POST["mail"]));
$userUbiPassword = urlencode(htmlspecialchars($_POST["password"]));

$getUser = json_decode(file_get_contents("https://test.r6lookup.com/getStats/loginUbiGet.php?email=$userUbiEmail&password=$userUbiPassword"), true);
