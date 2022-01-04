<?php

include 'phptemplates/mysqlConn.php';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- R6Lookup -->
    <title>R6Lookup | About</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats">
    <link rel="canonical" href="https://www.r6lookup.com/" />
    <!-- favicon -->
    <link rel="icon" href="dist/img/icon.svg" sizes="any" type="image/svg+xml">
    <!-- CSS link -->
    <link rel="stylesheet" href="https://www.r6lookup.com/dist/css/style.css">
</head>
<body>
    <?php include('phptemplates/header.html'); ?>
    <div class="main-about-page">
        <div class="text">
            <p>Thanks for choosing R6Lookup as you rainbow stats checker. You might have noticed a bar once you <br> search a player up. That bar is for you to see if the searched player is a hacker or not. Our algorithm <br> checks the player's stats and compares it to months of research of what stats stick out from a hacker <br> against a “normal” player. <br>
               Something to consider is that this algorithm is <br> new and will have its flaws. But I can say from testing if the percentage is above 50% they are most <br> likely hackers. <br>
            </p>
        </div>

    </div>
    <?php include('phptemplates/footer.html'); ?>
    <?php include('phptemplates/cookieAlert.html'); ?>
    <!-- JS Scripts -->
    <script src="https://www.r6lookup.com/dist/js/searchBar.js" ></script>
    <script src="https://www.r6lookup.com/dist/js/cookiealert.js"></script>
</body>
</html>
