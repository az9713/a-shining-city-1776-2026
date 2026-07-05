Add-Type -AssemblyName System.Drawing
# Official DDD-F-416E proportions: 1.9 x 1, union 0.76 x 7/13, 50 stars in 9 rows (6-5)
$w = 1900; $h = 1000
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$rb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(178,34,52))
$bb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60,59,110))
$wb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

$sh = $h / 13.0
for ($i = 0; $i -lt 13; $i++) {
  $b = if ($i % 2 -eq 0) { $rb } else { $wb }
  $g.FillRectangle($b, 0, [float]($i * $sh), $w, [float]([Math]::Ceiling($sh)))
}
$cw = [float](0.76 * $h); $ch = [float](7 * $sh)
$g.FillRectangle($bb, 0, 0, $cw, $ch)

$r1 = [float](0.0308 * $h); $r2 = $r1 * 0.382
for ($row = 0; $row -lt 9; $row++) {
  $cols = if ($row % 2 -eq 0) { @(1,3,5,7,9,11) } else { @(2,4,6,8,10) }
  foreach ($c in $cols) {
    $sx = $c / 12.0 * $cw; $sy = ($row + 1) / 10.0 * $ch
    $pts = @()
    for ($p = 0; $p -lt 10; $p++) {
      $rr = if ($p % 2 -eq 0) { $r1 } else { $r2 }
      $pa = (-90 + $p * 36) * [Math]::PI / 180
      $pts += New-Object System.Drawing.PointF([float]($sx + $rr * [Math]::Cos($pa)), [float]($sy + $rr * [Math]::Sin($pa)))
    }
    $g.FillPolygon($wb, $pts)
  }
}
$g.Dispose()
$bmp.Save("$PSScriptRoot\usflag_ref.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "saved usflag_ref.png"
