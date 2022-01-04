<?php

class UbiAPI
{
    private $b64authcreds;
    public $http_useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36";

    public function __construct($email, $password)
    {
        $this->b64authcreds=$this->generateB64Creds($email.":".$password);
    }

    public function generateB64Creds($emailandpassword)
    {
        return base64_encode($emailandpassword);
    }

    public function login()
    {
        $request_url = "https://public-ubiservices.ubi.com/v3/profiles/sessions";
        #$request_header_ubiappid="314d4fef-e568-454a-ae06-43e3bece12a6";
        $request_header_ubiappid="39baebad-39e5-4552-8c25-2c9b919064e2";
        $request_header_authbasic=$this->b64authcreds;
        $headers = [
            "Content-Type: application/json; charset=utf-8",
            "Accept: */*",
            "Ubi-AppId: ".$request_header_ubiappid,
            "Ubi-RequestedPlatformType: uplay",
            "Authorization: Basic ".$request_header_authbasic,
            "X-Requested-With: XMLHttpRequest",
            "Referer: https://public-ubiservices.ubi.com/Default/Login?appId=".$request_header_ubiappid."&lang=en-US&nextUrl=https%3A%2F%2Fclub.ubisoft.com%2Flogged-in.html%3Flocale%3Den-US",
            "Accept-Language: en-US",
            "Accept-Encoding: deflate, br",
            "User-Agent: ".$this->http_useragent,
            "Host: public-ubiservices.ubi.com",
            "Content-Lenght: 19",
            "Cache-Control: no-cache",
        ];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $request_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, '{"rememberMe":true}');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_ENCODING, 'gzip');
        $ubioutput = curl_exec($ch);
        $orginaloutput=$ubioutput;
        curl_close($ch);
        $test_beforeSave=$this->saveTicket(false);
        $this->saveTicket(true, $ubioutput);
        $test_afterSave=$this->saveTicket(false);
        $test_fileUpdated=false;

        if ($test_beforeSave != $test_afterSave) {
            $test_fileUpdated=true;
        }

        return array(
            "error" => false,
            "content" => "Ticket Updated? (1==true):".$test_fileUpdated,
            "b64authcreds" => $this->b64authcreds,
            "ubioutput" => $ubioutput
        );
    }

    public function uplayticket($check = true)
    {
        $ticket = json_decode($this->saveTicket(false), true);
        if ((!isset($ticket["expiration"]) || isset($ticket["error"]) && $ticket["error"] == true || isset($ticket["errorCode"])) && $check) {
            $this->login();
            return $this->uplayticket(false);
        } elseif ($check) {
            $time = strtotime($ticket["expiration"]);
            if ($time < time()) {
                $this->login();
                return $this->uplayticket(false);
            }
        }
        if (!isset($ticket["ticket"])) {
            return "";
        }
        $ticket = $ticket["ticket"];

        $prefix = "Ubi_v1 t=";
        return $prefix.$ticket;
    }

    private function saveTicket($save, $ticket = "")
    {
        if ($save) {
            $file_ticket = fopen("api_ticket", "w") or die("Can't open ticket file");
            try {
                fwrite($file_ticket, $ticket);
                return true;
            } catch (Exception $e) {
                return false;
            }
        } else {
            $ticket_file = fopen("api_ticket", "r") or die("{error:true}");
            $ticket = fgets($ticket_file);
            return $ticket;
        }
    }

