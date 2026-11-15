# Packages a scene .jsx into a standalone page, using the Sleigh Ride bundle as the base
# (same React / Babel / dc-runtime / animations engine), swapping in the scene code,
# scene list, component name and title.
param(
  [string]$Repo, [string]$Scenes, [string]$Title, [string]$Component, [string]$Jsx,
  [string]$SceneList, [string]$Thumb
)
$ErrorActionPreference = 'Stop'
$base = [IO.File]::ReadAllText((Join-Path $Repo 'Pixel Sleigh Ride (standalone).html'))
$OLD = '6ac92a0a-f80f-44ab-8af2-397792c737ea'
$new = [guid]::NewGuid().ToString()

$code = [IO.File]::ReadAllText((Join-Path $Scenes 'common.jsx')) + "`n" + [IO.File]::ReadAllText((Join-Path $Scenes $Jsx))
$raw = [Text.Encoding]::UTF8.GetBytes($code)
$ms = New-Object IO.MemoryStream
$gz = New-Object IO.Compression.GZipStream($ms, [IO.Compression.CompressionMode]::Compress)
$gz.Write($raw, 0, $raw.Length); $gz.Close()
$b64 = [Convert]::ToBase64String($ms.ToArray())

# Manifest entry for the scene file
$start = $base.IndexOf('"' + $OLD + '":{')
$dataAt = $base.IndexOf('"data":"', $start) + 8
$end = $base.IndexOf('"}', $dataAt) + 2
if ($start -lt 0 -or $end -lt $dataAt) { throw 'scene entry not found' }
$entry = '"' + $new + '":{"mime":"application/javascript","compressed":true,"data":"' + $b64 + '"}'
$out = $base.Substring(0, $start) + $entry + $base.Substring($end)

# Template
$m = [regex]::Match($out, '(<script type="__bundler/template">\s*)(.*?)(\s*</script>)', 'Singleline')
$tpl = ConvertFrom-Json $m.Groups[2].Value
$tpl = [regex]::Replace($tpl, "window\.OM_SCENES = '.*?';", { param($x) "window.OM_SCENES = '" + $SceneList.Replace("'", "\'") + "';" })
$tpl = $tpl.Replace('SleighApp', $Component).Replace($OLD + '#/sleigh.jsx', $new + '#/' + $Jsx)
if ($tpl -notmatch [regex]::Escape($Component) -or $tpl -notmatch $new) { throw 'template patch failed' }
$enc = ConvertTo-Json $tpl -Compress
$out = $out.Substring(0, $m.Groups[2].Index) + $enc + $out.Substring($m.Groups[2].Index + $m.Groups[2].Length)

# Loading thumbnail + title
$t0 = $out.IndexOf('<div id="__bundler_thumbnail">')
$t1 = $out.IndexOf('</svg></div>', $t0) + 12
$out = $out.Substring(0, $t0) + '<div id="__bundler_thumbnail">' + $Thumb + '</div>' + $out.Substring($t1)
$out = $out.Replace('<title>Bundled Page</title>', '<title>' + $Title + '</title>')

$dest = Join-Path $Repo ($Title + ' (standalone).html')
[IO.File]::WriteAllText($dest, $out, (New-Object Text.UTF8Encoding($false)))
"$dest  $([math]::Round($out.Length / 1KB)) KB  scene=$new"
