#!/bin/bash
# Deploy das Cloud Functions para integracao com WhatsApp (Meta API)
#
# Antes de rodar, configure as variaveis:
#   export WHATSAPP_TOKEN="seu_token_aqui"
#   export WHATSAPP_PHONE_ID="seu_phone_id_aqui"
#
# Uso: bash deploy.sh

set -e

PROJECT_ID="sitedevendas"
REGION="southamerica-east1"
RECIPIENT="5535998511194"

if [ -z "$WHATSAPP_TOKEN" ] || [ -z "$WHATSAPP_PHONE_ID" ]; then
  echo "ERRO: defina WHATSAPP_TOKEN e WHATSAPP_PHONE_ID antes do deploy"
  exit 1
fi

deploy_fn() {
  local NAME=$1
  echo ""
  echo "==> Deploying $NAME"
  gcloud functions deploy $NAME \
    --gen2 \
    --runtime=nodejs20 \
    --region=$REGION \
    --source=. \
    --entry-point=$NAME \
    --trigger-http \
    --allow-unauthenticated \
    --set-env-vars="WHATSAPP_TOKEN=${WHATSAPP_TOKEN},WHATSAPP_PHONE_ID=${WHATSAPP_PHONE_ID},RECIPIENT_PHONE=${RECIPIENT}" \
    --project=$PROJECT_ID

  echo "URL $NAME:"
  gcloud functions describe $NAME --region=$REGION --project=$PROJECT_ID --format='value(serviceConfig.uri)'
}

deploy_fn sendOrder
deploy_fn sendRegistration
