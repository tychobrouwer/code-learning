<?php

if(isset($_GET['submit']) && !empty($_GET['username'])){
    // General Stats
    include 'getStats/getUserData.php';

    // Calculate Hacker Probability
    include 'hacker.php';

    //print("<pre>".print_r($playerData,true)."</pre>");

} else {
    header( "Location: index.php" );
    exit ;
}

?>

<!DOCTYPE html>
<html lang="en">
    <?php require('header.php'); ?>


    <?php require('footer.php'); ?>
    <script src="dist/js/searchBar.js"></script>
</body>
</html>
