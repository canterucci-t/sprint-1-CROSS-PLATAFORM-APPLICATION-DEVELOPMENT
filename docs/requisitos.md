# Documento de Requisitos - Monitoramento Inteligente de Grama

## 1. Visao geral

O **Monitoramento Inteligente de Grama** e uma solucao mobile para apoiar a Motiva no acompanhamento da vegetacao nas rodovias concedidas. A proposta se baseia na apresentacao do grupo: um veiculo de vistoria percorre os trechos a cada duas semanas com camera de visao computacional, mede a altura da grama por trecho, envia os dados para uma base e gera previsao da proxima necessidade de corte.

Nesta Sprint 1, o foco e documentar e prototipar um MVP navegavel. O prototipo deve mostrar o fluxo de coleta, analise, alerta e decisao operacional, mantendo os dados simulados e preparando a base para implementacao na Sprint 2.

## 2. Problema escolhido

A conservacao de grama e vegetacao lateral em rodovias exige acompanhamento constante. Quando a gestao depende apenas de vistoria visual manual ou calendario fixo, a equipe pode cortar antes da hora em alguns trechos e atrasar a intervencao em outros pontos que ja estao proximos do limite operacional.

O problema escolhido pelo grupo e:

**Como ajudar supervisores e equipes de conservacao da Motiva a monitorar automaticamente a altura da grama por trecho, prever a data ideal de corte e priorizar as frentes de manutencao antes que a vegetacao ultrapasse o limite de 30 cm?**

## 3. Proposta de solucao

O app organiza as informacoes coletadas pelo carro de vistoria e transforma os dados em decisao operacional. A solucao segue quatro etapas:

1. **Coleta quinzenal:** veiculo da empresa percorre os trechos com camera, GPS e registro por rodovia/km.
2. **Medicao automatica:** a camera identifica a grama e estima a altura por trecho usando visao computacional simulada no prototipo.
3. **Previsao de corte:** o sistema considera tipo de vegetacao, clima e historico para prever quando a grama deve atingir o limite de 30 cm.
4. **Dashboard e alertas:** supervisor acompanha mapa, historico, tendencia, proximas datas de corte e alertas de prioridade.

Na Sprint 1, a visao computacional e a previsao sao representadas por regras e dados simulados. A implementacao real pode evoluir com base historica, imagens rotuladas e integracoes climaticas.

## 4. Atores envolvidos

| Ator | Papel |
| --- | --- |
| Operador de vistoria | Realiza o percurso quinzenal com veiculo equipado e acompanha se a coleta ocorreu corretamente. |
| Supervisor de conservacao | Analisa alertas, previsoes e decide quais trechos entram na programacao de corte. |
| Gestor operacional | Acompanha indicadores de cobertura, conformidade, historico e uso das equipes. |
| Frentes de conservacao | Executam rocada e corte nos trechos priorizados. |
| Orgaos reguladores | ARTESP e ANTT podem exigir rastreabilidade, evidencias e padrao de conservacao. |

## 5. Persona principal

**Nome:** Carlos Henrique  
**Idade:** 38 anos  
**Cargo:** Supervisor de conservacao rodoviaria  
**Contexto:** Carlos coordena frentes de conservacao responsaveis por rocada e corte de grama em rodovias concedidas. Ele precisa acompanhar varios trechos, decidir onde atuar primeiro e justificar a programacao das equipes com base em dados confiaveis.

**Necessidades:**

- Saber quais trechos foram vistoriados no ciclo quinzenal.
- Visualizar a altura atual da grama por trecho.
- Receber alerta quando a previsao indicar risco de ultrapassar 30 cm.
- Consultar historico, tendencia de crescimento e proxima data sugerida de corte.
- Priorizar equipes com base em dados de altura, clima, tipo de vegetacao e criticidade do trecho.
- Manter evidencias e rastreabilidade para gestao interna e auditorias.

**Dores:**

- Dificuldade de consolidar informacoes de muitos trechos.
- Dependencia de avaliacao visual manual.
- Falta de previsao clara sobre quando cada trecho precisara de corte.
- Risco de alocar equipes em locais menos urgentes.
- Necessidade de comprovar cobertura de vistoria e criterios de decisao.

**Objetivo no app:** transformar dados de camera, GPS, clima e historico em alertas e programacao de corte por prioridade.

## 6. Requisitos funcionais

| Codigo | Requisito | Prioridade |
| --- | --- | --- |
| RF01 | O sistema deve permitir login simulado por perfil: operador de vistoria, supervisor e gestor. | Alta |
| RF02 | O sistema deve exibir dashboard com cobertura da coleta, trechos alertados, proximos cortes e indicadores gerais. | Alta |
| RF03 | O operador deve iniciar ou registrar uma coleta quinzenal por rodovia e sentido. | Alta |
| RF04 | O sistema deve registrar rodovia, km inicial, km final, sentido, data/hora e identificacao do ciclo de vistoria. | Alta |
| RF05 | O sistema deve capturar ou simular localizacao GPS associada aos trechos vistoriados. | Alta |
| RF06 | O sistema deve permitir anexar ou simular imagem capturada pela camera de vistoria. | Alta |
| RF07 | O sistema deve exibir a altura estimada da grama por trecho em centimetros. | Alta |
| RF08 | O sistema deve classificar a altura da grama como normal, atencao ou corte necessario. | Alta |
| RF09 | O sistema deve considerar o limite operacional de 30 cm para gerar alerta de corte. | Alta |
| RF10 | O sistema deve registrar tipo de vegetacao predominante por trecho. | Media |
| RF11 | O sistema deve considerar clima ou variaveis climaticas simuladas para estimar ritmo de crescimento. | Media |
| RF12 | O sistema deve calcular previsao da proxima data de corte por trecho. | Alta |
| RF13 | O sistema deve exibir tendencia de crescimento da grama com base no historico simulado. | Media |
| RF14 | O sistema deve mostrar mapa ou representacao visual dos trechos com cores por status. | Alta |
| RF15 | O sistema deve listar ranking de trechos por prioridade de corte. | Alta |
| RF16 | O supervisor deve abrir o detalhe de um trecho com imagem, altura atual, historico, tendencia e proxima data de corte. | Alta |
| RF17 | O supervisor deve aprovar a inclusao de um trecho no cronograma de corte. | Alta |
| RF18 | O sistema deve gerar cronograma semanal simulado para as frentes de conservacao. | Media |
| RF19 | O gestor deve visualizar indicadores de cobertura por trecho, alertas, cortes previstos e eficiencia de alocacao. | Media |
| RF20 | O prototipo deve permitir percorrer o fluxo principal no Figma sem instrucao externa. | Alta |

