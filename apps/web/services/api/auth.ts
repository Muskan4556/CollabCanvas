import axios from "axios";

type LoginInput = {
  username: string;
  password: string;
};

type SignupInput = {
  username: string;
  password: string;
  name: string;
};

type LoginResponse = {
  token: string;
};

type SignupResponse = {
  message: string;
  userId: string;
  token: string;
};

export async function login(input: LoginInput) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!baseUrl)
    throw new Error("NEXT_PUBLIC_BACKEND_URL");

  const res = await axios.post<LoginResponse>(`${baseUrl}/api/v1/auth/login`, {
    username: input.username,
    password: input.password,
  });
  return res.data;
}

export async function signup(input: SignupInput) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!baseUrl)
    throw new Error("NEXT_PUBLIC_BACKEND_URL");

  const res = await axios.post<SignupResponse>(
    `${baseUrl}/api/v1/auth/signup`,
    {
      username: input.username,
      password: input.password,
      name: input.name,
    },
  );
  return res.data;
}
