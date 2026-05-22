# Guia do Prototipo Figma - Monitoramento Inteligente de Grama

Este documento orienta a criacao do prototipo navegavel de alta fidelidade do **Monitoramento Inteligente de Grama**, seguindo a apresentacao do grupo e os requisitos da Sprint 1.

## 1. Identidade visual

**Conceito:** monitoramento inteligente de grama em rodovias, com visao computacional, previsao de corte e apoio a decisao operacional.

**Direcao visual:**

- Interface mobile limpa, operacional e facil de usar em campo.
- Elementos de rodovia, camera veicular, mapa, vegetacao, medicao em centimetros, historico e alerta.
- Cores de status baseadas no limite de 30 cm: verde para normal, amarelo para atencao e vermelho para corte necessario.
- Cards compactos, graficos simples e informacoes priorizadas para leitura rapida.

**Cores sugeridas:**

- Verde operacional: `#0B5C46`
- Verde seguro: `#1F9D66`
- Verde claro: `#E8F6EF`
- Amarelo atencao: `#F2B705`
- Vermelho corte necessario: `#D64545`
- Azul tecnologia/mapa: `#1E5AA8`
- Cinza texto: `#263238`
- Fundo claro: `#F6F8FA`

**Tipografia sugerida:** Inter, Roboto ou similar sem serifa.

**Componentes principais:**

- Barra superior com nome da tela.
- Navegacao inferior com Dashboard, Mapa, Coletas, Ranking e Cronograma.
- Cards de trecho com rodovia, km, altura atual, previsao, status e miniatura.
- Chips de status: normal, atencao e corte necessario.
- Botao primario verde para acao principal.
- Icones de camera, GPS, mapa, alerta, ranking, calendario, grafico e checklist.

## 2. Telas obrigatorias

### Tela 1 - Login

Objetivo: permitir entrada simulada no app.

Elementos:

- Logo/nome Monitoramento Inteligente de Grama.
- Subtitulo: visao computacional e previsao de corte.
- Campo e-mail.
- Campo senha.
- Seletor de perfil: operador de vistoria, supervisor ou gestor.
- Botao "Entrar".

Interacao:

- "Entrar" leva ao Dashboard.

### Tela 2 - Dashboard

Objetivo: apresentar a situacao operacional dos trechos monitorados.

Elementos:

- Saudacao do usuario.
- Cards de indicadores: cobertura da ultima coleta, trechos acima de 30 cm, trechos em atencao e cortes previstos na semana.
- Resumo do ciclo: "Vistoria a cada 2 semanas".
- Card "Proximo trecho critico" com altura atual e data sugerida de corte.
- Alertas recentes.
- Botao "Ver coleta atual".
- Navegacao inferior.

Interacoes:

- "Ver coleta atual" leva para Coleta Quinzenal.
- Card de alerta leva para Detalhe do Trecho.
- Aba "Mapa" leva para Mapa de Trechos.
- Aba "Cronograma" leva para Cronograma Semanal.

### Tela 3 - Coleta quinzenal

Objetivo: representar o carro de vistoria coletando dados por camera e GPS.

Elementos:

- Identificacao do ciclo de vistoria.
- Rodovia, sentido, km inicial e km final.
- Status da camera: ativa/simulada.
- Status do GPS.
- Progresso de cobertura por trecho.
- Miniatura da imagem capturada.
- Lista de trechos medidos com altura estimada.
- Botao "Processar medicao".

Interacao:

- "Processar medicao" leva para Analise por Visao Computacional.

### Tela 4 - Analise por visao computacional

Objetivo: demonstrar o processamento automatico da altura da grama.

Elementos:

- Imagem do trecho com area de vegetacao destacada visualmente.
- Altura estimada em centimetros.
- Confianca simulada da leitura.
- Tipo de vegetacao identificado/informado.
- Comparacao com o limite de 30 cm.
- Status do trecho: normal, atencao ou corte necessario.
- Botao "Ver previsao".

Interacao:

- "Ver previsao" leva para Previsao de Corte.

### Tela 5 - Previsao de corte

Objetivo: mostrar quando a grama deve atingir o limite de 30 cm.

Elementos:

- Resumo do trecho.
- Altura atual.
- Limite de 30 cm.
- Tipo de vegetacao.
- Clima simulado: chuva recente, temperatura e condicao de crescimento.
- Grafico simples de tendencia.
- Data prevista para corte.
- Motivos da previsao.
- Botao "Salvar alerta".

Interacao:

- "Salvar alerta" leva para Ranking de Prioridades.

### Tela 6 - Mapa de trechos

Objetivo: mostrar a visualizacao principal por rodovia e status.

Elementos:

- Mapa ou representacao visual de rodovia.
- Trechos coloridos por status: verde, amarelo e vermelho.
- Filtros por rodovia, ciclo de coleta e status.
- Legenda: normal, atencao, corte necessario.
- Card do trecho selecionado com altura atual, previsao e botao de detalhe.

Interacoes:

- Tocar em trecho vermelho leva para Detalhe do Trecho.
- Filtros mudam visualmente os pontos exibidos.

