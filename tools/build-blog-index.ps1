<#
  build-blog-index.ps1
  Erzeugt site/blog-index.json automatisch aus der Blog-Uebersicht (site/news.html).

  Fuer eine statische Seite ersetzt diese Index-Datei die "Datenbank":
  - Kategorien + Anzahl der Beitraege je Kategorie
  - Beitraege (neueste zuerst) mit Titel, Kategorie, Datum und Vorschaubild

  Quelle der Wahrheit ist site/news.html (die gepflegte Beitragsliste, neueste zuerst).
  Das exakte Veroeffentlichungsdatum wird aus dem JSON-LD (datePublished) jeder
  Artikeldatei gelesen.

  AUSFUEHREN nach jeder Aenderung an den Beitraegen:
      pwsh -File tools/build-blog-index.ps1     (oder: powershell -File ...)
#>

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$site = Join-Path $root 'site'
$newsFile = Join-Path $site 'news.html'
$outFile  = Join-Path $site 'blog-index.json'

if (-not (Test-Path $newsFile)) { throw "news.html nicht gefunden: $newsFile" }

$html = [System.IO.File]::ReadAllText($newsFile, [System.Text.Encoding]::UTF8)

# Jede Beitragskarte aus der Uebersicht auslesen (Reihenfolge = neueste zuerst)
$cardRegex = '(?s)<a class="news-card" href="(?<url>/[^"]+)">.*?<img src="(?<img>[^"]+)"[^>]*?>.*?<span class="news-cat">(?<cat>[^<]*)</span>\s*<h3>(?<title>.*?)</h3>'
$matches = [regex]::Matches($html, $cardRegex)

if ($matches.Count -eq 0) { throw "Keine Beitragskarten in news.html gefunden. Regex pruefen." }

function Decode([string]$s) {
  $s = [regex]::Replace($s, '<[^>]+>', '')          # evtl. Inline-Tags entfernen
  return [System.Net.WebUtility]::HtmlDecode($s).Trim()
}

$posts = New-Object System.Collections.Generic.List[object]
$seen  = @{}

foreach ($m in $matches) {
  $url = $m.Groups['url'].Value
  if ($seen.ContainsKey($url)) { continue }   # Duplikate (falls eine Karte doppelt vorkommt) ueberspringen
  $seen[$url] = $true

  $cat   = Decode $m.Groups['cat'].Value
  $title = Decode $m.Groups['title'].Value
  $img   = $m.Groups['img'].Value

  # Exaktes Datum aus der Artikeldatei (JSON-LD datePublished)
  $slug = $url.TrimStart('/')
  $articlePath = Join-Path $site ($slug + '.html')
  $date = ''
  if (Test-Path $articlePath) {
    $a = [System.IO.File]::ReadAllText($articlePath, [System.Text.Encoding]::UTF8)
    $dm = [regex]::Match($a, '"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})')
    if ($dm.Success) { $date = $dm.Groups[1].Value }
  }

  $posts.Add([pscustomobject]@{
    url      = $url
    title    = $title
    category = $cat
    image    = $img
    date     = $date
  })
}

# Nach Datum absteigend sortieren (leere Daten ans Ende), stabile Reihenfolge sonst wie in news.html
$idx = 0
$ordered = $posts | ForEach-Object { $_ | Add-Member -NotePropertyName _i -NotePropertyValue ($idx++) -PassThru } |
  Sort-Object @{Expression={ if ($_.date) { $_.date } else { '0000-00-00' } }; Descending=$true}, @{Expression='_i';Descending=$false}

# Kategorien zaehlen
$catCounts = @{}
foreach ($p in $ordered) {
  if (-not $p.category) { continue }
  if ($catCounts.ContainsKey($p.category)) { $catCounts[$p.category]++ } else { $catCounts[$p.category] = 1 }
}
$categories = $catCounts.GetEnumerator() |
  Sort-Object @{Expression='Value';Descending=$true}, @{Expression='Name';Descending=$false} |
  ForEach-Object { [pscustomobject]@{ name = $_.Key; count = $_.Value } }

$postsOut = $ordered | ForEach-Object { [pscustomobject]@{ url=$_.url; title=$_.title; category=$_.category; image=$_.image; date=$_.date } }

$data = [pscustomobject]@{
  generatedAt = (Get-Date -Format 'yyyy-MM-dd')
  total       = $postsOut.Count
  categories  = @($categories)
  posts       = @($postsOut)
}

$json = $data | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($outFile, $json, (New-Object System.Text.UTF8Encoding($false)))

Write-Host ("blog-index.json geschrieben: {0} Beitraege, {1} Kategorien" -f $postsOut.Count, $categories.Count)
$categories | ForEach-Object { Write-Host ("  - {0}: {1}" -f $_.name, $_.count) }
