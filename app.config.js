// import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  expo: {
    owner: "xvalhk",
    name: 'KCalCulate',
    slug: "kcalculate",
    version: '2.5.0',
    icon: "./assets/icon.png",
    orientation: "portrait",
    android: {
      package: 'com.xvalhk.kcalculate',
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#10b77f"           
      }

    },
    extra: {
      eas: {
        projectId: "61dd7fa9-1722-4e48-8c26-da3cc237ad60"
      },
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      USDA_API_KEY: process.env.USDA_API_KEY,
    },
  },
}); 
