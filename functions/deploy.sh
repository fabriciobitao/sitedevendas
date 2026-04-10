#!/bin/bash
# Deploy da Cloud Function para envio de pedidos via WhatsApp
#
# Antes de rodar, configure as variaveis:
#   export WHATSAPP_TOKEN="seu_token_aqui"
#   export WHATSAPP_PHONE_ID="seu_phone_id_aqui"
#
# Uso: bash deploy.sh

PROJECT_ID="sitedevendas"
REGION="southamerica-east1"
FUNCTION_NAME="sendOrder"

gcloud functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=nodejs20 \
  --region=$REGION \
  --source=. \
  --entry-point=sendOrder \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars="WHATSAPP_TOKEN=${WHATSAPP_TOKEN},WHATSAPP_PHONE_ID=${WHATSAPP_PHONE_ID},RECIPIENT_PHONE=5535998511194" \
  --project=$PROJECT_ID

echo ""
echo "Function URL:"
gcloud functions describe $FUNCTION_NAME --region=$REGION --project=$PROJECT_ID --format='value(serviceConfig.uri)'
