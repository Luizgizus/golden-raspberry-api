# Golden Raspberry Awards API

## **1. Como rodar os pré-requisitos da aplicação**

A aplicação utiliza Node.js e gerenciador de pacotes npm para execução. Antes de iniciar, certifique-se de que possui os seguintes pré-requisitos instalados:

- **Node.js** (versão 16 ou superior)
- **npm** (instalado junto com o Node.js)

### **Passos para instalação:**
1. Clone o repositório:
   ```bash
   git clone https://github.com/Luizgizus/golden-raspberry-api.git
   cd golden-raspberry-api
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto.
   - Exemplo de variáveis no `.env`:
     ```env
     PORT=3000
     DB_FILE_PATH='../../data/Movielist.csv'
     ```

## **2. Como startar a aplicação**

Para iniciar o servidor da aplicação, execute o seguinte comando:

```bash
npm run start
```

A API estará disponível em:
```
http://localhost:<PORT>
```
O valor padrão da porta é `3000`, mas você pode alterá-lo configurando a variável `PORT` no arquivo `.env`.

## **3. Funcionamento inicial da aplicação**
Assim que o comando de execução for rodado a aplicação iniciará, e em seguida ela irá popular o banco de dados com os valores contidos no arquivo csv no caminho inserido na variavel de ambiente `DB_FILE_PATH`, é importante que o camino esteja correto para que a aplicaçõ popule corretamento o banco.

O exemplo da variavel na construção do env já tem um caminho que lê um arquivo chamado Movielist dentro da pasta data do projeto.

Após a inicialização do banco a aplicação irá disponibilizar na porta desejada o acesso ao endpoitn principal da aplicação. Este sendo um get pode ser testado diretamente no browser pela URL:

```
http://localhost:<PORT>/movies/producer-intervals
```

## **4. Como rodar os testes da aplicação**

A aplicação contém testes de integração para validar o comportamento da API e sua interação com o banco de dados em memória. Para executar os testes, siga os passos abaixo:

1. Certifique-se de que as dependências estão instaladas:
   ```bash
   npm install
   ```

2. Execute os testes:
   ```bash
   npm run test:e2e
   ```

### **4.1. Explicação de como os testes estão funcionando**

Os testes de integração utilizam o framework [Jest](https://jestjs.io/) e são responsáveis por verificar os seguintes cenários da API:

1. **Cenário com intervalos mínimos e máximos para um único produtor:**
   - Valida que a API retorna corretamente os intervalos mínimos e máximos de prêmios consecutivos de um único produtor.

2. **Cenário com múltiplos produtores compartilhando o mesmo valor de intervalo:**
   - Verifica se a API lida corretamente com múltiplos produtores que têm os mesmos valores de intervalo mínimo e máximo.

3. **Cenário com banco de dados vazio:**
   - Confirma que a API retorna o status HTTP 404 e uma mensagem adequada quando não há dados suficientes para realizar a análise.

Os testes utilizam um banco de dados em memória para garantir isolamento e repetibilidade. Antes de cada teste:
- O banco é limpo usando a função `moviesService.deleteAll()`.
- Novos dados de filmes são inseridos com as funções `getUniqueProducerInterval` e `getmultipleProducerInterval`.

### **Exemplo de saída esperada:**
#### Sucesso:
```json
{
  "min": [
    {
      "producer": "produce 1",
      "interval": 1,
      "previousWin": 2010,
      "followingWin": 2011
    }
  ],
  "max": [
    {
      "producer": "produce 2",
      "interval": 5,
      "previousWin": 2015,
      "followingWin": 2020
    }
  ]
}
```
#### Banco vazio:
```json
{
  "statusCode": 404,
  "message": "Não foram encontrados filmes suficientes para fazer a analise"
}
```

A estrutura do teste garante que o comportamento da API esteja consistente com os dados fornecidos.

---
