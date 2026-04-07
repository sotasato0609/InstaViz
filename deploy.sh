#!/bin/bash
set -euo pipefail

# ============================================================
# InstaViz デプロイスクリプト (Cloud Build 方式)
# 使い方:
#   ./deploy.sh           → backend + frontend 両方デプロイ
#   ./deploy.sh backend   → backend のみ
#   ./deploy.sh frontend  → frontend のみ
# ============================================================

# --- 設定 ---
PROJECT_ID="instaviz-492607"
REGION="asia-northeast1"
REGISTRY="asia-northeast1-docker.pkg.dev/${PROJECT_ID}/instaviz"

BACKEND_SERVICE="instaviz-backend"
BACKEND_IMAGE="${REGISTRY}/backend:latest"
BACKEND_PORT=4000

FRONTEND_SERVICE="instaviz-frontend"
FRONTEND_IMAGE="${REGISTRY}/frontend:latest"
FRONTEND_PORT=8080

# --- 色付き出力 ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# --- 事前チェック ---
preflight() {
  info "事前チェック..."

  command -v gcloud >/dev/null 2>&1 || error "gcloud CLI がインストールされていません"

  # gcloud 認証確認
  if ! gcloud auth print-access-token >/dev/null 2>&1; then
    error "gcloud 未認証です。'gcloud auth login' を実行してください"
  fi

  # プロジェクト確認
  CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
  if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    warn "現在のプロジェクト: ${CURRENT_PROJECT} → ${PROJECT_ID} に切り替えます"
    gcloud config set project "$PROJECT_ID"
  fi

  ok "事前チェック完了 (プロジェクト: ${PROJECT_ID})"
}

# --- Backend デプロイ ---
deploy_backend() {
  echo ""
  info "========== Backend デプロイ開始 =========="

  # Cloud Build でビルド & Artifact Registry へプッシュ
  info "Cloud Build でイメージをビルド中..."
  gcloud builds submit ./backend \
    --config=backend/cloudbuild.yaml \
    --region="$REGION" \
    --quiet

  # Cloud Run デプロイ
  info "Cloud Run へデプロイ中..."
  gcloud run deploy "$BACKEND_SERVICE" \
    --image "$BACKEND_IMAGE" \
    --region "$REGION" \
    --port "$BACKEND_PORT" \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 3 \
    --quiet

  BACKEND_DEPLOYED_URL=$(gcloud run services describe "$BACKEND_SERVICE" \
    --region "$REGION" \
    --format="value(status.url)")

  ok "Backend デプロイ完了: ${BACKEND_DEPLOYED_URL}"
}

# --- Frontend デプロイ ---
deploy_frontend() {
  echo ""
  info "========== Frontend デプロイ開始 =========="

  # Cloud Build でビルド & Artifact Registry へプッシュ
  # (cloudbuild.yaml 内で Vite 環境変数を --build-arg で注入済み)
  info "Cloud Build でイメージをビルド中..."
  gcloud builds submit ./frontend \
    --config=frontend/cloudbuild.yaml \
    --region="$REGION" \
    --quiet

  # Cloud Run デプロイ
  info "Cloud Run へデプロイ中..."
  gcloud run deploy "$FRONTEND_SERVICE" \
    --image "$FRONTEND_IMAGE" \
    --region "$REGION" \
    --port "$FRONTEND_PORT" \
    --allow-unauthenticated \
    --memory 128Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 3 \
    --quiet

  FRONTEND_DEPLOYED_URL=$(gcloud run services describe "$FRONTEND_SERVICE" \
    --region "$REGION" \
    --format="value(status.url)")

  ok "Frontend デプロイ完了: ${FRONTEND_DEPLOYED_URL}"
}

# --- メイン ---
main() {
  local target="${1:-all}"

  echo ""
  echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║      InstaViz デプロイスクリプト      ║${NC}"
  echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
  echo ""

  preflight

  case "$target" in
    backend)
      deploy_backend
      ;;
    frontend)
      deploy_frontend
      ;;
    all)
      deploy_backend
      deploy_frontend
      ;;
    *)
      error "不明な引数: ${target}\n使い方: ./deploy.sh [backend|frontend|all]"
      ;;
  esac

  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║        デプロイ完了しました！         ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
  echo ""
}

main "$@"
