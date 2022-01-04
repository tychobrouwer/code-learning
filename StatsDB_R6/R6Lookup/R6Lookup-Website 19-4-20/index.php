<?php

if(isset($_GET['submit']) && !empty($_GET['username'])){
	// General Stats
	include 'getStats/getUserData.php';

	// print function that actually works
	function console_log($data){
		echo '<script>';
		echo 'console.log('.json_encode($data).')';
		echo '</script>';
	}

	// If statement if hacker.php is allowed to load.
	if (!empty($userData) && !array_key_exists('error', $userData) && array_key_exists('profile_id', $userData) && ($generalPvpHeadshotRatio > 0.55 || $generalPvpPenetrationRatio > 0.3 || $level < 150)){
		// Calculate Hacker Probability
		include 'hacker.php';

		console_log($print);

	} else {
		$sumHacker = 0;
	}
	// echo $sumHacker;
	// print("<pre>".print_r($userData,true)."</pre>");
}

?>
 <!-- HTML ofc -->
<!DOCTYPE html>
<html lang="en">
    <?php require('header.php'); ?>
    <div class="main-page">
        <div class="rainbowsix-logo"></div>
        <div class="container-left">
            <div class="searchbox">
                <form action="index.php" method="GET">
                    <table>
                        <tbody>
                            <tr>
                                <td class="search-player-td">
									<div class="search-player-div">
										<input id="cursor-end" autofocus class="search-player-input" name="username" 	placeholder="Search player.." <?php if(isset($_GET['submit'])) { ?>
											value="<?php echo $_GET['username'] ?>"
										<?php }?>>
									</div>
                                </td>
                                <td class="platformbox">
                                    <label class="radio">
                                        <input type="radio" name="platform" checked="checked" value="uplay"><span class="fab fa-windows fa-lg uplay"></span>
                                    </label>
                                </td>
                                <td class="platformbox">
                                    <label class="radio">
                                        <input type="radio" name="platform"
										<?php if (isset($platform) && htmlspecialchars($platform)=="psn") {?>
											checked="checked"
										<?php } ?>
										value="psn">
										<span class="fab fa-playstation fa-lg psn"></span>
                                    </label>
                                </td>
                                <td class="platformbox">
                                    <label class="radio">
                                    <input type="radio" name="platform"
									<?php if (isset($platform) && htmlspecialchars($platform)=="xbl") {?>
										checked="checked"
									<?php }?>
									value="xbl"><span class="fab fa-xbox fa-lg xbl"></span>
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
            <div class="results">
                <div class="h2-results">
                    <h2>Results</h2>
                </div>
                <div class="players">
                    <?php if(isset($_GET['submit']) && !empty($_GET['username'])){ ?>
                        <?php if(!empty($userData) && !array_key_exists('error', $userData) && array_key_exists('profile_id', $userData)){ ?>
                            <a draggable="false" href="player.php?username=<?php echo $userName ?>&platform=<?php echo $platform ?>
							&submit=submit">
                                <div class="playerstats">
                                    <div class="rank-logo">
										<img draggable="false" src="<?php echo $rankImage ?>" alt="rank image"></img>
                                    </div>
                                    <div class="stats">
                                        <h4><?php echo $userName ?></h4>
                                        <div class="prev-stats">
                                            <p class="level">
                                                <span class="aternate-text">level: </span>
												<?php echo $level ?>
                                            </p>
                                            <p class="kd">
                                                <span class="aternate-text">KD: </span>
												<?php echo $generalPvpKd ?>
                                            </p>
                                            <p class="rank">
                                                <span class="aternate-text">MMR: </span>
												<?php echo $currentMmr ?>
                                            </p>
											<p class="hacker">
												<span class="aternate-text">Hacker: </span>
												<?php echo $sumHacker ?>
											</p>
                                        </div>
                                    </div>
									<div class="hackerprob-div">
										<div class="hackerprob">

										</div>
									</div>
                                </div>
                            </a>
                        <?php } else { ?>
                            <div class="error-message">
                                <h4>User not found!</h4>
                                <p>Please check your spelling and make sure you are searching by the correct platform.</p>
                            </div>
                        <?php } ?>
                    <?php } ?>
                </div>
            </div>
        </div>
        <div class="container-right">
            <div class="header-container-right">
                <h2>About</h2>
            </div>
            <div class="content-container-right">
                <p>This is an fan-made project and is a work in progress. We calculate a hackerprobability, for this we use the winrate, KD-ratio, headshotratio, penetrationkills and level. While calculating this probability we try to eliminate smurfs as much as possible, but we understand that we can not make it flawless all the time. Therefore we are open for any suggestions.</p>
            </div>
        </div>
    </div>
    <?php require('footer.php'); ?>
	<script src="dist/js/setCaretPos.js"></script>
    <script src="dist/js/searchBar.js" ></script>
	<script src="dist/js/hackerBar.js"></script>
</body>
</html>
