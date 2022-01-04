<div class="season-div">
    <div class="season-name-div">
        <p class="season-name">
            <?php echo $getUser[$season]["seasonName"] ?>
        </p>
    </div>
    <div class="season-info">
        <div class="season-rank">
            <div class="season-rank-div">
                <div class="season-previous-img-div">
                    <div class="season-previous-img">
                        <img src="<?php echo $getUser[$season]["rankInfo"]["image"] ?>" alt="previous season img" width="60" height="60">
                    </div>
                </div>
                <div class="season-current-rank-div">
                    <div class="season-max-mmr-div">
                        <p class="season-max-mmr">
                            <?php if ((int)$getUser[$season]['max_mmr'] != 0) {
                                echo (int)$getUser[$season]['max_mmr'];
                            } else {
                                echo $getUser[$season]['mmr'];
                            } ?>
                            <span>Max Mmr</span>
                            <span id="<?php echo $season ?>-max_mmr-img-down" class="compare-arrow compare-hide">
                                <svg aria-hidden="true" focusable="false" class="arrowUp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                                </svg>
                            </span>
                            <span id="<?php echo $season ?>-max_mmr-img-equal" class="compare-arrow compare-hide">
                                <svg aria-hidden="true" focusable="false" class="arrowEven" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                                </svg>
                            </span>
                            <span id="<?php echo $season ?>-max_mmr-img-up" class="compare-arrow compare-hide">
                                <svg aria-hidden="true" focusable="false" class="arrowDown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                                </svg>
                            </span>
                            <span id="<?php echo $season ?>-max_mmr" class="compare-stat compare-hide compare-show-<?php echo $season ?>"></span>
                        </p>
                    </div>
                    <div class="season-current-rank">
                        <div class="season-current-rank-bar" style="width:
                        <?php if ($getUser[$season]['next_rank_mmr'] < $getUser[$season]['mmr'] && $getUser[$season]['next_rank_mmr'] != 0) {
                            echo '100';
                        } else {
                            echo (($getUser[$season]['mmr'] - $getUser[$season]['previous_rank_mmr']) / ($getUser[$season]['next_rank_mmr'] - $getUser[$season]['previous_rank_mmr']) * 100);
                        } ?>%">
                        </div>
                        <p>
                            <?php if ($getUser[$season]["rank"] != 0 && $getUser[$season]['next_rank_mmr'] > $getUser[$season]['mmr']) {
                                echo $getUser[$season]["mmr"] ?> / <?php
                                echo $getUser[$season]["next_rank_mmr"];
                            } else {
                                echo $getUser[$season]["mmr"];

                            } ?>
                        </p>
                    </div>
                </div>
                <div class="season-next-img-div">
                    <div class="season-next-img">
                        <img src="<?php echo $getUser[$season]["nextRankInfo"]["image"] ?>" alt="next season img" width="60" height="60">
                    </div>
                </div>
                <div class="season-max-rank">
                    <div class="season-max-img">
                        <img src="<?php echo $getUser[$season]["maxRankInfo"]["image"] ?>" alt="max rank" width="50" height="50">
                        <span id="<?php echo $season ?>-max_rank-img-down" class="compare-arrow compare-hide">
                            <svg aria-hidden="true" focusable="false" class="arrowUp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                            </svg>
                        </span>
                        <span id="<?php echo $season ?>-max_rank-img-equal" class="compare-arrow compare-hide">
                            <svg aria-hidden="true" focusable="false" class="arrowEven" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                            </svg>
                        </span>
                        <span id="<?php echo $season ?>-max_rank-img-up" class="compare-arrow compare-hide">
                            <svg aria-hidden="true" focusable="false" class="arrowDown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                            </svg>
                        </span>
                        <img id="<?php echo $season ?>-max_rank_img" class="compare-hide" src="" alt="max rank" width="50" height="50">
                    </div>
                    <div class="season-max-rank-text" id="<?php echo $season ?>-max_rank_text">
                        <p>Max Rank</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="season-info-div">
            <div class="season-info">
                <p class="current-season-kd">
                    <?php if ($getUser[$season]['deaths'] != 0) {
                        echo number_format(round($getUser[$season]['kills'] / $getUser[$season]['deaths'], 2), 2, '.', '');
                    } else {
                        echo "0.00";
                    } ?>
                    <span> K/D</span>
                    <span id="<?php echo $season ?>-kd-img-down" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowUp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-kd-img-equal" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowEven" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-kd-img-up" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowDown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-kd" class="compare-stat compare-hide compare-show-<?php echo $season ?>"></span>
                </p>
                <p class="season-winloss">
                    <?php if (($getUser[$season]['wins'] + $getUser[$season]['losses']) != 0) {
                        echo number_format(round($getUser[$season]['wins'] / ($getUser[$season]['wins'] + $getUser[$season]['losses']) * 100, 2), 2, '.', '');
                    } else {
                        echo "0.00";
                    } ?>
                    <span> Win %</span>
                    <span id="<?php echo $season ?>-win-img-down" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowUp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-win-img-equal" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowEven" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-win-img-up" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowDown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-win%" class="compare-stat compare-hide compare-show-<?php echo $season ?>"></span>
                </p>
            </div>
        </div>
        <div class="season-info-div">
            <div class="season-info">
                <p class="season-kills">
                    <?php echo $getUser[$season]["kills"] ?>
                    <span> Kills</span>
                    <span id="<?php echo $season ?>-kills-img-down" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowUp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-kills-img-equal" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowEven" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-kills-img-up" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowDown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-kills" class="compare-stat compare-hide compare-show-<?php echo $season ?>"></span>
                </p>
                <p class="season-wins">
                    <?php echo $getUser[$season]['wins'] ?>
                    <span> Wins</span>
                    <span id="<?php echo $season ?>-wins-img-down" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowUp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-wins-img-equal" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowEven" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-wins-img-up" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowDown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-wins" class="compare-stat compare-hide compare-show-<?php echo $season ?>"></span>
                </p>
            </div>
        </div>
        <div class="season-info-div">
            <div class="season-info">

                <p class="season-deaths">
                    <?php echo $getUser[$season]["deaths"] ?>
                    <span> Deaths</span>
                    <span id="<?php echo $season ?>-deaths-img-down" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowUp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-deaths-img-equal" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowEven" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-deaths-img-up" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowDown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-deaths" class="compare-stat compare-hide compare-show-<?php echo $season ?>"></span>
                </p>
                <p class="season-losses">
                    <?php echo $getUser[$season]['losses'] ?>
                    <span> Losses</span>
                    <span id="<?php echo $season ?>-losses-img-down" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowUp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-losses-img-equal" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowEven" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-losses-img-up" class="compare-arrow compare-hide">
                        <svg aria-hidden="true" focusable="false" class="arrowDown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                        </svg>
                    </span>
                    <span id="<?php echo $season ?>-losses" class="compare-stat compare-hide compare-show-<?php echo $season ?>"></span>
                </p>
            </div>
        </div>
        <div class="dropdown">
            <button class=dropdownbtn>Compare</button>
            <div class="dropdown-content">
                <?php foreach ($seasons as $season_) { ?>
                    <button class="compare" season="<?php echo $season ?>" value="<?php echo $season_ ?>"><?php echo $getUser[$season_]['seasonName'] ?></button>
                <?php } ?>
            </div>
        </div>
    </div>
</div>
