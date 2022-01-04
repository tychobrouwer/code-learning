<?php

$arrContextOptions = array(
    "ssl" => array(
        "verify_peer" => false,
        "verify_peer_name" => false,
    ),
);

$ubi_page = file_get_contents("https://game-rainbow6.ubi.com/it-it/home", false, stream_context_create($arrContextOptions));
preg_match("/main(.+)js/", $ubi_page, $matches);
$mainjs = file_get_contents("https://game-rainbow6.ubi.com/assets/scripts/main" . $matches[1] . "js", false, stream_context_create($arrContextOptions));
preg_match("/assets\/data\/operators(.+?)json/", $mainjs, $matches);
$operators_string = file_get_contents("https://game-rainbow6.ubi.com/assets/data/operators" . $matches[1] . "json", false, stream_context_create($arrContextOptions));

$json = json_decode($operators_string, true);

print("<pre>".print_r($json, true)."</pre>");
