<?php
$nameInput = htmlspecialchars($_GET["id"]);
$platformInput = htmlspecialchars($_GET["platform"]);

header("Location: /player/$nameInput/$platformInput");
exit();