## 7. Requisitos nao funcionais

| Codigo | Requisito | Prioridade |
| --- | --- | --- |
| RNF01 | O app deve ser projetado para dispositivos mobile, com foco em consulta rapida em campo e na operacao. | Alta |
| RNF02 | A navegacao deve deixar claro o fluxo coleta, analise, alerta e cronograma. | Alta |
| RNF03 | A previsao de corte deve ser explicavel no MVP, mostrando os fatores usados no calculo. | Alta |
| RNF04 | A Sprint 1 deve usar dados simulados para camera, altura da grama, clima e historico. | Alta |
| RNF05 | A identidade visual deve comunicar rodovia, vegetacao, tecnologia, mapa e operacao. | Alta |
| RNF06 | A solucao deve considerar conectividade instavel em rodovias e prever armazenamento local para evolucao futura. | Media |
| RNF07 | O app deve solicitar permissoes de camera e localizacao antes de usar recursos nativos. | Alta |
| RNF08 | A solucao deve proteger dados operacionais e evidencias de vistoria em evolucoes futuras. | Media |
| RNF09 | O codigo futuro deve usar TypeScript e componentes reutilizaveis para facilitar manutencao. | Media |
| RNF10 | A arquitetura deve separar coleta, processamento, visualizacao, historico e planejamento. | Media |
| RNF11 | O prototipo no Figma deve estar publicado com permissao de visualizacao ativa. | Alta |
| RNF12 | A proposta deve se manter viavel sem modelo real de visao computacional, backend ou dados internos da Motiva nesta Sprint. | Alta |

## 8. Regra inicial de previsao e alerta

Para representar a proposta da apresentacao, o prototipo usa uma regra simples:

| Criterio | Uso no MVP |
| --- | --- |
| Altura atual da grama | Valor estimado em centimetros por trecho. |
| Limite operacional | 30 cm para indicar corte necessario. |
| Tipo de vegetacao | Define ritmo base de crescimento simulado. |
| Clima | Chuva e temperatura aumentam a previsao de crescimento. |
| Historico do trecho | Ajuda a estimar tendencia e reincidencia. |

Classificacao sugerida:

| Altura/previsao | Nivel | Acao recomendada |
| --- | --- | --- |
| Ate 20 cm e sem previsao de atingir 30 cm no curto prazo | Verde - normal | Manter no ciclo de vistoria quinzenal. |
| 21 a 29 cm ou previsao de atingir 30 cm em poucos dias | Amarelo - atencao | Acompanhar e considerar programacao preventiva. |
| 30 cm ou mais, ou previsao imediata de ultrapassar o limite | Vermelho - corte necessario | Priorizar no cronograma de rocada/corte. |

## 9. Restricoes tecnicas identificadas

- O grupo nao possui acesso a dados reais da Motiva, imagens rotuladas, bases climaticas internas ou historico operacional.
- A Sprint 1 deve simular visao computacional, altura da grama, clima e previsao de crescimento.
- Um modelo real de medicao por imagem exige dataset, validacao em campo, calibracao de camera e testes de precisao.
- A medicao automatica pode variar com iluminacao, velocidade do veiculo, angulo da camera, chuva, sombra e oclusoes.
- Recursos de camera e GPS dependem de permissao do dispositivo e podem ter falhas de sinal em rodovias.
- A conectividade em campo pode ser instavel; a Sprint 2 deve prever armazenamento local e sincronizacao posterior.
- O prototipo no Figma deve demonstrar o fluxo completo, mesmo sem integracao real.
- A solucao deve evitar prometer precisao de IA antes de validar o MVP com dados suficientes.

## 10. Escopo da Sprint 1

Dentro do escopo:

- Definicao do problema e recorte da solucao.
- Persona principal.
- Levantamento de requisitos funcionais e nao funcionais.
- Justificativa da stack mobile.
- Roteiro do prototipo navegavel de alta fidelidade no Figma.
- README completo no GitHub.
- Link do prototipo no README.

Fora do escopo:

- Backend real.
- Modelo real de visao computacional treinado.
- Integracao com sistemas internos da Motiva.
- Medicao real da altura da grama em rodovia.
- Publicacao do aplicativo em loja.

## 11. Criterios de aceitacao do prototipo

- O avaliador consegue sair do login e chegar ao dashboard.
- O app mostra um ciclo de coleta quinzenal.
- O app exibe altura da grama por trecho e limite de 30 cm.
- O app apresenta previsao da proxima data de corte.
- O mapa e o ranking indicam quais trechos sao prioridade.
- O supervisor consegue priorizar um trecho e visualizar o cronograma semanal.
- O prototipo esta navegavel, com botoes conectados e identidade visual consistente.
