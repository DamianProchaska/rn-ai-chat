module.exports = function(api) {
    api.cache(true);
    return {
      presets: [
        'babel-preset-expo', // Expo domyślnie zawiera wsparcie dla React i JSX
        '@babel/preset-react', // Dodajemy ten preset, by mieć pewność, że JSX zostanie przetworzony
      ],
      plugins: [
        'react-native-reanimated/plugin', // Jeśli używasz reanimated, upewnij się, że plugin jest na końcu listy
      ],
    };
  };
