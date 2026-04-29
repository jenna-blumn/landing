[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$BOT_TOKEN = $env:TELEGRAM_BOT_TOKEN
$CHAT_ID = $env:TELEGRAM_CHAT_ID
$GEMINI_API_KEY = $env:GEMINI_API_KEY

if (-not $BOT_TOKEN -or -not $CHAT_ID -or -not $GEMINI_API_KEY) {
    Write-Host "ERROR: Set TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, and GEMINI_API_KEY" -ForegroundColor Red
    exit 1
}

$BASE_URL = "https://api.telegram.org/bot$BOT_TOKEN"
# Using Google Gemini API endpoint
$GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY"

$offset = 0
$PROJECT_DIR = (Get-Location).Path

# Store conversation history to simulate interactive chat like Claude `--continue`
$global:conversationHistory = @()

Write-Host "=== Telegram-Gemini Bot ===" -ForegroundColor Cyan

function Send-Telegram($text) {
    # Escape characters safely for JSON
    $escaped = $text.Replace('\', '\\').Replace('"', '\"').Replace("`r`n", '\n').Replace("`n", '\n').Replace("`r", '\n')
    $json = "{""chat_id"":""$CHAT_ID"",""text"":""$escaped""}"
    $tempFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tempFile, $json, (New-Object System.Text.UTF8Encoding $false))
    try {
        $out = & curl.exe -s -X POST "$BASE_URL/sendMessage" -H "Content-Type: application/json; charset=utf-8" -d "@$tempFile" 2>&1
        Write-Host "  [sent] $($text.Substring(0, [Math]::Min(50, $text.Length)))..." -ForegroundColor DarkGray
    } catch {
        Write-Host "  [send failed]" -ForegroundColor Red
    }
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

function Send-LongMessage($text) {
    if (-not $text) { return }
    if ($text.Length -le 4000) {
        Send-Telegram $text
        return
    }
    $remaining = $text
    $page = 1
    while ($remaining.Length -gt 0) {
        $len = [Math]::Min(4000, $remaining.Length)
        $chunk = $remaining.Substring(0, $len)
        $remaining = $remaining.Substring($len)
        Send-Telegram "[$page] $chunk"
        $page++
        Start-Sleep -Milliseconds 500
    }
}

function Call-Gemini($userText) {
    # Add user message to history
    $userMsg = @{
        role = "user"
        parts = @( @{ text = $userText } )
    }
    $global:conversationHistory += $userMsg

    # Create payload
    $payloadObj = @{
        contents = $global:conversationHistory
    }
    $payloadJson = $payloadObj | ConvertTo-Json -Depth 10 -Compress
    
    $tempFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tempFile, $payloadJson, (New-Object System.Text.UTF8Encoding $false))

    try {
        # Make request to Gemini API
        $responseJson = & curl.exe -s -X POST $GEMINI_URL -H "Content-Type: application/json" -d "@$tempFile"
        $responseObj = $responseJson | ConvertFrom-Json
        
        # Parse output
        if ($responseObj.candidates -and $responseObj.candidates.Count -gt 0) {
            $geminiText = $responseObj.candidates[0].content.parts[0].text
            
            # Add Gemini response to history
            $modelMsg = @{
                role = "model"
                parts = @( @{ text = $geminiText } )
            }
            $global:conversationHistory += $modelMsg
            
            return $geminiText
        } else {
            # Usually blocked for safety ratings or API limits
            Write-Host "Gemini API Error / No Content:`n$responseJson" -ForegroundColor Red
            # Remove bad user message from history
            $global:conversationHistory = $global:conversationHistory[0..($global:conversationHistory.Length-2)]
            return "오류가 발생했습니다 (API 응답 에러). 다시 시도해주세요."
        }
    } catch {
        # Remove bad user message from history
        $global:conversationHistory = $global:conversationHistory[0..($global:conversationHistory.Length-2)]
        return "호출 실패. 네트워크나 API Key를 확인하세요.`n$($_.Exception.Message)"
    } finally {
        Remove-Item $tempFile -ErrorAction SilentlyContinue
    }
}

Write-Host "Sending startup message..." -ForegroundColor Yellow
Send-Telegram "Gemini Bot Started 🌟`n제미나이 봇이 켜졌습니다!`n`n[명령어]`n/status - 봇 상태 확인`n/clear - 대화 내용 초기화`n/stop - 봇 끄기`n그 외 - 제미나이와 대화"

Write-Host "Ready! Waiting for Telegram messages..." -ForegroundColor Green

while ($true) {
    try {
        $uri = "$BASE_URL/getUpdates?offset=$offset&timeout=30"
        $response = Invoke-RestMethod -Uri $uri -Method Get -TimeoutSec 35

        if ($response.ok -and $response.result.Count -gt 0) {
            foreach ($update in $response.result) {
                $offset = $update.update_id + 1
                $msg = $update.message
                if ($msg.chat.id -ne [int64]$CHAT_ID) { continue }
                $text = $msg.text
                if (-not $text) { continue }

                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] USER >> $text" -ForegroundColor Yellow

                if ($text -eq "/status") {
                    Send-Telegram "Gemini Bot은 쌩쌩하게 작동 중입니다! 🚀`n경로: $PROJECT_DIR"
                    continue
                }
                if ($text -eq "/stop") {
                    Send-Telegram "Gemini Bot을 종료합니다. 👋"
                    Write-Host "Stopping by user request." -ForegroundColor Magenta
                    exit 0
                }
                if ($text -eq "/start") {
                    Send-Telegram "Gemini Bot 준비 완료! 무엇이든 물어보세요."
                    continue
                }
                if ($text -eq "/clear") {
                    $global:conversationHistory = @()
                    Send-Telegram "대화 기록이 깔끔하게 초기화되었습니다. 🧹"
                    continue
                }

                # 대화 시작
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Requesting Gemini API..." -ForegroundColor Cyan
                # Send-Telegram "생각 중... 🤔" # 무음 처리

                $result = Call-Gemini $text
                
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Done" -ForegroundColor Green
                Send-LongMessage $result
            }
        }
    } catch {
        Write-Host "Connection error, retrying..." -ForegroundColor Red
        Start-Sleep -Seconds 2
    }
}
