<?php
    require('player-data.php');

    if(isset($_GET['submit'])){
        $nameInput = htmlspecialchars($_GET['username']);
        $platform = htmlspecialchars($_GET['platform']);

        $playerData = GetPlayerData($nameInput, $platform);

        //print("<pre>".print_r($playerData,true)."</pre>");
    } 
?>

<!DOCTYPE html>
<html lang="en">
    <?php include('header.php'); ?>
</body>
</html>