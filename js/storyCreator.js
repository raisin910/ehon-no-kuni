/**
 * 絵本作成機能（更新版）
 */

// 作成データの管理
window.storyCreationData = {
    mode: null,
    character: null,
    setting: null,
    theme: null,
    userInput: null,
    createdAt: null
};

// 選択モードの開始
function startSelectMode() {
    console.log('選択モードを開始');
    
    // データをリセット
    window.storyCreationData = {
        mode: 'select',
        character: null,
        setting: null,
        theme: null,
        createdAt: new Date().toISOString()
    };
    
    // 最初の選択画面を表示
    showCharacterSelection();
    playSound('select');
}

// 画面を全て非表示
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// キャラクター選択画面を表示
function showCharacterSelection() {
    hideAllScreens();
    document.getElementById('character-selection').classList.add('active');
    setupSelectionHandlers('character');
}

// 舞台選択画面を表示
function showSettingSelection() {
    hideAllScreens();
    document.getElementById('setting-selection').classList.add('active');
    setupSelectionHandlers('setting');
}

// テーマ選択画面を表示
function showThemeSelection() {
    hideAllScreens();
    document.getElementById('theme-selection').classList.add('active');
    setupSelectionHandlers('theme');
}

// 選択ハンドラーの設定
function setupSelectionHandlers(type) {
    const items = document.querySelectorAll(`#${type}-selection .selection-item`);
    
    items.forEach(item => {
        item.onclick = function() {
            // 選択状態をクリア
            items.forEach(i => i.classList.remove('selected'));
            
            // 選択状態を追加
            this.classList.add('selected');
            
            // データを保存
            const value = this.dataset[type];
            window.storyCreationData[type] = value;
            
            // 効果音
            playSound('select');
            
            // 次の画面へ
            setTimeout(() => {
                if (type === 'character') {
                    showSettingSelection();
                } else if (type === 'setting') {
                    showThemeSelection();
                } else if (type === 'theme') {
                    showSelectModeConfirmation();
                }
            }, 300);
        };
    });
}

// 選択モードの確認画面を表示
function showSelectModeConfirmation() {
    hideAllScreens();
    document.getElementById('confirmation-screen').classList.add('active');
    
    // 選択モードの確認表示
    document.getElementById('free-input-confirmation').style.display = 'none';
    document.getElementById('select-mode-confirmation').style.display = 'block';
    
    // 選択内容を表示
    const data = window.storyCreationData;
    
    // キャラクター
    const charDisplay = document.getElementById('character-display');
    charDisplay.innerHTML = `
        <img src="assets/images/characters/${data.character}.png" alt="${data.character}">
        <span>${getCharacterName(data.character)}</span>
    `;
    
    // 舞台
    const settingDisplay = document.getElementById('setting-display');
    settingDisplay.innerHTML = `
        <img src="assets/images/settings/${data.setting}.png" alt="${data.setting}">
        <span>${getSettingName(data.setting)}</span>
    `;
    
    // テーマ
    const themeDisplay = document.getElementById('theme-display');
    themeDisplay.innerHTML = `
        <img src="assets/images/themes/${data.theme}.png" alt="${data.theme}">
        <span>${getThemeName(data.theme)}</span>
    `;
}

// 名前を取得する関数
function getCharacterName(id) {
    const names = {
        cat: 'ねこ',
        rabbit: 'うさぎ',
        bear: 'くま',
        girl: 'おんなのこ',
        boy: 'おとこのこ',
        robot: 'ロボット'
    };
    return names[id] || id;
}

function getSettingName(id) {
    const names = {
        forest: 'もり',
        ocean: 'うみ',
        space: 'うちゅう',
        city: 'まち',
        castle: 'おしろ',
        candy: 'おかしのくに'
    };
    return names[id] || id;
}

function getThemeName(id) {
    const names = {
        friendship: 'ともだち',
        treasure: 'たからさがし',
        helping: 'たすける',
        adventure: 'ぼうけん',
        magic: 'まほう',
        party: 'パーティー'
    };
    return names[id] || id;
}