### Tela 7 - Ranking de prioridades

Objetivo: indicar onde as equipes devem atuar primeiro.

Elementos:

- Lista ordenada por urgencia de corte.
- Cada item mostra rodovia, km, altura atual, dias ate atingir 30 cm, status, tipo de vegetacao e miniatura.
- Filtros por rodovia, status e data prevista.
- Botao para alternar entre ranking e mapa.

Interacao:

- Tocar em um item leva para Detalhe do Trecho.

### Tela 8 - Detalhe do trecho

Objetivo: permitir decisao do supervisor com evidencias.

Elementos:

- Foto principal do trecho.
- Rodovia, km, sentido e localizacao.
- Altura atual em cm.
- Limite de 30 cm e status.
- Historico simulado das ultimas coletas.
- Tendencia de crescimento.
- Data prevista para corte.
- Motivos do alerta: tipo de vegetacao, clima e historico.
- Botao "Priorizar no cronograma".
- Botao secundario "Acompanhar".

Interacoes:

- "Priorizar no cronograma" leva para Cronograma Semanal.
- "Acompanhar" retorna ao Ranking com status atualizado.

### Tela 9 - Cronograma semanal

Objetivo: demonstrar o planejamento das frentes de conservacao.

Elementos:

- Dias da semana.
- Equipes simuladas de rocada/corte.
- Trechos planejados por prioridade.
- Altura atual e data prevista por trecho.
- Indicador de carga da equipe.
- Destaque para trechos com 30 cm ou mais.
- Botao "Confirmar cronograma".

Interacao:

- "Confirmar cronograma" leva para Confirmacao.

### Tela 10 - Relatorios

Objetivo: representar valor para gestor operacional.

Elementos:

- Indicadores de cobertura por trecho.
- Percentual de rodovia vistoriada no ciclo.
- Quantidade de alertas gerados.
- Trechos recorrentes.
- Grafico simples de altura media por semana.
- Card de melhor alocacao das equipes.

Interacao:

- Item de trecho recorrente leva para Detalhe do Trecho.

### Tela 11 - Confirmacao

Objetivo: fechar o fluxo principal.

Elementos:

- Mensagem de sucesso.
- Resumo do trecho priorizado.
- Altura atual, limite e status.
- Equipe e data planejada.
- Botao "Voltar ao dashboard".

Interacao:

- Retorna ao Dashboard.

## 3. Fluxo navegavel principal

Login -> Dashboard -> Coleta quinzenal -> Analise por visao computacional -> Previsao de corte -> Ranking de prioridades -> Detalhe do trecho -> Cronograma semanal -> Confirmacao -> Dashboard

## 4. Fluxos secundarios recomendados

- Dashboard -> Mapa de trechos -> Detalhe do trecho.
- Dashboard -> Ranking de prioridades -> Detalhe do trecho.
- Detalhe do trecho -> Acompanhar -> Ranking de prioridades.
- Dashboard -> Cronograma semanal -> Detalhe do trecho planejado.
- Dashboard -> Relatorios -> Trecho recorrente -> Detalhe do trecho.

## 5. Dados simulados para usar nas telas

### Trecho com corte necessario

- Rodovia: SP-280
- Trecho: km 42 ao km 43
- Sentido: Oeste
- Altura atual: 34 cm
- Limite: 30 cm
- Tipo de vegetacao: grama densa
- Clima: chuva recente e temperatura favoravel ao crescimento
- Ultima coleta: ha 2 dias
- Previsao: corte imediato
- Status: vermelho - corte necessario
- Acao recomendada: priorizar no cronograma de corte

### Trecho em atencao

- Rodovia: SP-330
- Trecho: km 112
- Sentido: Norte
- Altura atual: 27 cm
- Limite: 30 cm
- Tipo de vegetacao: capim alto
- Clima: chuva moderada
- Ultima coleta: ha 1 dia
- Previsao: atingir 30 cm em 5 dias
- Status: amarelo - atencao
- Acao recomendada: programar corte preventivo na semana

### Trecho normal

- Rodovia: SP-348
- Trecho: km 76
- Sentido: Sul
- Altura atual: 16 cm
- Limite: 30 cm
- Tipo de vegetacao: grama baixa
- Clima: seco
- Ultima coleta: hoje
- Previsao: manter abaixo de 30 cm ate a proxima vistoria
- Status: verde - normal
- Acao recomendada: manter no ciclo quinzenal

## 6. Checklist antes de publicar o Figma

- Todas as telas principais estao conectadas por prototype links.
- O botao principal de cada tela leva para a proxima etapa correta.
- O fluxo coleta -> medicao -> previsao -> alerta -> cronograma aparece de forma evidente.
- O limite de 30 cm aparece nas telas de analise, previsao e detalhe.
- O mapa, ranking, historico, previsao e cronograma estao representados.
- O link do Figma esta com permissao "anyone with the link can view".
- O link foi incluido no README do GitHub.
- O avaliador consegue concluir o fluxo sem instrucoes externas.
