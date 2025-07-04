/**
 * えほんのくに - 絵本ビューワー
 * 絵本の読み込みと表示を管理します
 */

// 現在表示中の絵本データ
let currentStory = null;
let currentPage = 0;
let totalPages = 0;
let currentBookType = 'user'; // デフォルトでユーザー絵本タイプを設定

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    // URLパラメータから絵本IDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');
    const bookType = urlParams.get('type') || 'user'; // 'user' または 'official'
    
    console.log('読み込み開始:', { storyId, bookType });
    
    // 絵本タイプを保存
    currentBookType = bookType;
    
    // 絵本データを読み込む
    if (storyId) {
        loadStory(storyId, bookType);
    } else {
        showError('絵本IDが指定されていません');
    }
    
    // 前のページ/次のページボタンのイベント
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevPage);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextPage);
    }
    
    // キーボードイベント
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        }
    });
    
    // 戻るボタン
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            if (currentBookType === 'official') {
                navigate('read-list.html');
            } else {
                navigate('user-books.html');
            }
        });
    }
});

// 絵本データを読み込む
function loadStory(storyId, bookType = 'user') {
    console.log('絵本読み込み:', storyId, bookType);
    
    try {
        // ローカルストレージから絵本データを取得
        let stories = [];
        
        if (bookType === 'official') {
            // 管理者絵本の場合
            stories = JSON.parse(localStorage.getItem('officialBooks') || '[]');
        } else {
            // ユーザー絵本の場合
            stories = JSON.parse(localStorage.getItem('generatedStories') || '[]');
        }
        
        console.log('取得した絵本データ:', stories);
        
        // 該当する絵本を検索
        const story = stories.find(story => story.id === storyId);
        
        if (!story) {
            showError('指定された絵本が見つかりません');
            return;
        }
        
        console.log('表示する絵本:', story);
        
        // 現在の絵本データを設定
        currentStory = story;
        currentPage = 0;
        
        // ページ数を設定（データの形式に応じて処理）
        if (story.pages && Array.isArray(story.pages)) {
            // 新形式：ページ配列がある場合
            totalPages = story.pages.length;
            console.log('新形式の絵本、ページ数:', totalPages);
        } else {
            // 旧形式：単一テキストの場合
            totalPages = 1;
            console.log('旧形式の絵本');
        }
        
        // 絵本を表示
        displayStory(story);
        
    } catch (error) {
        console.error('ストーリーの読み込みに失敗しました:', error);
        showError('絵本の読み込みに失敗しました');
    }
}

// 絵本データを表示
function displayStory(story) {
    console.log('絵本表示開始:', story);
    
    // 絵本のタイトルを表示
    const titleElement = document.getElementById('book-title');
    if (titleElement) {
        titleElement.textContent = story.title || 'タイトルなし';
    }
    
    // 絵本の作者を表示
    const authorElement = document.getElementById('book-author');
    if (authorElement) {
        authorElement.textContent = story.author || '名前なし';
    }
    
    // 絵本タイプによって処理を分ける
    if (story.pages && Array.isArray(story.pages) && story.pages.length > 0) {
        // 新形式：ページ配列がある場合（管理者絵本またはAI生成絵本）
        displayPagedStory(story);
    } else {
        // 旧形式：単一テキストの場合
        displaySinglePageStory(story);
    }
}

// ページ形式の絵本を表示
function displayPagedStory(story) {
    console.log('ページ形式の絵本を表示');
    totalPages = story.pages.length;
    
    // 最初のページを表示
    displayPage(0);
    
    // ナビゲーションボタンを有効化
    updateNavigationButtons();
}

// 単一ページ形式の絵本を表示
function displaySinglePageStory(story) {
    console.log('単一ページ形式の絵本を表示');
    totalPages = 1;
    
    const pageNumberElement = document.getElementById('page-number');
    const pageTextElement = document.getElementById('page-text');
    const pageImageElement = document.getElementById('page-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (pageNumberElement) pageNumberElement.textContent = '1 / 1';
    if (pageTextElement) pageTextElement.textContent = story.content || story.summary || '本文がありません';
    
    // 画像がある場合は表示、なければ非表示
    if (pageImageElement) {
        if (story.imageUrl) {
            pageImageElement.src = story.imageUrl;
            pageImageElement.style.display = 'block';
        } else {
            pageImageElement.style.display = 'none';
        }
    }
    
    // ナビゲーションボタンの無効化（1ページのみ）
    if (prevBtn) {
        prevBtn.disabled = true;
        prevBtn.classList.add('disabled');
    }
    
    if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.classList.add('disabled');
    }
}

// 指定ページを表示
function displayPage(pageIndex) {
    if (!currentStory || !currentStory.pages) {
        console.error('絵本データまたはページデータがありません');
        return;
    }
    
    // ページ範囲チェック
    if (pageIndex < 0 || pageIndex >= totalPages) {
        console.warn('無効なページインデックス:', pageIndex);
        return;
    }
    
    // 現在のページを更新
    currentPage = pageIndex;
    
    // ページデータを取得
    const page = currentStory.pages[pageIndex];
    
    console.log('ページ表示:', pageIndex, page);
    
    // テキストを表示
    const textElement = document.getElementById('page-text');
    if (textElement && page) {
        textElement.textContent = page.text || '';
    }
    
    // 画像を表示（画像URLがある場合）
    const imageElement = document.getElementById('page-image');
    if (imageElement) {
        if (page && page.imageUrl) {
            imageElement.src = page.imageUrl;
            imageElement.style.display = 'block';
        } else {
            imageElement.style.display = 'none';
        }
    }
    
    // ページ番号を表示
    const pageNumberElement = document.getElementById('page-number');
    if (pageNumberElement) {
        pageNumberElement.textContent = `${pageIndex + 1} / ${totalPages}`;
    }
    
    // ボタンの有効/無効を設定
    updateNavigationButtons();
}

// 前のページを表示
function prevPage() {
    console.log('前のページ:', currentPage - 1);
    if (currentPage > 0) {
        displayPage(currentPage - 1);
    }
}

// 次のページを表示
function nextPage() {
    console.log('次のページ:', currentPage + 1);
    if (currentPage < totalPages - 1) {
        displayPage(currentPage + 1);
    }
}

// ナビゲーションボタンの状態を更新
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        if (currentPage === 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages - 1;
        if (currentPage === totalPages - 1) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
    
    console.log('ナビゲーションボタン更新:', {
        currentPage,
        totalPages,
        prevDisabled: currentPage === 0,
        nextDisabled: currentPage === totalPages - 1
    });
}

// エラーメッセージを表示
function showError(message) {
    const pageContent = document.getElementById('book-content');
    if (pageContent) {
        pageContent.innerHTML = `
            <div class="error-message">
                <p><i class="fas fa-exclamation-circle"></i> ${message}</p>
                <button class="back-btn" onclick="navigate('index.html')">ホームに戻る</button>
            </div>
        `;
    }
    
    // エラーメッセージをコンソールにも出力
    console.error(message);
}