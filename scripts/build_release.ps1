# FORMORA 3D — Windows Portable & Installer Release Builder
# Prepares a self-contained production bundle with launchers, installer, and uninstaller.

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$ReleaseDir = Join-Path $Root "release\FORMORA-3D-v1.0.0-Windows-x64"
$ZipTarget = Join-Path $Root "release\FORMORA-3D-v1.0.0-Windows-Portable.zip"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " [FORMORA 3D] Building Windows Production Distribution" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Clean previous release artifacts
if (Test-Path $ReleaseDir) {
    Write-Host "Cleaning previous release folder..." -ForegroundColor Gray
    Remove-Item $ReleaseDir -Recurse -Force
}
if (Test-Path $ZipTarget) {
    Remove-Item $ZipTarget -Force
}

New-Item -ItemType Directory -Path $ReleaseDir -Force | Out-Null

# 2. Copy production build artifacts
Write-Host "Copying core application files..." -ForegroundColor Gray
Copy-Item (Join-Path $Root "package.json") -Destination $ReleaseDir
Copy-Item (Join-Path $Root "next.config.mjs") -Destination $ReleaseDir
Copy-Item (Join-Path $Root "README.md") -Destination $ReleaseDir
Copy-Item (Join-Path $Root "ARCHITECTURE.md") -Destination $ReleaseDir
if (Test-Path (Join-Path $Root "CHANGELOG.md")) {
    Copy-Item (Join-Path $Root "CHANGELOG.md") -Destination $ReleaseDir
}
if (Test-Path (Join-Path $Root "LICENSE")) {
    Copy-Item (Join-Path $Root "LICENSE") -Destination $ReleaseDir
}

Write-Host "Copying optimized .next production bundle..." -ForegroundColor Gray
Copy-Item (Join-Path $Root ".next") -Destination (Join-Path $ReleaseDir ".next") -Recurse

if (Test-Path (Join-Path $Root "public")) {
    Copy-Item (Join-Path $Root "public") -Destination (Join-Path $ReleaseDir "public") -Recurse
} else {
    New-Item -ItemType Directory -Path (Join-Path $ReleaseDir "public") -Force | Out-Null
}

# 3. Copy necessary production node_modules
Write-Host "Copying essential runtime node_modules..." -ForegroundColor Gray
$TargetNM = Join-Path $ReleaseDir "node_modules"
New-Item -ItemType Directory -Path $TargetNM -Force | Out-Null

$RuntimePackages = @(
    "next",
    "react",
    "react-dom",
    "three",
    "zustand",
    "lucide-react",
    "client-only",
    "nanoid"
)

foreach ($pkg in $RuntimePackages) {
    $srcPkg = Join-Path $Root "node_modules\$pkg"
    if (Test-Path $srcPkg) {
        Copy-Item $srcPkg -Destination (Join-Path $TargetNM $pkg) -Recurse
    }
}

# 4. Generate Launchers
Write-Host "Generating standalone Windows launchers..." -ForegroundColor Gray

# A. Standard Console Launcher (FORMORA-3D.cmd)
$LauncherCmd = @"
@echo off
setlocal
title FORMORA 3D Studio - Production Engine
echo ========================================================
echo   FORMORA 3D - AI Product Packaging Studio (Windows)
echo ========================================================
echo.

set APP_DIR=%~dp0
cd /d "%APP_DIR%"

echo [1/2] Starting FORMORA 3D Production Engine on http://localhost:3000 ...
start /b "" node "node_modules\next\dist\bin\next" start -p 3000

echo [2/2] Opening browser ...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

echo.
echo ========================================================
echo   FORMORA 3D is active at http://localhost:3000
echo   Close this window to terminate the studio engine.
echo ========================================================
echo.
pause
"@
Set-Content -Path (Join-Path $ReleaseDir "FORMORA-3D.cmd") -Value $LauncherCmd -Encoding ascii

# B. Silent Background Launcher (FORMORA-3D-Silent.vbs)
$SilentVbs = @"
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "FORMORA-3D.cmd", 0, False
"@
Set-Content -Path (Join-Path $ReleaseDir "FORMORA-3D-Silent.vbs") -Value $SilentVbs -Encoding ascii

