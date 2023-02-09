import { useEffect, useState } from "react";
import { Grid } from "react-loader-spinner";
import styled from "styled-components";
import TopBar from "../components/TopBar";
import useEnrollment from "../hooks/api/useEnrollment";
import usePostEnrollment from "../hooks/api/usePostEnrollment";
import { Amount, CreditCard, EnrollmentPost, PaymentPost } from "../protocols";
import PaymentCreditCardPage from "../components/creditCardForm";
import { getCardInfo } from "../usefull/creditCardInfo";
import useUpdateEnrollment from "../hooks/api/useUpdateEnrollment";
import usePostPayment from "../hooks/api/usePostPayment";
import { AiFillCheckCircle } from "react-icons/ai";
import useToken from "../hooks/useToken";
import BottomBar from "../components/BottomBar";
import errorMessagesAll from "../usefull/errorMessages";
import { device } from "../mediaqueries/devices";
import images from "../assets/images/landscapes/images";

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
  const [ image ] = useState(images[Math.floor(Math.random() * 29) + 1]);

  function postEnrollForm(event : any) {
    event.preventDefault();
  }

  async function postEnroll() {
    setPostPaymentErrorMsg([""]);
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
    setPostEnrollErrorMsg([""]);
    const cardInfo = getCardInfo();
    if (verifyCardData(cardInfo) === "invalid") return;
    try {
      const payment : PaymentPost = {
        creditCardLastDigits: cardInfo.number.slice(-4),
        cardIssuer: cardInfo.issuer,
        cardName: cardInfo.name,
        value: creditAmount.amount
      };
      await postPayment(payment, "");
      await getEnrollment();
      setColorMsg("green");
      setPostPaymentErrorMsg(["OK"]);
    } catch (error) {
      setColorMsg("red");
      setPostPaymentErrorMsg(["Erro, digite as informações novamente.."]);
    }
  }

  async function addWithdraw() {
    setPostEnrollErrorMsg([""]);
    if(keyPIX.length<=3) {
      setPostPaymentErrorMsg(["Chave PIX incorreta..."]);
      setColorMsg("red");
      return;
    }
    if(creditAmount.amount===0) {
      setPostPaymentErrorMsg(["Digite um valor de saldo..."]);
      setColorMsg("red");
      return;
    }
    try {
      creditAmount.paymentHash = "saque";
      await updateEnrollment(creditAmount, "");
      creditAmount.amount=0;
      setKeyPIX("");
      await getEnrollment();
      setColorMsg("green");
      setPostPaymentErrorMsg(["OK"]);
    } catch (error) {
      setColorMsg("red");
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
      setColorMsg("red");
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
      <Container randomImage={image}>
        <EnrollmentContainer>
          { token ? <FormPostEnroll onSubmit={postEnrollForm}>
            <FormInfo>
              <div>Adicione as informações do cadastro:</div>
            </FormInfo>
            <InputPostGame value={postNewEnroll?.name} type="text" placeholder=" Digite o seu nome aqui..." onChange={(e) => {setPostNewEnroll({ ...postNewEnroll, name: e.target.value });}}/>
            <InputPostGame value={postNewEnroll?.CPF} type="text" placeholder=" Digite o seu CPF aqui..." onChange={(e) => {setPostNewEnroll({ ...postNewEnroll, CPF: e.target.value });}}/>
            <InputPostGame value={postNewEnroll?.enrollmentUrl} type="text" placeholder=" Digite a URL da imagem de seu perfil aqui..." onChange={(e) => {setPostNewEnroll({ ...postNewEnroll, enrollmentUrl: e.target.value });}}/>
            <Button disabled={postEnrollmentLoading} onClick={postEnroll} type="submit">
              {postEnrollmentLoading ? <Grid color="white" width="72px" height="200px" radius="5"></Grid> : "Alterar cadastro"}
            </Button>
            {postEnrollErrorMsg.map((msg) => <ErrorMessage color={colorMsg}>{msg}</ErrorMessage>) }
          </FormPostEnroll> : <FormPostEnroll>Faça login para liberar essa área..</FormPostEnroll>}
          <EnrollPayment display={displayBalance}>
            {enrollment ? <><EnrollImgInfo>Imagem de perfil:</EnrollImgInfo>
              <ImgContainer><img alt="" src={enrollment.enrollmentUrl?.toString()}/></ImgContainer>
              <EnrollInfoDivGreen>Balanço: R${(enrollment?.balance/100).toFixed(2)}</EnrollInfoDivGreen>
              <EnrollInfoDivBlue>Balanço Congelado: R${(enrollment?.freezedBalance/100).toFixed(2)}</EnrollInfoDivBlue>
              <Button onClick={() => {displayChanges("addCredit");}}>Adicionar crédito</Button>
              <Button onClick={() => {displayChanges("withdrawCredit");}}>Retirar crédito</Button> </>
              :
              <EnrollInfoDiv>Finalize seu cadastro para liberar essa área...</EnrollInfoDiv>}
          </EnrollPayment>
          <EnrollPayment display={displayAddCredit}>
            <PaymentCreditCardPage />
            <PaymentDiv>
              <InputCreditAmount type="text" placeholder=" Digite o valor a ser creditado..." onChange={(e) => {setCreditAmount({ ...creditAmount, amount: Number(e.target.value)*100 });}}/>
              <Button disabled={updateEnrollmentLoading} onClick={addCredit}>
                {updateEnrollmentLoading ? <Grid color="white" width="72px" height="200px" radius="5"></Grid> : "Finalizar Pagamento"}
              </Button>    
              {postPaymentErrorMsg.map((msg) => ( msg!=="OK"?<ErrorMessage color={colorMsg}>{msg}</ErrorMessage>:"") )}
              <Button onClick={() => {displayChanges("balance");}}>Voltar</Button>
              {postPaymentErrorMsg[0]==="OK" ? <Button>Depósito Realizado!<AiFillCheckCircle color="green" size="55px"></AiFillCheckCircle></Button> : ""}       
            </PaymentDiv>
          </EnrollPayment>
          <EnrollPayment display={displayWithdraw}>
            <EnrollInfoDivGreen>Saldo disponivel para saque: R${(enrollment?.balance/100).toFixed(2)}</EnrollInfoDivGreen>
            <InputCreditAmount  type="text" placeholder=" Digite sua chave PIX" onChange={(e) => {setKeyPIX(e.target.value);}}/>
            <InputCreditAmount  type="text" placeholder=" Digite o valor a ser sacado..." onChange={(e) => {setCreditAmount({ ...creditAmount, amount: Number(e.target.value)*(-100) });}}/>
            {postPaymentErrorMsg.map((msg) => ( msg!=="OK"?<ErrorMessage color={colorMsg}>{msg}</ErrorMessage>:"") )}
            <Button disabled={updateEnrollmentLoading} onClick={addWithdraw}>
              {updateEnrollmentLoading ? <Grid color="white" width="72px" height="200px" radius="5"></Grid> : "Finalizar saque"}
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

export type DisplayImage = { display:string };

const Container = styled.div.attrs((props: any) => ({
  randomImage: props.randomImage
}))`
  width: 100%;
  min-height: calc(100vh - 130px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${props => props.randomImage});
  background-size: cover;
`;

export const EnrollmentContainer = styled.div`
  width: auto ;
  height: auto;
  border-radius: 10px;
  margin-top: 15px;
  object-fit: cover;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
  background: linear-gradient(#222222,#101010,#222222);
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.6);
  flex-wrap: wrap;
  @media ${device.mobileM} {

  }
`;

const FormPostEnroll = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  align-items: center;
  justify-content: center;
  height: 550px;
  margin: 20px;
  border-radius: 15px;
  background: linear-gradient(#000000,#444444,#000000);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  text-align: center;
  @media ${device.mobileM} {
    min-width: unset;
    height: auto;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 90%;
  }
`;

const ImgContainer = styled.div`
  width: 200px;
  height: 200px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const Button = styled.button`
  width: 50%;
  min-width: 200px;
  max-width: 350px;
  height: 52px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  color: white;
  font-size: 17px;
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  overflow: hidden;
  margin-top: 10px;
  cursor: pointer;
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  :active{
    background: linear-gradient(#000000,#666666,#000000);
  }
  @media ${device.mobileM} {
    height: 45px;
    font-size: 14px;
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
  @media ${device.mobileM} {
    margin-top: 10px;
    font-size: 13px;
  }
`;

const EnrollInfoDiv = styled.div`
    font-size: 17px;
    margin: 10px;
    text-align: center;
    @media ${device.mobileM} {
    font-size: 15px;
  }
`;

const EnrollInfoDivGreen = styled.div`
    font-size: 22px;
    margin: 10px;
    text-align: center;
    color: green;
    font-weight: 700;
    @media ${device.mobileM} {
    font-size: 15px;
  }
`;

const EnrollInfoDivBlue = styled.div`
    font-size: 22px;
    margin: 10px;
    text-align: center;
    color: blue;
    font-weight: 700;
    @media ${device.mobileM} {
    font-size: 15px;
  }
`;

export type Display = { display:string}

const EnrollPayment = styled.div.attrs((props: Display) => ({
  display: props.display
}))`
  width: 500px;
  height: 550px;
  display: ${props => props.display};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  margin: 20px;
  background: linear-gradient(#000000,#444444,#000000);
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  overflow: auto;
  @media ${device.mobileM} {
    width: 90%;
    height: auto;
    padding-top: 20px;
    padding-bottom: 20px;
  }
`;

const InputCreditAmount = styled.input`
  height: 40px;
  width: 60%;
  border-radius: 5px;
  font-size: 17px;
  @media ${device.mobileM} {
    font-size: 15px;
  }
`;

const PaymentDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
`;

const FormInfo = styled.div`
  display: flex;
  font-size: 22px;
  width: 80%;
  justify-content: center;
  align-items: center;
  text-align: center;
  @media ${device.mobileM} {
    font-size: 17px;
  }
`;

const InputPostGame = styled.input`
  margin-top: 20px;
  width: 75%;
  max-width: 400px;
  height: 45px;
  background-color: white;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 700;
  @media ${device.mobileM} {
    width: 80%;
    font-size: 14px;
  }
  `;

const EnrollImgInfo = styled.div`
    font-size: 24px;
    padding-bottom: 15px;
    @media ${device.mobileM} {
      font-size: 17px;
  }
`;
