Add-Type -AssemblyName System.Drawing
$w = 1300; $h = 684
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$red = [System.Drawing.Color]::FromArgb(178,34,52)
$blue = [System.Drawing.Color]::FromArgb(60,59,110)
$white = [System.Drawing.Color]::White
$rb = New-Object System.Drawing.SolidBrush($red)
$bb = New-Object System.Drawing.SolidBrush($blue)
$wb = New-Object System.Drawing.SolidBrush($white)

# 13 stripes, red top and bottom
$sh = $h / 13.0
for ($i = 0; $i -lt 13; $i++) {
  $b = if ($i % 2 -eq 0) { $rb } else { $wb }
  $g.FillRectangle($b, 0, [float]($i * $sh), $w, [float]([Math]::Ceiling($sh)))
}
# canton: 7 stripes tall, 40% wide
$cw = [float](0.4 * $w); $ch = [float](7 * $sh)
$g.FillRectangle($bb, 0, 0, $cw, $ch)

# 13 stars in a circle, each pointing outward from center
$cx = $cw / 2; $cy = $ch / 2; $R = 0.30 * $ch; $r1 = 0.062 * $ch; $r2 = $r1 * 0.382
for ($k = 0; $k -lt 13; $k++) {
  $ang = -90 + $k * (360.0 / 13)   # star position on circle
  $a = $ang * [Math]::PI / 180
  $sx = $cx + $R * [Math]::Cos($a); $sy = $cy + $R * [Math]::Sin($a)
  $pts = @()
  for ($p = 0; $p -lt 10; $p++) {
    $rr = if ($p % 2 -eq 0) { $r1 } else { $r2 }
    # tip of star points outward (same direction as $ang)
    $pa = ($ang + $p * 36) * [Math]::PI / 180
    $pts += New-Object System.Drawing.PointF([float]($sx + $rr * [Math]::Cos($pa)), [float]($sy + $rr * [Math]::Sin($pa)))
  }
  $g.FillPolygon($wb, $pts)
}
$g.Dispose()
$bmp.Save("$PSScriptRoot\betsy_ref.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "saved betsy_ref.png"
