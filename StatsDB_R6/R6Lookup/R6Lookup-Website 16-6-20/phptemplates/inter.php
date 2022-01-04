<?php
$nameInput = $_GET["id"];
$platformInput = $_GET["platform"];

header("Location: /player/$nameInput/$platformInput");
exit();
