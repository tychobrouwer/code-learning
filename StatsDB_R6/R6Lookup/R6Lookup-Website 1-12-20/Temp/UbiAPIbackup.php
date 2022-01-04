<?php

include_once("config.php");

class UbiAPI
{
    private $b64authcreds;
    public $http_useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36";

    public function __construct($email, $password)
    {
        $this->b64authcreds=$this->generateB64Creds($email.":".$password);
    }

    public function getErrorMessage()
    {
        $ticket = json_decode($this->saveTicket(false), true);
        if (isset($ticket["errorCode"])) {
            return $ticket;
        }
        return false;
    }

    public function generateB64Creds($emailandpassword)
    {
        return base64_encode($emailandpassword);
    }

    public function parseHeaders($headers)
    {
        $head = array();
        foreach ($headers as $k => $v) {
            $t = explode(':', $v, 2);
            if (isset($t[1])) {
                $head[ trim($t[0])] = trim($t[1]);
            } else {
                $head[] = $v;
                if (preg_match("#HTTP/[0-9\.]+\s+([0-9]+)#", $v, $out)) {
                    $head['reponse_code'] = intval($out[1]);
                }
            }
        }
        return $head;
    }

    public function login()
    {
        $request_url = "https://public-ubiservices.ubi.com/v3/profiles/sessions";
        #$request_header_ubiappid="314d4fef-e568-454a-ae06-43e3bece12a6";
        $request_header_ubiappid="39baebad-39e5-4552-8c25-2c9b919064e2";
        $request_header_authbasic=$this->b64authcreds;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $request_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, '{"rememberMe":true}');
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
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
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
        return array("error"=>false,
                     "content"=>"Ticket Updated? (1==true):".$test_fileUpdated);
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

/////////////////////////////////////////////////////////////////////////////////////////////////

    private function getStatsRaw($users, $stats, $platform)
    {
        $user = explode(",", $users)[0];
        $request_urls = array("uplay" =>
                              "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics"
                              ,"xbl" =>
                              "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics"
                              ,"psn" =>
                              "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
                             );

        $request_url = $request_urls[$platform] . "?populations=$users&statistics=$stats";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $request_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $headers =[
            "Authorization: ".$this->uplayticket(),
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$user/multiplayer",
            "Connection: keep-alive"];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $ubioutput = curl_exec($ch);
        curl_close($ch);
        return str_replace(":infinite", "", $ubioutput);
    }

///////////////////////////////////////////////////////////////////////////////

