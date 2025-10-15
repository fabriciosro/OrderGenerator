📋 Visão Geral

Sistema de trading completo composto por duas aplicações que se comunicam via protocolo FIX 4.4:

OrderGenerator: Frontend React + Backend .NET para geração de ordens

OrderAccumulator: Backend .NET para processamento e controle de risco de ordens


OrderGenerator - Clean Architecture

OrderGenerator/
├── Domain/          ← Entidades e regras de negócio
├── Application/     ← Casos de uso e DTOs
├── Infrastructure/  ← Implementação FIX Client
└── Presentation/    ← Web API + Frontend React

✅ Interface web responsiva para criação de ordens

✅ Validação de dados client-side e server-side

✅ Símbolos disponíveis: PETR4, VALE3, VIIA4

✅ Lados: Compra/Venda

✅ Comunicação FIX 4.4 com OrderAccumulator

✅ Exibição de resultados em tempo real


📥 Instalação e Execução Pré-requisitos

.NET 8.0 SDK

Node.js 18+

1. Configuração do Backend

bash
cd OrderGenerator.Presentation
dotnet restore
dotnet run

2. Configuração do Frontend

bash
cd OrderGenerator.Presentation/ClientApp
npm install

# Produção
npm run build

# Desenvolvimento
npm run dev

URLs

Aplicação: https://localhost:7001


🔧 Configuração FIX
fix-client.cfg
ini
[default]
FileStorePath=store
FileLogPath=log
ConnectionType=initiator
HeartBtInt=30
ReconnectInterval=5

[session]
BeginString=FIX.4.4
SenderCompID=ORDERGEN
TargetCompID=ORDERACC
SocketConnectHost=localhost
SocketConnectPort=9810
📡 API Endpoints
POST /api/orders
Cria uma nova ordem FIX.

Request:

json
{
  "symbol": "PETR4",
  "side": "COMPRA",
  "quantity": 100,
  "price": 25.50
}
Response:

json
{
  "orderId": "guid",
  "execType": "0",
  "symbol": "PETR4",
  "side": "Compra",
  "quantity": 100,
  "price": 25.50,
  "status": "New",
  "message": "Ordem aceita"
}

🧪 Testando o Sistema

1. Inicie o OrderAccumulator

bash
cd OrderAccumulator.Presentation
dotnet run

2. Inicie o OrderGenerator

bash
cd OrderGenerator.Presentation
dotnet run

3. Acesse a aplicação

Abra: https://localhost:7001/swagger

Crie ordens e observe os resultados

🐛 Solução de Problemas

Erro de Conexão FIX
Verifique se OrderAccumulator está rodando na porta 9810

Confirme os arquivos de configuração FIX

Verifique as pastas store/ e log/

Build do React Falha
Execute npm install na pasta ClientApp

Verifique se o Node.js está na versão 18+

