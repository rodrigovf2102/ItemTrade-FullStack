import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../components/TopBar";
import useItems from "../hooks/api/useItems";
import usePostTrade from "../hooks/api/usePostTrade";
import useTrades from "../hooks/api/useTrades";
import useToken from "../hooks/useToken";
import { TradeInfo, TradePost } from "../protocols";
import errorMessagesAll from "../usefull/errorMessages";
import { ErrorMessage } from "./games";

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
            <Title>Informações sobre o Item:</Title>
            <Info>{items[0].name}</Info>
            <Info>Jogo: {items[0].Game.name}</Info>
            <Info>Servidor: {items[0].Server.name}</Info>
            <ImageContainer><img alt="" src={items[0].itemUrl}/></ImageContainer>
            <Info>Preço: R${(items[0].price/100).toFixed(2)}</Info>
            <Info>Quantidade: {items[0].amount}</Info>
            <Button onClick={openModal}>Comprar Item</Button>
          </ItemInfo>
          <SellerInfo>
            {token ? <><Title>Informações sobre o vendedor:</Title>
              <ImageContainer><img alt="" src={items[0].Enrollment.enrollmentUrl}/></ImageContainer>
              <Info>Nome: {items[0].Enrollment.name}</Info> 
              <Info>Total de vendas: {trades?.length}</Info>
              <Info>Concluídas: {trades?.filter((trade) => trade.tradeStatus==="COMPLETE").length}</Info>
              <Info>Em andamento: {trades?.filter((trade) => trade.tradeStatus==="INCOMPLETE").length}</Info> </>:
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
    </>
  );
}

const Container = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemContainer = styled.div`
  width: 50%;
  height: 80%;
  background: linear-gradient(45deg,#333333,#111111,#333333);
  border-radius: 10px;
  display: flex;
`;

const ItemInfo = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px;
  border-radius: 15px;
  background: linear-gradient(#555555,#000000,#555555);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
`;

const SellerInfo = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px;
  border-radius: 15px;
  background: linear-gradient(#555555,#000000,#555555);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
`;

const ImageContainer = styled.div`
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 10px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Button = styled.button`
  width: 250px;
  height: 60px;
  font-size: 25px;
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
`;

const Title = styled.div`
  font-size: 25px;
  padding:15px;
  text-align: center;
`;

const Info = styled.div`
  font-size: 20px;
  padding: 10px;
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
  left: 35%;
  position: absolute;
  width: 600px;
  height: 260px;
  background:  linear-gradient(#333333,#000000,#333333);
  border-radius: 10px;
  div{
    font-size: 20px;
  }
`;

