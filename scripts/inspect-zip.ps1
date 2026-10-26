param(
    [string]$ZipPath = "BHAYA-INDIA-SHOPIFY-THEME-FINAL.zip"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$fileInfo = Get-Item $ZipPath
Write-Host "=== ZIP FILE FORENSIC METADATA ==="
Write-Host "Full Path: " $fileInfo.FullName
Write-Host "Length (bytes): " $fileInfo.Length
Write-Host "LastWriteTime (Local): " $fileInfo.LastWriteTime
Write-Host "LastWriteTime (UTC): " $fileInfo.LastWriteTimeUtc

$hasher = [System.Security.Cryptography.SHA256]::Create()
$stream = [System.IO.File]::OpenRead($fileInfo.FullName)
$hashBytes = $hasher.ComputeHash($stream)
$stream.Close()
$sha256 = [System.BitConverter]::ToString($hashBytes) -replace '-',''
Write-Host "SHA256: " $sha256

$zip = [System.IO.Compression.ZipFile]::OpenRead($fileInfo.FullName)
Write-Host "`nTotal Entries in ZIP:" $zip.Entries.Count

$mustExist = @(
    "templates/index.json",
    "templates/404.json",
    "layout/theme.liquid",
    "sections/hero-banner.liquid",
    "sections/brand-story.liquid",
    "sections/why-bhaya-india.liquid",
    "sections/business-verticals.liquid",
    "sections/category-showcase.liquid",
    "sections/featured-products.liquid",
    "sections/b2b-wholesale.liquid",
    "sections/seller-section.liquid",
    "sections/manufacturer-section.liquid",
    "sections/bhaya-india-2.liquid",
    "sections/founder-story.liquid",
    "sections/gallery-preview.liquid",
    "sections/home-faq.liquid",
    "sections/customer-desk.liquid"
)

Write-Host "`n=== CRITICAL ENTRY EXISTENCE AUDIT IN ZIP ==="
foreach ($target in $mustExist) {
    $entry = $zip.GetEntry($target)
    if ($null -ne $entry) {
        Write-Host "[PRESENT] $target (Size: $($entry.Length) bytes, Compressed: $($entry.CompressedLength) bytes)"
    } else {
        Write-Host "[MISSING] $target"
    }
}

Write-Host "`n=== EXACT templates/index.json CONTENT INSIDE ZIP ==="
$indexEntry = $zip.GetEntry("templates/index.json")
$reader = New-Object System.IO.StreamReader($indexEntry.Open())
$rawIndexContent = $reader.ReadToEnd()
$reader.Close()
Write-Host $rawIndexContent

$zip.Dispose()
