<?php
echo file_get_contents("https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates");
$html = show_source("https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates");
// $pattern = ""; // Don't get what the patern should be???!!
// preg_match_all($pattern, $data, $news);
//
// print $news;

// $c = curl_init('https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates');
// curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
// //curl_setopt(... other options you want...)
//
// $html = curl_exec($c);

$pattern = "class='updatesFeed__item'";
preg_match_all($pattern, $html, $news);

// print $news;
// echo $html;
echo "test";
echo $html;

/*

*/
