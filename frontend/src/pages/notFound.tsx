import TopBar from "../components/TopBar";
import styled from "styled-components";
import BottomBar from "../components/BottomBar";
import { device } from "../mediaqueries/devices";
import img from "../assets/images/action.gif";

export default function NotFoundPage() {
  return (
    <>
      <TopBar></TopBar>
      <Container>
        <img alt="" src={img}/>
        <div>404 : Página não encontrada</div>
      </Container>
      <BottomBar></BottomBar>
    </>
  );
}

const Container = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 35px;
  text-align: center;
  img{
    width: 40%;
  }
  @media ${device.mobileM} {
    font-size: 20px;
  }
`;
