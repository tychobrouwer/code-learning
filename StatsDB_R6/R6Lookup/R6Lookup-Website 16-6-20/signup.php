<?php
session_start();

include 'phptemplates/mysqlConn.php';
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if (isset($_POST['submit']) && !empty($_POST['newusername']) && !empty($_POST['newpassword']) && !empty($_POST['newmail']) && !empty($_POST['id'])) {
    if (!empty($_POST['newusername'])) {
        $sqlusername = htmlspecialchars($_POST['newusername']);
        $sql = $conn->query("SELECT username FROM user WHERE username = '$sqlusername'");
    }
    if (mysqli_num_rows($sql) > 0) {
        $usernameTaken = true;
    } else {
        $usernameTaken = false;
    }
    if (htmlspecialchars($_POST['newmail']) == htmlspecialchars($_POST['newmail2'])) {
        $mailmatch = false;
    } else {
        $mailmatch = true;
    }
    if (htmlspecialchars($_POST['newpassword']) == htmlspecialchars($_POST['newpassword2'])) {
        $passwordmatch = false;
        $hash = password_hash($_POST['newpassword'], PASSWORD_DEFAULT);
    } else {
        $passwordmatch = true;
    }
    if (!empty($_POST['id'])) {
        $sqlid = htmlspecialchars($_POST['id']);
        $sql2 = $conn->query("SELECT code FROM user WHERE code = '$sqlid'");
    }
    if (mysqli_num_rows($sql2) > 0) {
        $wrongid = false;
    } else {
        $wrongid = true;
    }
    if ($mailmatch == false && $passwordmatch == false && $usernameTaken == false && $wrongid == false) {
        $id = htmlspecialchars($_POST['id']);
        $platform = htmlspecialchars($_POST['platform']);
        $username = htmlspecialchars($_POST['newusername']);
        $mail = htmlspecialchars($_POST['newmail']);

        $query = "UPDATE user SET username=?,mail=?,platform=?,password=? WHERE code=?";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param('sssss', $username, $mail, $platform, $hash, $id);
            $stmt->execute();
            $stmt->close();
            echo "Record Updated:";
            echo $stmt->affected_rows;
        } else {
            echo $conn->error;
            $stmt->close();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <!-- R6Lookup -->
    <title>R6Lookup | Signup</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats,lookup,stats,stat,,rainbow,six siege,r6look">
    <link rel="canonical" href="https://www.r6lookup.com/" />
    <!-- favicon -->
    <link rel="icon" href="https://www.r6lookup.com/dist/img/icon.svg" sizes="any" type="image/svg+xml">
    <!-- CSS link -->
    <link rel="stylesheet" href="https://www.r6lookup.com/dist/css/style.css">
    <!-- Google Fonts link -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <!-- Fontawesome Script -->
    <script src="https://kit.fontawesome.com/01aa610b63.js" crossorigin="anonymous"></script>
    <!-- CSS links -->
    <link rel="stylesheet" rel=preload type="text/css" as="style" href="https://www.r6lookup.com/dist/css/style.css" async>
 </head>
  <body>
    <form method="post">
      <input placeholder="Username" type="username" name="newusername" autocomplete="off" required>
      <?php if ($usernameTaken == true) { ?>
          <div class="message">
              <p>Username already taken</p>
          </div>
      <?php } ?> <br>
      <input placeholder="Password" type="password" name="newpassword" autocomplete="off" required>
      <input placeholder="Retype password" type="password" name="newpassword2" autocomplete="off" required>
      <?php if ($passwordmatch == true) { ?>
          <div class="message">
              <p>Password not matching</p>
          </div>
      <?php } ?> <br>
      <input placeholder="Mail" type="email" name="newmail" required>
      <input placeholder="Retype mail" type="email" name="newmail2" required>
      <?php if ($mailmatch == true) { ?>
          <div class="message">
              <p>Mail not matching</p>
          </div>
      <?php } ?> <br>
      <input placeholder="Code" type="text" name="id" autocomplete="off" required>
      <?php if ($wrongid == true) { ?>
          <div class="message">
              <p>Wrong code</p>
          </div>
      <?php } ?>
      <br>
      <input type="radio" name="platform" value="uplay">
      <input type="radio" name="platform" value="xbl">
      <input type="radio" name="platform" value="psn">
      <input type="submit" name="submit" value="Signup">
  </body>
</html>