///////////////////////////////////////////////////////////////////////////////

    public function getUserFID($content, $platform)
    {
        $prefixUrl = "https://api-ubiservices.ubi.com/v2/profiles?";
        $request_url = $prefixUrl."profileId=".$content;

        $request_header_ubiappid = "314d4fef-e568-454a-ae06-43e3bece12a6";
        $request_header_ubisessionid = "a651a618-bead-4732-b929-4a9488a21d27";
        $headers =[
            "Accept: */*",
            "ubi-appid: ".$request_header_ubiappid,
            "ubi-sessionid: ".$request_header_ubisessionid,
            "authorization: ".$this->uplayticket(),
            "Referer: https://club.ubisoft.com/en-US/friends",
            "Accept-Language: en-US",
            "Origin: https://club.ubisoft.com",
            "Accept-Encoding: deflate, br",
            "User-Agent: ".$this->http_useragent,
            "Host: api-ubiservices.ubi.com",
            "Cache-Control: no-cache"
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $request_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_ENCODING, 'gzip');

        $ubioutput = curl_exec($ch);
        curl_close($ch);

        $orginaloutput = $ubioutput;
        $jsonoutput = json_decode($ubioutput, true);

        return array(
            "nick" => $jsonoutput['profiles'][0]['nameOnPlatform'],
            "pid" => $jsonoutput['profiles'][0]['profileId']
        );
    }

    ///////////////////////////////////////////////////////////////////////////////

    public function getServerStatus()
    {
        $prefixUrl = "https://game-status-api.ubisoft.com/v1/instances?appIds=";

        $request_url_uplay = $prefixUrl . "e3d5ea9e-50bd-43b7-88bf-39794f4e3d40";
        $request_url_psn = $prefixUrl . "fb4cc4c9-2063-461d-a1e8-84a7d36525fc";
        $request_url_xbl = $prefixUrl . "4008612d-3baf-49e4-957a-33066726a7bc";

        $ch_uplay = curl_init();
        curl_setopt($ch_uplay, CURLOPT_URL, $request_url_uplay);
        curl_setopt($ch_uplay, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch_uplay, CURLOPT_ENCODING, 'gzip');

        $ch_psn = curl_init();
        curl_setopt($ch_psn, CURLOPT_URL, $request_url_psn);
        curl_setopt($ch_psn, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch_psn, CURLOPT_ENCODING, 'gzip');

        $ch_xbl = curl_init();
        curl_setopt($ch_xbl, CURLOPT_URL, $request_url_xbl);
        curl_setopt($ch_xbl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch_xbl, CURLOPT_ENCODING, 'gzip');

        $mh = curl_multi_init();

        curl_multi_add_handle($mh, $ch_uplay);
        curl_multi_add_handle($mh, $ch_psn);
        curl_multi_add_handle($mh, $ch_xbl);

        do {
            $status = curl_multi_exec($mh, $active);
            if ($active) {
                curl_multi_select($mh);
            }
        } while ($active && $status == CURLM_OK);

        curl_multi_remove_handle($mh, $ch_uplay);
        curl_multi_remove_handle($mh, $ch_psn);
        curl_multi_remove_handle($mh, $ch_xbl);
        curl_multi_close($mh);

        $result_uplay = json_decode(curl_multi_getcontent($ch_uplay), true);
        $result_psn = json_decode(curl_multi_getcontent($ch_psn), true);
        $result_xbl = json_decode(curl_multi_getcontent($ch_xbl), true);

        return array(
            "server_uplay_status" => $result_uplay[0],
            "server_psn_status" => $result_psn[0],
            "server_xbl_status" => $result_xbl[0]
        );
    }

///////////////////////////////////////////////////////////////////////////////

    public function getStatsIndex($mode, $input, $platform, $season, $region, $stats)
    {
        $uplayTicket = $this->uplayticket();

        $prefixUrl1 = "https://public-ubiservices.ubi.com/v2/profiles?";
        if ($mode == 1 || $mode == "bynick") {
            $input = urlencode($input);
            $request_url1 = $prefixUrl1."nameOnPlatform=".$input."&platformType=$platform";
        }
        if ($mode == 2 || $mode == "byid") {
            $request_url1 = $prefixUrl1."profileId=".$input;
        }

        $request_header_ubiappid1 = "39baebad-39e5-4552-8c25-2c9b919064e2";
        $request_header_ubisessionid1 = "a4df2e5c-7fee-41ff-afe5-9d79e68e8048";

        $headers1 = [
            "Accept: application/json, text/plain, */*",
            "ubi-appid: " . $request_header_ubiappid1,
            "ubi-sessionid: " . $request_header_ubisessionid1,
            "authorization: " . $uplayTicket,
            "Referer: https://club.ubisoft.com/en-US/friends",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: gzip, deflate, br",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Host: public-ubiservices.ubi.com",
            "Pragma: no-cache",
            "Cache-Control: no-cache",
            "Connection: keep-alive"
        ];

        $ch1 = curl_init();
        curl_setopt($ch1, CURLOPT_URL, $request_url1);
        curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch1, CURLOPT_ENCODING, 'gzip');
        curl_setopt($ch1, CURLOPT_HTTPHEADER, $headers1);
        $result1 = json_decode(curl_exec($ch1), true);
        curl_close($ch1);

        $profileId = $result1["profiles"][0]["profileId"];

        $request_urls2 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6karma/players",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6karma/players",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6karma/players"
        );
        $headers2 =[
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: gzip, deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        $request_url2 = $request_urls2[$platform] . "?board_id=pvp_ranked&profile_ids=$profileId&region_id=$region&season_id=-$season";

        $ch2 = curl_init();
        curl_setopt($ch2, CURLOPT_URL, $request_url2);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers2);
        curl_setopt($ch2, CURLOPT_ENCODING, 'gzip');

        $request_urls3 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );

        $request_url3 = $request_urls3[$platform] . "?populations=$profileId&statistics=$stats";

        $headers3 = [
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        $ch3 = curl_init();
        curl_setopt($ch3, CURLOPT_URL, $request_url3);
        curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch3, CURLOPT_HTTPHEADER, $headers3);
        curl_setopt($ch3, CURLOPT_ENCODING, 'gzip');

        $request_urls4 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6playerprofile/playerprofile/progressions",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6playerprofile/playerprofile/progressions",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6playerprofile/playerprofile/progressions"
        );
        $headers4 =[
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];
        $request_url4 = $request_urls4[$platform] . "?profile_ids=$profileId";

        $ch4 = curl_init();
        curl_setopt($ch4, CURLOPT_URL, $request_url4);
        curl_setopt($ch4, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch4, CURLOPT_HTTPHEADER, $headers4);
        curl_setopt($ch4, CURLOPT_ENCODING, 'gzip');

        $mh = curl_multi_init();

        curl_multi_add_handle($mh, $ch2);
        curl_multi_add_handle($mh, $ch3);
        curl_multi_add_handle($mh, $ch4);

        do {
            $status = curl_multi_exec($mh, $active);
            if ($active) {
                curl_multi_select($mh);
            }
        } while ($active && $status == CURLM_OK);

        curl_multi_remove_handle($mh, $ch2);
        curl_multi_remove_handle($mh, $ch3);
        curl_multi_remove_handle($mh, $ch4);
        curl_multi_close($mh);

        $result2 = json_decode(curl_multi_getcontent($ch2), true);
        $result3 = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch3)), true);
        $result4 = json_decode(curl_multi_getcontent($ch4), true);

        return array_merge(
            $result1["profiles"][0],
            $result4["player_profiles"][0],
            $result3["results"]["$profileId"],
            $result2["players"]
        );
    }

