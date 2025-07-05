/**
 * API設定ファイル
 * 重要: このファイルはGitにコミットしないでください
 */

// Gemini APIキーをグローバル変数として設定
// 以下の文字列を実際のAPIキーに置き換えてください
window.GEMINI_API_KEY = 'YOUR_API_KEY_HERE';  // ← 修正

// その他の設定
window.API_CONFIG = {
    // API設定
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
    
    // レート制限（無料プランは1分間に60リクエストまで）
    RATE_LIMIT_PER_MINUTE: 60,
    
    // 開発モード（true: テンプレート使用、false: API使用）
    DEV_MODE: true  // ← falseからtrueに修正
};

// 以下は変更なし
function validateAPIKey() {
    if (!window.GEMINI_API_KEY || window.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        console.error('⚠️ Gemini APIキーが設定されていません！');
        console.log('1. https://aistudio.google.com/app/apikey でAPIキーを取得');
        console.log('2. config.jsのGEMINI_API_KEYに設定');
        
        // デフォルトでテンプレートモードを有効化
        window.API_CONFIG.DEV_MODE = true;
        
        return false;
    }
    console.log('✅ Gemini APIキーが設定されています');
    return true;
}

// 初期化関数
function initAPI() {
    const isValid = validateAPIKey();
    
    // 環境情報をログに出力
    console.log('API設定:', {
        apiUrl: window.API_CONFIG.GEMINI_API_URL,
        devMode: window.API_CONFIG.DEV_MODE,
        apiKeyValid: isValid
    });
    
    // デバイス情報
    const deviceInfo = {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isOnline: navigator.onLine,
        browser: navigator.userAgent
    };
    console.log('デバイス情報:', deviceInfo);
    
    return {
        isValid,
        config: window.API_CONFIG,
        deviceInfo
    };
}

// 設定の確認
console.log('config.js loaded');
window.addEventListener('DOMContentLoaded', initAPI);
