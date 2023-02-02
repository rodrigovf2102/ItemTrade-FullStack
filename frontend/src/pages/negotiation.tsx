import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import useTrades from "../hooks/api/useTrades";
import useToken from "../hooks/useToken";
import { TradeInfo } from "../protocols";
import { Container } from "./games";
import styled from "styled-components";
import { GameContainer, GameImage, GamesContainer } from "./items";

export default function NegotiationPage() {
  const { tradeType } = useParams();
  const { trades, getTrades, tradesLoading } = useTrades();
  const navigate = useNavigate();
  const token = useToken();

  useEffect(() => {
    const tradeTypeNotEmpty = tradeType as unknown as string;
    const tradeInfo : TradeInfo = {
      tradeType: tradeTypeNotEmpty,
      enrollmentId: undefined
    };
    if(tradeType)getTrades(tradeInfo, "");
  }, [tradeType]);

  return(
    <>
      <TopBar></TopBar>
      <Container>
        {!token ? <div>Faça login para ver essa área...</div> :"" }
        {tradesLoading ? <div> Carregando...</div> : ""}
        {!trades && token ? <div>Finalize seu cadastro para ver esse área...</div>:""}
        {trades?.length===0 ? <div>Você ainda nao tem negociações do tipo: {tradeType}</div> : ""}
        {trades?.map(trade => (
          <GamesContainer>
            <GameContainer>
              <div>{trade.Item.name}</div>
              <GameImage><img alt="" src={trade.Item.itemUrl}/></GameImage>
              <div>Comprador: {trade.EnrollmentBuyer.name}</div>
              <div>Vendedor: {trade.EnrollmentSeller.name}</div>
              <div>Preço: R${(trade.Item.price/100).toFixed(2)}</div>
              <div>Andamento: {trade.tradeStatus}</div>
              <Button onClick={() => {navigate(`/trade/${trade.id}`);}}>Ver detalhes</Button>
            </GameContainer>
          </GamesContainer>
        ))}
      </Container>
      <BottomBar></BottomBar>
    </>
  );
}

export const Button = styled.button`
  width: 250px;
  height: 60px;
  font-size: 25px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  margin: 5px;
  border-radius: 15px;
  text-align: center;
  color: white;
  font-size: 18px;
  cursor: pointer;
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  :active{
    background: linear-gradient(#000000,#666666,#000000);
  }
`;

