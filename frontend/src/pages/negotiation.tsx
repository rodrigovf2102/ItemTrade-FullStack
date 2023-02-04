import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import useTrades from "../hooks/api/useTrades";
import useToken from "../hooks/useToken";
import { TradeInfo } from "../protocols";
import { Container } from "./games";
import styled from "styled-components";
import { GamesContainer, GamePrice } from "./items";
import { device } from "../mediaqueries/devices";

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
        <GamesContainer>
          {trades?.map(trade => (
            <GameContainer  onClick={() => {navigate(`/trade/${trade.id}`);}}>
              <GameImage><img alt="" src={trade.Item.itemUrl}/></GameImage>
              <div>{trade.Item.name}</div>
              <div>Comprador: {trade.EnrollmentBuyer.name}</div>
              <div>Vendedor: {trade.EnrollmentSeller.name}</div>
              <GamePrice>Preço: R${(trade.Item.price/100).toFixed(2)}</GamePrice>
              {trade.tradeStatus ==="COMPLETE"? <GamePrice>Andamento: {trade.tradeStatus}</GamePrice> : <TradeStatus>Andamento: {trade.tradeStatus}</TradeStatus>}
            </GameContainer>
          ))}
        </GamesContainer>
      </Container>
      <BottomBar></BottomBar>
    </>
  );
}

export const Button = styled.button`
  width: 200px;
  height: 60px;
  font-size: 20px;
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

export const GameContainer = styled.div`
  width: 240px ;
  height: 320px;
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  object-fit: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: white;
  background: linear-gradient(#333333,#000000,#333333);
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  div{
    font-size: 15px;
    line-height: 20px;
    display: flex;
    justify-content: start;
    align-items: flex-start;
    width: 100%;
    overflow: auto;
  }
  @media ${device.mobileM} {
    width: 180px;
    height: 250px;
    padding: 8px;
    margin: 6px;
    div{
      font-size: 13px;
      line-height: 15px;
    }
  }
`;

export const GameImage = styled.div`
  width: 90%;
  overflow: hidden;
  height: 40%;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const TradeStatus = styled.div`
  font-weight: 700;
  color: red;
`;
