<?php
  // General Stats
  include 'getStats/getUserData.php';

  $sumHacker = 0;
  $sumHackerKd = 0;
  $sumHackerPR = 0;
  $sumHackerWL = 0;
  $sumHackerHKR = 0;
  $sumHackerLevel = 0;

  // High K/D might indicate hacker
  if ($level <= 110 ) {
    if ($generalRankedKd >= 4.0) {
      $sumHackerKd += 15;
    }   elseif ($generalRankedKd >= 3.0) {
          $sumHackerKd += 10;
        }  elseif ($generalRankedKd >= 2.0) {
            $sumHackerKd += 5;
          }   elseif ($generalRankedKd >= 1.6) {
                $sumHackerKd += 3;
              }
  }

  // Hight Penetration ratio might indicate hackers
  if ($level <= 100 && $generalPvpKd > 1.5) {
    if ($generalPvpPenetrationRatio > 0.9) {
      $sumHackerPR += 30;
    }   elseif ($generalPvpPenetrationRatio > 0.7) {
          $sumHackerPR += 20;
      } elseif ($generalPvpPenetrationRatio > 0.35) {
           $sumHackerPR += 15;
         } elseif ($generalPvpPenetrationRatio > 0.2) {
               $sumHackerPR += 10;
            }
  }
  // Headshoot to kill ratio, most hackers use aimbot.
  if ($generalPvpHeadshotRatio >= 0.9) {
    $sumHackerHKR += 15;
  }  elseif ($generalPvpHeadshotRatio >= 0.75) {
        $sumHackerHKR += 10;
     }    elseif ($generalPvpHeadshotRatio >= 0.55) {
            $sumHackerHKR += 5;
          }

  // Win/Loss ratio since most hackers have a high win/loss
  if ($level <= 100) {
    if ($generalRankedWinnloss >= 60) {
      $sumHackerWL += 5;
    }  elseif ($generalRankedWinnloss >= 70) {
          $sumHackerWL += 7;
        }   elseif ($generalRankedWinnloss >= 90) {
              $sumHackerWL += 10;
           }
  }
  // Level for hackers. Most hackers have low lvl accounts
  if ($sumHacker >=4 && $currentMmr > 3000) {
    if ($level <= 40) {
      $sumHackerLevel += 5;
    }   elseif ($level <= 60) {
          $sumHackerLevel += 4;
        }   elseif ($level <= 100) {
              $sumHackerLevel += 3;
              }
    }
    $sumHacker = $sumHackerWL + $sumHackerKd + $sumHackerPR + $sumHackerHKR + $sumHackerLevel;
    $print = [
        "stats" => [
            "Level" => $level,
            "MMR" => $currentMmr,
            "Ranked K/D" => $generalRankedKd,
            "Penetration" => $generalPvpPenetrationRatio,
            "HS/Kill ratio" => $generalPvpHeadshotRatio,
            "W/L ratio" => $generalRankedWinnloss
        ],
        "points" => [
            "KD" => $sumHackerKd,
            "Penetration Ratio" => $sumHackerPR,
            "Headshot Ratio" => $sumHackerHKR,
            "Win Loss ratio" => $sumHackerWL,
            "Level" => $sumHackerLevel
        ]
    ];
 ?>
