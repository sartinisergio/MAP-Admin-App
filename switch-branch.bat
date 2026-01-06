@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════════╗
echo ║           SWITCH BRANCH - MAP Admin App                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Mostra branch corrente
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
echo 📍 Branch corrente: %current_branch%
echo.

REM Mostra modifiche pendenti
git diff-index --quiet HEAD --
if not %errorlevel%==0 (
    echo ⚠️  HAI MODIFICHE NON SALVATE!
    echo.
    echo 📊 Modifiche pendenti:
    git status --short
    echo.
    echo 💡 CONSIGLIO: Salva le modifiche prima di cambiare branch
    echo    - Usa: push-to-develop.bat (se sei su develop)
    echo    - Oppure: git stash (per salvare temporaneamente)
    echo.
    choice /C SN /M "Vuoi continuare comunque (modifiche andranno perse)"
    if errorlevel 2 (
        echo.
        echo ❌ Operazione annullata
        pause
        exit /b
    )
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                 SCEGLI BRANCH                                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo   [1] 🚀 main       (PRODUZIONE - sito live)
echo   [2] 🧪 develop    (SVILUPPO - test online)
echo   [3] ❌ Annulla
echo.
choice /C 123 /M "Seleziona opzione"

if errorlevel 3 (
    echo ❌ Operazione annullata
    pause
    exit /b
)

if errorlevel 2 (
    set target_branch=develop
    set target_url=https://develop--map-manual-analyses-platform.netlify.app
    set target_desc=SVILUPPO E TEST
)

if errorlevel 1 (
    if not errorlevel 2 (
        set target_branch=main
        set target_url=https://map-manual-analyses-platform.netlify.app
        set target_desc=PRODUZIONE LIVE
    )
)

echo.
echo 🔄 Cambio a branch %target_branch%...
git checkout %target_branch%
if errorlevel 1 (
    echo.
    echo ❌ ERRORE: Impossibile cambiare branch
    pause
    exit /b 1
)

echo.
echo ✅ Ora sei su branch: %target_branch%
echo    📝 %target_desc%
echo    🌐 URL: %target_url%
echo.
pause
