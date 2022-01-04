<!DOCTYPE html>
<html lang="en">
<head>
    <!-- R6Stats API -->
    <title>R6Lookup | Rainbow Six Player Stats</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav">
    <meta name="description" content="A Rainbow Six Siege player statistics website using Ubisoft's own statistics API. Made using the Rainbow Six Siege Player Stats API project from Seems2Legit."/>
    <link rel="canonical" href="http://localhost:8000/r6stats-api-v2/index.php" />
    <!-- favicon -->
    <meta name="application-name" content="&nbsp;"/>
    <meta name="msapplication-TileColor" content="#FFFFFF" />
    <meta name="msapplication-TileImage" content="mstile-144x144.png" />
    <meta name="msapplication-square70x70logo" content="mstile-70x70.png" />
    <meta name="msapplication-square150x150logo" content="mstile-150x150.png" />
    <meta name="msapplication-wide310x150logo" content="mstile-310x150.png" />
    <meta name="msapplication-square310x310logo" content="mstile-310x310.png" />
    <link rel="apple-touch-icon-precomposed" sizes="57x57" href="dist/img/favicon/apple-touch-icon-57x57.png" />
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="dist/img/favicon/apple-touch-icon-114x114.png" />
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="dist/img/favicon/apple-touch-icon-72x72.png" />
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="dist/img/favicon/apple-touch-icon-144x144.png" />
    <link rel="apple-touch-icon-precomposed" sizes="60x60" href="dist/img/favicon/apple-touch-icon-60x60.png" />
    <link rel="apple-touch-icon-precomposed" sizes="120x120" href="dist/img/favicon/apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon-precomposed" sizes="76x76" href="dist/img/favicon/apple-touch-icon-76x76.png" />
    <link rel="apple-touch-icon-precomposed" sizes="152x152" href="dist/img/favicon/apple-touch-icon-152x152.png" />
    <link rel="icon" type="image/png" href="dist/img/favicon/favicon-196x196.png" sizes="196x196" />
    <link rel="icon" type="image/png" href="dist/img/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="dist/img/favicon/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="dist/img/favicon/favicon-16x16.png" sizes="16x16" />
    <link rel="icon" type="image/png" href="dist/img/favicon/favicon-128.png" sizes="128x128" />
    <!-- CSS link -->
    <link rel="stylesheet" href="dist/css/style.css">
    <!-- Google Fonts link -->
    <link href="https://fonts.googleapis.com/css2?family=Overpass&display=swap" rel="stylesheet">
    <!-- Fontawesome link -->
    <script src="https://kit.fontawesome.com/01aa610b63.js" crossorigin="anonymous"></script>

</head>
<body>
    <header class="header-nav">
        <div class="main-nav">
            <a class="logo" href="index.php" draggable="false">R6 Stats API</a>
            <a class="github" href="https://github.com/TychoBrouwer/R6Lookup-Website" draggable="false"><i class="fab fa-github fa-lg"></i></a>
            <div class="search"><i class="fas fa-search fa-lg"></i></div>
            <div class="close-search-bar hide-search-bar"><i class="fas fa-times-circle fa-lg"></i></div>
            <div class="search-bar hide-search-bar">
                <form  action="player.php" method="GET">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <input class="search-player-input" name="username" placeholder="Search player.."/>
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
