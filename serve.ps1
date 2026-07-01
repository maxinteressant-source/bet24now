# Kleiner statischer Webserver fuer die Bet24Now-Seite.
# Start:  powershell -ExecutionPolicy Bypass -File serve.ps1
# Danach im Browser oeffnen: http://localhost:8000
# Stoppen: in diesem Fenster Strg+C druecken.

param([int]$Port = 8000)
$port = $Port
$root = Join-Path $PSScriptRoot 'site'

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.xml'  = 'application/xml; charset=utf-8'
  '.txt'  = 'text/plain; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.gif'  = 'image/gif'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.webp' = 'image/webp'
  '.woff' = 'font/woff'
  '.woff2'= 'font/woff2'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host ""
Write-Host "  Bet24Now laeuft:  http://localhost:$port" -ForegroundColor Green
Write-Host "  Ordner:           $root"
Write-Host "  Stoppen mit Strg+C"
Write-Host ""

try {
  while ($listener.IsListening) {
    $context  = $listener.GetContext()
    $request  = $context.Request
    $response = $context.Response

    $rel = [Uri]::UnescapeDataString($request.Url.AbsolutePath).TrimStart('/')
    if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
    $path = Join-Path $root $rel
    if (Test-Path $path -PathType Container) { $path = Join-Path $path 'index.html' }

    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ct  = $mime[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $response.ContentType = $ct
      $response.ContentLength64 = $bytes.Length
      if ($request.HttpMethod -ne 'HEAD') {
        try { $response.OutputStream.Write($bytes, 0, $bytes.Length) } catch {}
      }
      Write-Host ("200  /{0}" -f $rel)
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - nicht gefunden: /$rel")
      $response.OutputStream.Write($msg, 0, $msg.Length)
      Write-Host ("404  /{0}" -f $rel) -ForegroundColor Yellow
    }
    $response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
}
