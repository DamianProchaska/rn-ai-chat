import 'dotenv/config';

export default {
  expo: {
    extra: {
      openAIKey: process.env.OPENAI_API_KEY,
      apiUrl: process.env.API_URL,
    },
  },
};
