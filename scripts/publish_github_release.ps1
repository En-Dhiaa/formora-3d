# FORMORA 3D - GitHub Release Publisher

$Root = Split-Path -Parent $PSScriptRoot
$GhExe = 'C:\Users\USER\.tools\bin\gh.exe'
$GitDir = 'C:\Program Files\Git\cmd'

$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Process')
[System.Environment]::SetEnvironmentVariable('Path', $GitDir + ';' + $currentPath, 'Process')

$ZipAsset = Join-Path $Root 'release\FORMORA-3D-v1.0.0-Windows-Portable.zip'
$Changelog = Join-Path $Root 'CHANGELOG.md'

Write-Host 'Creating GitHub Release v1.0.0 on En-Dhiaa/formora-3d...'

$assetArg = $ZipAsset + '#FORMORA-3D-v1.0.0-Windows-Portable.zip'
& $GhExe release create v1.0.0 $assetArg --title 'FORMORA 3D v1.0.0 - Official Production Release' --notes-file $Changelog

if ($LASTEXITCODE -eq 0) {
    Write-Host 'SUCCESS: GitHub Release v1.0.0 published successfully!'
} else {
    Write-Host 'ERROR: Failed to create release.'
}
