@echo off
REM Script d'export Firestore pour Windows
REM Usage: export-firestore.bat [nom-du-dossier]

set "timestamp=%date:~-4,4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=%timestamp: =0%"

if "%1"=="" (
    set "export_name=export-%timestamp%"
) else (
    set "export_name=%1"
)

echo 🚀 Export Firestore vers: backups\%export_name%
firebase emulators:export "backups\%export_name%"

if %errorlevel% equ 0 (
    echo ✅ Export réussi dans: backups\%export_name%
) else (
    echo ❌ Erreur lors de l'export
    exit /b 1
)
