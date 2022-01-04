<div class="left-content">
    <div class="profile-pic-div">
        <img class="profile-pic" src="https://ubisoft-avatars.akamaized.net/<?php echo $getUser["profile_id"] ?>/default_146_146.png" alt="profile picture">
    </div>
    <div class="profile">
        <div class="platform-region-select">
            <h3><?php echo $displayPlatform ?></h3>
            <div class="region-select">
                <form method="POST" id="regionForm">
                    <table>
                        <tbody>
                            <tr>
                                <td class="regionbox">
                                    <label class="radio">
                                        <input class="region-emea-input" type="radio" value="emea" name="submitRegion" onclick="submit()"
                                        <?php if (isset($sesRegion) && $sesRegion == "emea") { ?>
                                            checked="checked"
                                        <?php } ?>>
                                        <div class="region-div">
                                            <div class="region">
                                                <p>EU</p>
                                            </div>
                                        </div>
                                    </label>
                                </td>
                                <td class="regionbox">
                                    <label class="radio">
                                        <input class="region-ncsa-input" type="radio" value="ncsa" name="submitRegion" onclick="submit()"
                                        <?php if (isset($sesRegion) && $sesRegion == "ncsa") { ?>
                                            checked="checked"
                                        <?php } ?>>
                                        <div class="region-div">
                                            <div class="region">
                                                <p>NA</p>
                                            </div>
                                        </div>
                                    </label>
                                </td>
                                <td class="regionbox">
                                    <label class="radio">
                                        <input class="region-apac-input" type="radio" value="apac" name="submitRegion" onclick="submit()"
                                        <?php if (isset($sesRegion) && $sesRegion == "apac") { ?>
                                            checked="checked"
                                        <?php } ?>>
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
                </form>
            </div>
        </div>
        <div class="username">
            <h1 id="username-set-color"><?php echo $getUser["nameOnPlatform"] ?>
                <?php if ($userTag == "Developer") { ?>
                    <span class="usertag usertag-developer">Developer</span>
                <?php } elseif ($userTag == "Partner") { ?>
                    <span class="usertag usertag-partner">Partner</span>
                <?php } elseif ($userTag == "Supporter") { ?>
                    <span class="usertag usertag-supporter">Supporter</span>
                <?php } elseif ($banned === true || $banned2 === true) { ?>
                    <span class="usertag usertag-hacker">Hacking</span>
                <?php } elseif ($probHacker == true) { ?>
                <?php if ($banned === true || $banned2 === true) { ?>
                    <span class="ban-status">BANNED</span>
                <?php } ?>
                    <span class="usertag usertag-probhacker">Maybe Hacking</span>
                <?php } elseif ($likHacker == true) { ?>
                    <span class="usertag usertag-likhacker">Likely Hacking</span>
                <?php } elseif ($hacking == true) { ?>
                    <span class="usertag usertag-hacker">Hacking</span>
                <?php } ?>
            </h1>
        </div>
        <div class="playerid">
            <p id="cutId-js"><?php echo $getUser["profile_id"] ?></p>
            <button id="copyBtn-js">
                <svg aria-hidden="true" focusable="false" class="copy-btn" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path>
                </svg>
            </button>
        </div>
        <?php if ($searchModeId == false) { ?>
            <div class="permanent-link">
                <a href="/player/<?php echo $getUser["profile_id"] ?>/uplay">Go to permanent page</a>
            </div>
        <?php } ?>
        <?php if (!empty($rowcust[3])) { ?>
            <div class="cust-link">
                <a target="_blank" href="<?php echo $rowcust[4] ?>"><?php echo $rowcust[3] ?></a>
            </div>
        <?php } ?>
    </div>
</div>
<div class="right-content">
    <div class="playerbar-div">
        <div class="hackerprob-div">
            <p class="hackerbar-p">Hacker: <?php echo $sumHacker ?>%</p>
            <div id="hackerprob">

            </div>
        </div>
        <div class="stat-info hacker">
            <p>Hacker % is how sure our algorithm is that the selected player is a hacker</p>
        </div>
        <div class="lootboxprob-div">
            <p class="lootboxprob-p">Alpha pack: <?php echo round($getUser["lootbox_probability"] / 100) ?>%</p>
            <div id="lootboxprob-player">

            </div>
        </div>
        <div class="stat-info alphapack">
            <p>Alpha pack % is the chance of the selected player getting an Alpha pack</p>
        </div>
    </div>
    <div class="basic-stats">
        <div class="level-div">
            <h4 class="level">Level: </h4>
            <h4><?php echo $getUser["level"] ?></h4>
        </div>
        <div class="time-played-div">
            <h4 class="time-played">Time played: </h4>
            <h4><?php echo $overallTimePlayedHMS["h"] . "h " . $overallTimePlayedHMS["m"] . "m" ?></h4>
        </div>
        <div class="current-mmr-div">
            <h4 class="current-mmr">Current mmr: </h4>
            <h4><?php echo $getUser[0]['mmr'] ?></h4>
        </div>
    </div>
</div>
