#!/usr/bin/env bash
# Локальный билд + загрузка на VPS + reload nginx.
# Перед запуском настрой SSH alias и переменные ниже.
set -euo pipefail

SSH_TARGET="${SSH_TARGET:-server2}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/aura}"
VITE_BASE_PATH="${VITE_BASE_PATH:-/aura/}"

echo "▶︎ Сборка с base=${VITE_BASE_PATH}..."
VITE_BASE="${VITE_BASE_PATH}" npm run build

echo "▶︎ Заливка в ${SSH_TARGET}:${REMOTE_DIR}..."
ssh "${SSH_TARGET}" "mkdir -p ${REMOTE_DIR}"
rsync -avz --delete dist/ "${SSH_TARGET}:${REMOTE_DIR}/"

echo "▶︎ Reload nginx..."
ssh "${SSH_TARGET}" "nginx -t && systemctl reload nginx"

echo "✅ Готово. Открой свой домен/${VITE_BASE_PATH}"
