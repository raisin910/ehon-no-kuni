/**
 * えほんのくに - 管理者絵本管理スクリプト
 * 管理者が絵本を追加・編集するための機能を提供します
 */

// 現在編集中の絵本データ
let currentBook = null;
let isEditMode = false;

// ページが読み込まれたときの処理
document.addEventListener('DOMContentLoaded', () => {
    // モーダル関連の要素を取得
    const addBookModal = document.getElementById('add-book-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const addBookForm = document.getElementById('add-book-form');
    const addBookBtn = document.getElementById('add-book-btn');
    const addPageBtn = document.getElementById('add-page-btn');
    
    // ページ編集モーダル関連
    const editPageModal = document.getElementById('edit-page-modal');
    const closePageModalBtn = document.getElementById('close-page-modal');
    const editPageForm = document.getElementById('edit-page-form');
    
    // モーダルを閉じるイベント
    closeModalBtn.addEventListener('click', () => {
        addBookModal.classList.remove('active');
    });
    
    closePageModalBtn.addEventListener('click', () => {
        editPageModal.classList.remove('active');
    });
    
    // 背景クリックでモーダルを閉じる
    addBookModal.addEventListener('click', (e) => {
        if (e.target === addBookModal) {
            addBookModal.classList.remove('active');
        }
    });
    
    editPageModal.addEventListener('click', (e) => {
        if (e.target === editPageModal) {
            editPageModal.classList.remove('active');
        }
    });
    
    // 絵本追加ボタンのイベント
    addBookBtn.addEventListener('click', () => {
        openAddBookModal();
    });
    
    // ページ追加ボタンのイベント
    addPageBtn.addEventListener('click', () => {
        addNewPage();
    });
    
    // 絵本フォーム送信イベント
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveBook();
    });
    
    // ページ編集フォーム送信イベント
    editPageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        savePageEdit();
    });
});

// 絵本追加モーダルを開く
function openAddBookModal(book = null) {
    // モーダル要素を取得
    const modal = document.getElementById('add-book-modal');
    const form = document.getElementById('add-book-form');
    const pageItems = document.getElementById('page-items');
    const modalTitle = modal.querySelector('.modal-title');
    
    // 編集モードかどうかを設定
    isEditMode = !!book;
    currentBook = book || createEmptyBook();
    
    // モーダルのタイトルを設定
    modalTitle.textContent = isEditMode ? '絵本を編集' : '新しい絵本を追加';
    
    // フォームに値を設定
    document.getElementById('book-title').value = currentBook.title || '';
    document.getElementById('cover-image').value = currentBook.coverImage || '';
    document.getElementById('book-author').value = currentBook.author || '管理者';
    document.getElementById('is-new').checked = currentBook.isNew || false;
    
    // ページを表示
    pageItems.innerHTML = '';
    
    if (currentBook.pages && currentBook.pages.length > 0) {
        currentBook.pages.forEach((page, index) => {
            addPageToList(page, index + 1);
        });
    } else {
        // 空の本の場合、デフォルトで12ページ追加
        for (let i = 0; i < 12; i++) {
            addNewPage();
        }
    }
    
    // モーダルを表示
    modal.classList.add('active');
}

// 空の絵本データを作成
function createEmptyBook() {
    return {
        id: 'book_' + Date.now(),
        title: '',
        author: '管理者',
        type: 'official',
        createdAt: new Date().toISOString(),
        pages: []
    };
}

// 新しいページを追加
function addNewPage() {
    const pageCount = currentBook.pages.length;
    const newPage = {
        pageNumber: pageCount + 1,
        text: '',
        imageUrl: ''
    };
    
    currentBook.pages.push(newPage);
    addPageToList(newPage, pageCount + 1);
}

