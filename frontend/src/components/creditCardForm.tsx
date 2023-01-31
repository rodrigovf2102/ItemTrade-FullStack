import React from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import styled from "styled-components";
import { setCardInfo } from "../usefull/creditCardInfo";

export default class PaymentForm extends React.Component {
  state = {
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
    formData: null,
  };

  handleInputFocus = (e:any) => {
    this.setState({ focus: e.target.name });
  };

  handleInputChange = (e:any) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    const paymentInfo = {
      name: this.state.name,
      issuer: this.state.issuer,
      number: this.state.number,
      expiry: this.state.expiry,
      cvc: this.state.cvc
    };
    
    if(name==="name") paymentInfo["name"] = value;
    if(name==="cvc") paymentInfo["cvc"] = value;
    if(name==="number") paymentInfo["number"] = value;
    if(name==="expiry") paymentInfo["expiry"] = value;

    setCardInfo(paymentInfo);
  };

  handleCallback = ({ issuer }:any) => {
    this.setState({ issuer: issuer });
  };

  render() {
    return (
      <>
        <CardContainer id="PaymentForm">
          <Cards
            cvc={this.state.cvc}
            expiry={this.state.expiry}
            name={this.state.name}
            number={this.state.number}
            callback={this.handleCallback}
          />
          <Form>
            <InputCardNumber
              type="tel"
              name="number"
              placeholder="Numero do cartão"
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
            <InputCardCVC
              type="tel"
              name="cvc"
              className="form-control"
              placeholder="CVC"
              pattern="\d{3,4}"
              required
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
            <div>Exemplo : 49..., 51..., 36..., 37...</div>
            <InputCardName
              type="text"
              name="name"
              className="form-control"
              placeholder="Nome"
              required
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
            <InputCardDate
              type="tel"
              name="expiry"
              className="form-control"
              placeholder="Válido até"
              pattern="\d\d/\d\d"
              required
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
          </Form>
        </CardContainer>
      </>
    );
  }
}

const Form = styled.form`
  margin-top: 15px;
  div {
    color: white;
    margin-left: 20px;
    margin-bottom: 10px;
  }
`;

const CardContainer = styled.div`
  width: 90%;
  height: 55%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InputCardNumber = styled.input`
  height: 40px;
  width: 50%;
  margin-left: 20px;
  border-radius: 5px;
  font-size: 18px;
`;

const InputCardCVC = styled.input`
  height: 40px;
  width: 17%;
  margin-left: 20px;
  border-radius: 5px;
  font-size: 18px;
`;

const InputCardName = styled.input`
  height: 40px;
  width: 50%;
  margin-left: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  font-size: 18px;
`;

const InputCardDate = styled.input`
  height: 40px;
  width: 30%;
  margin-left: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  font-size: 18px;
`;