    public function getStatsIndex($mode, $input, $platform, $season, $region, $stats)
    {
        $prefixUrl1 = "https://api-ubiservices.ubi.com/v2/profiles?";
        if ($mode == 1 || $mode == "bynick") {
            $input = urlencode($input);
            $request_url1 = $prefixUrl1."nameOnPlatform=".$input."&platformType=$platform";
        }
        if ($mode == 2 || $mode == "byid") {
            $request_url1 = $prefixUrl1."profileId=".$input;
        }
        $request_header_ubiappid1 = "314d4fef-e568-454a-ae06-43e3bece12a6";
        $request_header_ubisessionid1 = "a651a618-bead-4732-b929-4a9488a21d27";
        $ch1 = curl_init();
        curl_setopt($ch1, CURLOPT_URL, $request_url1);
        curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
        $headers1 =[
            "Accept: */*",
            "ubi-appid: ".$request_header_ubiappid1,
            "ubi-sessionid: ".$request_header_ubisessionid1,
            "authorization: ".$this->uplayticket(),
            "Referer: https://club.ubisoft.com/en-US/friends",
            "Accept-Language: en-US",
            "Origin: https://club.ubisoft.com",
            "Accept-Encoding: deflate, br",
            "User-Agent: ".$this->http_useragent,
            "Host: api-ubiservices.ubi.com",
            "Cache-Control: no-cache"];
        curl_setopt($ch1, CURLOPT_HTTPHEADER, $headers1);
        $result1 = json_decode(curl_exec($ch1), true);
        curl_close($ch1);

        $profileId = $result1["profiles"][0]["profileId"];

        $request_urls2 = array(
            "uplay" =>
            "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6karma/players"
            ,"xbl" =>
            "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6karma/players"
            ,"psn" =>
            "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6karma/players"
        );
        $headers2 =[
            "Authorization: ".$this->uplayticket(),
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
        curl_setopt($ch2, CURLOPT_ENCODING, '');

        $request_urls3 = array(
            "uplay" =>
            "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" =>
            "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" =>
            "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );

        $request_url3 = $request_urls3[$platform] . "?populations=$profileId&statistics=$stats";

        $headers3 = [
            "Authorization: ".$this->uplayticket(),
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
        curl_setopt($ch3, CURLOPT_ENCODING, '');

        $request_urls4 = array(
            "uplay" =>
            "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6playerprofile/playerprofile/progressions",
            "xbl" =>
            "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6playerprofile/playerprofile/progressions",
            "psn" =>
            "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6playerprofile/playerprofile/progressions"
        );
        $headers4 =[
            "Authorization: ".$this->uplayticket(),
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
        curl_setopt($ch4, CURLOPT_ENCODING, '');

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
        $prefixUrl1 = "https://api-ubiservices.ubi.com/v2/profiles?";
        if ($mode == 1 || $mode == "bynick") {
            $input = urlencode($input);
            $request_url1 = $prefixUrl1."nameOnPlatform=".$input."&platformType=$platform";
        }
        if ($mode == 2 || $mode == "byid") {
            $request_url1 = $prefixUrl1."profileId=".$input;
        }
        $request_header_ubiappid1 = "314d4fef-e568-454a-ae06-43e3bece12a6";
        $request_header_ubisessionid1 = "a651a618-bead-4732-b929-4a9488a21d27";
        $ch1 = curl_init();
        curl_setopt($ch1, CURLOPT_URL, $request_url1);
        curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
        $headers1 =[
            "Accept: */*",
            "ubi-appid: ".$request_header_ubiappid1,
            "ubi-sessionid: ".$request_header_ubisessionid1,
            "authorization: ".$this->uplayticket(),
            "Referer: https://club.ubisoft.com/en-US/friends",
            "Accept-Language: en-US",
            "Origin: https://club.ubisoft.com",
            "Accept-Encoding: deflate, br",
            "User-Agent: ".$this->http_useragent,
            "Host: api-ubiservices.ubi.com",
            "Cache-Control: no-cache"];
        curl_setopt($ch1, CURLOPT_HTTPHEADER, $headers1);
        $result1 = json_decode(curl_exec($ch1), true);
        curl_close($ch1);

        $profileId = $result1["profiles"][0]["profileId"];

        $seasons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $ch2 = array();

        $request_urls2 = array(
            "uplay" =>
            "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6karma/players"
            ,"xbl" =>
            "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6karma/players"
            ,"psn" =>
            "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6karma/players"
        );
        $headers2 =[
            "Authorization: ".$this->uplayticket(),
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
            curl_setopt($ch2[$season], CURLOPT_ENCODING, '');
        }

        $request_urls3 = array(
            "uplay" =>
            "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" =>
            "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" =>
            "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );

        $request_url3 = $request_urls3[$platform] . "?populations=$profileId&statistics=$stats";

        $headers3 = [
            "Authorization: ".$this->uplayticket(),
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
        curl_setopt($ch3, CURLOPT_ENCODING, '');

        $request_urls4 = array(
            "uplay" =>
            "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6playerprofile/playerprofile/progressions",
            "xbl" =>
            "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6playerprofile/playerprofile/progressions",
            "psn" =>
            "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6playerprofile/playerprofile/progressions"
        );
        $headers4 =[
            "Authorization: ".$this->uplayticket(),
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
        curl_setopt($ch4, CURLOPT_ENCODING, '');

        $operatorStats = "operatorpvp_smoke_poisongaskill,operatorpvp_timeplayed,operatorpvp_roundwon,operatorpvp_roundlost,operatorpvp_kills,operatorpvp_death,operatorpvp_mute_gadgetjammed,operatorpvp_sledge_hammerhole,operatorpvp_thatcher_gadgetdestroywithemp,operatorpvp_castle_kevlarbarricadedeployed,operatorpvp_ash_bonfirewallbreached,operatorpvp_pulse_heartbeatspot,operatorpvp_thermite_reinforcementbreached,operatorpvp_doc_teammaterevive,operatorpvp_rook_armortakenteammate,operatorpvp_twitch_gadgetdestroybyshockdrone,operatorpvp_montagne_shieldblockdamage,operatorpvp_glaz_sniperkill,operatorpvp_fuze_clusterchargekill,operatorpvp_kapkan_boobytrapkill,operatorpvp_tachanka_turretkill,operatorpvp_blitz_flashedenemy,operatorpvp_iq_gadgetspotbyef,operatorpvp_jager_gadgetdestroybycatcher,operatorpvp_bandit_batterykill,operatorpvp_buck_kill,operatorpvp_frost_dbno,operatorpvp_blackbeard_gunshieldblockdamage,operatorpvp_valkyrie_camdeployed,operatorpvp_capitao_lethaldartkills,operatorpvp_caveira_interrogations,operatorpvp_hibana_detonate_projectile,operatorpvp_echo_enemy_sonicburst_affected,operatorpvp_cazador_assist_kill,operatorpvp_black_mirror_gadget_deployed,operatorpvp_dazzler_gadget_detonate,operatorpvp_caltrop_enemy_affected,operatorpvp_concussionmine_detonate,operatorpvp_concussiongrenade_detonate,operatorpvp_phoneshacked,operatorpvp_attackerdrone_diminishedrealitymode,operatorpvp_tagger_tagdevice_spot,operatorpvp_rush_adrenalinerush,operatorpvp_barrage_killswithturret,operatorpvp_deceiver_revealedattackers,operatorpvp_clash_sloweddown,operatorpvp_maverick_wallbreached,operatorpvp_Nomad_Assist,operatorpvp_Kaid_Electroclaw_Hatches,operatorpvp_totalxp,operatorpvp_dbno,operatorpvp_meleekills,operatorpvp_headshot,operatorpvp_amaru_distancereeled,operatorpve_clash_sloweddown,operatorpvp_goyo_volcandetonate,operatorpvp_gridlock_traxdeployed,operatorpvp_kaid_electroclawelectrify,operatorpvp_kali_gadgetdestroywithexplosivelance,operatorpvp_mozzie_droneshacked,operatorpvp_nokk_observationtooldeceived,operatorpvp_nomad_airjabdetonate,operatorpvp_oryx_killsafterdash,operatorpvp_wamai_gadgetdestroybymagnet,operatorpvp_warden_killswithglasses";
        $request_urls5 = array(
            "uplay" => "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl" => "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn" =>"https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        );

        $request_url5 = $request_urls5[$platform] . "?populations=$profileId&statistics=$operatorStats";
        $headers5 =[
            "Authorization: ".$this->uplayticket(),
            "Origin: https://game-rainbow6.ubi.com",
            "Accept-Encoding: deflate, br",
            "Host: public-ubiservices.ubi.com",
            "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
            "Accept: application/json, text/plain, */*",
            "Ubi-AppId: 39baebad-39e5-4552-8c25-2c9b919064e2",
            "Ubi-SessionId: a4df2e5c-7fee-41ff-afe5-9d79e68e8048",
            "Referer: https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/$profileId/multiplayer",
            "Connection: keep-alive"];

        $ch5 = curl_init();
        curl_setopt($ch5, CURLOPT_URL, $request_url5);
        curl_setopt($ch5, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch5, CURLOPT_HTTPHEADER, $headers5);
        curl_setopt($ch5, CURLOPT_ENCODING, '');

        $mh = curl_multi_init();

        foreach ($ch2 as $ch2_) {
            curl_multi_add_handle($mh, $ch2_);
        }
        curl_multi_add_handle($mh, $ch3);
        curl_multi_add_handle($mh, $ch4);
        curl_multi_add_handle($mh, $ch5);

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

        $result3 = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch3)), true);

        $result4 = json_decode(curl_multi_getcontent($ch4), true);

        $result5Raw = json_decode(str_replace(":infinite", "", curl_multi_getcontent($ch5)), true);
        $result5['operators']['stats_raw'] = $result5Raw['results'][$profileId];


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
                $result2_12["players"][$profileId]
            ),
            $result5
        );
    }
}
