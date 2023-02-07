import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import useTrades from "../hooks/api/useTrades";
import useToken from "../hooks/useToken";
import { TradeInfo } from "../protocols";
import styled from "styled-components";
import { GamesContainer, GamePrice } from "./items";
import { device } from "../mediaqueries/devices";
import images from "../assets/images/landscapes/images";

export default function NegotiationPage() {
  const { tradeType } = useParams();
  const { trades, getTrades, tradesLoading } = useTrades();
  const navigate = useNavigate();
  const token = useToken();
  let [ image, setImage ] = useState(images[Math.floor(Math.random() * 29) + 1]);

  useEffect(() => {
    image = images[Math.floor(Math.random() * 24) + 1];
    setImage(image);
  }, [trades]);

  useEffect(() => {
    const tradeTypeNotEmpty = tradeType as unknown as string;
    const tradeInfo : TradeInfo = {
      tradeType: tradeTypeNotEmpty,
      enrollmentId: undefined
    };
    if(tradeType)getTrades(tradeInfo, "");
  }, [tradeType]);

  if(!token && !tradesLoading) {
    return (
      <>
        <TopBar></TopBar>
        <ContainerMessages>
          <div>Faça login para ver essa área...</div>
        </ContainerMessages>
        <BottomBar></BottomBar>
      </>
    );
  }

  if(tradesLoading) {
    return (
      <>
        <TopBar></TopBar>
        <ContainerMessages>
          <div> Carregando...</div>
        </ContainerMessages>
        <BottomBar></BottomBar>
      </> );
  }

  if(!trades && token) {
    return (
      <>
        <TopBar></TopBar>
        <ContainerMessages>
          <div>Finalize seu cadastro para ver esse área...</div>
        </ContainerMessages>
        <BottomBar></BottomBar>
      </>
    );
  }

  if(trades?.length===0) {
    return (
      <>
        <TopBar></TopBar>
        <ContainerMessages>
          <div>Você ainda nao tem negociações do tipo: {tradeType}</div>
        </ContainerMessages>
        <BottomBar></BottomBar>
      </>
    );
  }

  return(
    <>
      <TopBar></TopBar>
      <Container randomImage={image}>
        <GamesContainer>
          {trades?.map(trade => (
            <GameContainer  onClick={() => {navigate(`/trade/${trade.id}`);}}>
              <GameImage><img alt="" src={trade.Item.itemUrl}/></GameImage>
              <ItemName>{trade.Item.name}</ItemName>
              <GameName>Comprador: {trade.EnrollmentBuyer.name}</GameName>
              <GameServer>Vendedor: {trade.EnrollmentSeller.name}</GameServer>
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

export type DisplayImage = { display:string };

const Container = styled.div.attrs((props: any) => ({
  randomImage: props.randomImage
}))`
  width: 100%;
  min-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: start;
  align-items: flex-start;
  background-image: url(${props => props.randomImage});
  background-size: cover;
`;

const ContainerMessages = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 83vh;
`;

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
  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.6);
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

const GameName = styled.div`
  color: blue;
`;

const GameServer = styled.div`
  color: purple;
`;

const ItemName = styled.div`
  color: yellow;
`;
