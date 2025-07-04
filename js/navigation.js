/**
 * えほんのくに - ナビゲーション管理スクリプト
 * 画面遷移とページ間のデータ受け渡しを管理
 */

// ページ遷移を管理する関数
function navigate(path, params = {}) {
    // 遷移アニメーション
    document.body.classList.add('page-transition');
    
    // パラメータをURLクエリ文字列に変換
    const queryString = Object.keys(params).length > 0 
        ? '?' + new URLSearchParams(params).toString() 
        : '';
    
    // 効果音を再生（実装されたら有効化）
    // playSound('click');
    
    // 少し遅延させて遷移（アニメーションのため）
    setTimeout(() => {
        window.location.href = path + queryString;
    }, 300);
}

// navigateToは別名として維持（後方互換性のため）
const navigateTo = navigate;

// 戻るボタンの動作
function goBack() {
    // 効果音を再生（実装されたら有効化）
    // playSound('back');
    
    // 履歴があれば戻る、なければホームに戻る
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navigate('index.html');
    }
}

// ホームに戻る
function goHome() {
    // 効果音を再生（実装されたら有効化）
    // playSound('home');
    navigate('index.html');
}

// URLからクエリパラメータを取得する関数
function getQueryParams() {
    const params = {};
    const queryString = window.location.search;
    
    if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        urlParams.forEach((value, key) => {
            params[key] = value;
        });
    }
    
    return params;
}

// ローカルストレージにデータを保存
function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('データの保存に失敗しました:', error);
        return false;
    }
}

// ローカルストレージからデータを取得
function loadData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
        return null;
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // 遷移アニメーションのクラスを削除
    document.body.classList.remove('page-transition');
    
    // ページ固有の初期化処理（各ページで上書き可能）
    if (typeof initPage === 'function') {
        initPage();
    }
    
    // すべてのページ共通の初期化
    initCommonElements();
});

// 共通要素の初期化
function initCommonElements() {
    // 戻るボタンがあれば動作を設定
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        if (!button.onclick) {
            button.addEventListener('click', goBack);
        }
    });
    
    // ホームボタンがあれば動作を設定
    const homeButtons = document.querySelectorAll('.home-button');
    homeButtons.forEach(button => {
        if (!button.onclick) {
            button.addEventListener('click', goHome);
        }
    });
}

// ブラウザの戻るボタン対応
window.addEventListener('popstate', (event) => {
    // 必要に応じて画面を更新
    if (event.state) {
        console.log('履歴ナビゲーション:', event.state);
    }
});

// 履歴にプッシュ
function pushState(data, title, url) {
    window.history.pushState(data, title, url);
}