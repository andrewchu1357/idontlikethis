# Rebuilds the five custom "Pixel ... (standalone).html" pages from scenes\*.jsx.
#   powershell -ExecutionPolicy Bypass -File _animations\build-all.ps1
#   powershell -ExecutionPolicy Bypass -File _animations\build-all.ps1 -Only train.jsx
# Each page is the Sleigh Ride bundle with its scene code swapped for
# scenes\common.jsx + the scene file, so "Pixel Sleigh Ride (standalone).html"
# must stay in the repo root.
param([string[]]$Only)
$s = Split-Path $MyInvocation.MyCommand.Path
$Repo = Split-Path $s
$thumb = '<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="80" fill="#141d4a"></rect><rect y="64" width="120" height="16" fill="#dfe7f5"></rect></svg>'
$melt = '{"name":"Melt","dur":7,"desc":"Pixels drift away top to bottom, ending on the empty sky the loop starts from"}'
$defs = @(
  @{ Title = 'Pixel Gingerbread'; Component = 'GingerbreadApp'; Jsx = 'gingerbread.jsx'; Scenes = '[{"name":"Ground","dur":3,"desc":"Snow, hills, pines and stars build up"},{"name":"House","dur":7,"desc":"A gingerbread house builds from walls to iced roof"},{"name":"Candy","dur":4.5,"desc":"Lollipops, candy canes, gumdrops and a candy path"},{"name":"Friends","dur":5,"desc":"Three gingerbread friends build in"},{"name":"Celebrate","dur":8,"desc":"Gumdrops twinkle, windows glow, the friends hop, snow falls"},' + $melt + ']' },
  @{ Title = 'Pixel Skating Pond'; Component = 'SkatingApp'; Jsx = 'skating.jsx'; Scenes = '[{"name":"Ground","dur":3,"desc":"Snow, hills, a crescent moon and stars build up"},{"name":"Pond","dur":4,"desc":"The frozen pond spreads out from its center"},{"name":"Park","dur":6,"desc":"Lamp posts, a string of lights, a bench and lit pines"},{"name":"Skaters","dur":5,"desc":"Two skaters and a kid build in on the ice"},{"name":"Celebrate","dur":8.5,"desc":"Skaters glide back and forth, lamps glow, lights twinkle, snow falls"},' + $melt + ']' },
  @{ Title = 'Pixel Carolers'; Component = 'CarolersApp'; Jsx = 'carolers.jsx'; Scenes = '[{"name":"Ground","dur":3,"desc":"Snow, stars and a crescent moon build up"},{"name":"Street","dur":7,"desc":"Townhouses, a shop window, wreaths and a street lamp build in"},{"name":"Carolers","dur":6,"desc":"Four carolers with song books build in"},{"name":"Celebrate","dur":9,"desc":"Music notes float up, the carolers sway, windows flicker, snow falls"},' + $melt + ']' },
  @{ Title = 'Pixel Rooftop'; Component = 'RooftopApp'; Jsx = 'rooftop.jsx'; Scenes = '[{"name":"Ground","dur":3.5,"desc":"A full moon, stars and the sleeping town build up"},{"name":"Roof","dur":6,"desc":"A snowy rooftop and its chimney build in"},{"name":"Santa","dur":4.5,"desc":"Santa appears in the chimney with his sack"},{"name":"Reindeer","dur":5.5,"desc":"The sleigh and two reindeer wait on the ridge"},{"name":"Celebrate","dur":8,"desc":"Santa pops up, reindeer hop, shooting stars, snow falls"},' + $melt + ']' },
  @{ Title = 'Pixel Holiday Train'; Component = 'TrainApp'; Jsx = 'train.jsx'; Scenes = '[{"name":"Ground","dur":3,"desc":"Snow, hills, pines, moon and stars build up"},{"name":"Tracks","dur":3.5,"desc":"Rails and a signal lay down across the scene"},{"name":"Train","dur":7,"desc":"The engine, tender, cars and caboose build in"},{"name":"Cargo","dur":4.5,"desc":"Presents and a lit tree load onto the cars"},{"name":"Celebrate","dur":9,"desc":"Smoke puffs, the rods chug, the headlamp glows, snow falls"},' + $melt + ']' }
)
foreach ($d in $defs) {
  if ($Only -and ($Only -notcontains $d.Jsx)) { continue }
  & "$s\build.ps1" -Repo $Repo -Scenes "$s\scenes" -Title $d.Title -Component $d.Component -Jsx $d.Jsx -SceneList $d.Scenes -Thumb $thumb
}
