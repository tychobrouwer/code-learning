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
  if ($level <= 150 && $generalPvpKills > 100) {
    if ($generalRankedKd >= 4.0) {
      $sumHackerKd += 20;
    }   elseif ($generalRankedKd >= 3.0) {
          $sumHackerKd += 15;
        }  elseif ($generalRankedKd >= 2.0) {
            $sumHackerKd += 10;
          }   elseif ($generalRankedKd >= 1.6) {
                $sumHackerKd += 5;
              }
  }

  // Hight Penetration ratio might indicate hackers
  if ($level <= 150 && $generalRankedKd > 1.5 && $generalPvpKills > 100) {
    if ($generalPvpPenetrationRatio >= 0.25) {
      $sumHackerPR += 25;
    } elseif ($generalPvpPenetrationRatio >= 0.2) {
           $sumHackerPR += 20;
         } elseif ($generalPvpPenetrationRatio > 0.15) {
               $sumHackerPR += 10;
            }
  }
  // Headshoot to kill ratio, most hackers use aimbot.
  if ($generalPvpKills > 50) {
    if ($generalPvpHeadshotRatio >= 0.8) {
      $sumHackerHKR += 25;
    }  elseif ($generalPvpHeadshotRatio >= 0.70) {
          $sumHackerHKR += 20;
        }    elseif ($generalPvpHeadshotRatio >= 0.55) {
              $sumHackerHKR += 15;
            }
  }
  // Win/Loss ratio since most hackers have a high win/loss
  if ($level <= 150 && $generalRankedWinns > 20) {
    if ($generalRankedWinnloss >= 83) {
      $sumHackerWL += 23;
    }  elseif ($generalRankedWinnloss >= 75) {
          $sumHackerWL += 17;
        }   elseif ($generalRankedWinnloss >= 60) {
              $sumHackerWL += 7;
           }
  }
  // Level for hackers. Most hackers have low lvl accounts
  if ( $currentMmr > 3000) {
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
            "Kills" => $generalPvpKills,
            "Ranked K/D" => $generalRankedKd,
            "Penetration" => $generalPvpPenetrationRatio,
            "HS/Kill ratio" => $generalPvpHeadshotRatio,
            "W/L ratio" => $generalRankedWinnloss,
            "Ranked wins" => $generalRankedWinns,
        ],
        "points" => [
            "KD" => $sumHackerKd,
            "Penetration Ratio" => $sumHackerPR,
            "Headshot Ratio" => $sumHackerHKR,
            "Win Loss ratio" => $sumHackerWL,
            "Level" => $sumHackerLevel,
        ]
    ];
 ?>
