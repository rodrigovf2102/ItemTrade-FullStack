# ItemTrade

ItemTrade is a WEB Plataform that itermediates trades between persons who wants to sell or buy items of online games;
ItemTrade goal is to safely complete buyer and seller transactions in a safe and far way;
Sellers money is avaiable for withdraw only when both seller and buyer sets that the transaction was completed.

To see more: http://itemtrade.trade/

# ItemTrade Website:



## How to execute

Minimum Requirements: 2 GB ram

1.Go to /frontend/src/services/api.tsx and put your IP adress ( localhost if using in the same machine ) on baseURL (exemple : baseURL: "http://52.3.242.76/api");

2.Create a .env based on .env.exemple in folder /node;

3.Execute: docker-compose up --build

4.To stop, use: docker-compose down -v
