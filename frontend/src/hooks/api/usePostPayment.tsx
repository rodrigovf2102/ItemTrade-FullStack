import useAsync from "../useAsync";
import * as paymentApi from "../../services/paymentApi";
import { PaymentPost, Payments } from "../../protocols";
import useToken from "../useToken";

export default function usePostPayment() {
  const token = useToken();

  const {
    loading: postPaymentLoading,
    error: postPaymentError,
    act: postPayment
  } = useAsync((data : PaymentPost) => paymentApi.postPayment(data, token), false);

  return {
    postPaymentLoading,
    postPaymentError,
    postPayment
  } as unknown as UsePayment;
}

type UsePayment = {
  postPaymentLoading: boolean,
  postPaymentError: any,
  postPayment(Payment : PaymentPost, token : string) : Promise<Payments>
}
