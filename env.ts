import Constants from 'expo-constants';

const ENV = {
  OPENAI_API_KEY: Constants.expoConfig?.extra?.openAIKey ?? '',
  API_URL: Constants.expoConfig?.extra?.apiUrl ?? '',
};

export default ENV;
