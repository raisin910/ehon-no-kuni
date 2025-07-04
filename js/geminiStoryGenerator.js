/**
 * Gemini APIを使用した絵本生成（改良版）
 */

// Gemini APIで絵本を生成
async function generateStoryWithGemini(creationData) {
    console.log('絵本生成開始 (Gemini):', creationData);
    
    // APIキーとモードを取得
    const API_KEY = window.GEMINI_API_KEY || '';
    const DEV_MODE = window.API_CONFIG?.DEV_MODE || false;
    
    // デバッグ情報
    console.log('API設定:', {
        apiKeyExists: !!API_KEY,
        devMode: DEV_MODE,
        generationMode: creationData.mode
    });
    
    // DEV_MODEが有効、またはAPIキーが無効な場合はテンプレートを使用
    if (DEV_MODE || !API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        console.log('開発モードまたはAPIキーなし: テンプレートを使用します');
        return generateTemplateStory(creationData);
    }
    
    try {
        // APIエンドポイント
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        // プロンプトを生成
        const prompt = createPrompt(creationData);
        
        console.log('Gemini API呼び出し中...');
        console.log('プロンプト概要:', prompt.substring(0, 100) + '...');
        
        // ローディングフィードバック
        updateGenerationProgress(10, '接続中...');
        
        // APIリクエスト
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });
        
        updateGenerationProgress(40, 'AIがおはなしを かんがえています...');
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(`API エラー: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        updateGenerationProgress(70, 'おはなしが できてきました...');
        
        console.log('API レスポンス受信');
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('APIからのレスポンスが不正です');
        }
        
        const generatedText = data.candidates[0].content.parts[0].text;
        console.log('生成テキスト（プレビュー）:', generatedText.substring(0, 200) + '...');
        
        // 生成されたテキストをパース
        updateGenerationProgress(90, 'えほんを つくっています...');
        const parsedStory = parseGeneratedStory(generatedText, creationData);
        
        console.log('パース結果:', {
            title: parsedStory.title,
            pageCount: parsedStory.pages.length
        });
        
        updateGenerationProgress(100, '完成！');
        return parsedStory;
        
    } catch (error) {
        console.error('Gemini API エラー:', error);
        console.error('エラーの詳細:', error.message);
        
        // エラーメッセージを表示（UIに依存）
        if (typeof showGenerationError === 'function') {
            showGenerationError(error.message);
        }
        
        // フォールバック
        console.log('テンプレートにフォールバックします');
        return generateTemplateStory(creationData);
    }
}

// 生成の進捗状況を更新（UIコンポーネントに依存）
function updateGenerationProgress(percent, message) {
    // プログレスバーがあれば更新
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
    
    // メッセージ表示があれば更新
    const messageElement = document.querySelector('.generating-text');
    if (messageElement && message) {
        messageElement.textContent = message;
    }
    
    console.log(`生成進捗: ${percent}% - ${message}`);
}

// エラーを表示（UIコンポーネントに依存）
function showGenerationError(message) {
    // エラーメッセージをコンソールに表示
    console.error('生成エラー:', message);
    
    // UIにエラーを表示（実装に依存）
    alert(`えほんの さくせいに しっぱいしました。\nもういちど おためしください。\n\n(${message})`);
}

// プロンプトを作成
function createPrompt(creationData) {
    if (creationData.mode === 'free') {
        // 自由入力モード
        return createFreeInputPrompt(creationData.userInput);
    } else {
        // 選択モード
        return createSelectModePrompt(creationData);
    }
}

// 自由入力用プロンプト（大幅改善版）
function createFreeInputPrompt(userInput) {
    return `
あなたは子ども向け絵本作家です。
5歳の子どもが「${userInput}」という絵本を読みたがっています。

この子どもの希望を100%実現する12ページの絵本を作成してください：

【重要な条件】
- 「${userInput}」の内容を絶対に物語の中心にする
- 子どもが想像した通りの展開にする  
- 各ページは1-2文の短い文章
- ひらがなとカタカナのみ使用（漢字は使わない）
- 子どもが理解しやすい簡単な言葉
- ワクワクする展開で面白くする
- 暴力的な内容や怖いシーンは含めない

【物語の構成例】
1-3ページ：「${userInput}」の設定・登場人物紹介
4-6ページ：「${userInput}」の中心となる出来事の始まり
7-9ページ：「${userInput}」のクライマックス・盛り上がり
10-12ページ：「${userInput}」の結末・ハッピーエンド

【特別指示】
- 「ぼうけんがはじまりました」「ふしぎなものをみつけました」のような汎用的な表現は絶対に使わない
- 「${userInput}」に含まれる具体的な要素（動物、楽器、音楽フェス、ハプニング、大合唱など）を必ず物語に含める
- 子どもの希望に沿った具体的で面白い展開にする

出力形式（必ず以下の形式で出力してください）：
タイトル: [絵本のタイトル]
ページ1: [内容]
ページ2: [内容]
ページ3: [内容]
ページ4: [内容]
ページ5: [内容]
ページ6: [内容]
ページ7: [内容]
ページ8: [内容]
ページ9: [内容]
ページ10: [内容]
ページ11: [内容]
ページ12: [内容]
`;
}

// 選択モード用プロンプト（改善版）
function createSelectModePrompt(creationData) {
    const character = getCharacterName(creationData.character);
    const setting = getSettingName(creationData.setting);
    const theme = getThemeName(creationData.theme);
    
    return `
あなたは子ども向け絵本作家です。
以下の設定で魅力的な12ページの絵本を作成してください：

【設定】
主人公: ${character}
舞台: ${setting}  
テーマ: ${theme}

【重要条件】
- ${character}が主役として活躍する物語
- ${setting}の特徴を活かした描写
- ${theme}のテーマを通じて学びがある
- 各ページは1-2文の短い文章
- ひらがなとカタカナのみ使用（漢字は使わない）
- 5歳の子どもが理解できる内容
- 教育的で温かいメッセージ
- ワクワクする展開で面白くする
- 登場人物の感情が伝わる表現を入れる
- 暴力的な内容や怖いシーンは含めない

【物語構成】
1-3ページ：${character}と${setting}の紹介、${theme}につながる状況設定
4-6ページ：${theme}に関する問題や課題の発生
7-9ページ：${character}が${theme}を通じて成長・解決していく過程
10-12ページ：${theme}の学びと感動的な結末

出力形式（必ず以下の形式で出力してください）：
タイトル: [絵本のタイトル]
ページ1: [内容]
ページ2: [内容]
ページ3: [内容]
ページ4: [内容]
ページ5: [内容]
ページ6: [内容]
ページ7: [内容]
ページ8: [内容]
ページ9: [内容]
ページ10: [内容]
ページ11: [内容]
ページ12: [内容]
`;
}

// 生成されたテキストをパース
function parseGeneratedStory(text, creationData) {
    const lines = text.split('\n').filter(line => line.trim());
    const story = {
        id: generateStoryId(),
        title: '',
        pages: [],
        creationData: creationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // タイトルを抽出
    const titleLine = lines.find(line => line.toLowerCase().startsWith('タイトル:') || line.toLowerCase().startsWith('title:'));
    if (titleLine) {
        const titleMatch = titleLine.match(/(?:タイトル|title):[ 　]*(.*)/i);
        story.title = titleMatch ? titleMatch[1].trim() : '';
    }
    
    // タイトルが取得できなかった場合はデフォルトタイトルを設定
    if (!story.title) {
        story.title = creationData.mode === 'free' 
            ? creationData.userInput 
            : `${getCharacterName(creationData.character)}の ${getThemeName(creationData.theme)}`;
    }
    
    // ページを抽出
    for (let i = 1; i <= 12; i++) {
        const pageRegex = new RegExp(`(?:ページ|page)[ 　]*${i}:[ 　]*(.*)`, 'i');
        
        // ページ行を探す
        let pageContent = '';
        for (const line of lines) {
            const match = line.match(pageRegex);
            if (match) {
                pageContent = match[1].trim();
                break;
            }
        }
        
        // ページを追加
        story.pages.push({
            pageNumber: i,
            text: pageContent,
            audioUrl: null,
            isEdited: false
        });
    }
    
    // ページが不足している場合は補完
    while (story.pages.length < 12) {
        story.pages.push({
            pageNumber: story.pages.length + 1,
            text: '',
            audioUrl: null,
            isEdited: false
        });
    }
    
    return story;
}

// テンプレートストーリーを生成（フォールバック）
function generateTemplateStory(creationData) {
    console.log('テンプレートモードで生成');
    
    if (creationData.mode === 'free') {
        return generateFreeInputTemplate(creationData.userInput);
    } else {
        return generateSelectModeTemplate(creationData);
    }
}

// 自由入力のテンプレート（改善版）
function generateFreeInputTemplate(userInput) {
    const story = {
        id: generateStoryId(),
        title: userInput,
        pages: [],
        creationData: { mode: 'free', userInput },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // ユーザー入力に基づいた動的テンプレート生成
    const templates = createDynamicTemplate(userInput);
    
    templates.forEach((text, index) => {
        story.pages.push({
            pageNumber: index + 1,
            text: text,
            audioUrl: null,
            isEdited: false
        });
    });
    
    return story;
}

// ユーザー入力に基づく動的テンプレート作成
function createDynamicTemplate(userInput) {
    // 入力からキーワードを抽出
    const keywords = extractKeywords(userInput);
    
    // 音楽フェスの例のようなケース
    if (userInput.includes('音楽') || userInput.includes('楽器') || userInput.includes('フェス') || userInput.includes('おんがく') || userInput.includes('がっき')) {
        return [
            'もりに すんでいる どうぶつたちが、がっきを もちよって あつまりました。',
            '「きょうは おんがくフェスを ひらこう！」と みんなが いいました。',
            'うさぎは バイオリン、くまは ドラム、きつねは フルートを もってきました。',
            'ステージを つくって、おんがくの じゅんびを はじめました。',
            'いよいよ えんそうが スタート！ みんなで きれいな おんがくを かなでます。',
            'ところが とつぜん、つよい かぜが ふいてきて ふくが とんでしまいました！',
            'あめも ふりはじめて、がっきが ぬれそうに なりました。',
            'でも どうぶつたちは あきらめません。きを つかって やねを つくりました。',
            'あめの おとと いっしょに、もっと すてきな おんがくが うまれました。',
            'さいごは みんなで だいがっしょう！ もり ぜんたいに うたごえが ひびきました。',
            'おんがくフェスは だいせいこう。みんなの えがおが キラキラ かがやいていました。',
            'またらいねんも、もっと すてきな おんがくフェスを ひらこうと やくそくしました。'
        ];
    }
    
    // 宇宙関連
    if (userInput.includes('宇宙') || userInput.includes('うちゅう') || userInput.includes('星') || userInput.includes('ほし')) {
        return [
            'あるよる、そらを みあげていると ひかる ものが みえました。',
            'それは うちゅうせんでした！ なかから ちいさな うちゅうじんが でてきました。',
            '「こんにちは！ いっしょに うちゅうりょこうを しませんか？」',
            'わくわくしながら うちゅうせんに のりこみました。',
            'そらたかく とんで、きれいな ほしたちを みることが できました。',
            'つきでは うさぎさんたちが おもちを ついていました。',
            'きんせいでは きらきらひかる はなが さいていました。',
            'どわくせいでは ちいさな いきものたちが あそんでいました。',
            'うちゅうじんと いっしょに ほしから ほしへ たびを しました。',
            'うちゅうは ふしぎで すてきなところで いっぱいでした。',
            'たのしい たびが おわり、ちきゅうに もどってきました。',
            'また いつか、うちゅうりょこうに いきたいと おもいました。'
        ];
    }
    
    // 海関連
    if (userInput.includes('海') || userInput.includes('うみ') || userInput.includes('魚') || userInput.includes('さかな')) {
        return [
            'あおい うみに かわいい さかなの かぞくが すんでいました。',
            'きょうは かぞくで たのしい ぼうけんに でかけます。',
            'うみの そこには カラフルな さんごが きれいに さいていました。',
            'たこさんや えびさんと ともだちに なりました。',
            'みんなで かくれんぼを して あそびました。',
            'とつぜん おおきな なみが やってきて びっくり！',
            'でも みんなで ちからを あわせて のりこえました。',
            'うみの なかには ひかる しんじゅが かくれていました。',
            'しんじゅを みつけて みんな おおよろこび！',
            'うみのともだちと いっしょに おいわいパーティーを しました。',
            'たのしい いちにちが おわり、いえに かえりました。',
            'またあした、あたらしい ぼうけんを しようと やくそくしました。'
        ];
    }
    
    // 一般的なケース（改善版）
    return [
        '「' + userInput + '」の すてきな おはなしが はじまります。',
        'しゅじんこうは とても わくわくしながら じゅんびを しました。',
        'ともだちも いっしょに きてくれて、もっと たのしくなりました。',
        'みんなで きょうりょくして、すばらしいことを はじめました。',
        'とちゅうで ちょっとした こまったことが おきました。',
        'でも あきらめずに、みんなで かんがえて かいけつしました。',
        'どんどん じょうずに なって、みんな とても うれしくなりました。',
        'たくさんの ひとが みにきて、おうえんしてくれました。',
        'さいごは みんなで いっしょに よろこびを わかちあいました。',
        'すてきな おもいでが たくさん できました。',
        'みんなの えがおが キラキラ かがやいていました。',
        'また こんど、もっと すてきなことを しようね！'
    ];
}

// キーワード抽出（簡易版）
function extractKeywords(input) {
    const keywords = [];
    
    // 動物関連
    if (input.includes('どうぶつ') || input.includes('動物')) keywords.push('動物');
    if (input.includes('ねこ') || input.includes('猫')) keywords.push('ねこ');
    if (input.includes('いぬ') || input.includes('犬')) keywords.push('いぬ');
    
    // 音楽関連
    if (input.includes('おんがく') || input.includes('音楽')) keywords.push('音楽');
    if (input.includes('がっき') || input.includes('楽器')) keywords.push('楽器');
    if (input.includes('うた') || input.includes('歌')) keywords.push('歌');
    
    // 場所関連
    if (input.includes('もり') || input.includes('森')) keywords.push('森');
    if (input.includes('うみ') || input.includes('海')) keywords.push('海');
    if (input.includes('そら') || input.includes('空')) keywords.push('空');
    
    return keywords;
}

// 選択モードのテンプレート
function generateSelectModeTemplate(creationData) {
    const character = getCharacterName(creationData.character);
    const setting = getSettingName(creationData.setting);
    const theme = getThemeName(creationData.theme);
    
    const story = {
        id: generateStoryId(),
        title: character + 'の ' + theme,
        pages: [],
        creationData: creationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // テーマに応じたテンプレート
    const templates = getTemplatesByTheme(creationData.theme, character, setting);
    
    templates.forEach((text, index) => {
        story.pages.push({
            pageNumber: index + 1,
            text: text,
            audioUrl: null,
            isEdited: false
        });
    });
    
    return story;
}

// テーマ別テンプレート
function getTemplatesByTheme(theme, character, setting) {
    const templates = {
        friendship: [
            setting + 'に すんでいる ' + character + 'は、ともだちを さがしていました。',
            'あるひ、あたらしい だれかに であいました。',
            '「こんにちは！ いっしょに あそぼう！」',
            'ふたりは すぐに なかよしに なりました。',
            'いっしょに たのしい ゲームを しました。',
            'おひるごはんも いっしょに たべました。',
            'こまったときは たすけあいました。',
            'けんかを することも ありました。',
            'でも、すぐに なかなおり しました。',
            'ともだちが いると まいにちが たのしいです。',
            'これからも ずっと なかよしです。',
            'あたらしい ともだちが できて うれしいな！'
        ],
        treasure: [
            character + 'は ' + setting + 'で たからものを みつけました。',
            'それは ふしぎな ちずでした。',
            '「たからさがしに いこう！」',
            'ちずを たよりに あるきはじめました。',
            'みちは ながくて たいへんでした。',
            'でも、あきらめずに すすみました。',
            'とちゅうで いろいろな ひとに あいました。',
            'みんなが おうえん してくれました。',
            'ついに、たからものの ばしょに つきました。',
            'そこには すてきな ものが ありました。',
            'でも、ほんとうの たからものは...',
            'みんなとの であいと ゆうきでした！'
        ],
        helping: [
            setting + 'で ' + character + 'は こまっている ひとを みつけました。',
            '「だいじょうぶ？ てつだうよ！」',
            'やさしく こえを かけました。',
            'いっしょに もんだいを かんがえました。',
            'ちからを あわせて がんばりました。',
            'すこしずつ かいけつ していきました。',
            'みんなも てつだいに きてくれました。',
            'ついに もんだいが かいけつ しました！',
            '「ありがとう！」と いわれました。',
            character + 'も うれしく なりました。',
            'ひとを たすけると じぶんも しあわせです。',
            'これからも みんなを たすけたいな！'
        ],
        adventure: [
            character + 'は ' + setting + 'で ぼうけんを はじめました。',
            'みたことのない みちを あるきます。',
            'ドキドキ わくわくが とまりません。',
            'ふしぎな ものを たくさん みつけました。',
            'あたらしい ばしょに つきました。',
            'そこには びっくりする ものが！',
            'ゆうきを だして ちかづきました。',
            'すこし こわかったけど だいじょうぶでした。',
            'たくさんの ことを けいけん しました。',
            'あたらしい ちしきも ふえました。',
            'ぼうけんは とても たのしかったです。',
            'つぎは どんな ぼうけんが まってるかな？'
        ],
        magic: [
            character + 'は ' + setting + 'で まほうの ちからを みつけました。',
            'キラキラ ひかる ふしぎな ものでした。',
            'さわってみると...なにかが おきました！',
            'ちいさな まほうが つかえるように！',
            'さいしょは うまく いきませんでした。',
            'れんしゅうを たくさん しました。',
            'だんだん じょうずに なってきました。',
            'まほうで みんなを えがおに しました。',
            'でも、たいせつなのは まほうじゃなくて...',
            'やさしい こころだと きづきました。',
            'まほうは みんなの ために つかいます。',
            'これからも れんしゅう がんばるぞ！'
        ],
        party: [
            character + 'は ' + setting + 'で パーティーの じゅんびを しています。',
            'みんなを よろこばせたいな！',
            'かざりつけを はじめました。',
            'おいしい ごちそうも つくります。',
            'ともだちが てつだいに きました。',
            'みんなで きょうりょく しました。',
            'すてきな かいじょうが できました！',
            'ゲストが つぎつぎと やってきます。',
            'たのしい おんがくが ながれます。',
            'みんなで ダンスを しました。',
            'えがおが いっぱいの パーティーです。',
            'さいこうの おもいでが できました！'
        ]
    };
    
    // テーマが未定義の場合はともだちテーマを使用
    return templates[theme] || templates.friendship;
}

// ストーリーIDを生成
function generateStoryId() {
    return 'story_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 名前取得関数
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