@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════════╗
echo ║      PUSH TO PRODUCTION (main) - MAP Admin App                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo ⚠️  ATTENZIONE: Stai per pubblicare in PRODUZIONE!
echo.
echo    🌐 Sito live: https://map-manual-analyses-platform.netlify.app
echo.
choice /C SN /M "Vuoi procedere con il deploy in produzione"
if errorlevel 2 (
    echo.
    echo ❌ Operazione annullata
    pause
    exit /b
)

echo.
echo 🔄 Cambio a branch main...
git checkout main
if errorlevel 1 (
    echo.
    echo ❌ ERRORE: Impossibile cambiare branch
    pause
    exit /b 1
)

echo.
echo 🔄 Pull ultime modifiche da main...
git pull origin main

echo.
echo 🔀 Merge develop → main...
git merge develop
if errorlevel 1 (
    echo.
    echo ❌ ERRORE: Conflitti nel merge!
    echo    Risolvi i conflitti manualmente e riprova.
    pause
    exit /b 1
)

echo.
echo 🚀 Push su GitHub (branch main - PRODUZIONE)...
git push origin main
if errorlevel 1 (
    echo.
    echo ❌ ERRORE nel push
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║        ✅ DEPLOY IN PRODUZIONE COMPLETATO!                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Sito LIVE (produzione):
echo    https://map-manual-analyses-platform.netlify.app
echo.
echo 📊 Monitor deploy Netlify:
echo    https://app.netlify.com/sites/map-manual-analyses-platform/deploys
echo.
echo ⏱️  Deploy in corso... (1-2 minuti)
echo.
echo 💡 CONSIGLIO: Torna su branch develop per continuare lo sviluppo
echo    Usa: switch-branch.bat
echo.
pause
