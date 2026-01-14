@echo off
echo ===============================================
echo   COMMIT DOCUMENTAZIONE v1.15.3
echo ===============================================
echo.

cd "C:\Users\SARTINI\Desktop\MAP\MAP Manual Analyses Platform"

echo [1/5] Passaggio a branch develop...
git checkout develop

echo.
echo [2/5] Aggiunta nuovi file...
git add GUIDA-GESTIONE-FRAMEWORK-MANUALI.md
git add GUIDA-DEPLOY-PRODUZIONE.md
git add WORKFLOW-UPLOAD-SICURO.md
git add STATO-PROGETTO-2026-01-14.md
git add PROMPT-PROSSIMA-SESSIONE.md
git add firebase-rules-sicure.txt
git add README.md

echo.
echo [3/5] Commit...
git commit -m "docs: Documentazione completa gestione framework/manuali v1.15.3"

echo.
echo [4/5] Push su develop...
git push origin develop

echo.
echo [5/5] Merge in main e push...
git checkout main
git merge develop
git push origin main
git checkout develop

echo.
echo ===============================================
echo   COMPLETATO!
echo ===============================================
echo.
echo File committati:
echo   - GUIDA-GESTIONE-FRAMEWORK-MANUALI.md (NUOVO)
echo   - GUIDA-DEPLOY-PRODUZIONE.md (NUOVO)
echo   - WORKFLOW-UPLOAD-SICURO.md (NUOVO)
echo   - STATO-PROGETTO-2026-01-14.md (NUOVO)
echo   - PROMPT-PROSSIMA-SESSIONE.md (NUOVO)
echo   - firebase-rules-sicure.txt (NUOVO)
echo   - README.md (AGGIORNATO)
echo.
echo Deploy Netlify in corso su:
echo   - https://develop--map-manual-analyses-platform.netlify.app
echo   - https://map-manual-analyses-platform.netlify.app
echo.
pause