// ページをリストに追加
function addPageToList(page, pageNumber) {
    const pageItems = document.getElementById('page-items');
    const pageItem = document.createElement('div');
    pageItem.className = 'page-item';
    
    pageItem.innerHTML = `
        <div class="page-number">${pageNumber}</div>
        <div class="page-text">${page.text || 'ページテキストなし'}</div>
        <div class="page-actions">
            <button type="button" class="page-edit-btn" onclick="openPageEditModal(${pageNumber - 1})">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="page-delete-btn" onclick="deletePage(${pageNumber - 1})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    pageItems.appendChild(pageItem);
}

// ページ編集モーダルを開く
function openPageEditModal(pageIndex) {
    const page = currentBook.pages[pageIndex];
    if (!page) return;
    
    const modal = document.getElementById('edit-page-modal');
    
    // フォームに値を設定
    document.getElementById('edit-page-number').value = pageIndex;
    document.getElementById('page-text').value = page.text || '';
    document.getElementById('page-image').value = page.imageUrl || '';
    
    // モーダルを表示
    modal.classList.add('active');
}

// ページ編集を保存
function savePageEdit() {
    const pageIndex = parseInt(document.getElementById('edit-page-number').value);
    const pageText = document.getElementById('page-text').value;
    const pageImage = document.getElementById('page-image').value;
    
    // 対象のページを取得
    const page = currentBook.pages[pageIndex];
    if (!page) return;
    
    // ページデータを更新
    page.text = pageText;
    page.imageUrl = pageImage;
    
    // ページリストを更新
    const pageItems = document.getElementById('page-items');
    const pageElements = pageItems.querySelectorAll('.page-item');
    
    if (pageElements[pageIndex]) {
        const pageTextElement = pageElements[pageIndex].querySelector('.page-text');
        pageTextElement.textContent = pageText || 'ページテキストなし';
    }
    
    // モーダルを閉じる
    document.getElementById('edit-page-modal').classList.remove('active');
}

// ページを削除
function deletePage(pageIndex) {
    // 最低限のページ数を保持（12ページ）
    if (currentBook.pages.length <= 12) {
        alert('絵本は最低12ページ必要です。これ以上削除できません。');
        return;
    }
    
    // ページを削除
    currentBook.pages.splice(pageIndex, 1);
    
    // ページ番号を更新
    currentBook.pages.forEach((page, index) => {
        page.pageNumber = index + 1;
    });
    
    // ページリストを更新
    refreshPageList();
}

// ページリストを更新
function refreshPageList() {
    const pageItems = document.getElementById('page-items');
    pageItems.innerHTML = '';
    
    currentBook.pages.forEach((page, index) => {
        addPageToList(page, index + 1);
    });
}

// 絵本を保存
function saveBook() {
    // フォームから値を取得
    const title = document.getElementById('book-title').value;
    const coverImage = document.getElementById('cover-image').value;
    const author = document.getElementById('book-author').value;
    const isNew = document.getElementById('is-new').checked;
    
    // 入力チェック
    if (!title) {
        alert('タイトルを入力してください');
        return;
    }
    
    // ページのテキストチェック
    let hasEmptyPage = false;
    currentBook.pages.forEach(page => {
        if (!page.text) {
            hasEmptyPage = true;
        }
    });
    
    if (hasEmptyPage) {
        const confirm = window.confirm('テキストが入力されていないページがあります。このまま保存しますか？');
        if (!confirm) return;
    }
    
    // 絵本データを更新
    currentBook.title = title;
    currentBook.coverImage = coverImage;
    currentBook.author = author;
    currentBook.isNew = isNew;
    currentBook.updatedAt = new Date().toISOString();
    
    // ローカルストレージから既存の絵本を取得
    let officialBooks = [];
    try {
        officialBooks = JSON.parse(localStorage.getItem('officialBooks') || '[]');
    } catch (e) {
        console.error('絵本データの読み込みに失敗しました:', e);
        officialBooks = [];
    }
    
    // 既存の絵本を更新または新規追加
    if (isEditMode) {
        const index = officialBooks.findIndex(book => book.id === currentBook.id);
        if (index !== -1) {
            officialBooks[index] = currentBook;
        } else {
            officialBooks.push(currentBook);
        }
    } else {
        officialBooks.push(currentBook);
    }
    
    // ローカルストレージに保存
    try {
        localStorage.setItem('officialBooks', JSON.stringify(officialBooks));
        
        // 保存成功メッセージ
        alert('絵本を保存しました');
        
        // モーダルを閉じる
        document.getElementById('add-book-modal').classList.remove('active');
        
        // 絵本リストを更新
        displayOfficialBooks(officialBooks);
        
    } catch (e) {
        console.error('絵本データの保存に失敗しました:', e);
        alert('絵本の保存に失敗しました');
    }
}

// 絵本を編集
function editBook(bookId) {
    // ローカルストレージから絵本を取得
    let officialBooks = [];
    try {
        officialBooks = JSON.parse(localStorage.getItem('officialBooks') || '[]');
    } catch (e) {
        console.error('絵本データの読み込みに失敗しました:', e);
        return;
    }
    
    // 対象の絵本を取得
    const book = officialBooks.find(b => b.id === bookId);
    if (!book) {
        alert('絵本が見つかりません');
        return;
    }
    
    // 編集モーダルを開く
    openAddBookModal(book);
}

// 絵本を削除
function deleteBook(bookId) {
    // 削除確認
    const confirm = window.confirm('この絵本を削除しますか？');
    if (!confirm) return;
    
    // ローカルストレージから絵本を取得
    let officialBooks = [];
    try {
        officialBooks = JSON.parse(localStorage.getItem('officialBooks') || '[]');
    } catch (e) {
        console.error('絵本データの読み込みに失敗しました:', e);
        return;
    }
    
    // 対象の絵本を削除
    const newBooks = officialBooks.filter(book => book.id !== bookId);
    
    // ローカルストレージに保存
    try {
        localStorage.setItem('officialBooks', JSON.stringify(newBooks));
        
        // 削除成功メッセージ
        alert('絵本を削除しました');
        
        // 絵本リストを更新
        displayOfficialBooks(newBooks);
        
    } catch (e) {
        console.error('絵本データの保存に失敗しました:', e);
        alert('絵本の削除に失敗しました');
    }
}

// デモ用データ（初回のみ）
function initDemoData() {
    // ローカルストレージに絵本データがあるかチェック
    const hasData = localStorage.getItem('officialBooks');
    if (hasData) return;
    
    // デモ用データ
    const demoBooks = [
        {
            id: 'official_001',
            title: 'ももたろう',
            author: '管理者',
            type: 'official',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
            coverImage: 'assets/images/books/momotaro/cover.png',
            pages: [
                {
                    pageNumber: 1,
                    text: 'むかしむかし、あるところに おじいさんと おばあさんが すんでいました。',
                    imageUrl: 'assets/images/books/momotaro/page1.png'
                },
                {
                    pageNumber: 2,
                    text: 'あるひ、おばあさんが かわで せんたくをしていると、おおきな もも が ながれてきました。',
                    imageUrl: 'assets/images/books/momotaro/page2.png'
                },
                // 他のページも同様に
                {
                    pageNumber: 3,
                    text: 'おばあさんが ももを ひろって かえると、もも が ぱかっと わかれて、なかから かわいい あかちゃんが でてきました。',
                    imageUrl: 'assets/images/books/momotaro/page3.png'
                },
                {
                    pageNumber: 4,
                    text: 'おじいさんと おばあさんは、この こを ももたろうと なづけて、だいじに そだてました。',
                    imageUrl: 'assets/images/books/momotaro/page4.png'
                },
                {
                    pageNumber: 5,
                    text: 'ももたろうは ぐんぐん せいちょうして、とても つよい こどもに なりました。',
                    imageUrl: 'assets/images/books/momotaro/page5.png'
                },
                {
                    pageNumber: 6,
                    text: 'ある日、ももたろうは「おにが、しまに すんでいて、みんなの たからものを とっています。おにたいじに いってきます」と いいました。',
                    imageUrl: 'assets/images/books/momotaro/page6.png'
                },
                {
                    pageNumber: 7,
                    text: 'おばあさんは、ももたろうに きびだんごを つくってあげました。ももたろうは、きびだんごを もって おにたいじの たびに でかけました。',
                    imageUrl: 'assets/images/books/momotaro/page7.png'
                },
                {
                    pageNumber: 8,
                    text: 'みちで いぬが やってきて「ももたろうさん、どこへ いくの？」と ききました。「おにが しまへ おにたいじに いくんだ」と ももたろうは こたえました。',
                    imageUrl: 'assets/images/books/momotaro/page8.png'
                },
                {
                    pageNumber: 9,
                    text: 'いぬは「きびだんごを ひとつ ください。おともします」と いいました。ももたろうは きびだんごを わけてあげました。',
                    imageUrl: 'assets/images/books/momotaro/page9.png'
                },
                {
                    pageNumber: 10,
                    text: 'つぎに さるが やってきて、さらに きじも やってきて、みんなで おにが しまへ むかいました。',
                    imageUrl: 'assets/images/books/momotaro/page10.png'
                },
                {
                    pageNumber: 11,
                    text: 'おにが しまについた ももたろうたちは、おにたちと たたかいました。ももたろうは とても つよかったので、おには まけてしまいました。',
                    imageUrl: 'assets/images/books/momotaro/page11.png'
                },
                {
                    pageNumber: 12,
                    text: 'おには「もう わるいことは しません」と あやまりました。たからものを とりかえした ももたろうたちは、みんなの ところへ かえりました。めでたし めでたし。',
                    imageUrl: 'assets/images/books/momotaro/page12.png'
                }
            ]
        }
    ];
    
    // ローカルストレージに保存
    try {
        localStorage.setItem('officialBooks', JSON.stringify(demoBooks));
        console.log('デモデータを初期化しました');
    } catch (e) {
        console.error('デモデータの初期化に失敗しました:', e);
    }
}