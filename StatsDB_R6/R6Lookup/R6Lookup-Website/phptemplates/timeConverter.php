<?php

function timeConverterHMS($seconds)
{
    $secondsInAMinute = 60;
    $secondsInAnHour  = 3600;
    $secondsInADay    = 86400;

    $hours = floor($seconds / $secondsInAnHour);
    $remSec1 = $seconds - ($hours * $secondsInAnHour);

    $minutes = floor($remSec1 / $secondsInAMinute);
    $remSec2 = $remSec1 - ($minutes * $secondsInAMinute);

    $seconds = floor($remSec2);

    // return the final array
    $obj = array(
        'h' => (int) $hours,
        'm' => (int) $minutes,
        's' => (int) $seconds,
    );
    return $obj;
}

function timeConverterDHMS($seconds)
{
    $secondsInAMinute = 60;
    $secondsInAnHour  = 3600;
    $secondsInADay    = 86400;

    $days = floor($seconds / $secondsInADay);
    $remS1 = $seconds - ($days * $secondsInADay);

    $hours = floor($remS1 / $secondsInAnHour);
    $remSec2 = $remS1 - ($hours * $secondsInAnHour);

    $minutes = floor($remSec2 / $secondsInAMinute);
    $remSec3 = $remSec2 - ($minutes * $secondsInAMinute);

    $seconds = floor($remSec3);

    // return the final array
    $obj = array(
        'd' => (int) $days,
        'h' => (int) $hours,
        'm' => (int) $minutes,
        's' => (int) $seconds
    );
    return $obj;
}
