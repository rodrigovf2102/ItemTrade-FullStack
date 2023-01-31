import { useEffect, useState } from "react";
import { Grid } from "react-loader-spinner";
import styled from "styled-components";
import TopBar from "../components/TopBar";
import useEnrollment from "../hooks/api/useEnrollment";
import usePostEnrollment from "../hooks/api/usePostEnrollment";
import { Amount, CreditCard, EnrollmentPost, PaymentPost } from "../protocols";
import { InputPostGame, Entrar  } from "./games";
import PaymentCreditCardPage from "../components/creditCardForm";
import { getCardInfo } from "../usefull/creditCardInfo";
import useUpdateEnrollment from "../hooks/api/useUpdateEnrollment";
import usePostPayment from "../hooks/api/usePostPayment";
import { AiFillCheckCircle } from "react-icons/ai";
import useToken from "../hooks/useToken";
import BottomBar from "../components/BottomBar";
import errorMessagesAll from "../usefull/errorMessages";

export default function ProfilePage() {
  const { enrollment, getEnrollment } = useEnrollment();
  const { postEnrollment, postEnrollmentLoading } = usePostEnrollment();
  const { updateEnrollment, updateEnrollmentLoading } = useUpdateEnrollment();
  const token = useToken();
  const { postPayment } = usePostPayment();
  const [ postEnrollErrorMsg, setPostEnrollErrorMsg ] = useState([""]);
  const [ postPaymentErrorMsg, setPostPaymentErrorMsg ] = useState([""]);
  const [ colorMsg, setColorMsg ] = useState("red");
  const [ postNewEnroll, setPostNewEnroll ] = useState<EnrollmentPost>({ name: "", CPF: "", enrollmentUrl: undefined });
  const [ displayAddCredit, setDisplayAddCredit ] = useState("none");
  const [ displayBalance, setDisplayBalance ] = useState("flex");
  const [ displayWithdraw, setDisplayWithdraw ] = useState("none");
  const [ creditAmount, setCreditAmount ] = useState<Amount>({ amount: 0, paymentHash: "" });
  const [ keyPIX, setKeyPIX ] = useState("");

  function postEnrollForm(event : any) {
    event.preventDefault();
  }

  async function postEnroll() {
    try {
      if(postNewEnroll.enrollmentUrl==="")postNewEnroll.enrollmentUrl=undefined;
      await postEnrollment(postNewEnroll, "");
      await getEnrollment();
      setPostEnrollErrorMsg(["Cadastro alterado com sucesso!"]);
      setColorMsg("green");
    } catch (err) {
      setColorMsg("red");
      errorMessagesAll(err, setPostEnrollErrorMsg);
    }
  }

  async function addCredit() {
    const cardInfo = getCardInfo();
    if (verifyCardData(cardInfo) === "invalid") return;
    try {
      const payment : PaymentPost = {
        creditCardLastDigits: cardInfo.number.slice(-4),
        cardIssuer: cardInfo.issuer,
        cardName: cardInfo.name,
        value: creditAmount.amount
      };
      const payInfo = await postPayment(payment, "");
      creditAmount.paymentHash = payInfo.paymentHash;
      await updateEnrollment(creditAmount, "");
      creditAmount.amount=0;
      await getEnrollment();
      setPostPaymentErrorMsg(["OK"]);
    } catch (error) {
      setPostPaymentErrorMsg(["Erro, digite as informações novamente.."]);
    }
  }

  async function addWithdraw() {
    if(keyPIX.length<=3) {
      setPostPaymentErrorMsg(["Chave PIX incorreta..."]);
      return;
    }
    if(creditAmount.amount===0) {
      setPostPaymentErrorMsg(["Digite um valor de saldo..."]);
      return;
    }
    try {
      creditAmount.paymentHash = "saque";
      await updateEnrollment(creditAmount, "");
      creditAmount.amount=0;
      setKeyPIX("");
      await getEnrollment();
      setPostPaymentErrorMsg(["OK"]);
    } catch (error) {
      setPostPaymentErrorMsg(["Erro, digite as informações novamente..."]);
    }
  }

  function verifyCardData(cardInfo : CreditCard) {
    if (!cardInfo) {
      setPostPaymentErrorMsg(["Preencha os campos"]);
      return "invalid";
    }
    const invalidCardData =
      cardInfo.number.length !== 16 ||
      cardInfo.issuer === "" ||
      cardInfo.expiry.length !== 4 ||
      cardInfo.cvc.length !== 3 ||
      isNaN(Number(cardInfo.number)) ||
      isNaN(Number(cardInfo.cvc)) ||
      isNaN(Number(cardInfo.expiry));
    if (invalidCardData) {
      setPostPaymentErrorMsg(["Dados inválidos"]);
      return "invalid";
    }
    return "valid";
  }

  function displayChanges(display:string) {
    if(display==="addCredit") {
      setDisplayBalance("none");
      setDisplayAddCredit("flex");
      setDisplayWithdraw("none");
    }
    if(display==="withdrawCredit") {
      setDisplayAddCredit("none");
      setDisplayBalance("none");
      setDisplayWithdraw("flex");      
    }
    if(display==="balance") {
      setPostPaymentErrorMsg([""]);
      setDisplayAddCredit("none");
      setDisplayBalance("flex");
      setDisplayWithdraw("none");      
    }
  }

  useEffect(() => {
    if(enrollment)setPostNewEnroll({ ...postNewEnroll, name: enrollment.name,
      CPF: enrollment.CPF, enrollmentUrl: enrollment.enrollmentUrl });
  }, [enrollment]);

  return (
    <>
      <TopBar></TopBar>
      <Container>
        <EnrollmentContainer>
          { token ? <FormPostEnroll onSubmit={postEnrollForm}>
            <FormInfo>
              <div>Adicione as informações do cadastro:</div>
            </FormInfo>
            <InputPostGame value={postNewEnroll?.name} type="text" placeholder=" Digite o seu nome aqui..." onChange={(e) => {setPostNewEnroll({ ...postNewEnroll, name: e.target.value });}}/>
            <InputPostGame value={postNewEnroll?.CPF} type="text" placeholder=" Digite o seu CPF aqui..." onChange={(e) => {setPostNewEnroll({ ...postNewEnroll, CPF: e.target.value });}}/>
            <InputPostGame value={postNewEnroll?.enrollmentUrl} type="text" placeholder=" Digite a URL da imagem de seu perfil aqui..." onChange={(e) => {setPostNewEnroll({ ...postNewEnroll, enrollmentUrl: e.target.value });}}/>
            <Entrar disabled={postEnrollmentLoading} onClick={postEnroll} type="submit">
              {postEnrollmentLoading ? <Grid color="white" width="100px" height="200px" radius="8"></Grid> : "Alterar cadastro"}
            </Entrar>
            {postEnrollErrorMsg.map((msg) => <ErrorMessage color={colorMsg}>{msg}</ErrorMessage>) }
          </FormPostEnroll> : <FormPostEnroll>"Faça login para liberar essa área.."</FormPostEnroll>}
          <EnrollPayment display={displayBalance}>
            {enrollment ? <><EnrollInfoDiv>Imagem de perfil:</EnrollInfoDiv>
              <ImgContainer><img alt="" src={enrollment.enrollmentUrl}/></ImgContainer>
              <EnrollInfoDiv>Balanço: R${(enrollment?.balance/100).toFixed(2)}</EnrollInfoDiv>
              <EnrollInfoDiv>Balanço Congelado: R${(enrollment?.freezedBalance/100).toFixed(2)}</EnrollInfoDiv>
              <Button onClick={() => {displayChanges("addCredit");}}>Adicionar crédito</Button>
              <Button onClick={() => {displayChanges("withdrawCredit");}}>Retirar crédito</Button> </>
              :
              <EnrollInfoDiv>Finalize seu cadastro para liberar essa área...</EnrollInfoDiv>}
          </EnrollPayment>
          <EnrollPayment display={displayAddCredit}>
            <PaymentCreditCardPage />
            <InputCreditAmount type="text" placeholder=" Digite o valor a ser creditado..." onChange={(e) => {setCreditAmount({ ...creditAmount, amount: Number(e.target.value)*100 });}}/>
            <Button disabled={updateEnrollmentLoading} onClick={addCredit}>
              {updateEnrollmentLoading ? <Grid color="white" width="100px" height="200px" radius="8"></Grid> : "Finalizar Pagamento"}
            </Button>    
            {postPaymentErrorMsg.map((msg) => ( msg!=="OK"?<ErrorMessage color={colorMsg}>{msg}</ErrorMessage>:"") )}
            <Button onClick={() => {displayChanges("balance");}}>Voltar</Button>
            {postPaymentErrorMsg[0]==="OK" ? <Button>Depósito Realizado!<AiFillCheckCircle color="green" size="55px"></AiFillCheckCircle></Button> : ""}       
          </EnrollPayment>
          <EnrollPayment display={displayWithdraw}>
            <EnrollInfoDiv>Saldo disponivel para saque: R${(enrollment?.balance/100).toFixed(2)}</EnrollInfoDiv>
            <InputCreditAmount  type="text" placeholder=" Digite sua chave PIX" onChange={(e) => {setKeyPIX(e.target.value);}}/>
            <InputCreditAmount  type="text" placeholder=" Digite o valor a ser sacado..." onChange={(e) => {setCreditAmount({ ...creditAmount, amount: Number(e.target.value)*(-100) });}}/>
            {postPaymentErrorMsg.map((msg) => ( msg!=="OK"?<ErrorMessage color={colorMsg}>{msg}</ErrorMessage>:"") )}
            <Button disabled={updateEnrollmentLoading} onClick={addWithdraw}>
              {updateEnrollmentLoading ? <Grid color="white" width="100px" height="200px" radius="8"></Grid> : "Finalizar saque"}
            </Button>  
            <Button onClick={() => {displayChanges("balance");}}>Voltar</Button> 
            {postPaymentErrorMsg[0]==="OK" ? <Button>Saque Realizado!<AiFillCheckCircle color="green" size="55px"></AiFillCheckCircle></Button> : ""}    
          </EnrollPayment>
        </EnrollmentContainer>
      </Container>
      <BottomBar></BottomBar>
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

export const EnrollmentContainer = styled.div`
  width: 80% ;
  height: 80%;
  background-color: gray;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  object-fit: cover;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: gray;
  background: linear-gradient(#222222,#101010,#222222);
`;

const FormPostEnroll = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: center;
  justify-content: center;
  height: 90%;
  margin: 50px;
  border-radius: 15px;
  background: linear-gradient(#000000,#444444,#000000);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  font-size: 22px;
`;

const ImgContainer = styled.div`
  width: 60%;
  img{
    width: 100%;
    object-fit: cover;
    border-radius: 50px;
  }
`;

const Button = styled.button`
  min-width: 300px;
  height: 45px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
  border-radius: 15px;
  color: white;
  font-size: 20px;
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  overflow: hidden;
  margin: 5px;
  cursor: pointer;
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  :active{
    background: linear-gradient(#000000,#666666,#000000);
  }
`;

export type ColorMsg = { color:string };

const ErrorMessage = styled.div.attrs((props: ColorMsg) => ({
  color: props.color
}))`
  margin-top: 20px;
  color: ${props => props.color};
  font-size: 16px;
  margin-bottom: 5px;
`;

const EnrollInfoDiv = styled.div`
    font-size: 22px;
    margin: 10px;
`;

export type Display = { display:string}

const EnrollPayment = styled.div.attrs((props: Display) => ({
  display: props.display
}))`
  width: 50%;
  height: 90%;
  display: ${props => props.display};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px;
  border-radius: 15px;
  background: linear-gradient(#000000,#444444,#000000);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
`;

const InputCreditAmount = styled.input`
  height: 40px;
  width: 50%;
  margin-left: 20px;
  border-radius: 5px;
  font-size: 18px;
  margin-bottom: 15px;
`;

const FormInfo = styled.div`
  display: flex;
  font-size: 22px;
  width: 80%;
  justify-content: center;
  align-items: center;
`;

