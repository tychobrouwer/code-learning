<table class="weapontype-table" data-sortable>
    <thead>
        <tr>
            <th class="weapontype-info-th">
                <p>Weapon</p>
            </th>
            <th class="weapontype-kills-th">
                <p>Kills</p>
            </th>
            <th class="weapontype-death-th">
                <p>Deaths</p>
            </th>
            <th class="weapontype-kd-th">
                <p>K/D</p>
            </th>
            <th class="weapontype-dbno-th">
                <p>Downed Enemies</p>
            </th>
            <th class="weapontype-dbno-th">
                <p>Downed Assists</p>
            </th>
            <th class="weapontype-headshot-ratio-th">
                <p>Headshot %</p>
            </th>
            <th class="weapontype-chosen-th">
                <p>Times Chosen</p>
            </th>
        </tr>
    </thead>
    <tbody>
    <?php foreach ($weaponTypes as $weapontype) { ?>
        <tr class="item weapontype-tr <?php echo $getUser["weapontype"][$weapontype]["weapon_type"] ?>" onclick="loadWeapon('<?php echo $getUser["weapontype"][$weapontype]["weapon_type"] ?>')">
            <td class="weapontype-info">
                <p>
                    <?php echo $getUser["weapontype"][$weapontype]["weapon_type_name"] ?>
                </p>
            </td>
            <td class="weapontype-kills">
                <p>
                    <?php echo $getUser["weapontype"][$weapontype]["weapontypepvp_kills"] ?>
                </p>
            </td>
            <td class="weapontype-death">
                <p>
                    <?php echo $getUser["weapontype"][$weapontype]["weapontypepvp_death"] ?>
                </p>
            </td>
            <td class="weapontype-kd">
                <p>
                    <?php if (empty($getUser["weapontype"][$weapontype]["weapontypepvp_death"])) {
                        echo "INF";
                    } else {
                        echo number_format($getUser["weapontype"][$weapontype]["weapontypepvp_kills"] / $getUser["weapontype"][$weapontype]["weapontypepvp_death"], 2, '.', '');
                    } ?>
                </p>
            </td>
            <td class="weapontype-dbno">
                <p>
                    <?php echo $getUser["weapontype"][$weapontype]["weapontypepvp_dbno"] ?>
                </p>
            </td>
            <td class="weapontypepvp-dbnoassist">
                <p>
                    <?php echo $getUser["weapontype"][$weapontype]["weapontypepvp_dbnoassists"] ?>
                </p>
            </td>
            <td class="weapontype-headshot-ratio">
                <p>
                    <?php if (empty($getUser["weapontype"][$weapontype]["weapontypepvp_headshot"])) {
                        echo "0.00";
                    } else {
                        echo
                        number_format($getUser["weapontype"][$weapontype]["weapontypepvp_headshot"] / $getUser["weapontype"][$weapontype]["weapontypepvp_kills"] * 100, 2, '.', '');
                    } ?>%
                </p>
            </td>
            <td class="weapontype-chosen">
                <p>
                    <?php echo $getUser["weapontype"][$weapontype]["weapontypepvp_chosen"] ?>
                </p>
            </td>
        </tr>
    <?php } ?>
    </tbody>
</table>
<input type="text" class="weapon-info-search" id="weapon-info-search-id" onkeyup="searchW()" placeholder="Search weapon">
<table class="weapon-table" id="weapon-table-id" data-sortable>
    <thead>
        <tr>
            <th class="weapon-info-th">
                <p>Weapon</p>
            </th>
            <th class="weapon-kills-th">
                <p>Kills</p>
            </th>
            <th class="weapon-death-th">
                <p>Deaths</p>
            </th>
            <th class="weapon-kd-th">
                <p>K/D</p>
            </th>
            <th class="weapon-dbno-th">
                <p>Downed Enemies</p>
            </th>
            <th class="weapon-dbno-th">
                <p>Downed Assists</p>
            </th>
            <th class="weapon-headshot-ratio-th">
                <p>Headshot %</p>
            </th>
            <th class="weapon-chosen-th">
                <p>Times Chosen</p>
            </th>
        </tr>
    </thead>
    <tbody>
    <?php foreach ($weapons as $weapon) { ?>
        <tr class="item weapon-tr <?php echo $getUser["weapon"][$weapon]["weapon_type"] ?>-tr <?php echo $getUser["weapon"][$weapon]["weapon_type"] ?>">
            <td class="weapon-info">
                <p>
                    <?php echo $getUser["weapon"][$weapon]["weapon_name"] ?>
                </p>
            </td>
            <td class="weapon-kills">
                <p>
                    <?php echo $getUser["weapon"][$weapon]["weaponpvp_kills"] ?>
                </p>
            </td>
            <td class="weapon-death">
                <p>
                    <?php echo $getUser["weapon"][$weapon]["weaponpvp_death"] ?>
                </p>
            </td>
            <td class="weapon-kd">
                <p>
                    <?php if (empty($getUser["weapon"][$weapon]["weaponpvp_death"])) {
                        echo "INF";
                    } else {
                        echo number_format($getUser["weapon"][$weapon]["weaponpvp_kills"] / $getUser["weapon"][$weapon]["weaponpvp_death"], 2, '.', '');
                    } ?>
                </p>
            </td>
            <td class="weapon-dbno">
                <p>
                    <?php echo $getUser["weapon"][$weapon]["weaponpvp_dbno"] ?>
                </p>
            </td>
            <td class="weapon-dbnoassist">
                <p>
                    <?php echo $getUser["weapon"][$weapon]["weaponpvp_dbnoassists"] ?>
                </p>
            </td>
            <td class="weapon-headshot-ratio">
                <p>
                    <?php if (empty($getUser["weapon"][$weapon]["weaponpvp_headshot"])) {
                        echo "0.00";
                    } else {
                        echo
                        number_format($getUser["weapon"][$weapon]["weaponpvp_headshot"] / $getUser["weapon"][$weapon]["weaponpvp_kills"] * 100, 2, '.', '');
                    } ?>%
                </p>
            </td>
            <td class="weapon-chosen">
                <p>
                    <?php echo $getUser["weapon"][$weapon]["weaponpvp_chosen"] ?>
                </p>
            </td>
        </tr>
    <?php } ?>
    </tbody>
</table>
