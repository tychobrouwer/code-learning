<?php
foreach ($seasons as $season) {
    if (($getUser[$season]['kills'] > 0 && $getUser[$season]['rank'] == 0 && $getUser[$season]['wins'] == 0 && $getUser[$season]['losses'] == 0) ||
        ($getUser[$season]['kills'] > 100 && $getUser[$season]['wins'] < 3 && $getUser[$season]['rank'] == 0 && $getUser[$season]['losses'] < 3) ||
        ($getUser[$season]['kills'] > 40 && $getUser[$season]['wins'] < 2 && $getUser[$season]['rank'] == 0 && $getUser[$season]['losses'] < 2)) {
        $banned = true;
        $bannedseason = $season;
        break 1;
    } else {
        $banned = false;
    }
}

if ($banned == true) {
    // if (in_array($bannedseason, $seasons, true)) {
    //     if ($getUser['0']['rank'] >= 1) {
    //         $banned = false;
    //     }
    // }

    foreach ($seasons as $value) {
        if (($value < $bannedseason) && ($getUser[$value]['rank'] > 0)) {
            $banned = false;
        }
    }
}
