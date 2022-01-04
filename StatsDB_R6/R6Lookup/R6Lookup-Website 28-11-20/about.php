<?php
session_start();

include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/mysqlConn.php';
include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/getRegion.php';
include $_SERVER['DOCUMENT_ROOT'] . '/phpconfig.php';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- R6Lookup -->
    <title>R6Lookup | About</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="theme-color" content="#101010">
    <meta name="google" content="notranslate">
    <meta name="format-detection" content="telephone=no">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats,lookup,stats,stat,rainbow,six siege,r6look,player,players,operator,operators,season,seasons,weapon,Weapons">
    <link rel="canonical" href="https://www.r6lookup.com/about" />
    <!-- Open Graph tags -->
    <meta property="og:site_name" content="R6Lookup" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="R6Lookup | About" />
    <meta property="og:description" content="A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox." />
    <meta property="og:image" content="https://www.r6lookup.com/dist/img/r6_lookup_logo_square.webp" />
    <meta property="og:url" content="https://www.r6lookup.com/about" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="R6Lookup | About" />
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
    <link rel="stylesheet" rel=preload type="text/css" as="style" href="/dist/css/about.css" async>
</head>
<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/header.php'; ?>
    <div class="main-about-page">
        <div class="about-text">
            <h1 class="about-title">
                About us
            </h1>
            <p class="about-disclamer">
                This website is a work in progress. We are still working on more features and the looks. If you see anything we are missing or find something you don't like, tell us on twitter <a rel="noopener" href="https://twitter.com/R6Lookup" target="_blank">@R6Lookup</a> or via mail <a href="mailto:support@r6lookup.com">support@r6lookup.com</a>.
                <br>
                And check out our <a class="partner-link" href="/partners">partners</a>.
            </p>
            <div class="about-content">
                <p class="bars-about-text">
                    Thanks for choosing R6Lookup as you rainbow stats checker. You might have noticed a bar once you search a player up. That bar is for you to see if the searched player is a hacker or not. Our algorithm checks the player's stats and compares it to a month of research of what stats stick out from a hacker against a “normal” player. Something to consider is that this algorithm is new and will have its flaws. Therefore we are open for any suggestions. But we can say from testing that if the percentage is above 50% they are most likely a hacker. We also have a bar that shows what the pack chance of the searched player is.
                </p>
                <div class="bars">
                    <div class="hackerprob-div">
                        <p class="hackerbar-p">Hacker: 86%</p>
                        <div id="hackerprob">

                        </div>
                    </div>
                    <div class="lootboxprob-div">
                        <p class="lootboxprob-p">alpha pack: 28%</p>
                        <div id="lootboxprob">

                        </div>
                    </div>
                </div>
                <p class="id-about-text">
                    We also have something we would like to call stalker id. This random generated string is never gonna change. It's connected to your account, even if you change username. This id can be found under the username of the player with a nice copy button to keep it simple.
                </p>
                <div class="id-copy">
                    <p>92a50c74-e277-48b2-bbba-709a00e2d054</p>
                    <svg aria-hidden="true" focusable="false" class="copy-btn" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path>
                    </svg>
                </div>
                <p class="platform-about-text">
                    By default the website will select desktop as your platform. If you have your account on Playstation or Xbox then you can just press the buttons in the searchbar to change platform. And make sure there is no spaces in the username, we will make it possible to use spaces in the future.
                </p>
                <div class="platform-selectbtn">
                    <table>
                        <tbody>
                            <tr>
                                <td class="platformbox">
                                    <label class="radio">
                                        <div class="uplay-div" title="Desktop">
                                            <svg aria-hidden="true" focusable="false" class="uplay" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path fill="currentColor" d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"></path>
                                            </svg>
                                        </div>
                                    </label>
                                </td>
                                <td class="platformbox">
                                    <label class="radio">
                                        <div class="psn-div" title="Playstation">
                                            <svg aria-hidden="true" focusable="false" class="psn" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                <path fill="currentColor" d="M570.9 372.3c-11.3 14.2-38.8 24.3-38.8 24.3L327 470.2v-54.3l150.9-53.8c17.1-6.1 19.8-14.8 5.8-19.4-13.9-4.6-39.1-3.3-56.2 2.9L327 381.1v-56.4c23.2-7.8 47.1-13.6 75.7-16.8 40.9-4.5 90.9.6 130.2 15.5 44.2 14 49.2 34.7 38 48.9zm-224.4-92.5v-139c0-16.3-3-31.3-18.3-35.6-11.7-3.8-19 7.1-19 23.4v347.9l-93.8-29.8V32c39.9 7.4 98 24.9 129.2 35.4C424.1 94.7 451 128.7 451 205.2c0 74.5-46 102.8-104.5 74.6zM43.2 410.2c-45.4-12.8-53-39.5-32.3-54.8 19.1-14.2 51.7-24.9 51.7-24.9l134.5-47.8v54.5l-96.8 34.6c-17.1 6.1-19.7 14.8-5.8 19.4 13.9 4.6 39.1 3.3 56.2-2.9l46.4-16.9v48.8c-51.6 9.3-101.4 7.3-153.9-10z"></path>
                                            </svg>
                                        </div>
                                    </label>
                                </td>
                                <td class="platformbox">
                                    <label class="radio">
                                        <div class="xbl-div" title="Xbox">
                                            <svg aria-hidden="true" focusable="false" class="xbl" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path fill="currentColor" d="M369.9 318.2c44.3 54.3 64.7 98.8 54.4 118.7-7.9 15.1-56.7 44.6-92.6 55.9-29.6 9.3-68.4 13.3-100.4 10.2-38.2-3.7-76.9-17.4-110.1-39C93.3 445.8 87 438.3 87 423.4c0-29.9 32.9-82.3 89.2-142.1 32-33.9 76.5-73.7 81.4-72.6 9.4 2.1 84.3 75.1 112.3 109.5zM188.6 143.8c-29.7-26.9-58.1-53.9-86.4-63.4-15.2-5.1-16.3-4.8-28.7 8.1-29.2 30.4-53.5 79.7-60.3 122.4-5.4 34.2-6.1 43.8-4.2 60.5 5.6 50.5 17.3 85.4 40.5 120.9 9.5 14.6 12.1 17.3 9.3 9.9-4.2-11-.3-37.5 9.5-64 14.3-39 53.9-112.9 120.3-194.4zm311.6 63.5C483.3 127.3 432.7 77 425.6 77c-7.3 0-24.2 6.5-36 13.9-23.3 14.5-41 31.4-64.3 52.8C367.7 197 427.5 283.1 448.2 346c6.8 20.7 9.7 41.1 7.4 52.3-1.7 8.5-1.7 8.5 1.4 4.6 6.1-7.7 19.9-31.3 25.4-43.5 7.4-16.2 15-40.2 18.6-58.7 4.3-22.5 3.9-70.8-.8-93.4zM141.3 43C189 40.5 251 77.5 255.6 78.4c.7.1 10.4-4.2 21.6-9.7 63.9-31.1 94-25.8 107.4-25.2-63.9-39.3-152.7-50-233.9-11.7-23.4 11.1-24 11.9-9.4 11.2z"></path>
                                            </svg>
                                        </div>
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="region-about-text">
                    Region is selected automatic by your current connection to the cloudflare server. This might not be accurate every time or you are checking someone from a different region, That's not a problem! You can change region at the top of the page. The regions you can select is the following Europe, North America and Asia.
                </p>
                <div class="regionbtn">
                    <table>
                        <tbody>
                            <tr>
                                <td class="regionbox">
                                    <label class="radio">
                                        <div class="region-div region-eu">
                                            <div class="region">
                                                <p>EU</p>
                                            </div>
                                        </div>
                                    </label>
                                </td>
                                <td class="regionbox">
                                    <label class="radio">
                                        <div class="region-div">
                                            <div class="region">
                                                <p>NA</p>
                                            </div>
                                        </div>
                                    </label>
                                </td>
                                <td class="regionbox">
                                    <label class="radio">
                                        <div class="region-div">
                                            <div class="region">
                                                <p>AS</p>
                                            </div>
                                        </div>
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p>
                    You might have seen a button with the text "Go to permanent page" under the username. This is when you search someone up with the top searchbar. This page you can't access via the searchbar on your browser. But if you press the button you will go to the permanent page that will work in the browser and you can share it to your friends.
                </p>
                <div class="permanent-pagebtn">
                    <div class="permanent-link">
                        <p>Go to permanent page</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/footer.html'; ?>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/cookieAlert.html'; ?>
    <!-- JS Scripts -->
    <script src="/dist/js/main-about.min.js" async></script>
</body>
</html>
