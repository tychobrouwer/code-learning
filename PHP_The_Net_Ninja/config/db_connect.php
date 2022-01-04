<?php

$conn = mysqli_connect('localhost', 'tycho', 'HFHU#4797hfe', 'ninja_pizza');

if(!$conn){
    echo 'Connection error' . mysqli_connect_error();
}

?>