///////////////////////////////////////////////////////////////////////////////

    public function getStatsPlayer($mode, $input, $platform, $season, $region, $stats)
    {
        $uplayTicket = $this->uplayticket();

        $prefixUrl1 = "https://public-ubiservices.ubi.com/v2/profiles?";
        if ($mode == 1 || $mode == "bynick") {
            $input = urlencode($input);
            $request_url1 = $prefixUrl1."nameOnPlatform=".$input."&platformType=$platform";
        }
        if ($mode == 2 || $mode == "byid") {
            $request_url1 = $prefixUrl1."profileId=".$input;
        }
        $request_header_ubiappid1 = "314d4fef-e568-454a-ae06-43e3bece12a6";
        $request_header_ubisessionid1 = "a651a618-bead-4732-b929-4a9488a21d27";
        $headers1 =[
            "Accept: */*",
            "ubi-appid: " . $request_header_ubiappid1,
            "ubi-sessionid: " . $request_header_ubisessionid1,
            "authorization: " . $uplayTicket,
            "Referer: https://club.ubisoft.com/en-US/friends",
            "Accept-Language: en-US",
            "Origin: https://club.ubisoft.com",
            "Accept-Encoding: deflate, br",
            "User-Agent: " . $this->http_useragent,
            "Host: api-ubiservices.ubi.com",
            "Cache-Control: no-cache"
        ];
        $ch1 = curl_init();
        curl_setopt($ch1, CURLOPT_URL, $request_url1);
        curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch1, CURLOPT_ENCODING, 'gzip');
        curl_setopt($ch1, CURLOPT_HTTPHEADER, $headers1);
        $result1 = json_decode(curl_exec($ch1), true);
        curl_close($ch1);

        $profileId = $result1["profiles"][0]["profileId"];

        $seasons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        $ch2 = array();

        $request_urls2 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6karma/players",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6karma/players",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6karma/players"
        );
        $headers2 =[
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: gzip, deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        foreach ($seasons as $season) {
            $request_url2_[$season] = $request_urls2[$platform] . "?board_id=pvp_ranked&profile_ids=$profileId&region_id=$region&season_id=-$season";

            $ch2[$season] = curl_init();
            curl_setopt($ch2[$season], CURLOPT_URL, $request_url2_[$season]);
            curl_setopt($ch2[$season], CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch2[$season], CURLOPT_HTTPHEADER, $headers2);
            curl_setopt($ch2[$season], CURLOPT_ENCODING, 'gzip');
        }

        $request_urls3 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );

        $request_url3 = $request_urls3[$platform] . "?populations=$profileId&statistics=$stats";

        $headers3 = [
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        $ch3 = curl_init();
        curl_setopt($ch3, CURLOPT_URL, $request_url3);
        curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch3, CURLOPT_HTTPHEADER, $headers3);
        curl_setopt($ch3, CURLOPT_ENCODING, 'gzip');

        $request_urls4 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6playerprofile/playerprofile/progressions",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6playerprofile/playerprofile/progressions",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6playerprofile/playerprofile/progressions"
        );
        $headers4 =[
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];
        $request_url4 = $request_urls4[$platform] . "?profile_ids=$profileId";

        $ch4 = curl_init();
        curl_setopt($ch4, CURLOPT_URL, $request_url4);
        curl_setopt($ch4, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch4, CURLOPT_HTTPHEADER, $headers4);
        curl_setopt($ch4, CURLOPT_ENCODING, 'gzip');

        $operatorStats = "operatorpvp_ash_bonfirekill,operatorpvp_ash_bonfirewallbreached,operatorpvp_bandit_batterykill,operatorpvp_black_mirror_gadget_deployed,operatorpvp_blackbeard_gunshieldblockdamage,operatorpvp_blitz_flashedenemy,operatorpvp_blitz_flashfollowupkills,operatorpvp_blitz_flashshieldassist,operatorpvp_buck_kill,operatorpvp_capitao_lethaldartkills,operatorpvp_capitao_smokedartslaunched,operatorpvp_castle_kevlarbarricadedeployed,operatorpvp_caveira_interrogations,operatorpvp_cazador_assist_kill,operatorpvp_dbno,operatorpvp_death,operatorpvp_doc_hostagerevive,operatorpvp_doc_selfrevive,operatorpvp_doc_teammaterevive,operatorpvp_echo_enemy_sonicburst_affected,operatorpvp_frost_dbno,operatorpvp_fuze_clusterchargekill,operatorpvp_glaz_sniperkill,operatorpvp_glaz_sniperpenetrationkill,operatorpvp_headshot,operatorpvp_hibana_detonate_projectile,operatorpvp_iq_gadgetspotbyef,operatorpvp_jager_gadgetdestroybycatcher,operatorpvp_kapkan_boobytrapdeployed,operatorpvp_kapkan_boobytrapkill,operatorpvp_kills,operatorpvp_meleekills,operatorpvp_montagne_shieldblockdamage,operatorpvp_mostused,operatorpvp_mute_gadgetjammed,operatorpvp_mute_jammerdeployed,operatorpvp_pulse_heartbeatassist,operatorpvp_pulse_heartbeatspot,operatorpvp_rook_armorboxdeployed,operatorpvp_rook_armortakenourself,operatorpvp_rook_armortakenteammate,operatorpvp_roundlost,operatorpvp_roundplayed,operatorpvp_roundwlratio,operatorpvp_roundwon,operatorpvp_sledge_hammerhole,operatorpvp_sledge_hammerkill,operatorpvp_smoke_poisongaskill,operatorpvp_tachanka_turretdeployed,operatorpvp_tachanka_turretkill,operatorpvp_thatcher_gadgetdestroywithemp,operatorpvp_thermite_chargedeployed,operatorpvp_thermite_chargekill,operatorpvp_thermite_reinforcementbreached,operatorpvp_timeplayed,operatorpvp_totalxp,operatorpvp_twitch_gadgetdestroybyshockdrone,operatorpvp_twitch_shockdronekill,operatorpvp_valkyrie_camdeployed,operatorpvp_mozzie_droneshacked,operatorpvp_gridlock_traxdeployed,operatorpvp_deceiver_revealedattackers,operatorpvp_tagger_tagdevice_spot,operatorpvp_amaru_distancereeled,operatorpvp_goyo_volcandetonate,operatorpvp_concussiongrenade_detonate,operatorpvp_dazzler_gadget_detonate,operatorpvp_warden_killswithglasses,operatorpvp_wamai_gadgetdestroybymagnet,operatorpvp_attackerdrone_diminishedrealitymode,operatorpvp_oryx_killsafterdash,operatorpvp_nomad_airjabdetonate,operatorpvp_nokk_observationtooldeceived,operatorpvp_maverick_wallbreached,operatorpvp_barrage_killswithturret,operatorpvp_caltrop_enemy_affected,operatorpvp_kali_gadgetdestroywithexplosivelance,operatorpvp_kaid_electroclawelectrify,operatorpvp_iana_killsafterreplicator,operatorpvp_rush_adrenalinerush,operatorpvp_concussionmine_detonate,operatorpvp_phoneshacked,operatorpvp_clash_sloweddown,operatorpvp_amaru_distancereeled,operatorpvp_melusi_sloweddown,operatorpvp_ace_selmadetonate,operatorpvp_zero_gadgetsdestroyed";

        $request_urls5 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );

        $request_url5 = $request_urls5[$platform] . "?populations=$profileId&statistics=$operatorStats";
        $headers5 =[
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        $ch5 = curl_init();
        curl_setopt($ch5, CURLOPT_URL, $request_url5);
        curl_setopt($ch5, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch5, CURLOPT_HTTPHEADER, $headers5);
        curl_setopt($ch5, CURLOPT_ENCODING, 'gzip');

        $weaponTypeStats = "weapontypepvp_bullethit,weapontypepvp_chosen,weapontypepvp_dbno,weapontypepvp_dbnoassists,weapontypepvp_death,weapontypepvp_headshot,weapontypepvp_kills,weapontypepvp_killassists,weapontypepvp_bulletfired";

        $request_urls6 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );

        $request_url6 = $request_urls6[$platform] . "?populations=$profileId&statistics=$weaponTypeStats";
        $headers6 =[
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        $ch6 = curl_init();
        curl_setopt($ch6, CURLOPT_URL, $request_url6);
        curl_setopt($ch6, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch6, CURLOPT_HTTPHEADER, $headers6);
        curl_setopt($ch6, CURLOPT_ENCODING, 'gzip');

        $weaponStats = "weaponpvp_kills,weaponpvp_death,weaponpvp_killassists,weaponpvp_headshot,weaponpvp_bullethit,weaponpvp_bulletfired,weaponpvp_dbno,weaponpvp_dbnoassists,weaponpvp_chosen";

        $request_urls7 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );

        $request_url7 = $request_urls7[$platform] . "?populations=$profileId&statistics=$weaponStats";
        $headers7 =[
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        $ch7 = curl_init();
        curl_setopt($ch7, CURLOPT_URL, $request_url7);
        curl_setopt($ch7, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch7, CURLOPT_HTTPHEADER, $headers7);
        curl_setopt($ch7, CURLOPT_ENCODING, 'gzip');

        $mh = curl_multi_init();

        foreach ($ch2 as $ch2_) {
            curl_multi_add_handle($mh, $ch2_);
        }
        curl_multi_add_handle($mh, $ch3);
        curl_multi_add_handle($mh, $ch4);
        curl_multi_add_handle($mh, $ch5);
        curl_multi_add_handle($mh, $ch6);
        curl_multi_add_handle($mh, $ch7);

        do {
            $status = curl_multi_exec($mh, $active);
            if ($active) {
                curl_multi_select($mh);
            }
        } while ($active && $status == CURLM_OK);

        foreach ($ch2 as $ch2_) {
            curl_multi_remove_handle($mh, $ch2_);
        }
        curl_multi_remove_handle($mh, $ch3);
        curl_multi_remove_handle($mh, $ch4);
        curl_multi_remove_handle($mh, $ch5);
        curl_multi_remove_handle($mh, $ch6);
        curl_multi_remove_handle($mh, $ch7);
        curl_multi_close($mh);

        $result2_1 = json_decode(curl_multi_getcontent($ch2[1]), true);
        $result2_2 = json_decode(curl_multi_getcontent($ch2[2]), true);
        $result2_3 = json_decode(curl_multi_getcontent($ch2[3]), true);
        $result2_4 = json_decode(curl_multi_getcontent($ch2[4]), true);
        $result2_5 = json_decode(curl_multi_getcontent($ch2[5]), true);
        $result2_6 = json_decode(curl_multi_getcontent($ch2[6]), true);
        $result2_7 = json_decode(curl_multi_getcontent($ch2[7]), true);
        $result2_8 = json_decode(curl_multi_getcontent($ch2[8]), true);
        $result2_9 = json_decode(curl_multi_getcontent($ch2[9]), true);
        $result2_10 = json_decode(curl_multi_getcontent($ch2[10]), true);
        $result2_11 = json_decode(curl_multi_getcontent($ch2[11]), true);
        $result2_12 = json_decode(curl_multi_getcontent($ch2[12]), true);
        $result2_13 = json_decode(curl_multi_getcontent($ch2[13]), true);
        $result2_14 = json_decode(curl_multi_getcontent($ch2[14]), true);

        $result3 = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch3)), true);

        $result4 = json_decode(curl_multi_getcontent($ch4), true);

        $result5Raw = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch5)), true);
        $result5['operators']['stats_raw'] = $result5Raw['results'][$profileId];

        $result6Raw = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch6)), true);
        $result6['weapontype']['stats_raw'] = $result6Raw['results'][$profileId];

        $result7Raw = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch7)), true);
        $result7['weapon']['stats_raw'] = $result7Raw['results'][$profileId];

        return array_merge(
            $result1["profiles"][0],
            $result4["player_profiles"][0],
            $result3["results"][$profileId],
            array(
                $result2_1["players"][$profileId],
                $result2_2["players"][$profileId],
                $result2_3["players"][$profileId],
                $result2_4["players"][$profileId],
                $result2_5["players"][$profileId],
                $result2_6["players"][$profileId],
                $result2_7["players"][$profileId],
                $result2_8["players"][$profileId],
                $result2_9["players"][$profileId],
                $result2_10["players"][$profileId],
                $result2_11["players"][$profileId],
                $result2_12["players"][$profileId],
                $result2_13["players"][$profileId],
                $result2_14["players"][$profileId]
            ),
            $result5,
            $result6,
            $result7
        );
    }

