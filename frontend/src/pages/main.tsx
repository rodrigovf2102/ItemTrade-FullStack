import TopBar from "../components/TopBar";
import styled from "styled-components";
import BottomBar from "../components/BottomBar";
import { device } from "../mediaqueries/devices";
import images from "../assets/images/landscapes/images";

export default function MainPage() {
  return(
    <>
      <TopBar></TopBar>
      <Container randomImage={images[Math.floor(Math.random() * 29) + 1]}>
        <Instrucoes>
          <Tittle>Site de compra e venda de itens de jogos online!</Tittle>
          <Subtitle>Instruções:</Subtitle>
          <div>1. Termine seu cadastro, em Perfil, para poder postar e comprar itens!</div>
          <div>2. Para comprar, adicione créditos na seção de depósitos!</div>
          <div>3. Para vender, anuncie seu item na seção de Itens!</div>
          <div>4. Para comprar, selecione um item na seção de Items e confirme compra!</div>
          <div>5. Quando um usuário comprar seu item, a negociação aparecerá na seção de vendas!</div>
          <div>6. Quando você comprar um item, a negociação aparecerá na seção de compras!</div>
          <div>7. Um chat de negociação será aberto para que vocês marquem a troca do item!</div>
          <div>8. O crédito do vendedor só será liberado após os dois confirmarem que a troca ocorreu!</div>
          <div>9. O crédito pode ser sacado para sua conta bancária na seção do perfil!</div>
        </Instrucoes>
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  min-height: calc(100vh - 130px);
  background-image: url(${props => props.randomImage});
  background-size: cover;
  img{
    width: 30%;
    max-width: 550px;
    min-width: 280px;
    border-radius: 20px;
  }
`;

const Instrucoes = styled.div`
  width: 60%;
  font-size: 20px;
  margin: 10px;
  background: linear-gradient(#222222,#000000,#222222);
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 20px;
  div{
    padding: 10px;
  }
  @media ${device.mobileM} {
    width: 90%;
    font-size: 14px;
  }
`;

const Tittle = styled.div`
  font-size: 40px;
  text-align: center;
  @media ${device.mobileM} {
    font-size: 24px;
    text-align: center;
  }
`;

const Subtitle = styled.div`
  font-size: 30px;
  @media ${device.mobileM} {
    font-size: 20px;
  }
`;

