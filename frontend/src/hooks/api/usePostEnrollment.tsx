import useAsync from "../useAsync";
import * as enrollmentApi from "../../services/enrollmentApi";
import { Enrollment, EnrollmentPost } from "../../protocols";
import useToken from "../useToken";

export default function usePostEnrollment() {
  const token = useToken();

  const {
    loading: postEnrollmentLoading,
    error: postEnrollmentError,
    act: postEnrollment
  } = useAsync((data : EnrollmentPost) => enrollmentApi.postEnrollment(data, token), false);

  return {
    postEnrollmentLoading,
    postEnrollmentError,
    postEnrollment
  } as unknown as UseEnrollment;
}

type UseEnrollment = {
  postEnrollmentLoading: boolean,
  postEnrollmentError: any,
  postEnrollment(Enrollment : EnrollmentPost, token : string) : Promise<Enrollment>
}