///////////////////////////////////////////////////////////////////////////////
    public function getPanelStats($resultSavedUsersA, $resultVotedHackersA, $resultLatestHackers, $stats)
    {
        $resultSavedUsersS = explode(":", $resultSavedUsersA);
        foreach ($resultSavedUsersS as $resultSavedUserD) {
            $resultSavedUsers[] = explode(",", $resultSavedUserD);
        }

        $resultVotedHackersS = explode(":", $resultVotedHackersA);
        foreach ($resultVotedHackersS as $resultVotedHackerD) {
            $resultVotedHackers[] = explode(",", $resultVotedHackerD);
        }

        $resultLatestHackers = explode(":", $resultLatestHackers);

        $uplayTicket = $this->uplayticket();

        $request_urls = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );

        $request_urls3 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6karma/players",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6karma/players",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6karma/players"
        );

        foreach ($resultSavedUsers as $resultSavedUser) {
            $request_url1[$resultSavedUser[0]] = $request_urls[$resultSavedUser[2]] . "?populations=" . $resultSavedUser[1] . "&statistics=$stats";

            $headers1[$resultSavedUser[0]] = [
                "Authorization: " . $uplayTicket,
                "Origin: https://game-rainbow6.ubi.com",
                "Accept-Encoding: deflate, br",
                "Host: public-ubiservices.ubi.com",
                "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
                "Accept: application/json, text/plain, */*",
                "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
                "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
                "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/" . $resultSavedUser[1] . "/multiplayer",
                "Connection: keep-alive"
            ];

            $ch1[$resultSavedUser[0]] = curl_init();
            curl_setopt($ch1[$resultSavedUser[0]], CURLOPT_URL, $request_url1[$resultSavedUser[0]]);
            curl_setopt($ch1[$resultSavedUser[0]], CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch1[$resultSavedUser[0]], CURLOPT_HTTPHEADER, $headers1[$resultSavedUser[0]]);
            curl_setopt($ch1[$resultSavedUser[0]], CURLOPT_ENCODING, 'gzip');

            $savedUsers[] = $resultSavedUser[0];
            $savedUsersPlatform[$resultSavedUser[0]] = $resultSavedUser[2];

            $headers3[$resultSavedUser[0]] =[
                "Authorization: " . $uplayTicket,
                "Origin: https://game-rainbow6.ubi.com",
                "Accept-Encoding: gzip, deflate, br",
                "Host: public-ubiservices.ubi.com",
                "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
                "Accept: application/json, text/plain, */*",
                "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
                "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
                "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/" . $resultSavedUser[1] . "/multiplayer",
                "Connection: keep-alive"
            ];

            $request_url3[$resultSavedUser[0]] = $request_urls3[$resultSavedUser[2]] . "?board_id=pvp_ranked&profile_ids=" . $resultSavedUser[1] . "&region_id=emea&season_id=-1";

            $ch3[$resultSavedUser[0]] = curl_init();
            curl_setopt($ch3[$resultSavedUser[0]], CURLOPT_URL, $request_url3[$resultSavedUser[0]]);
            curl_setopt($ch3[$resultSavedUser[0]], CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch3[$resultSavedUser[0]], CURLOPT_HTTPHEADER, $headers3[$resultSavedUser[0]]);
            curl_setopt($ch3[$resultSavedUser[0]], CURLOPT_ENCODING, 'gzip');
        }

        foreach ($resultVotedHackers as $resultVotedHacker) {
            $request_url2[$resultVotedHacker[0]] = $request_urls[$resultVotedHacker[2]] . "?populations=" . $resultVotedHacker[1] . "&statistics=$stats";

            $headers2[$resultVotedHacker[0]] = [
                "Authorization: " . $uplayTicket,
                "Origin: https://game-rainbow6.ubi.com",
                "Accept-Encoding: deflate, br",
                "Host: public-ubiservices.ubi.com",
                "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
                "Accept: application/json, text/plain, */*",
                "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
                "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
                "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/" . $resultVotedHacker[1] . "/multiplayer",
                "Connection: keep-alive"
            ];

            $ch2[$resultVotedHacker[0]] = curl_init();
            curl_setopt($ch2[$resultVotedHacker[0]], CURLOPT_URL, $request_url2[$resultVotedHacker[0]]);
            curl_setopt($ch2[$resultVotedHacker[0]], CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch2[$resultVotedHacker[0]], CURLOPT_HTTPHEADER, $headers2[$resultVotedHacker[0]]);
            curl_setopt($ch2[$resultVotedHacker[0]], CURLOPT_ENCODING, 'gzip');

            $votedHackers[] = $resultVotedHacker[0];
            $votedHackersPlatform[$resultVotedHacker[0]] = $resultVotedHacker[2];

            $headers4[$resultSavedUser[0]] =[
                "Authorization: " . $uplayTicket,
                "Origin: https://game-rainbow6.ubi.com",
                "Accept-Encoding: gzip, deflate, br",
                "Host: public-ubiservices.ubi.com",
                "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
                "Accept: application/json, text/plain, */*",
                "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
                "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
                "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/" . $resultSavedUser[1] . "/multiplayer",
                "Connection: keep-alive"
            ];

            $request_url4[$resultSavedUser[0]] = $request_urls3[$resultSavedUser[2]] . "?board_id=pvp_ranked&profile_ids=" . $resultSavedUser[1] . "&region_id=emea&season_id=-1";

            $ch4[$resultSavedUser[0]] = curl_init();
            curl_setopt($ch4[$resultSavedUser[0]], CURLOPT_URL, $request_url4[$resultSavedUser[0]]);
            curl_setopt($ch4[$resultSavedUser[0]], CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch4[$resultSavedUser[0]], CURLOPT_HTTPHEADER, $headers4[$resultSavedUser[0]]);
            curl_setopt($ch4[$resultSavedUser[0]], CURLOPT_ENCODING, 'gzip');
        }

        $mh = curl_multi_init();

        foreach ($ch1 as $ch1_) {
            curl_multi_add_handle($mh, $ch1_);
        }
        foreach ($ch2 as $ch2_) {
            curl_multi_add_handle($mh, $ch2_);
        }
        foreach ($ch3 as $ch3_) {
            curl_multi_add_handle($mh, $ch3_);
        }
        foreach ($ch4 as $ch4_) {
            curl_multi_add_handle($mh, $ch4_);
        }

        do {
            $status = curl_multi_exec($mh, $active);
            if ($active) {
                curl_multi_select($mh);
            }
        } while ($active && $status == CURLM_OK);

        foreach ($ch1 as $ch1_) {
            curl_multi_remove_handle($mh, $ch1_);
        }
        foreach ($ch2 as $ch2_) {
            curl_multi_remove_handle($mh, $ch2_);
        }
        foreach ($ch3 as $ch3_) {
            curl_multi_remove_handle($mh, $ch3_);
        }
        foreach ($ch4 as $ch4_) {
            curl_multi_remove_handle($mh, $ch4_);
        }
        curl_multi_close($mh);

        foreach ($savedUsers as $savedUser) {
            $result1[$savedUser] = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch1[$savedUser])), true)["results"];
            $result3[$savedUser] = json_decode(curl_multi_getcontent($ch3[$savedUser]), true);

            $resultId[$savedUser] = key($result1[$savedUser]);
            $result1[$savedUser] = $result1[$savedUser][$resultId[$savedUser]];
            $result1[$savedUser]["playerId"] = $resultId[$savedUser];
            $result1[$savedUser]["platform"] = $savedUsersPlatform[$savedUser];
            $result1[$savedUser]["ranked"] = $result3[$savedUser]["players"][$resultId[$savedUser]];
        }

        foreach ($votedHackers as $votedHacker) {
            $result2[$votedHacker] = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch2[$votedHacker])), true)["results"];
            $result4[$votedHacker] = json_decode(curl_multi_getcontent($ch4[$votedHacker]), true);

            $resultId[$votedHacker] = key($result2[$votedHacker]);
            $result2[$votedHacker] = $result2[$votedHacker][$resultId[$votedHacker]];
            $result2[$votedHacker]["playerId"] = $resultId[$votedHacker];
            $result2[$votedHacker]["platform"] = $votedHackersPlatform[$votedHacker];
            $result2[$votedHacker]["ranked"] = $result4[$savedUser]["players"][$resultId[$votedHacker]];
        }

        return array(
            "savedUsers" => $result1,
            "votedHackers" => $result2
        );
    }

