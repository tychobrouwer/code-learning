<?php

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- R6Lookup -->
    <title>R6Lookup | Rainbow Six Player Stats</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats">
    <link rel="canonical" href="http://www.r6lookup.com/" />
    <!-- favicon -->
    <link rel="icon" href="dist/img/icon.svg" sizes="any" type="image/svg+xml">
    <!-- CSS link -->
    <link rel="stylesheet" href="dist/css/style.css">
    <!-- Google Fonts link -->
    <link href="https://fonts.googleapis.com/css2?family=Overpass&display=swap" rel="stylesheet">
    <!-- Fontawesome Script -->
    <script src="https://kit.fontawesome.com/01aa610b63.js" crossorigin="anonymous"></script>
    <!-- Google Ads Script -->
    <script data-ad-client="ca-pub-6981341622225523" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
</head>
<body>
    <header class="header-nav">
        <div class="main-nav">
            <a class="logo" href="/" draggable="false">R6 Lookup</a>
            <div class="search"><i class="fas fa-search fa-lg"></i></div>
            <div class="close-search-bar hide-search-bar"><i class="fas fa-times-circle fa-lg"></i></div>
            <div class="search-bar hide-search-bar">
                <form  action="player.php" method="POST">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <input class="search-player-input" name="username" placeholder="Search player..."/>
                                </td>
                                <td class="platformbox">
                                    <label class="radio">
                                        <input type="radio" name="platform" value="uplay" checked="checked"><span class="fab fa-windows fa-md uplay"></span>
                                    </label>
                                </td>
                                <td class="platformbox">
                                    <label class="radio">
                                        <input type="radio" name="platform" value="psn"><span class="fab fa-playstation fa-md psn"></span>
                                    </label>
                                </td>
                                <td class="platformbox">
                                    <label class="radio">
                                        <input type="radio" name="platform" value="xbl"><span class="fab fa-xbox fa-md xbl"></span>
                                    </label>
                                </td>
                                <td>
                                    <input type="submit" name="submit" value="submit" class="hide">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    </header>
</html>
