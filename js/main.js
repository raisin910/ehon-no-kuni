/**
 * えほんのくに - メインスクリプト
 * アプリケーション全体の共通処理を管理
 */

// グローバル設定
const APP_CONFIG = {
    // アプリケーション設定
    appName: 'えほんのくに',
    version: '1.0.0',
    
    // テーマ設定
    themes: ['ねこ', '宇宙', 'おかし', 'どうぶつ', 'ゆうえんち', 'おとぎばなし'],
    
    // キャラクター設定
    characters: [
        { id: 'cat', name: 'ニャンタ', type: 'animal' },
        { id: 'bunny', name: 'ぴょんこ', type: 'animal' },
        { id: 'bear', name: 'くまごろう', type: 'animal' },
        { id: 'alien', name: 'ピコ', type: 'fantasy' },
        { id: 'robot', name: 'ロボット', type: 'fantasy' },
        { id: 'fairy', name: 'ティンク', type: 'fantasy' }
    ],
    
    // 読み込みキャラ設定
    scanCharacters: [
        { id: 'qr001', name: 'まほうつかいジン', type: 'wizard' },
        { id: 'qr002', name: 'ゆうしゃリク', type: 'hero' },
        { id: 'qr003', name: 'おひめさまユイ', type: 'princess' }
    ]
};

// ロード時イベント
window.addEventListener('load', () => {
    console.log(`${APP_CONFIG.appName} v${APP_CONFIG.version} を起動しています...`);
    initApp();
});

// アプリケーションの初期化
function initApp() {
    // デバイスチェック
    checkDevice();
    
    // アニメーション有効化
    enableAnimations();
    
    // イベントリスナーの設定
    setupEventListeners();
    
    console.log('アプリケーションが初期化されました');
}

// デバイスの種類を判定して最適化
function checkDevice() {
    // モバイルデバイスのチェック
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // タッチデバイスのチェック
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // デバイスに応じたクラスをbodyに追加
    if (isMobile) {
        document.body.classList.add('is-mobile');
    }
    
    if (isTouch) {
        document.body.classList.add('is-touch');
    }
    
    console.log(`デバイスタイプ: ${isMobile ? 'モバイル' : 'デスクトップ'}, タッチ: ${isTouch}`);
}

// アニメーションの有効化
function enableAnimations() {
    // アニメーション遅延の設定
    document.querySelectorAll('.animated').forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

// イベントリスナーの設定
function setupEventListeners() {
    // ウィンドウのリサイズイベント
    window.addEventListener('resize', debounce(() => {
        // リサイズ時の処理
        adjustLayout();
    }, 250));
    
    // オリエンテーション変更イベント（モバイル）
    window.addEventListener('orientationchange', () => {
        // 向き変更時の処理
        setTimeout(adjustLayout, 100);
    });
    
    // ページを離れる前の警告（必要に応じて）
    window.addEventListener('beforeunload', (e) => {
        // 保存していないデータがある場合のみ警告
        const hasUnsavedData = checkUnsavedData();
        if (hasUnsavedData) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
}

// レイアウトの調整
function adjustLayout() {
    // ビューポートの高さを取得（モバイルブラウザのUI考慮）
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    console.log('レイアウトを調整しました');
}

// 未保存データのチェック（作成中の絵本がある場合など）
function checkUnsavedData() {
    // 作成中の絵本データがあるかチェック
    const currentStory = loadData('current-story');
    return currentStory && currentStory.modified;
}

// デバウンス関数（連続実行の防止）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ランダムな整数を生成（min以上max未満）
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// テキストを子供向けに簡略化（漢字→ひらがな変換など）
function simplifyText(text) {
    // 実際の変換処理は外部APIまたは辞書を使用（簡易版）
    return text.replace(/漢字/g, 'かんじ')
               .replace(/難しい/g, 'むずかしい');
}

// テキストの読み上げ
function speakText(text) {
    // ブラウザの音声合成APIを使用
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'ja-JP';
        speech.rate = 0.9; // 少しゆっくり
        speech.pitch = 1.1; // 少し高め
        window.speechSynthesis.speak(speech);
        return true;
    }
    return false;
}

// 画面の明るさを調整（夜間モードなど）
function adjustBrightness(level) {
    // 0（暗い）〜100（明るい）
    const brightness = Math.max(0, Math.min(100, level));
    document.documentElement.style.setProperty('--brightness-filter', `brightness(${brightness}%)`);
}

// ローディング表示の切り替え
function showLoading(show) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        if (show) {
            loadingOverlay.classList.add('active');
        } else {
            loadingOverlay.classList.remove('active');
        }
    }
}

/**
 * 共通処理
 */

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('アプリケーションが初期化されました');
    
    // APIキーの確認
    if (window.GEMINI_API_KEY) {
        console.log('Gemini APIキー:', window.GEMINI_API_KEY === 'YOUR_ACTUAL_API_KEY_HERE' ? '未設定（デフォルト値のまま）' : '設定済み');
    } else {
        console.warn('config.js が読み込まれていない可能性があります');
    }
    
    // レイアウト調整
    adjustLayout();
});

// レイアウト調整
function adjustLayout() {
    const viewportHeight = window.innerHeight;
    const app = document.getElementById('app');
    if (app) {
        app.style.minHeight = viewportHeight + 'px';
    }
    console.log('レイアウトを調整しました');
}

// ウィンドウリサイズ時の処理
window.addEventListener('resize', adjustLayout);

// グローバルエラーハンドリング
window.addEventListener('error', (event) => {
    console.error('エラーが発生しました:', event.error);
});

// 効果音を再生（共通関数）
window.playSound = function(soundName) {
    // 音声ファイルが準備できるまで無効化
    console.log('効果音:', soundName);
    return; // 音声ファイルエラーを防ぐため一時的に無効化
};