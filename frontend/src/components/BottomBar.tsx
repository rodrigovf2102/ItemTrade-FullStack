import styled from "styled-components";
import img from "../assets/images/action.jpg";
import { device } from "../mediaqueries/devices";

export default function BottomBar() {
  return(
    <>
      <Espace></Espace>
      <Container>
        <Itens>
          <img alt="" src={img}/><div>@ 2023 ITEMTRADE. Todos os direitos reservados.</div>
        </Itens>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 60px;
  background: linear-gradient(#111111,#000000,#111111);
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Itens = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 10px;
  flex-wrap: wrap;
  img{
    width: 25px;
    margin-right: 20px;
  }
  div{
    text-align: center;
    font-size: 14px;
  }
  @media ${device.mobileM} {
    div{
      font-size: 11px;
    }
  }
`;

const Espace = styled.div`
  height: 60px;
`;

