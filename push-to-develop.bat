@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         PUSH TO DEVELOP - MAP Admin App                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verifica branch corrente
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
echo 📍 Branch corrente: %current_branch%

REM Se non sei su develop, chiedi conferma per switch
if not "%current_branch%"=="develop" (
    echo.
    echo ⚠️  NON SEI SUL BRANCH DEVELOP!
    echo    Branch corrente: %current_branch%
    echo.
    choice /C SN /M "Vuoi passare al branch develop"
    if errorlevel 2 (
        echo.
        echo ❌ Operazione annullata. Resta su %current_branch%
        pause
        exit /b
    )
    echo.
    echo 🔄 Cambio a branch develop...
    git checkout develop
    if errorlevel 1 (
        echo.
        echo ❌ ERRORE: Impossibile cambiare branch
        pause
        exit /b 1
    )
    echo ✅ Ora sei su develop
)

echo.
echo 📊 Stato modifiche:
echo ────────────────────────────────────────────────────────────────
git status --short
echo.

REM Verifica se ci sono modifiche
git diff-index --quiet HEAD --
if %errorlevel%==0 (
    echo ✅ Nessuna modifica da caricare
    echo.
    pause
    exit /b 0
)

echo 📦 Aggiungo tutte le modifiche...
git add .
echo.

REM Chiedi messaggio commit
set /p commit_msg="💬 Messaggio commit (vuoto = default): "
if "%commit_msg%"=="" (
    set commit_msg=Dev: modifiche develop - %date% %time%
)

echo.
echo 💾 Commit: %commit_msg%
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo.
    echo ❌ ERRORE nel commit
    pause
    exit /b 1
)

echo.
echo 🚀 Push su GitHub (branch develop)...
git push origin develop
if errorlevel 1 (
    echo.
    echo ❌ ERRORE nel push
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║             ✅ PUSH SU DEVELOP COMPLETATO!                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🌐 URL di TEST (develop):
echo    https://develop--map-manual-analyses-platform.netlify.app
echo.
echo 📊 Monitor deploy Netlify:
echo    https://app.netlify.com/sites/map-manual-analyses-platform/deploys
echo.
echo ⏱️  Deploy in corso... (1-2 minuti)
echo.
pause