// 作成をやり直す
function restartCreation() {
    if (confirm('さいしょから やりなおしますか？')) {
        // モード選択画面に戻る
        hideAllScreens();
        document.getElementById('mode-selection').classList.add('active');
        
        // データをリセット
        window.storyCreationData = {
            mode: null,
            character: null,
            setting: null,
            theme: null,
            userInput: null,
            createdAt: null
        };
        
        playSound('back');
    }
}

// 絵本を生成
async function generateStory() {
    console.log('絵本生成開始:', window.storyCreationData);
    
    // 生成画面を表示
    hideAllScreens();
    document.getElementById('generating-screen').classList.add('active');
    
    // プログレスバーアニメーション
    animateProgressBar();
    
    try {
        // Gemini APIで生成
        const story = await generateStoryWithGemini(window.storyCreationData);
        
        // 生成成功
        window.lastGeneratedStory = story;
        showCompleteScreen(story);
        
    } catch (error) {
        console.error('生成エラー:', error);
        alert('えほんの さくせいに しっぱいしました。もういちど おためしください。');
        restartCreation();
    }
}

// プログレスバーのアニメーション
function animateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) {
            progress = 90;
        }
        progressBar.style.width = progress + '%';
    }, 500);
    
    // 生成完了時にクリア
    window.progressInterval = interval;
}

// 完成画面を表示
function showCompleteScreen(story) {
    // プログレスバーを完了
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
        document.querySelector('.progress-bar').style.width = '100%';
    }
    
    setTimeout(() => {
        hideAllScreens();
        document.getElementById('complete-screen').classList.add('active');
        
        // タイトルと概要を表示
        document.getElementById('story-title').textContent = story.title;
        document.getElementById('story-summary').textContent = 
            story.pages[0].text.substring(0, 100) + '...';
        
        // 効果音
        playSound('complete');
        
        // ローカルストレージに保存
        saveGeneratedStory(story);
        
    }, 1000);
}

// 生成された絵本を保存
function saveGeneratedStory(story) {
    // 既存の絵本リストを取得
    let stories = JSON.parse(localStorage.getItem('generatedStories') || '[]');
    
    // 新しい絵本を追加
    stories.unshift(story);
    
    // 最大20個まで保存
    if (stories.length > 20) {
        stories = stories.slice(0, 20);
    }
    
    // 保存
    localStorage.setItem('generatedStories', JSON.stringify(stories));
}

// 絵本を読む
function readStory() {
    if (window.lastGeneratedStory) {
        // 読む画面に遷移
        const storyId = window.lastGeneratedStory.id;
        window.location.href = `read.html?id=${storyId}`;
    } else {
        alert('えほんが みつかりません');
    }
}

// 絵本を編集
function editStory() {
    if (window.lastGeneratedStory) {
        // 編集画面に遷移
        const storyId = window.lastGeneratedStory.id;
        window.location.href = `edit.html?id=${storyId}`;
    } else {
        alert('えほんが みつかりません');
    }
}

// 新しく作る
function createNewStory() {
    // データをリセット
    window.storyCreationData = {
        mode: null,
        character: null,
        setting: null,
        theme: null,
        userInput: null,
        createdAt: null
    };
    window.lastGeneratedStory = null;
    
    // モード選択画面に戻る
    hideAllScreens();
    document.getElementById('mode-selection').classList.add('active');
}

// 効果音を再生
function playSound(soundName) {
    try {
        const audio = new Audio(`assets/audio/${soundName}.mp3`);
        audio.volume = 0.5;
        audio.play();
    } catch (error) {
        console.log('効果音の再生に失敗:', error);
    }
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    // URLパラメータを確認
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('complete') === 'true') {
        // 編集から戻ってきた場合
        if (window.lastGeneratedStory) {
            showCompleteScreen(window.lastGeneratedStory);
        } else {
            // モード選択画面を表示
            document.getElementById('mode-selection').classList.add('active');
        }
    } else {
        // 通常の開始
        document.getElementById('mode-selection').classList.add('active');
    }
});