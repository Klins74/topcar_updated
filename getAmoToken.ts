import axios from "axios";

const client_id = "f3513251-17d3-42f7-9bc0-4064650c7050";
const client_secret = "sDOVM9zJw2SNX1G22RGInhxqURc47eiNVjvrfQq8sIIWo6cSBp7GyEDlKyWjVmMl";
const redirect_uri = "https://www.topcar.club/amo/callback"; // тот же, что в настройке интеграции
const code = "def5020035b7d798610ab3167d0729fdb5caf34360a9bfd9d3eb4fc53e823f6b070fb853a165a119b8a55096590d1047a92d63370b58a1e0f8de4418ad900970b8581bf485f1e565c6f6f1a900f538de757e61959d9d698249b9deb4998554eca38d6ef1c8e76fa64cea62b2ac9f46e57b83186ae719f9362d7fe2b9b1cd1f66b3d0dab4c2e376de49535781a199bba21a881fac9c44ad364e616dc1bfc08a158a8a60bf80385bdb88e4eacb7ebe233e2096da074cde0dac83e22b6ba42b911c994a2d6b7af080c0b67733b1eed932205ab02370ee0caa1246e12396b87215e1baf218200af65781dbd578819a4b2733ee2b0122a04d5ae28e2b5869437b6049588bafe1370cf188870b3a5ea705ba98760d945b0dbe0d9513d8dd071f241b32e6064b35cab69aa5968e24bb227ef0527f38d6e6b9f27bf70b654e04da46b125192eb7fdd79267f050fbe3ff99854743edc27dd347bdb9aa3069de0dd4ff2fe33b72a61827c4b79af154a3a01d5a9b3dda4ee69199e9fbb25574d1191a7ed60a1fa6a0cda97d4bf4778cade3a63e5f6015e8f86336dc242d99796159d2aecbc32bf4725df1302bd994b1fb337b0863aa6b06643dbc8c01ef4096ec7bd69b9cd49466e6e2e8583194a1678ec79f036019d944b7958b66368cadebe5658b2f68d578a0d5bdca5a45042f2bbeaea214ed3b330e6bec6dabf8"; // твой полный код

interface AmoTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
  account_id: number;
}

async function getAmoToken(): Promise<void> {
  try {
    const response = await axios.post<AmoTokenResponse>("https://mucik003.amocrm.ru/oauth2/access_token", {
      client_id,
      client_secret,
      grant_type: "authorization_code",
      code,
      redirect_uri,
    });

    const { access_token, refresh_token, expires_in } = response.data;

    console.log("✅ Access Token:", access_token);
    console.log("🔁 Refresh Token:", refresh_token);
    console.log("⏳ Expires In (seconds):", expires_in);
  } catch (error: any) {
    console.error("❌ Ошибка при получении токена:");
    console.error(error.response?.data || error.message);
  }
}

getAmoToken();

