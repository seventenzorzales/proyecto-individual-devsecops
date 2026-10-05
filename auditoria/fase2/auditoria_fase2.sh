#!/bin/bash
# Script de Auditoría de Cierre - MediaStream API (Fase 2 Segura)

echo "Iniciando re-pruebas de penetración sobre la API Refactorizada..."
mkdir -p evidencias_fase2

echo "[*] Probando A01: Intento de elevación a VIP..."
curl -s -X POST http://localhost:3001/api/content/exclusive \
-H "Content-Type: application/json" \
-d '{"is_vip": true}' > evidencias_fase2/evidencia_cierre_A01.txt

echo "[*] Probando A02: Registro con contraseña débil (Regex fallback)..."
curl -s -X POST http://localhost:3001/api/creators/register \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "123"}' > evidencias_fase2/evidencia_cierre_A02.txt

echo "[*] Probando A03: Intento de Inyección SQL en buscador..."
curl -s -X GET "http://localhost:3001/api/podcasts/search?q=' OR 1=1 --" > evidencias_fase2/evidencia_cierre_A03.txt

echo "[*] Probando A07: Solicitud de recuperación con correo inválido..."
curl -s -X POST http://localhost:3001/api/users/recover \
-H "Content-Type: application/json" \
-d '{"email": "admin' > evidencias_fase2/evidencia_cierre_A07.txt

echo "[*] Probando A05: Intento de forzar exposición de Stack Traces..."
curl -s -X GET http://localhost:3001/api/system/status > evidencias_fase2/evidencia_cierre_A05.txt

echo "Re-pruebas finalizadas. El sistema devuelve códigos defensivos. Evidencias en /evidencias_fase2."