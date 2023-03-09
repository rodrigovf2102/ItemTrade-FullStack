import styled from "styled-components";
import img from "../assets/images/action.jpg";
import { device } from "../mediaqueries/devices";

export default function BottomBar() {
  return(
    <>
      <Espace></Espace>
      <Container>
        <Itens>
          <img alt="" src={img}/>
          <div>@ 2023 ITEMTRADE. Desenvolvido por Rodrigo Vieira Fonseca, mais informações:
            <a href="https://github.com/rodrigovf2102"> Github</a>
          </div>
        </Itens>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 100%;
  height: 60px;
  background: linear-gradient(#111111,#000000,#111111);
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  @media ${device.mobileM} {
    height: unset;
    height: 45px;
  }
`;

const Itens = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin: 10px;
  flex-wrap: wrap;
  img{
    width: 25px;
    margin-right: 20px;
  }
  div{
    font-size: 14px;
  }
  @media ${device.mobileM} {
    margin: 0;
    height: 100%;
    text-align: center;
    div{
      font-size: 11px;
    }
    img{
      display: none;
    }
  }
`;

const Espace = styled.div`
  height: 60px;
  @media ${device.mobileM} {
    height: 45px;
  }
`;

