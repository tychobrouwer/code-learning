<?php
session_start();

$loggedIn = $_SESSION['loggedin'];
$userId = $_SESSION['userId'];

if ($loggedIn != true) {
    header("Location: https://www.r6lookup.com/login");
}

include 'phptemplates/mysqlConn.php';

$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);


if ($stmt = $conn->prepare("SELECT background, message, nameColor, urlName, url FROM customize WHERE userId = ?")) {
    $stmt->bind_param('s', $userId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($background, $message, $nameColor, $urlName, $url);
        $stmt->fetch();
    } else {
        echo 'No data';
    }
    $stmt->close();
}

if (isset($_POST["clearbackground"]) && isset($_POST["submit"])) {
    $sql = $conn->query("UPDATE customize SET background = '' WHERE userId = '$userId'");
} else {
    if (isset($_POST["background"]) && !empty($_POST["background"]) && isset($_POST["submit"])) {
        $background = $_POST["background"];
        $sql = $conn->query("UPDATE customize SET background = '$background' WHERE userId = '$userId'");
    }
}

if (isset($_POST["clearMessage"]) && isset($_POST["submit"])) {
    $sql = $conn->query("UPDATE customize SET message = '' WHERE userId = '$userId'");
} else {
    if (isset($_POST["message"]) && isset($_POST["submit"])) {
        $message = $_POST["message"];
        $sql = $conn->query("UPDATE customize SET message = '$message' WHERE userId = '$userId'");
    }
}

if (isset($_POST["clearNameColor"]) && isset($_POST["submit"])) {
    $sql = $conn->query("UPDATE customize SET nameColor = '' WHERE userId = '$userId'");
} else {
    if (isset($_POST["nameColor"]) && isset($_POST["submit"])) {
        $nameColor = $_POST["nameColor"];
        $sql = $conn->query("UPDATE customize SET nameColor = '$nameColor' WHERE userId = '$userId'");
    }
}

if (isset($_POST["clearUrlName"]) && isset($_POST["submit"])) {
    $sql = $conn->query("UPDATE customize SET urlName = '' WHERE userId = '$userId'");
} else {
    if (isset($_POST["urlName"]) && isset($_POST["submit"])) {
        $urlName = $_POST["urlName"];
        $sql = $conn->query("UPDATE customize SET urlName = '$urlName' WHERE userId = '$userId'");
    }
}

if (isset($_POST["clearUrl"]) && isset($_POST["submit"])) {
    $sql = $conn->query("UPDATE customize SET url = '' WHERE userId = '$userId'");
} else {
    if (isset($_POST["url"]) && isset($_POST["submit"])) {
        $url = $_POST["url"];
        $sql = $conn->query("UPDATE customize SET url = '$url' WHERE userId = '$userId'");
    }
}
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Signup</title>
    </head>
    <body>
        <?php if ($loggedIn == true) { ?>
            <form method="POST">
                <input placeholder="Background URL" type="url" name="background" autocomplete="off"
                <?php if (isset($background)) { ?>
                    value="<?php echo $background?>"
                <?php } ?>>
                <input type="checkbox" name="clearbackground">
                <input placeholder="I'm awesome" type="text" maxlength="25" name="message" autocomplete="off"
                <?php if (isset($message)) { ?>
                    value="<?php echo $message?>"
                <?php } ?>>
                <input type="checkbox" name="clearMessage">
                <input placeholder="#FF2D00" type="text" maxlength="7" name="nameColor" autocomplete="off"
                <?php if (isset($nameColor)) { ?>
                    value="<?php echo $nameColor ?>"
                <?php } ?>>
                <input type="checkbox" name="clearNameColor">
                <input placeholder="My youtube channel here" type="text" maxlength="28" name="urlName" autocomplete="off"
                <?php if (isset($urlName)) { ?>
                    value="<?php echo $urlName ?>"
                <?php } ?>>
                <input type="checkbox" name="clearUrlName">
                <input placeholder="URL" type="url" name="url" autocomplete="off"
                <?php if (isset($url)) { ?>
                    value="<?php echo $url ?>"
                <?php } ?>>
                <input type="checkbox" name="clearUrl">
                <input name="submit" type="submit" value="Submit">
            </form>
        <?php } else { ?>
            <p class="text"><?php echo "You are not logged in!" ?></p>
        <?php } ?>
    </body>
</html>
