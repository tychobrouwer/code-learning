<?php



$userFound = false;
if (isset($_POST['submit']) && !empty($_POST['username'])) {
	$userFound = true;
}

if($userFound === true){

	$region = 'emea';

	include 'getStats/getVarIndex.php';

	// print function that actually works
	function console_log($data){
		echo '<script>';
		echo 'console.log('.json_encode($data).')';
		echo '</script>';
	}

	// If statement if hacker.php is allowed to load.
	if (!empty($getUser) && !array_key_exists('error', $getUser) && array_key_exists('profile_id', $getUser) && ($generalPvpHeadshotRatio >= 0.55 || $generalPvpPenetrationRatio >= 0.1 && $level < 150)){
		// Calculate Hacker Probability
		include 'hacker.php';

		console_log($print);

	} else {
		$sumHacker = 0;
	}

	// echo $sumHacker;
	// print("<pre>".print_r($getUser,true)."</pre>");
}


?>
 <!-- HTML ofc -->
<!DOCTYPE html>
<html lang="en">
    <?php require('header.php'); ?>
    <div class="main-page">
        <div class="rainbowsix-logo"></div>
		<div class="content">
			<div class="container-left">
				<div class="header-container-left">
					<h2>header</h2>
				</div>
				<div class="content-container-left">
					<p>Text</p>
				</div>
			</div>
	        <div class="container-center">
	            <div class="searchbox">
	                <form action="/" method="POST">
	                    <table>
	                        <tbody>
	                            <tr>
	                                <td class="search-player-td">
										<div class="search-player-div">
											<input id="cursor-end" autofocus class="search-player-input" name="username" placeholder="Search player..."
											<?php if($userFound === true) { ?>
												value="<?php echo $userName ?>"
											<?php }?>>
										</div>
	                                </td>
	                                <td class="platformbox platformbox-uplay">
	                                    <label class="radio">
	                                        <input type="radio" name="platform" checked="checked" value="uplay"><span class="fab fa-windows fa-lg uplay"></span>
	                                    </label>
	                                </td>
	                                <td class="platformbox platformbox-psn">
	                                    <label class="radio">
	                                        <input type="radio" name="platform"
											<?php if (isset($platform) && $platform=="psn") {?>
												checked="checked"
											<?php } ?>
											value="psn">
											<span class="fab fa-playstation fa-lg psn"></span>
	                                    </label>
	                                </td>
	                                <td class="platformbox platformbox-xbl">
	                                    <label class="radio">
	                                    <input type="radio" name="platform"
										<?php if (isset($platform) && $platform=="xbl") {?>
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
				<?php if($userFound === true){ ?>
	            <div class="results">
	                <div class="h2-results">
	                    <h2>Results</h2>
	                </div>
	                <div class="players">
                        <?php if(!empty($getUser) && !array_key_exists('error', $getUser)){ ?>
                            <a draggable="false" href="/player/<?php echo $userName ?>/<?php echo $platform ?>">
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
												<?php echo $generalRankedKd ?>
                                            </p>
                                            <p class="rank">
                                                <span class="aternate-text">MMR: </span>
												<?php echo $currentMmr ?>
                                            </p>
                                        </div>
                                    </div>
										<div class="hackerprob-div">
											<div id="hackerprob">

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
	                </div>
	            </div>
				<?php } ?>
	        </div>
	        <div class="container-right">
	            <div class="header-container-right">
	                <h2>About</h2>
	            </div>
	            <div class="content-container-right">
	                <p>This is an fanmade project and is a work in progress. We calculate a hackerprobability, for this we use the winrate, KD-ratio, headshotratio, penetrationkills and level. While calculating this probability we try to eliminate smurfs as much as possible, but we understand that we can not make it flawless all the time. Therefore we are open for any suggestions.</p>
	            </div>
	        </div>
		</div>
    </div>
    <?php require('footer.php'); ?>
	<!-- PHP Variable to JS -->
	<script type="text/javascript">
		var valHacker = '<?php echo $sumHacker ?>';
	</script>
	<!-- JS Scripts -->
	<script src="dist/js/setCaretPos.js"></script>
    <script src="dist/js/searchBar.js" ></script>
	<script src="dist/js/hackerBar.js"></script>
</body>
</html>
