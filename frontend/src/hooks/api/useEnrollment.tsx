import useAsync from "../useAsync";
import * as enrollmentApi from "../../services/enrollmentApi";
import { Enrollment } from "../../protocols";
import useToken from "../useToken";

export default function useEnrollment() {
  const token = useToken();
  const {
    data: enrollment,
    loading: enrollmentLoading,
    error: enrollmentError,
    act: getEnrollment
  } = useAsync(() => enrollmentApi.getEnrollment(token));

  return {
    enrollment,
    enrollmentLoading,
    enrollmentError,
    getEnrollment
  } as unknown as UseEnrollment;
}

type UseEnrollment = {
  enrollment: Enrollment,
  enrollmentLoading: boolean,
  enrollmentError: any,
  getEnrollment() : Promise<Enrollment>
}
