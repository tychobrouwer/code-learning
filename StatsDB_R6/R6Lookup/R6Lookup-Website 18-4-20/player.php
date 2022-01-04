<?php

if(isset($_GET['submit']) && !empty($_GET['username'])){
    // Finding your region from IP address
	$ip_address = $_SERVER['REMOTE_ADDR'];
	$geoplugin = 'http://www.geoplugin.net/php.gp?ip='.$ip_address;
	$geoReturn = unserialize(file_get_contents($geoplugin));
	$contryCode = $geoReturn['geoplugin_countryCode'];
	$continentCode = $geoReturn['geoplugin_continentCode'];
	// echo $continentCode;

	if ($continentCode == 'AF' || $continentCode == 'EU' || $continentCode == 'AN') {
	  $region = 'emea';
	} elseif ($continentCode == 'NA' || $continentCode == 'SA') {
	  $region = 'ncsa';
  } elseif ($continentCode == 'AS' || $continentCode == 'OC') {
	  $region = 'apac';
	}
	// echo $region;

	include 'getStats/getUserData.php';

	// print function that actually works
	function console_log($data){
		echo '<script>';
		echo 'console.log('.json_encode($data).')';
		echo '</script>';
	}

	// If statement if hacker.php is allowed to load.
	if (!empty($userData) && !array_key_exists('error', $userData) && array_key_exists('profile_id', $userData) && ($generalPvpHeadshotRatio >= 0.55 || $generalPvpPenetrationRatio >= 0.1 && $level < 150)){
		// Calculate Hacker Probability
		include 'hacker.php';

		console_log($print);

	} else {
		$sumHacker = 0;
	}
	// echo $sumHacker;
	// print("<pre>".print_r($userData,true)."</pre>");

} else {
    header( "Location: index.php" );
    exit ;
}

?>

<!DOCTYPE html>
<html lang="en">
    <?php require('header.php'); ?>


    <?php require('footer.php'); ?>
    <!-- PHP Variable to JS -->
    <script type="text/javascript">
        var valHacker = '<?php echo $sumHacker ?>';
    </script>
    <!-- JS Scripts -->
    <script src="dist/js/searchBar.js"></script>
</body>
</html>
