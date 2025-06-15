
import { build } from 'vite';

async function buildApp() {
  try {
    console.log('🚀 Building your trading app...');
    await build();
    console.log('✅ Build complete! Check the dist folder for deployable files.');
    console.log('📁 You can now drag the dist folder to Netlify/Vercel');
    console.log('📱 For mobile app: run "npx cap sync" after building');
  } catch (error) {
    console.error('❌ Build failed:', error);
  }
}

buildApp();
