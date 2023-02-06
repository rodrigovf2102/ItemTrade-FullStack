import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import useItems from "../hooks/api/useItems";
import usePostTrade from "../hooks/api/usePostTrade";
import useTrades from "../hooks/api/useTrades";
import useToken from "../hooks/useToken";
import { TradeInfo, TradePost } from "../protocols";
import errorMessagesAll from "../usefull/errorMessages";
import { ErrorMessage } from "./games";
import { device } from "../mediaqueries/devices";

export default function ItemPage() {
  const { postTrade } = usePostTrade();
  const { itemId } = useParams();
  const { items, getItems } = useItems();
  const { trades, getTrades } = useTrades();
  const [ displayModal, setDisplayModal ] = useState("none");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState([""]);
  const token = useToken();

  useEffect(() => {
    async function LoadItems() {
      await getItems(0, "Todos", "", itemId as string);
    }
    LoadItems();
  }, []);

  useEffect(() => {
    if(items) {
      const tradesInfo : TradeInfo = {
        tradeType: "SALE",
        enrollmentId: items[0].enrollmentId
      };
      getTrades(tradesInfo, "");
    } 
  }, [items]);

  function openModal() {
    setDisplayModal("flex");
  }

  function closeModal() {
    setDisplayModal("none");
  }

  async function confirmPurchase() {
    const sellerInfo : TradePost = {
      sellerEnrollmentId: items[0].Enrollment.id,
      itemId: items[0].id
    };
    try {
      const trade = await postTrade(sellerInfo, "");
      setDisplayModal("none");
      setErrorMessage([""]);
      navigate(`/trade/${trade.id}`);
    } catch (error) {
      errorMessagesAll(error, setErrorMessage);
    }
  }

  return (
    <>
      <TopBar></TopBar>
      <Container>
        
        {items ? <ItemContainer>
          <ItemInfo>
            <ImageContainer><img alt="" src={items[0].itemUrl}/></ImageContainer>
            <Title>Informações do Item:</Title>
            <Info>{items[0].name}</Info>
            <Info>Jogo: {items[0].Game.name}</Info>
            <Info>Servidor: {items[0].Server.name}</Info> 
            <InfoDone>Preço: R${(items[0].price/100).toFixed(2)}</InfoDone>
            <Info>Quantidade: {items[0].amount}</Info>
            <ButtonContainer><Button onClick={openModal}>Comprar Item</Button></ButtonContainer>
          </ItemInfo>
          <SellerInfo>
            <ImageContainer><img alt="" src={items[0].Enrollment.enrollmentUrl}/></ImageContainer>
            {token ? <><Title>Informações do vendedor:</Title>
              <Info>Nome: {items[0].Enrollment.name}</Info> 
              <InfoTotal>Total de vendas: {trades?.length}</InfoTotal>
              <InfoDone>Concluídas: {trades?.filter((trade) => trade.tradeStatus==="COMPLETE").length}</InfoDone>
              <InfoIncomplete>Em andamento: {trades?.filter((trade) => trade.tradeStatus==="INCOMPLETE").length}</InfoIncomplete> </>:
              "Faça login para ver essa área..."}
          </SellerInfo>
          <Modal display={displayModal}>
            <div>Tem certeza que deseja comprar o item?</div>
            <div>
              <Button onClick={confirmPurchase}>Confirmar</Button>
              <Button onClick={closeModal}>Cancelar</Button>
              {errorMessage.map((msg) => ( msg!=="OK"?<ErrorMessage>{msg}</ErrorMessage>:"") )}
            </div>
          </Modal>
        </ItemContainer>
          : 
          <div>Carregando...</div>}
      </Container>
      <BottomBar></BottomBar>
    </>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemContainer = styled.div`
  margin-top: 10px;
  padding: 30px;
  width: 80%;
  height: 80%;
  background: linear-gradient(45deg,#333333,#111111,#333333);
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  @media ${device.mobileM} {
    width: 100%;
    padding: 5px;
  }
`;

const ItemInfo = styled.div`
  width: 43%;
  max-width: 450px;
  height: 550px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: start;
  text-align: center;
  border-radius: 15px;
  background: linear-gradient(#555555,#000000,#555555);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  margin-bottom: 25px;
  @media ${device.mobileM} {
    width: 50%;
    border-radius: 0;
    margin-bottom: 0;
  }
`;

const SellerInfo = styled.div`
  width: 43%;
  max-width: 450px;
  height: 550px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  justify-content: start;
  border-radius: 15px;
  background: linear-gradient(#555555,#000000,#555555);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  margin-bottom: 25px;
  @media ${device.mobileM} {
    width: 50%;
    border-radius: 0;
    margin-bottom: 0;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  padding: 15px;
  height: 250px;
  overflow: hidden;
  border-radius: 10px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
  }
`;

export const Button = styled.button`
  width: 250px;
  height: 60px;
  font-size: 20px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 20px;
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
  @media ${device.mobileM} {
    font-size: 15px;
    height: 50px;
  }
`;

const Title = styled.div`
  font-size: 22px;
  padding:15px;
  text-align: center;
  @media ${device.mobileM} {
    font-size: 17px;
    padding: 8px;
  }
`;

const Info = styled.div`
  font-size: 17px;
  padding: 10px;
  display: flex;
  justify-content: start;
  text-align: start;
  @media ${device.mobileM} {
    font-size: 14px;
    padding: 5px;
  }
`;

export const InfoDone = styled.div`
  font-size: 20px;
  padding: 10px;
  color: green;
  font-weight: 700;
  @media ${device.mobileM} {
    font-size: 15px;
    padding: 5px;
  }
`;

export const InfoIncomplete = styled.div`
  font-size: 20px;
  padding: 10px;
  color: red;
  font-weight: 700;
  @media ${device.mobileM} {
    font-size: 15px;
    padding: 5px;
  }
`;

export const InfoTotal = styled.div`
  font-size: 20px;
  padding: 10px;
  color: blue;
  font-weight: 700;
  @media ${device.mobileM} {
    font-size: 15px;
    padding: 5px;
  }
`;

export type DisplayModal = { display:string };

const Modal = styled.div.attrs((props: DisplayModal) => ({
  display: props.display
}))`
  padding-top: 40px;
  display: ${props => props.display};
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  width: 600px;
  height: 260px;
  background:  linear-gradient(#333333,#000000,#333333);
  border-radius: 10px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  div{
    font-size: 16px;
  }
  @media ${device.mobileM} {
    width: 380px;
    text-align: center;
    div{
      font-size: 13px;
    }
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

