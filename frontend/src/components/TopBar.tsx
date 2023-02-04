import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import UserContext from "../contexts/UserContext";
import { MdOutlineExitToApp } from "react-icons/md";
import { GiSwordSmithing } from "react-icons/gi";
import { AiFillHome } from "react-icons/ai";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaGamepad, FaMoneyBillAlt } from "react-icons/fa";
import { IoServer } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { device } from "../mediaqueries/devices";
import { RiLogoutBoxLine } from "react-icons/ri";

export default function TopBar() {
  const { userData, setUserData, deleteUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const tradeType = { PURCHASE: "PURCHASE", SALE: "SALE" };

  function logout() {
    setUserData({});
    deleteUserData();
    navigate("/signin");
  }

  return(
    <Container>
      <Itens>
        <Button>{userData.email? userData.email.split("@")[0] : "Login: "}<MdOutlineExitToApp onClick={logout} size={"25px"}></MdOutlineExitToApp></Button>
        <ButtonMobile>{userData.email? <RiLogoutBoxLine onClick={logout} size={"25px"}></RiLogoutBoxLine> : <MdOutlineExitToApp onClick={logout} size={"25px"}></MdOutlineExitToApp> }</ButtonMobile>

        <Button onClick={() => (navigate("/"))}>Início</Button>
        <ButtonMobile onClick={() => (navigate("/"))}><AiFillHome size={"25px"}> </AiFillHome></ButtonMobile>

        <Button onClick={() => (navigate("/games"))}>Games</Button>
        <ButtonMobile onClick={() => (navigate("/games"))}><FaGamepad size={"25px"}> </FaGamepad></ButtonMobile>

        <Button onClick={() => (navigate("/servers/0"))}>Servers</Button>
        <ButtonMobile onClick={() => (navigate("/servers/0"))}><IoServer size={"25px"}> </IoServer></ButtonMobile>

        <Button onClick={() => (navigate("/items/0"))}>Items</Button>
        <ButtonMobile onClick={() => (navigate("/items/0"))}><GiSwordSmithing size={"25px"}> </GiSwordSmithing></ButtonMobile>

        <Button onClick={() => (navigate(`/negotiations/${tradeType.PURCHASE}`))}>Compras</Button>
        <ButtonMobile onClick={() => (navigate(`/negotiations/${tradeType.PURCHASE}`))}><BsFillCartCheckFill size={"25px"}> </BsFillCartCheckFill></ButtonMobile>

        <Button onClick={() => (navigate(`/negotiations/${tradeType.SALE}`))}>Vendas</Button>
        <ButtonMobile onClick={() => (navigate(`/negotiations/${tradeType.SALE}`))}><FaMoneyBillAlt size={"25px"}> </FaMoneyBillAlt></ButtonMobile>
        
        <Button onClick={() => (navigate(`/profile/${userData.id}`))}>Perfil</Button>
        <ButtonMobile onClick={() => (navigate(`/profile/${userData.id}`))}><CgProfile size={"25px"}> </CgProfile></ButtonMobile>
      </Itens>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 70px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Itens = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 10px;
  flex-wrap: wrap;
`;

const Button = styled.div`
  min-width: 80px;
  height: 42px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 15px;
  font-size: 13px;
  cursor: pointer;
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  :active{
    background: linear-gradient(#000000,#666666,#000000);
  }
  @media ${device.mobileM} {
    display: none;
  }
`;

const ButtonMobile = styled.div`
  display: none;
  @media ${device.mobileM} {
    display: flex;
    color: white;
  }
`;
