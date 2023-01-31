import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../components/TopBar";
import useEnrollment from "../hooks/api/useEnrollment";
import useTrade from "../hooks/api/useTrade";
import useUpdateTradeStatus from "../hooks/api/useUpdateTradeStatus";
import { Button } from "./item";
import { ErrorMessage } from "./login";
import { FiSend } from "react-icons/fi";
import usePostMessage from "../hooks/api/usePostMessage";
import useTradeMessages from "../hooks/api/useTradeMessages";
import { MessagePost } from "../protocols";
import useToken from "../hooks/useToken";

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
    }, 5000);
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
      <Container>
        <EnrollmentContainer>
          {tradeLoading ? "Carregando..." : ""}
          {trade && token ? 
            <TradeContainer>
              <TradeInfo>
                <EnrollmentInfos>
                  <div>Comprador: {trade.EnrollmentBuyer.name}</div>
                  <div>Vendedor: {trade.EnrollmentSeller.name}</div>
                  <div>Status de venda do comprador: {trade.buyerStatus}</div>
                  <div>Status de venda do vendedor: {trade.sellerStatus}</div>
                  <div>Status da venda: {trade.tradeStatus}</div>
                  {enrollment?.id === trade.buyerEnrollmentId ? 
                    <Button onClick={confirmDelivery} disabled={updateTradeStatusLoading}>Confirmar Recebimento do item</Button> :
                    <Button onClick={confirmDelivery} disabled={updateTradeStatusLoading}>Confirmar Entrega do item</Button>}
                  {errorMessage.map((msg) => ( msg!=="OK"?<ErrorMessage>{msg}</ErrorMessage>:"") )}
                </EnrollmentInfos>
                <ItemInfos>
                  <div>Item: {trade.Item.name}</div>
                  <div>Quantidade: {trade.Item.amount}, Preço pago: R${(trade.Item.price/100).toFixed(2)}</div>
                  <img alt="" src={trade.Item.itemUrl}/>
                </ItemInfos>
              </TradeInfo>
              <MessageInfo>
                <MessageBox ref={messageBox}>
                  <div>Combine a troca do item com seu negociador por aqui!</div>
                  <div>{tradeMessages?.map((tradeMessage) => (
                    (tradeMessage.Message.enrollmentId === trade.buyerEnrollmentId ? 
                      (<div>
                        ({tradeMessage.Message.date.slice(0, 10)} - {tradeMessage.Message.date.slice(11, 19)}) - {trade.EnrollmentBuyer.name} disse: {tradeMessage.Message.text}
                      </div>)
                      :
                      (<div>
                        ({tradeMessage.Message.date.slice(0, 10)} - {tradeMessage.Message.date.slice(11, 19)}) - {trade.EnrollmentSeller.name} disse: {tradeMessage.Message.text}
                      </div>)
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
    </>
  );
}

const MessageBox = styled.div`
    width: 90%;
    height: 70%;
    background-color: #ffffff;
    border-radius: 10px;
    border: 5px solid gray;
    padding: 10px;
    overflow: auto;
    div{
      margin: 5px;
      font-size: 18px;
      line-height: 25px;
    }
  `;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
`;

const TradeInfo = styled.div`
  height: 45%;
  width: 96%;
  margin: 20px;
  border-radius: 15px;
  background: linear-gradient(#333333,#000000,#333333);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  display: flex;
`;

const TypeMessageBox = styled.form`
  width: 90%;
  height: 15%;
  display: flex;
  button{
    background-color: white;
    border-radius: 10px;
    width: 5%;
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
  width: 95%;
  height: 100%;
  font-size: 18px;
  border-radius: 10px;
`;

const MessageInfo = styled.div`
   height: 45%;
  width: 96%;
  margin: 20px;
  border-radius: 15px;
  background: linear-gradient(#333333,#000000,#333333);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
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
  color: gray;
  background: linear-gradient(90deg,#222222,#111111,#222222);
`;

const EnrollmentInfos = styled.div`
  height: auto;
  width: 50%;
  display: flex;
  flex-direction: column;
 align-items: center;
 justify-content: center;
 margin: 30px;
 background: linear-gradient(#000000,#222222,#000000);
 box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
 border-radius: 20px;
 div{
  margin: 5px;
  font-size: 20px;
 }
`;

const ItemInfos = styled.div`
  height: auto;
  background: linear-gradient(#000000,#222222,#000000);
 box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
 border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  margin: 30px;
  img{
    width: 200px;
    height: 50%;
    object-fit: cover;
    margin: 20px;
  }
  font-size: 20px;
`;
