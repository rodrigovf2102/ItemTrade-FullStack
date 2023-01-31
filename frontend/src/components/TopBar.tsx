import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import UserContext from "../contexts/UserContext";
import { MdOutlineExitToApp } from "react-icons/md";

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
        <Button>{userData.email? userData.email : "Login: "}<MdOutlineExitToApp onClick={logout} size={"25px"}></MdOutlineExitToApp></Button>
        <Button onClick={() => (navigate("/"))}>Início</Button>
        <Button onClick={() => (navigate("/games"))}>Games</Button>
        <Button onClick={() => (navigate("/servers/0"))}>Servers</Button>
        <Button onClick={() => (navigate("/items/0"))}>Items</Button>
        <Button onClick={() => (navigate(`/negotiations/${tradeType.PURCHASE}`))}>Compras</Button>
        <Button onClick={() => (navigate(`/negotiations/${tradeType.SALE}`))}>Vendas</Button>
        <Button onClick={() => (navigate(`/profile/${userData.id}`))}>Perfil</Button>
      </Itens>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Itens = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 20px;
  flex-wrap: wrap;
`;

const Button = styled.div`
  min-width: 100px;
  height: 50px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 15px;
  cursor: pointer;
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  :active{
    background: linear-gradient(#000000,#666666,#000000);
  }
`;