# C. One-Click Desktop Shortcut Installer (install-shortcut.cmd)
$InstallShortcut = @"
@echo off
setlocal
echo ========================================================
echo   Installing FORMORA 3D Desktop Shortcut...
echo ========================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command "\$WshShell = New-Object -ComObject WScript.Shell; \$Shortcut = \$WshShell.CreateShortcut([System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'FORMORA 3D Studio.lnk')); \$Shortcut.TargetPath = '%~dp0FORMORA-3D.cmd'; \$Shortcut.WorkingDirectory = '%~dp0'; \$Shortcut.Description = 'FORMORA 3D - AI Product Packaging Design Studio'; \$Shortcut.Save(); Write-Host 'Shortcut created successfully on your Desktop!' -ForegroundColor Green"

echo.
echo Installation complete! You can now launch FORMORA 3D directly from your Desktop.
pause
"@
Set-Content -Path (Join-Path $ReleaseDir "install-desktop-shortcut.cmd") -Value $InstallShortcut -Encoding ascii

# D. Uninstaller (uninstall-shortcut.cmd)
$UninstallShortcut = @"
@echo off
setlocal
echo Removing FORMORA 3D Desktop Shortcut...
del "%USERPROFILE%\Desktop\FORMORA 3D Studio.lnk" 2>nul
echo Done.
pause
"@
Set-Content -Path (Join-Path $ReleaseDir "uninstall-shortcut.cmd") -Value $UninstallShortcut -Encoding ascii

# 5. Add Windows System Requirements & User Manual
$ReadmeTxt = @"
========================================================================
 FORMORA 3D - AI Product Packaging Studio (Windows 64-bit)
 Version: 1.0.0 (Production Release)
 Author: Eng. Dhiaa Al-Hmiri (https://github.com/En-Dhiaa)
 Official Repository: https://github.com/En-Dhiaa/formora-3d
========================================================================

SYSTEM REQUIREMENTS:
  * Operating System: Windows 10 or Windows 11 (64-bit)
  * Processor: Intel Core i3 / AMD Ryzen 3 or higher
  * RAM: 4 GB minimum (8 GB recommended for 4K rendering)
  * Graphics: WebGL 2.0 compatible GPU (DirectX 11/12 or Vulkan)
  * Display: 1280x720 minimum resolution (1920x1080 Full HD recommended)
  * Runtime: Node.js 18+ (bundled/system)

HOW TO RUN:
  1. Quick Launch:
     Double-click 'FORMORA-3D.cmd'
     The production engine will start and your browser will automatically open to:
     http://localhost:3000

  2. Install Desktop Shortcut:
     Run 'install-desktop-shortcut.cmd' as administrator or standard user.
     An official shortcut named 'FORMORA 3D Studio' will be created on your Desktop.

  3. Uninstalling:
     Run 'uninstall-shortcut.cmd' to remove the desktop shortcut, or simply delete
     this folder. Zero residual files or registry keys are created.

KEY FEATURES:
  * Parametric packaging models (Carton boxes, bottles, squeeze tubes, doy pouches)
  * Dynamic 6-face UV artwork mapping with automatic dimension calculation
  * PBR physics-based materials (Glass, cardboard, HDPE plastic, metallic foil)
  * Studio lighting rigs with soft contact shadows and reflective floor pedestals
  * 4K Ultra HD render export with transparent background (PNG, JPEG, WebP)
  * 3D GLB export for Blender, Unreal Engine, and Web AR
  * 2D Dieline viewer with cut & fold lines export
  * AI Studio Packaging compliance checklist (FDA/MOH)

SECURITY & PRIVACY:
  * Offline-first execution: all 3D geometries and artworks render locally on your machine.
  * Zero telemetry and zero third-party tracking.
========================================================================
"@
Set-Content -Path (Join-Path $ReleaseDir "README-WINDOWS.txt") -Value $ReadmeTxt -Encoding utf8

# 6. Compress into Portable ZIP Archive
Write-Host "Creating portable distribution ZIP archive..." -ForegroundColor Gray
Compress-Archive -Path "$ReleaseDir\*" -DestinationPath $ZipTarget -Force

$zipSize = (Get-Item $ZipTarget).Length / 1MB
Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " [SUCCESS] Windows Release Bundle Built Successfully!" -ForegroundColor Green
Write-Host " Folder: $ReleaseDir" -ForegroundColor Green
Write-Host " Portable ZIP: $ZipTarget ($([Math]::Round($zipSize, 2)) MB)" -ForegroundColor Green
Write-Host "========================================================`n" -ForegroundColor Green
