<?php
$displayData = false;

// print function that actually works
function console_log($data)
{
    echo '<script>';
    echo 'console.log('.json_encode($data).')';
    echo '</script>';
}

$developers = "DS-Jocular*uplay*99cd6586-2abe-4e5b-8671-184cb628b004;DS-Cloav*uplay*92a50c74-e277-48b2-bbba-709a00e2d054";
$seasons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
$operators = [
    'ace', 'alibi', 'amaru', 'ash', 'bandit', 'blackbeard', 'blitz', 'buck', 'capitao', 'castle', 'caveira', 'clash', 'doc', 'dokkaebi', 'echo', 'ela', 'finka', 'frost', 'fuze', 'glaz',
    'goyo', 'gridlock', 'hibana', 'iana', 'iq', 'jackal', 'jager', 'kaid', 'kali', 'kapkan', 'lesion', 'lion', 'maestro', 'maverick', 'melusi', 'mira', 'montagne', 'mozzie', 'mute', 'nomad',
    'nokk', 'oryx', 'pulse', 'rook', 'sledge', 'smoke', 'tachanka', 'thatcher', 'thermite', 'twitch', 'valkyrie', 'vigil', 'wamai', 'warden', 'ying', 'zero', 'zofia'
];
$weaponTypes = [
    "assault_rifle", "submachine_gun", "light_machine_gun", "marksman_rifle", "handgun", "shotgun", "machine_pistol", "launcher"
];
$weapons = [
    'g8a1', '416-ccarbine', 'm870', 'mp7', 'ak-12', '9x19vsn', 'ots-03', 'gsh-18', 'smg-12', 'k1a', 'c75auto', 'bosg.12.2', 'mk14ebr', 'mx4storm', 'alda5.56', 'bailiff410', 'keratos.357', 'ar-15.50', 'supershorty', 'p-10c',
    '1911tacops', 'm4', 'spsmg9', 'ak-74m', 'arx200', '.44magsemi-auto', 'auga3', 'tcsg12', 'p10roni', 'f90', 'sdp9mm', 'mk17cqb', 'camrs', '9mmc1', 'c8-sfw', 'spas-12', 'sr-25', 'super90', 'csrx300', 'mk19mm',
    'd-50', 'mpx', 'm249', 'spas-15', 'prb92', 'm12', 'para-308', 'p229', 'supernova', 'bearing9', 'mp5sd', 'type-89', 'auga2', 'sg-cqb', '5.7usg', 'm590a1', 'f2', 'pmm', 'sasg-12', 'ita12l',
    'ita12s', 'c7e', 'vector.45acp', 'usp40', 'pdw9', 't-5smg', 't-95lsw', 'q-929', 'six12', 'six12sd', 'm249saw', '417', 'mp5', 'l85a2', 'p90', 'lfp586', 'p226mk25', 'p12', 'm1014', 'smg-11',
    'ump45', 'fmg-9', 'mp5k', 'r4-c', '552commando', '556xi', 'm45meusoc', 'ar33', 'p9', '6p41', 'g36c', 'commando9', 'v308', 'spear.308', 'acs12', 'scorpionevo3a1', 'fo-12', 'm762', 'lmg-e', 'rg15',
    'sc3000k'
];
