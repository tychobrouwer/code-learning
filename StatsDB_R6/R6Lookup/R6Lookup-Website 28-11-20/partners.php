<?php
session_start();

include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/mysqlConn.php';
include $_SERVER['DOCUMENT_ROOT'] . '/phpconfig.php';
include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/getRegion.php';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- R6Lookup -->
    <title>R6Lookup | Partners</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="theme-color" content="#101010">
    <meta name="google" content="notranslate">
    <meta name="format-detection" content="telephone=no">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats,lookup,stats,stat,rainbow,six siege,r6look,player,players,operator,operators,season,seasons,weapon,Weapons">
    <link rel="canonical" href="https://www.r6lookup.com/partners" />
    <!-- Open Graph tags -->
    <meta property="og:site_name" content="R6Lookup" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="R6Lookup | Parters" />
    <meta property="og:description" content="A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox." />
    <meta property="og:image" content="https://www.r6lookup.com/dist/img/r6_lookup_logo_square.webp" />
    <meta property="og:url" content="https://www.r6lookup.com/partners" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="R6Lookup | Partners" />
    <meta name="twitter:site" content="@r6lookup" />
    <meta name="twitter:description" content="A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox." />
    <meta name="twitter:image" content="https://www.r6lookup.com/dist/img/r6_lookup_logo_square.webp" />
    <!-- favicon -->
    <link rel="icon" href="/dist/img/icon.svg" sizes="any" type="image/svg+xml" async>
    <link rel="apple-touch-icon" href="/dist/img/icon.png">
    <!-- dns-prefetch -->
    <link rel="dns-prefetch" href="//www.google-analytics.com">
    <!-- Preload Fonts -->
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff2" crossorigin="anonymous">
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff" crossorigin="anonymous">
    <!-- CSS link -->
    <link rel="stylesheet" rel=preload type="text/css" as="style" href="/dist/css/partner.css" async>
</head>
<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/header.php'; ?>
    <div class="main-partner-page">
        <div class="main-partner-text">
            <h1 class="main-partner-title">
                Partners
            </h1>
            <p class="main-partners-head">
                Here you can see all our partners that helped us become what we are today. Please show some love and check them out.
            </p>
            <div class="main-partners">
                <div class="main-partner-name">
                    <ul>
                        <li>
                            <p>
                                Competitive Gaming League | R6
                            </p>
                            <div class="main-partner-icon">
                                <a target="_blank" rel="noopener" href="https://discord.gg/UGmFmwj">
                                    <picture width="200" height="110">
                                        <source srcset="/dist/img/partners/CGL_partner_video.webp" type="image/webp"></source>
                                        <img alt="Black Ice Discord Community" srcset="/dist/img/partners/CGL_partner_video.gif">
                                    </picture>
                                </a>
                            </div>
                        </li>
                        <hr>
                        <li>
                            <p>
                                Black Ice Discord Community
                            </p>
                            <div class="main-partner-icon">
                                <a target="_blank" rel="noopener" href="https://discord.com/invite/VPaAmE">
                                    <picture width="200" height="110">
                                        <source srcset="/dist/img/partners/BIDC_partner_img.webp" type="image/webp"></source>
                                        <img alt="Black Ice Discord Community" srcset="/dist/img/partners/BIDC_partner_img.jpg">
                                    </picture>
                                </a>
                            </div>
                        </li>
                        <hr>
                        <li>
                            <p>
                                Tactical Gaming | R6 international community
                            </p>
                            <div class="main-partner-icon">
                                <a target="_blank" rel="noopener" href="http://www.tactical-gaming.net">
                                    <picture width="200" height="110">
                                        <source srcset="/dist/img/partners/TG_partner_video.webp" type="image/webp"></source>
                                        <img alt="Black Ice Discord Community" srcset="/dist/img/partners/TG_partner_video.gif">
                                    </picture>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/footer.html'; ?>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/cookieAlert.html'; ?>
    <!-- JS Scripts -->
    <script src="/dist/js/main-partner.min.js" async></script>
</body>
</html>
