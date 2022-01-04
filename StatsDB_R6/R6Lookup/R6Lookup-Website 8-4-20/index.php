<?php
    require('player-data.php');

    if(isset($_GET['submit'])){
        $nameInput = htmlspecialchars($_GET['username']);
        $platform = htmlspecialchars($_GET['platform']);

        $searchResults = GetPlayersName($nameInput, $platform);

        $playersStats = GetPlayersStats($searchResults, $platform);

        //print("<pre>".print_r($searchResults,true)."</pre>");
        //print("<pre>".print_r($playersStats,true)."</pre>");
    } 
?>

<!DOCTYPE html>
<html lang="en">
    <?php include('header.php'); ?>
    <div class="main-page">
        <div class="rainbowsix-logo"></div>
        <div class="container-left">
            <div class="searchbox">
                <form action="index.php" method="GET">
                    <table>
                        <tbody>
                            <tr>
                                <td >
                                    <input class="search-player-input" name="username" placeholder="Search player..">
                                </td>
                                <td class="platformbox" val="uplay">
                                    <label class="radio">
                                        <input type="radio" name="platform" checked="checked"
                                        <?php if (isset($platform) && $platform=="uplay")?> value="uplay">
                                        <span class="fab fa-windows fa-lg uplay"></span>
                                    </label>
                                </td>
                                <td class="platformbox" val="psn">
                                    <label class="radio">
                                        <input type="radio" name="platform"
                                        <?php if (isset($platform) && $platform=="psn")?> value="psn">
                                        <span class="fab fa-playstation fa-lg psn"></span>
                                    </label>
                                </td>
                                <td class="platformbox" val="xbl">
                                    <label class="radio">
                                    <input type="radio" name="platform"
                                        <?php if (isset($platform) && $platform=="xbl")?> value="xbl">
                                        <span class="fab fa-xbox fa-lg xbl"></span>
                                    </label>
                                </td>
                                <td><input type="submit" name="submit" value="submit" class="hide"></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
            <div class="results">
                <div class="h2-results">
                    <h2>Results</h2>
                </div>
                <div class="players">
                    <?php if(isset($_GET['submit'])){ ?>
                        <?php foreach($playersStats as $playerStats) {?>
                            <a href="player.php?username=<?php echo htmlspecialchars($playerStats['p_name']) ?>&platform=<?php echo htmlspecialchars($platform) ?>&submit=submit">
                                <div class="playerstats">
                                    <div class="rank-logo"><img src="dist/img/ranks/<?php echo htmlspecialchars($playerStats['rank']) ?>.png" alt="rank"></div>
                                    <div class="stats">
                                        <h4><?php echo htmlspecialchars($playerStats['p_name']) ?></h4>
                                        <div class="prev-stats">
                                            <p class="level"><span class="aternate-text">level: </span><?php echo htmlspecialchars($playerStats['level']) ?></p>
                                            <p class="kd"><span class="aternate-text">kd: </span><?php echo htmlspecialchars($playerStats['kd']) ?></p>
                                            <p class="rank"><span class="aternate-text">rank: </span><?php echo htmlspecialchars($playerStats['rank']) ?></p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        <?php } ?>
                    <?php } ?>
                </div>
            </div>
        </div>
        <div class="container-right">

        </div>
    </div>
</body>
</html>