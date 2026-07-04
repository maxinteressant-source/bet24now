# Kleiner nebenläufiger statischer Webserver für die Bet24Now-Seite.
# Start:  powershell -ExecutionPolicy Bypass -File serve.ps1 [Port]
# Öffnen: http://localhost:8000   ·   Stoppen: Strg+C
param([int]$Port = 8000)
$root = Join-Path $PSScriptRoot 'site'

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host ""
Write-Host "  Bet24Now laeuft:  http://localhost:$Port" -ForegroundColor Green
Write-Host "  Ordner:           $root"
Write-Host "  Stoppen mit Strg+C"
Write-Host ""

$handler = {
  param($context, $root)
  $mime = @{
    '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
    '.xml'='application/xml; charset=utf-8'; '.txt'='text/plain; charset=utf-8'; '.json'='application/json; charset=utf-8';
    '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.gif'='image/gif'; '.svg'='image/svg+xml';
    '.ico'='image/x-icon'; '.webp'='image/webp'; '.woff'='font/woff'; '.woff2'='font/woff2'
  }
  $request = $context.Request
  $response = $context.Response
  try {
    $rel = [Uri]::UnescapeDataString($request.Url.AbsolutePath).TrimStart('/')
    if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
    $path = Join-Path $root $rel
    if (Test-Path $path -PathType Container) { $path = Join-Path $path 'index.html' }
    $response.KeepAlive = $false
    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ct = $mime[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $response.ContentType = $ct
      $response.ContentLength64 = $bytes.Length
      if ($request.HttpMethod -ne 'HEAD') { $response.OutputStream.Write($bytes, 0, $bytes.Length) }
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - nicht gefunden: /$rel")
      $response.ContentLength64 = $msg.Length
      if ($request.HttpMethod -ne 'HEAD') { $response.OutputStream.Write($msg, 0, $msg.Length) }
    }
  } catch {} finally { try { $response.OutputStream.Close() } catch {} }
}

$pool = [runspacefactory]::CreateRunspacePool(1, 12)
$pool.Open()

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $ps = [powershell]::Create()
    $ps.RunspacePool = $pool
    [void]$ps.AddScript($handler).AddArgument($context).AddArgument($root)
    [void]$ps.BeginInvoke()
  }
} finally {
  $listener.Stop(); $pool.Close()
}
