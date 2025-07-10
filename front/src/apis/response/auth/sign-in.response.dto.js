import { ResponseDto } from "../response.dto";

export const SignInResponseDto = {
  ...ResponseDto,
  token: "",
  expirationTime: 0,
};