///////////////////////////////////////////////////////////////////////////////
    public function getAPIStats($playerName, $platform, $stats)
    {
        $uplayTicket = $this->uplayticket();

        $input = urlencode($playerName);
        $request_url1 = "https://public-ubiservices.ubi.com/v2/profiles?nameOnPlatform=$input&platformType=$platform";

        $request_header_ubiappid1 = "39baebad-39e5-4552-8c25-2c9b919064e2";
        $request_header_ubisessionid1 = "a4df2e5c-7fee-41ff-afe5-9d79e68e8048";
        $headers1 =[
            "Accept: application/json, text/plain, */*",
            "ubi-appid: " . $request_header_ubiappid1,
            "ubi-sessionid: " . $request_header_ubisessionid1,
            "authorization: " . $uplayTicket,
            "Referer: https://club.ubisoft.com/en-US/friends",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: gzip, deflate, br",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Host: public-ubiservices.ubi.com",
            "Pragma: no-cache",
            "Cache-Control: no-cache",
            "Connection: keep-alive"
        ];
        $ch1 = curl_init();
        curl_setopt($ch1, CURLOPT_URL, $request_url1);
        curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch1, CURLOPT_ENCODING, 'gzip');
        curl_setopt($ch1, CURLOPT_HTTPHEADER, $headers1);
        $result1 = json_decode(curl_exec($ch1), true);
        curl_close($ch1);

        $profileId = $result1["profiles"][0]["profileId"];

        $request_urls2 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6karma/players",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6karma/players",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6karma/players"
        );
        $request_url2 = $request_urls2[$platform] . "?board_id=pvp_ranked&profile_ids=$profileId&region_id=emea&season_id=-1";

        $headers2 =[
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: gzip, deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        $ch2 = curl_init();
        curl_setopt($ch2, CURLOPT_URL, $request_url2);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers2);
        curl_setopt($ch2, CURLOPT_ENCODING, 'gzip');

        $request_urls3 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );
        $request_url3 = $request_urls3[$platform] . "?populations=$profileId&statistics=$stats";

        $headers3 = [
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        $ch3 = curl_init();
        curl_setopt($ch3, CURLOPT_URL, $request_url3);
        curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch3, CURLOPT_HTTPHEADER, $headers3);
        curl_setopt($ch3, CURLOPT_ENCODING, 'gzip');

        $request_urls4 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6playerprofile/playerprofile/progressions",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6playerprofile/playerprofile/progressions",
            "psn" => "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6playerprofile/playerprofile/progressions"
        );
        $request_url4 = $request_urls4[$platform] . "?profile_ids=$profileId";

        $headers4 =[
            "Authorization: " . $uplayTicket,
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"
        ];

        $ch4 = curl_init();
        curl_setopt($ch4, CURLOPT_URL, $request_url4);
        curl_setopt($ch4, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch4, CURLOPT_HTTPHEADER, $headers4);
        curl_setopt($ch4, CURLOPT_ENCODING, 'gzip');

        $mh = curl_multi_init();

        curl_multi_add_handle($mh, $ch2);
        curl_multi_add_handle($mh, $ch3);
        curl_multi_add_handle($mh, $ch4);

        do {
            $status = curl_multi_exec($mh, $active);
            if ($active) {
                curl_multi_select($mh);
            }
        } while ($active && $status == CURLM_OK);

        curl_multi_remove_handle($mh, $ch2);
        curl_multi_remove_handle($mh, $ch3);
        curl_multi_remove_handle($mh, $ch4);
        curl_multi_close($mh);

        $result2 = json_decode(curl_multi_getcontent($ch2), true);

        $result3 = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch3)), true);

        $result4 = json_decode(curl_multi_getcontent($ch4), true);

        return array_merge(
            $result1["profiles"][0],
            $result2["players"][$profileId],
            $result3["results"][$profileId],
            $result4["player_profiles"][0]
        );
    }
}
