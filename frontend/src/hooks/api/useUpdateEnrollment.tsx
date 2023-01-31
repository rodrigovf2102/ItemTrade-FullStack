import useAsync from "../useAsync";
import * as enrollmentApi from "../../services/enrollmentApi";
import { Amount, Enrollment } from "../../protocols";
import useToken from "../useToken";

export default function useUpdateEnrollment() {
  const token = useToken();

  const {
    loading: updateEnrollmentLoading,
    error: updateEnrollmentError,
    act: updateEnrollment
  } = useAsync((data : Amount) => enrollmentApi.updateEnrollment(data, token), false);

  return {
    updateEnrollmentLoading,
    updateEnrollmentError,
    updateEnrollment
  } as unknown as UpdateEnrollment;
}

type UpdateEnrollment = {
  updateEnrollmentLoading: boolean,
  updateEnrollmentError: any,
  updateEnrollment(amount : Amount, token : string) : Promise<Enrollment>
}
