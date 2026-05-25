# Monitoramento Inteligente de Grama

Aplicativo mobile para monitoramento inteligente da grama em rodovias concedidas, com coleta quinzenal por carro equipado com camera, medicao automatica da altura da vegetacao, previsao da proxima necessidade de corte e apoio a decisao das equipes de conservacao.

## Integrantes

| Nome | RM |
| --- | --- |
| Erick Gimenez | RM564748 |
| Henrique Boscoli | RM563651 |
| Joao Henrique | RM563578 |
| Sergio Mirabelo | RM562161 |
| Tomazzo Canterucci | RM565566 |

## Contexto do desafio

O Challenge CCR Motiva propoe uma solucao tecnologica para melhorar a gestao e o monitoramento da vegetacao nas rodovias concedidas. Esse processo envolve frentes de conservacao, operadores de vistoria, supervisores, gestores e exigencias reguladoras de orgaos como ARTESP e ANTT.

A apresentacao do grupo define uma solucao de visao computacional e previsao de corte: um carro da empresa percorre os trechos a cada duas semanas, uma camera mede a altura da grama em tempo real, os dados sao enviados ao sistema e o supervisor acompanha historico, tendencia, alertas e proxima data de corte.

## Problema escolhido

Como ajudar supervisores e equipes de conservacao da Motiva a monitorar automaticamente a altura da grama por trecho, prever a data ideal de corte e priorizar as frentes de manutencao antes que a vegetacao ultrapasse o limite de 30 cm?

O recorte escolhido evita depender apenas de calendario fixo ou avaliacao visual manual. A proposta transforma a vistoria quinzenal em dados estruturados para apoiar decisoes sobre onde e quando cortar.

## Persona principal

**Carlos Henrique**, 38 anos, supervisor de conservacao rodoviaria.

Carlos coordena frentes de conservacao responsaveis por rocada e corte de grama em diferentes trechos da concessao. Ele precisa acompanhar cobertura de vistoria, identificar trechos proximos do limite de 30 cm, consultar evidencias e organizar as equipes com base em prioridade. Sua maior dificuldade e transformar muitas informacoes de campo em uma programacao clara, rastreavel e defensavel.

## Proposta de solucao

O **Monitoramento Inteligente de Grama** sera um app mobile em React Native/Expo que apresenta os dados coletados pelo carro de vistoria e apoia a decisao operacional.

A solucao segue o fluxo:

**Coleta:** veiculo percorre os trechos a cada duas semanas com camera e GPS.  
**Medicao:** a camera identifica a grama e estima a altura por trecho.  
**Analise:** o sistema considera tipo de vegetacao, clima e historico para prever crescimento.  
**Alerta:** quando a altura atual ou prevista se aproxima de 30 cm, o trecho entra em atencao ou corte necessario.  
**Decisao:** supervisor consulta dashboard, mapa, ranking, detalhe do trecho e cronograma semanal.

Na Sprint 1, a visao computacional e a previsao serao simuladas no prototipo. A ideia e demonstrar a experiencia e preparar a implementacao da Sprint 2 com dados estruturados.

## Funcionalidades previstas

- Login simulado por perfil: operador de vistoria, supervisor e gestor.
- Dashboard com cobertura da coleta, trechos alertados, proximos cortes e indicadores.
- Registro de ciclo de coleta quinzenal por rodovia, km e sentido.
- Simulacao de camera e GPS do veiculo de vistoria.
- Medicao estimada da altura da grama em centimetros por trecho.
- Classificacao por status: normal, atencao e corte necessario.
- Regra de alerta baseada no limite de 30 cm.
- Previsao da proxima data de corte usando tipo de vegetacao, clima e historico simulado.
- Mapa de trechos com cores por status.
- Ranking de prioridades de corte.
- Detalhe do trecho com imagem, altura atual, historico, tendencia e previsao.
- Cronograma semanal para frentes de conservacao.
- Relatorios sinteticos de cobertura, alertas e recorrencia.

## Stack tecnologica

| Tecnologia | Uso | Justificativa |
| --- | --- | --- |
| React Native | Desenvolvimento mobile | Permite criar app Android/iOS com uma base de codigo unica, adequada ao uso em campo e consulta operacional. |
| Expo | Ambiente de desenvolvimento | Facilita prototipacao, testes em dispositivo fisico e acesso a camera, localizacao e recursos nativos. |
| TypeScript | Linguagem | Reduz erros por tipagem e melhora manutencao para a Sprint 2. |
| React Navigation | Navegacao | Suporta login, abas, pilhas de telas, detalhes de trecho e fluxo de cronograma. |
| Expo Location | Geolocalizacao | Necessario para associar trechos, km e registros de vistoria a coordenadas. |
| Expo Camera / Image Picker | Captura de imagem | Representa a camera usada na coleta e permite evoluir para evidencias reais. |
| AsyncStorage | Armazenamento local | Permite persistir dados simulados e preparar funcionamento offline inicial. |
| JSON simulado | Base inicial | Viabiliza o MVP sem backend, dados internos da Motiva ou modelo real de IA. |
| Figma | Prototipo navegavel | Permite validar telas, identidade visual e fluxo principal antes da implementacao. |

## Documento de requisitos

O levantamento de requisitos esta disponivel em:

[docs/requisitos.md](docs/requisitos.md)

## Prototipo navegavel

Link do Figma:

https://www.figma.com/make/3Psh6k7cLO2SiDWW5qWvHj/Prototipo-Monitoramento-Grama?t=fapbGbizSWPnklNG-1&preview-route=%2Flogin

Especificacao das telas e fluxo do prototipo:

[docs/prototipo-figma.md](docs/prototipo-figma.md)

## Fluxo principal do usuario

1. Usuario acessa o app.
2. Dashboard mostra o status da coleta quinzenal.
3. Operador/supervisor abre a coleta atual.
4. App apresenta medicao automatica da altura da grama por trecho.
5. App exibe previsao de corte com limite de 30 cm.
6. Supervisor visualiza ranking e mapa de trechos.
7. Supervisor abre o detalhe do trecho critico.
8. Supervisor prioriza o trecho no cronograma semanal.
9. App confirma a programacao de corte.

## Ganhos esperados para a Motiva

- Maior cobertura e rastreabilidade da vistoria quinzenal.
- Reducao de cortes desnecessarios antes do momento ideal.
- Menor risco de atraso em trechos que chegam ao limite de 30 cm.
- Melhor planejamento das frentes de conservacao.
- Decisao baseada em altura medida, historico, clima e previsao.
- Visualizacao rapida por dashboard, mapa, ranking e cronograma.

## Status da Sprint 1

- [x] Definicao do problema e recorte da solucao.
- [x] Persona principal.
- [x] Requisitos funcionais e nao funcionais.
- [x] Justificativa da stack tecnologica.
- [x] Roteiro do prototipo navegavel no Figma.
- [x] Prototipo publicado no Figma.
- [x] Link do Figma incluido no README.
- [x] Link do repositorio GitHub preenchido no arquivo de entrega.
