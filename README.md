# Monitoramento Inteligente de Grama — CCR Motiva

Aplicativo mobile para monitoramento inteligente da vegetação nas rodovias concedidas pela CCR Motiva. A solução exibe o estado de cada trecho monitorado, gera alertas automáticos quando a grama ultrapassa 30 cm e permite priorizar cortes diretamente pelo celular.

## Integrantes

| Nome | RM |
| --- | --- |
| Erick Gimenez | RM564748 |
| Henrique Boscoli | RM563651 |
| Joao Henrique | RM563578 |
| Sergio Mirabelo | RM562161 |
| Tomazzo Canterucci | RM565566 |

## Contexto do desafio

O Challenge CCR Motiva propõe uma solução para melhorar a gestão da vegetação nas rodovias concedidas. Esse processo envolve operadores de vistoria, supervisores, gestores e exigências reguladoras da ARTESP e ANTT.

---

## Sprint 2 — App Funcional com Mock de Dados

### Pré-requisitos

- Node.js 18 ou superior
- Expo Go no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/canterucci-t/sprint-1-CROSS-PLATAFORM-APPLICATION-DEVELOPMENT.git
cd sprint-1-CROSS-PLATAFORM-APPLICATION-DEVELOPMENT

# 2. Instale as dependências
npm install

# 3. Inicie o servidor Expo
npx expo start
```

Escaneie o QR code com o **Expo Go** no celular para rodar no dispositivo físico.

Para rodar no emulador Android:
```bash
npx expo start --android
```

### Login de demonstração

O app já vem com os campos preenchidos. Basta tocar em **Entrar**.

| Campo | Valor |
| --- | --- |
| E-mail | carlos@motiva.com.br |
| Senha | motiva2026 |
| Perfil | Supervisor (padrão) |

---

## Estrutura do projeto

```
App.tsx                     # Entrada do app — controla login e navegação
src/
  dados.js                  # Todos os dados mockados (trechos, alertas, cronograma)
  telas/
    Login.js                # Login com seleção de perfil
    Dashboard.js            # Indicadores, trecho mais crítico, alertas
    Ranking.js              # Lista de trechos ordenada por urgência
    Cronograma.js           # Agenda de cortes agrupada por dia
    Detalhe.js              # Detalhe do trecho + gráfico de histórico
    Confirmacao.js          # Confirmação ao priorizar um corte
```

---

## Fluxo principal

```
Login → Dashboard
          ├─ Tocar no trecho crítico → Detalhe → Priorizar → Confirmação → Dashboard
          ├─ "Ver ranking" → Ranking → Detalhe → Priorizar → Confirmação
          └─ Tab Cronograma → item do dia → Detalhe
```

---

## Mock de dados (`src/dados.js`)

- **10 trechos** em 5 rodovias: SP-280, SP-330, SP-348, SP-150, SP-160
- Cada trecho tem: altura atual (cm), status, tipo de vegetação, histórico de 4 medições, previsão de corte
- **4 alertas** automáticos (limite atingido, previsão crítica, reincidência)
- **5 itens de cronograma** distribuídos entre Equipe A, B e C

---

## Tecnologias utilizadas

| Tecnologia | Versão | Uso |
| --- | --- | --- |
| React Native | ^0.86 | Framework mobile |
| Expo | ^56.0 | Ambiente de desenvolvimento |
| React Navigation | ^6 | Stack + Bottom Tabs |
| @expo/vector-icons | ^14 | Ícones (Ionicons) |
| expo-location | ~17.0 | Preparado para GPS (Sprint 3) |

---

## Protótipo Figma (Sprint 1)

https://www.figma.com/make/3Psh6k7cLO2SiDWW5qWvHj/Prototipo-Monitoramento-Grama?t=fapbGbizSWPnklNG-1&preview-route=%2Flogin
