#!/usr/bin/env bash
# Publica este repositorio en GitHub. Requiere GitHub CLI: https://cli.github.com
set -euo pipefail

REPO="${1:-lalogiabarberia}"     # ./subir-a-github.sh flamia/lalogiabarberia

command -v gh >/dev/null || { echo "Falta GitHub CLI (gh). Instálelo primero."; exit 1; }
gh auth status >/dev/null 2>&1 || gh auth login

gh repo create "$REPO" --private --source=. --remote=origin --push
echo
echo "Listo: $(gh repo view "$REPO" --json url -q .url)"
echo "Siguiente paso: cargue FTP_SERVER, FTP_USERNAME y FTP_PASSWORD"
echo "en Settings > Secrets and variables > Actions para activar el despliegue."
