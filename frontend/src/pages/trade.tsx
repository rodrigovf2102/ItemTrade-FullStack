import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../components/TopBar";
import useEnrollment from "../hooks/api/useEnrollment";
import useTrade from "../hooks/api/useTrade";
import useUpdateTradeStatus from "../hooks/api/useUpdateTradeStatus";
import { FiSend } from "react-icons/fi";
import usePostMessage from "../hooks/api/usePostMessage";
import useTradeMessages from "../hooks/api/useTradeMessages";
import { MessagePost } from "../protocols";
import useToken from "../hooks/useToken";
import { device } from "../mediaqueries/devices";
import images from "../assets/images/landscapes/images";
import BottomBar from "../components/BottomBar";

export default function TradePage() {
  const { tradeId } = useParams();
  const { trade, getTrade, tradeLoading } = useTrade();
  const { enrollment } = useEnrollment();
  const { updateTradeStatus, updateTradeStatusLoading } = useUpdateTradeStatus();
  const { postMessage, postMessageLoading } = usePostMessage();
  const { tradeMessages, getTradeMessages, tradeMessagesLoading } = useTradeMessages();
  const [ errorMessage, setErrorMessage ] = useState([""]);
  const [ message, setMessage ] = useState("");
  const [ iteratorInterval, setIteratorIterval ] = useState(0);
  const [ image ] = useState(images[Math.floor(Math.random() * 24) + 1]);
  const defaultElemet = document.querySelector("div") as HTMLDivElement;
  const messageBox = useRef<HTMLDivElement>(defaultElemet);
  const token = useToken();

  useEffect(() => {
    getTrade(Number(tradeId), "");
    getTradeMessages(Number(tradeId), "");
  }, []);

  useEffect(() => {
    messageBox?.current.scrollTo(0, messageBox?.current?.scrollHeight);
  }, [tradeMessages]);

  useEffect(() => {
    const intervalGetTradeMessages = setInterval(() => {
      setIteratorIterval(iteratorInterval+1);
      getTradeMessages(Number(tradeId), "");
    }, 10000);
    return () => clearInterval(intervalGetTradeMessages);
  }, [iteratorInterval]);

  async function confirmDelivery() {
    if(enrollment.id === trade.buyerEnrollmentId) {
      if(trade.buyerStatus === "COMPLETE") {
        setErrorMessage(["Status já está completo"]);
        return;        
      };
    }
    if(enrollment.id === trade.sellerEnrollmentId) {
      if(trade.sellerStatus === "COMPLETE") {
        setErrorMessage(["Status já está completo"]);
        return;
      }
    }
    try {
      await updateTradeStatus(trade.id, "");
      await getTrade(Number(tradeId), "");
    } catch (error) {
      setErrorMessage([error.message]);
    }
  }

  async function sendMessage() {
    const messagePost : MessagePost = {
      text: message,
      tradeId: trade.id
    };
    try {
      await postMessage(messagePost, "");
      await getTradeMessages(trade.id, "");
      setMessage("");
    } catch (error) {
      alert(error.message);
    }
  }

  function handleKeyDown(event : React.KeyboardEvent<HTMLButtonElement>) {
    if(event.key === "Enter") sendMessage();
  }

  function preventDefault(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <>
      <TopBar></TopBar>
      <Container randomImage={image}>
        <EnrollmentContainer>
          {tradeLoading ? "Carregando..." : ""}
          {trade && token ? 
            <TradeContainer>
              <TradeInfo>
                <EnrollmentInfos>
                  <BuyerName>Comprador: {trade.EnrollmentBuyer.name}</BuyerName>
                  <SellerName>Vendedor: {trade.EnrollmentSeller.name}</SellerName>
                  {trade?.buyerStatus==="COMPLETE"?
                    <InfoDone>Status de venda do comprador: {trade.buyerStatus}</InfoDone>
                    :
                    <InfoIncomplete>Status de venda do comprador: {trade.buyerStatus}</InfoIncomplete>}
                  {trade?.sellerStatus==="COMPLETE"? 
                    <InfoDone>Status de venda do vendedor: {trade.sellerStatus}</InfoDone>
                    :
                    <InfoIncomplete>Status de venda do vendedor: {trade.sellerStatus}</InfoIncomplete>}
                  {trade?.tradeStatus==="COMPLETE"? 
                    <InfoDone>Status de venda do vendedor: {trade.tradeStatus}</InfoDone>
                    :
                    <InfoIncomplete>Status da venda: {trade.tradeStatus}</InfoIncomplete>}
                  {enrollment?.id === trade.buyerEnrollmentId ? 
                    <Button onClick={confirmDelivery} disabled={updateTradeStatusLoading}>Confirmar Recebimento do item</Button> :
                    <Button onClick={confirmDelivery} disabled={updateTradeStatusLoading}>Confirmar Entrega do item</Button>}
                  {errorMessage.map((msg) => ( msg!=="OK"?<ErrorMessage>{msg}</ErrorMessage>:"") )}
                </EnrollmentInfos>
                <ItemInfos>
                  <SellerName>Item: {trade.Item.name}</SellerName>
                  <img alt="" src={trade.Item.itemUrl}/>
                  <BuyerName>Quantidade: {trade.Item.amount}</BuyerName>
                  <InfoDone>Preço: R${(trade.Item.price/100).toFixed(2)}</InfoDone>
                </ItemInfos>
              </TradeInfo>
              <MessageInfo>
                <MessageBox ref={messageBox}>
                  <div>Combine a troca do item com seu negociador por aqui!</div>
                  <div>{tradeMessages?.map((tradeMessage) => (
                    (tradeMessage.Message.enrollmentId === trade.buyerEnrollmentId ? 
                      (<BuyerName>
                        ({tradeMessage.Message.date.slice(0, 10)} - {tradeMessage.Message.date.slice(11, 19)}) - {trade.EnrollmentBuyer.name} disse: {tradeMessage.Message.text}
                      </BuyerName>)
                      :
                      (<SellerName>
                        ({tradeMessage.Message.date.slice(0, 10)} - {tradeMessage.Message.date.slice(11, 19)}) - {trade.EnrollmentSeller.name} disse: {tradeMessage.Message.text}
                      </SellerName>)
                    )
                  ))}</div>
                </MessageBox>
                <TypeMessageBox onSubmit={preventDefault}>
                  <TypeBox value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Digite sua mensagem aqui..."></TypeBox>
                  <button tabIndex={0} onKeyDown={handleKeyDown} disabled={tradeMessagesLoading || postMessageLoading} onClick={sendMessage}>
                    <FiSend size="40px" color="black"></FiSend>
                  </button>
                </TypeMessageBox>
                
              </MessageInfo>
            </TradeContainer> :
            !trade && token ?  <div>Esse trade não está relacionado com seu cadastro...</div>:
              <div>Faça seu login para visualizar conteudo...</div>}
        </EnrollmentContainer>
      </Container>
      <BottomBar></BottomBar>
    </>
  );
}

