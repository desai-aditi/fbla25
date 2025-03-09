import type { ThemeConfig } from 'antd';

const antdTheme: ThemeConfig = {
  token: {
    fontFamily: "'Libre Franklin', sans-serif",
    colorPrimary: '#1B4332', // darkgreen
    colorSuccess: '#40916C', // pistachio
    colorWarning: '#D4A373', // accent
    colorError: '#9B2C2C',   // error
    colorInfo: '#184E77',    // cerulean
    colorTextBase: '#1C1C1C', // night
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 38,
      algorithm: true,
      fontFamily: "'Libre Franklin', sans-serif",
    },
    Input: {
      borderRadius: 6,
      controlHeight: 38,
      algorithm: true,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 38,
      algorithm: true,
    },
    Card: {
      borderRadius: 8,
      algorithm: true,
    },
    DatePicker: {
      borderRadius: 6,
      controlHeight: 38,
      algorithm: true,
    },
    Radio: {
      borderRadius: 6,
      controlHeight: 32,
      algorithm: true,
    },
    Table: {
      borderRadius: 8,
      algorithm: true,
      fontFamily: "'Libre Franklin', sans-serif",
    },
    Modal: {
      borderRadius: 8,
      algorithm: true,
    },
  },
};

export default antdTheme; 