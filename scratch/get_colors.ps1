Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("c:\Users\FUADO CHRIS\Desktop\Readify\frontend\readify\public\bg-readify.png")
$colors = @{}

# Sample pixels
for ($x = 0; $x -lt $bmp.Width; $x += [math]::Max(1, [math]::floor($bmp.Width/50))) {
    for ($y = 0; $y -lt $bmp.Height; $y += [math]::Max(1, [math]::floor($bmp.Height/50))) {
        $pixel = $bmp.GetPixel($x, $y)
        # Only keep colors that are not extremely dark (R+G+B > 80)
        if (($pixel.R + $pixel.G + $pixel.B) -gt 80) {
            # Convert to Hex
            $hex = "#{0:X2}{1:X2}{2:X2}" -f $pixel.R, $pixel.G, $pixel.B
            $colors[$hex] = ($colors[$hex] + 1)
        }
    }
}

$bmp.Dispose()

# Output top 20 colors
$colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 20