const MessageBox = styled.div`
    width: 100%;
    height: 300px;
    background-color: #ffffff;
    border-radius: 10px;
    border: 5px solid gray;
    padding: 10px;
    overflow: auto;
    color: black;
    div{
      margin: 5px;
      font-size: 18px;
      line-height: 25px;
    }
  `;

export type DisplayImage = { display:string };

const Container = styled.div.attrs((props: any) => ({
  randomImage: props.randomImage
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${props => props.randomImage});
  background-size: cover;
  min-height: calc(100vh - 130px);
`;

const TradeInfo = styled.div`
  height: auto;
  width: 96%;
  margin: 15px;
  padding: 20px;
  border-radius: 15px;
  background: linear-gradient(#333333,#000000,#333333);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  @media ${device.mobileM} {
    width: 100%;
    margin: 0;
    padding: 0;
    margin-top: 20px;
    background: none;
  }
`;

const TypeMessageBox = styled.form`
  width: 100%;
  height: 50px;
  display: flex;
  button{
    background-color: white;
    border-radius: 10px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    :hover{
      background-color: gray;
    }
  }
`;

const TypeBox = styled.input`
  background: white;
  width: 100%;
  height: 100%;
  font-size: 18px;
  border-radius: 10px;
`;

const MessageInfo = styled.div`
  height: 45%;
  width: 95%;
  border-radius: 15px;
  background: linear-gradient(#333333,#000000,#333333);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  margin: 15px;
  padding: 20px;
  @media ${device.mobileM} {
  width: 100%;
  padding: 0px;
  margin: 0px;
  }
`;

const TradeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const EnrollmentContainer = styled.div`
  width: 80% ;
  height: 90%;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  object-fit: cover;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.5);
  background: linear-gradient(90deg,#222222,#111111,#222222);
  @media ${device.mobileM} {
    width: 100%;
    margin: 0;
    padding: 0;
    height: auto;
    background: none;
  }
`;

const EnrollmentInfos = styled.div`
  max-height: 300px;
  width: 40%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(#000000,#222222,#000000);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  text-align: center;
  padding: 10px;
 div{
  padding: 5px;
  font-size: 17px;
  height: auto;
 }
 @media ${device.mobileM} {
  width: 100%;
  margin-bottom: 15px;
  div{
    font-size: 14px;
  }
}
`;

const ItemInfos = styled.div`
  max-height: 350px;
  background: linear-gradient(#000000,#222222,#000000);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  min-width: 340px;
  margin-left: 10px;
  text-align: center;
  padding: 10px;
  img{
    width: 150px;
    height: 150px;
    object-fit: cover;
    margin-top: 5px;
  }
  div{
    font-size: 17px;
    line-height: 23px;
  }
  @media ${device.mobileM} {
    width: 100%;
    margin-left: 0;
    margin-bottom: 15px;
  div{
    font-size: 14px;
    line-height: 18px;
  }
}
`;

export const InfoDone = styled.div`
  font-size: 20px;
  color: green;
  font-weight: 700;
`;

export const InfoIncomplete = styled.div`
  font-size: 20px;
  color: red;
  font-weight: 700;
`;

const BuyerName = styled.div`
  font-size: 20px;
  color: blue;
`;

const SellerName = styled.div`
  color: purple;
  font-size: 20px;
`;

export const Button = styled.button`
  width: 250px;
  height: 55px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 700;
  margin-top: 10px;
  cursor: pointer;
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  :active{
    background: linear-gradient(#000000,#666666,#000000);
  }
  @media ${device.mobileM} {
    font-size: 13px;
    height: 50px;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 5px;
  color: red;
  font-size: 14px;
  height: auto;
`;
