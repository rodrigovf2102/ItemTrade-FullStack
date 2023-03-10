import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import { GameInfo, ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName, ItemWithNameAndType } from "../protocols";
import { FormContainer, Form, Input, 
  FormPostGame, FormInfo, InputPostGame, Entrar, ErrorMessage, DisplayModal } from "./games";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Grid } from "react-loader-spinner";
import UserContext from "../contexts/UserContext";
import useItems from "../hooks/api/useItems";
import styled from "styled-components";
import usePostItem from "../hooks/api/usePostItem";
import BottomBar from "../components/BottomBar";
import errorMessagesAll from "../usefull/errorMessages";
import { device } from "../mediaqueries/devices";
import images from "../assets/images/landscapes/images";

export default function ItemsPage() {
  const { items, getItems, itemsLoading } = useItems();
  const { postItemLoading, postItem } = usePostItem();
  const { userData } = useContext(UserContext);
  const [ itemName, setItemName] = useState<ItemWithNameAndType>({ name: "", itemType: "Todos" });
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [ gameInfo, setGameInfo ] = useState<GameInfo>({ gameName: "", serverName: "" });
  const [ postItemErrorMessage, setPostItemErrorMessage] = useState<string[]>([]);
  const [ modalStatus, setModalStatus ] = useState("none");
  const [ postNewItem, setPostNewItem] = useState<ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName>
  ({ name: "", price: 0, amount: 0, itemUrl: "", gameName: "", serverName: "", itemType: "" });
  const itemCategories = ["Selecione um tipo...", "Dinheiro", "Equipamento", "Recurso", "Utilizavel", "Raros"];
  const itemCategoriesGet = ["Todos", "Dinheiro", "Equipamento", "Recurso", "Utilizavel", "Raros"];
  const [ image ] = useState(images[Math.floor(Math.random() * 29) + 1]);

  useEffect(() => {
    async function refreshItems() {
      await getItems(Number(serverId), itemName.itemType, itemName.name, "");
    }
    refreshItems();
  }, [serverId, itemName]);

  function navigateItem(itemId:number) {
    navigate(`/item/${itemId}`);
  }

  useEffect(() => {
    getGameNameAndServerName();
  }, [items]);

  async function postItemForm() {
    try {
      await postItem(postNewItem, userData.token);
      setModalStatus("none");
      await getItems(Number(serverId), "Todos", "", "");
    } catch (err) {
      errorMessages(err);
    }
  }

  function getGameNameAndServerName() {
    let game : string | undefined;
    let server : string | undefined;
    if(items?.length>0) {
      game = items[0].Game.name;
      game = items.find(item => item.Game.name!==game)?.Game.name;
      if(!game) gameInfo.gameName =  `Jogo ${items[0].Game.name} e `;
      if(game) gameInfo.gameName = "Todos os Jogos e ";

      server = items[0].Server.name;
      server = items.find(item => item.Server.name!==server)?.Server.name;
      if(!server && !game) gameInfo.serverName = `Servidor ${items[0].Server.name}`;
      if(!server && game) gameInfo.serverName = `Servidores ${items[0].Server.name}`;
      if(server && !game) gameInfo.serverName = "Todos os Server do jogo";
      if(server && game) gameInfo.serverName = "Todos os Servers";
      
      setGameInfo({ ...gameInfo });
    } 
  }

  function errorMessages(error : any) {
    errorMessagesAll(error, setPostItemErrorMessage);
  }

  function postForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function openModal() {
    setModalStatus("flex");
    window.scrollTo(0, 0);
  }

  function closeModal() {
    setModalStatus("none");
    setPostItemErrorMessage([""]);
  }

  return(
    <>
      <TopBar></TopBar>
      <Container randomImage={image}>
        <FormContainer>
          <Form>
            <Input readOnly={itemsLoading} type="text" placeholder=" Procure um item aqui..."  onChange={(e) => {setItemName({ ...itemName, name: e.target.value  });}}/>
            <SelectPostGame placeholder=" Selecione o tipo do item..." onChange={(e) => {setItemName({ ...itemName, itemType: e.target.value  });}}>
              {itemCategoriesGet.map((categorie) => (<option value={categorie}>{categorie}</option>))}
            </SelectPostGame>
          </Form>
        </FormContainer>
        {gameInfo.gameName ? <TitleContainer><Title>{gameInfo.gameName}{gameInfo.serverName}</Title></TitleContainer> : ""}
        <GamesContainer>
          {items ? items.map((item, index) => (
            <><GameContainer onClick={() => {navigateItem(item.id);}}>
              <GameImage><img alt={""} src={item.itemUrl}/></GameImage>
              <ItemName>{item.name}</ItemName>
              <GameName>{item.Game.name}</GameName>
              <GameServer>{item.Server.name}</GameServer>
              <div>Quantia: {item.amount}</div>
              <GamePrice>R${(item.price/100).toFixed(2)}</GamePrice>
            </GameContainer>
            {index===items.length-1?
              <GameContainer  onClick={openModal}>
                <IoMdAddCircleOutline size={"150px"}></IoMdAddCircleOutline>
                <div>Adicione um Item</div>
              </GameContainer>:""}</>)) : <TitleContainer><Title>Carregando...</Title></TitleContainer>}
          {items?.length === 0 ?
            <GameContainer  onClick={openModal}>
              <IoMdAddCircleOutline size={"150px"}></IoMdAddCircleOutline>
              <div>Adicione um Item</div>
            </GameContainer> :"" }
        </GamesContainer>
        <Modal display={modalStatus}>
          <FormContainer>
            <FormPostGame onSubmit={postForm}>
              <FormInfo>
                <div>Adicione as informa????es do jogo:</div>
                <AiOutlineCloseCircle onClick={closeModal} size={"35px"}></AiOutlineCloseCircle>
              </FormInfo>
              <InputPostGame type="text" placeholder=" Digite o nome do item aqui..." onChange={(e) => {setPostNewItem({ ...postNewItem, name: e.target.value });}}/>
              <InputPostGame type="text" placeholder=" Digite o link da imagem aqui..." onChange={(e) => {setPostNewItem({ ...postNewItem, itemUrl: e.target.value });}}/>
              <InputPostGame type="text" placeholder=" Digite o nome do jogo aqui..." onChange={(e) => {setPostNewItem({ ...postNewItem, gameName: e.target.value });}}/>
              <InputPostGame type="text" placeholder=" Digite o pre??o do item(s) aqui..." onChange={(e) => {setPostNewItem({ ...postNewItem, price: Number(e.target.value)*100 });}}/>
              <InputPostGame type="text" placeholder=" Digite a quantidade de item..." onChange={(e) => {setPostNewItem({ ...postNewItem, amount: Number(e.target.value) });}}/>
              <InputPostGame type="text" placeholder=" Digite o server que o item se encontra..." onChange={(e) => {setPostNewItem({ ...postNewItem, serverName: e.target.value });}}/>
              <SelectPostGame placeholder=" Selecione o tipo do item..." onChange={(e) => {setPostNewItem({ ...postNewItem, itemType: e.target.value });}}>
                {itemCategories.map((categorie) => (<option value={categorie}>{categorie}</option>))}
              </SelectPostGame>
              <Entrar disabled={postItemLoading} onClick={postItemForm} type="submit">
                {postItemLoading ? <Grid color="white" width="100px" height="200px" radius="8"></Grid> : "Adicionar Item"}
              </Entrar>
              {typeof postItemErrorMessage !== "string" ? postItemErrorMessage.map((msg) => 
                <ErrorMessage>{msg}</ErrorMessage>) 
                : 
                <ErrorMessage>{postItemErrorMessage}</ErrorMessage>}
            </FormPostGame>
          </FormContainer>
        </Modal>
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
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: start;
  align-items: flex-start;
  background-image: url(${props => props.randomImage});
  background-size: cover;
  @media ${device.mobileM} {
    min-height: calc(100vh - 115px);
  }
`;

const Title = styled.div`
  font-size: 18px;
  padding: 10px;
  margin-left: 15px;
  margin-bottom: 5px;
  width: auto;
  border-radius: 6px;
  color: black;
  font-weight: 500;
  color: orange;
  background: linear-gradient(#444444,#000000,#444444);
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.6);
  cursor: default;
  @media ${device.mobileM} {
    font-size: 14px;
    text-align: center;
    margin-top: 8px;
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const GameContainer = styled.div`
  width: 158px ;
  height: 200px;
  border-radius: 10px;
  padding: 8px;
  object-fit: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.6);
  background: linear-gradient(#444444,#000000,#444444);
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  div{
    font-size: 15px;
    line-height: 20px;
    display: flex;
    justify-content: start;
    align-items: flex-start;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
  }
  @media ${device.mobileM} {
    width: 110px;
    height: 150px;
    padding: 4px;
    div{
      line-height: 14px;
      font-size: 11px;
    }
  }
`;

export const GamesContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 158px);
  grid-template-rows: repeat(auto-fill, 200px);
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  height: calc(100vh - 250px);
  overflow-y: auto;
  overflow-x: hidden;
  @media ${device.mobileM} {
    grid-template-columns: repeat(auto-fill, 110px);
    grid-template-rows: repeat(auto-fill, 150px);
    gap: 15px;
  }
`;

export const GamePrice = styled.div`
  font-weight: 700;
  color: green;
`;

export const GameImage = styled.div`
  width: 100%;
  overflow: hidden;
  height: 45%;
  img{
    border-radius: 5px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SelectPostGame = styled.select`
  margin-top: 10px;
  width: 250px;
  height: 45px;
  background-color: white;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 700; 
  @media ${device.mobileM} {
    font-size: 13px;
    height: 30px;
  }
`;

const Modal = styled.div.attrs((props: DisplayModal) => ({
  display: props.display
}))`
  padding-top: 20px;
  padding-bottom: 15px;
  display: ${props => props.display};
  align-items: flex-start;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 575px;
  height: auto;
  background:  linear-gradient(#333333,#000000,#333333);
  border-radius: 10px;
  @media ${device.mobileM} {
    width: 90%;
    min-width: 0;
    max-width: 450px;
    text-align: center;
  }
`;

const GameName = styled.div`
  color: blue;
`;

const GameServer = styled.div`
  color: purple;
`;

const ItemName = styled.div`
  color: yellow;
`;

export {
  Title,
  TitleContainer
};
