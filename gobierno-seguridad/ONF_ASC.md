# Marco Normativo y Controles

## 1. Marco Normativo Organizacional (ONF)
Todo código fuente debe ser sometido a análisis de vulnerabilidades antes de su integración y despliegue en producción, adoptando el estándar OWASP Top 10 como línea base obligatoria.

## 2. Requerimientos de Seguridad de la Aplicación (ASR)
- ASR-01: Las credenciales deben procesarse mediante funciones de derivación de claves antes de su persistencia.
- ASR-02: El sistema no debe confiar en parámetros de estado enviados por el cliente (is_vip).
- ASR-03: Las consultas a bases de datos deben utilizar obligatoriamente sentencias parametrizadas.

## 3. Controles de Seguridad (ASC)
- ASC-01 (Control de Acceso): Validar roles exclusivamente en el servidor.
- ASC-02 (Fallos Criptográficos): Uso obligatorio de algoritmos robustos con salt aleatorio.
- ASC-03 (Inyección): Aplicar validación de listas blancas, Regex y consultas parametrizadas.
- ASC-04 (Configuración): Middleware de manejo global de errores sin revelar el framework Express.
- ASC-05 (Autenticación): Tokens criptográficamente seguros y de un solo uso.