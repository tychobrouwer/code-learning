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
                        <img src="<?php echo $getUser[$season]["rankInfo"]["image"] ?>" alt="previous season img">
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
                        </p>
                    </div>
                    <div class="season-current-rank">
                        <div class="season-current-rank-bar" style="width:
                        <?php echo (($getUser[$season]['mmr'] - $getUser[$season]['previous_rank_mmr']) / ($getUser[$season]['next_rank_mmr'] - $getUser[$season]['previous_rank_mmr']) * 100); ?>%">

                        </div>
                        <p>
                            <?php if ($getUser[$season]["rank"] != 0) {
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
                        <img src="<?php echo $getUser[$season]["nextRankInfo"]["image"] ?>" alt="next season img">
                    </div>
                </div>
                <div class="season-max-rank">
                    <div class="season-max-img">
                        <img src="<?php echo $getUser[$season]["maxRankInfo"]["image"] ?>" alt="next season img">
                    </div>
                    <div class="season-max-rank-text">
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
                </p>
                <p class="season-winloss">
                    <?php if (($getUser[$season]['wins'] + $getUser[$season]['losses']) != 0) {
                        echo number_format(round($getUser[$season]['wins'] / ($getUser[$season]['wins'] + $getUser[$season]['losses']) * 100, 2), 2, '.', '');
                    } else {
                        echo "0.00%";
                    } ?>
                    <span> Win %</span>
                </p>
            </div>
        </div>
        <div class="season-info-div">
            <div class="season-info">
                <p class="season-kills">
                    <?php echo $getUser[$season]["kills"] ?>
                    <span> Kills</span>
                </p>
                <p class="season-wins">
                    <?php echo $getUser[$season]['wins'] ?>
                    <span> Wins</span>
                </p>
            </div>
        </div>
        <div class="season-info-div">
            <div class="season-info">

                <p class="season-deaths">
                    <?php echo $getUser[$season]["deaths"] ?>
                    <span> Deaths</span>
                </p>
                <p class="season-losses">
                    <?php echo $getUser[$season]['losses'] ?>
                    <span> Losses</span>
                </p>
            </div>
        </div>
    </div>
</div>
