/**
 * えほんのくに - 絵本データ管理スクリプト
 * 管理者が提供する絵本データを管理します
 */

// 管理者提供の絵本データ
const OFFICIAL_BOOKS = [
    {
        id: "official_001",
        title: "ももたろう",
        author: "管理者",
        type: "official",
        createdAt: "2023-01-01T00:00:00.000Z",
        coverImage: "assets/images/books/momotaro/cover.png",
        pages: [
            {
                pageNumber: 1,
                text: "むかしむかし、あるところに おじいさんと おばあさんが すんでいました。",
                imageUrl: "assets/images/books/momotaro/page1.png"
            },
            {
                pageNumber: 2,
                text: "あるひ、おばあさんが かわで せんたくをしていると、おおきな もも が ながれてきました。",
                imageUrl: "assets/images/books/momotaro/page2.png"
            },
            {
                pageNumber: 3,
                text: "おばあさんが ももを ひろって かえると、もも が ぱかっと わかれて、なかから かわいい あかちゃんが でてきました。",
                imageUrl: "assets/images/books/momotaro/page3.png"
            },
            {
                pageNumber: 4,
                text: "おじいさんと おばあさんは、この こを ももたろうと なづけて、だいじに そだてました。",
                imageUrl: "assets/images/books/momotaro/page4.png"
            },
            {
                pageNumber: 5,
                text: "ももたろうは ぐんぐん せいちょうして、とても つよい こどもに なりました。",
                imageUrl: "assets/images/books/momotaro/page5.png"
            },
            {
                pageNumber: 6,
                text: "ある日、ももたろうは「おにが、しまに すんでいて、みんなの たからものを とっています。おにたいじに いってきます」と いいました。",
                imageUrl: "assets/images/books/momotaro/page6.png"
            },
            {
                pageNumber: 7,
                text: "おばあさんは、ももたろうに きびだんごを つくってあげました。ももたろうは、きびだんごを もって おにたいじの たびに でかけました。",
                imageUrl: "assets/images/books/momotaro/page7.png"
            },
            {
                pageNumber: 8,
                text: "みちで いぬが やってきて「ももたろうさん、どこへ いくの？」と ききました。「おにが しまへ おにたいじに いくんだ」と ももたろうは こたえました。",
                imageUrl: "assets/images/books/momotaro/page8.png"
            },
            {
                pageNumber: 9,
                text: "いぬは「きびだんごを ひとつ ください。おともします」と いいました。ももたろうは きびだんごを わけてあげました。",
                imageUrl: "assets/images/books/momotaro/page9.png"
            },
            {
                pageNumber: 10,
                text: "つぎに さるが やってきて、さらに きじも やってきて、みんなで おにが しまへ むかいました。",
                imageUrl: "assets/images/books/momotaro/page10.png"
            },
            {
                pageNumber: 11,
                text: "おにが しまについた ももたろうたちは、おにたちと たたかいました。ももたろうは とても つよかったので、おには まけてしまいました。",
                imageUrl: "assets/images/books/momotaro/page11.png"
            },
            {
                pageNumber: 12,
                text: "おには「もう わるいことは しません」と あやまりました。たからものを とりかえした ももたろうたちは、みんなの ところへ かえりました。めでたし めでたし。",
                imageUrl: "assets/images/books/momotaro/page12.png"
            }
        ]
    },
    {
        id: "official_002",
        title: "きんぎょの おつかい",
        author: "管理者",
        type: "official",
        createdAt: "2023-02-15T00:00:00.000Z",
        coverImage: "assets/images/books/kingyo/cover.png",
        pages: [
            {
                pageNumber: 1,
                text: "きんぎょの きんちゃんは、おかあさんの おつかいに いきました。",
                imageUrl: "assets/images/books/kingyo/page1.png"
            },
            {
                pageNumber: 2,
                text: "「おみずと えさを かってきてね」と おかあさんが いいました。",
                imageUrl: "assets/images/books/kingyo/page2.png"
            },
            {
                pageNumber: 3,
                text: "きんちゃんは きんぎょばちから とびだして、みずの なかを およぎはじめました。",
                imageUrl: "assets/images/books/kingyo/page3.png"
            },
            {
                pageNumber: 4,
                text: "みちで かめの かめきちに あいました。「どこへ いくの？」と かめきち。「おつかいに いくの」と きんちゃん。",
                imageUrl: "assets/images/books/kingyo/page4.png"
            },
            {
                pageNumber: 5,
                text: "かめきちと いっしょに およいでいると、たこの たろうに あいました。「ぼくも いっしょに いってもいい？」",
                imageUrl: "assets/images/books/kingyo/page5.png"
            },
            {
                pageNumber: 6,
                text: "みんなで おみせに つきました。きんちゃんは おみずと えさを かいました。",
                imageUrl: "assets/images/books/kingyo/page6.png"
            },
            {
                pageNumber: 7,
                text: "かえりみち、くじらの くじろうに あいました。「なにを もっているの？」「おかあさんの おつかいで かったの」",
                imageUrl: "assets/images/books/kingyo/page7.png"
            },
            {
                pageNumber: 8,
                text: "くじろうが「てつだってあげるよ」と いって、おおきな くちで おみずと えさを はこんでくれました。",
                imageUrl: "assets/images/books/kingyo/page8.png"
            },
            {
                pageNumber: 9,
                text: "ところが とちゅうで、あめが ふってきました。みずの なかなのに あめって ふしぎですね。",
                imageUrl: "assets/images/books/kingyo/page9.png"
            },
            {
                pageNumber: 10,
                text: "みんなで いそいで およぎました。でも、みずの なかだから ぬれても へいきですね。",
                imageUrl: "assets/images/books/kingyo/page10.png"
            },
            {
                pageNumber: 11,
                text: "やっと おうちに つきました。「おかあさん、ただいま！ おつかい できたよ」",
                imageUrl: "assets/images/books/kingyo/page11.png"
            },
            {
                pageNumber: 12,
                text: "おかあさんは「ありがとう、きんちゃん。えらいね」と ほめてくれました。きんちゃんは とても うれしかったです。",
                imageUrl: "assets/images/books/kingyo/page12.png"
            }
        ]
    },
    {
        id: "official_003",
        title: "こぶたの ぼうけん",
        author: "管理者",
        type: "official",
        createdAt: "2023-05-20T00:00:00.000Z",
        coverImage: "assets/images/books/kobuta/cover.png",
        isNew: true,
        pages: [
            {
                pageNumber: 1,
                text: "3びきの こぶたが もりのなかを たんけんします。なまえは ぶーちゃん、ぶうちゃん、ぶいちゃんです。",
                imageUrl: "assets/images/books/kobuta/page1.png"
            },
            {
                pageNumber: 2,
                text: "「きょうは どこに いこうかな」と ぶーちゃん。「おおきな きの ところに いこう」と ぶうちゃん。",
                imageUrl: "assets/images/books/kobuta/page2.png"
            },
            {
                pageNumber: 3,
                text: "こぶたたちは もりのなかを あるきはじめました。とりが うたっています。「きれいな こえだね」",
                imageUrl: "assets/images/books/kobuta/page3.png"
            },
            {
                pageNumber: 4,
                text: "とちゅうで りすに あいました。「こんにちは、どこに いくの？」「たんけんに いくんだよ」",
                imageUrl: "assets/images/books/kobuta/page4.png"
            },
            {
                pageNumber: 5,
                text: "りすが「わたしも いっしょに いってもいい？」と きいてきました。「もちろん、いいよ！」",
                imageUrl: "assets/images/books/kobuta/page5.png"
            },
            {
                pageNumber: 6,
                text: "4ひきは おおきな きを みつけました。「わあ、すごく おおきいね！」「のぼってみようよ」",
                imageUrl: "assets/images/books/kobuta/page6.png"
            },
            {
                pageNumber: 7,
                text: "みんなで きを のぼろうとしましたが、こぶたたちは うまく のぼれませんでした。りすだけが すいすい のぼっていきます。",
                imageUrl: "assets/images/books/kobuta/page7.png"
            },
            {
                pageNumber: 8,
                text: "「ぼくたちは のぼれないね」「でも だいじょうぶ、べつの たのしいことを しよう」と ぶいちゃん。",
                imageUrl: "assets/images/books/kobuta/page8.png"
            },
            {
                pageNumber: 9,
                text: "こぶたたちは きのみを あつめはじめました。たくさん あつめて かごが いっぱいに なりました。",
                imageUrl: "assets/images/books/kobuta/page9.png"
            },
            {
                pageNumber: 10,
                text: "「みんなで たべようよ」と ぶーちゃん。りすも きから おりてきて、いっしょに きのみを たべました。",
                imageUrl: "assets/images/books/kobuta/page10.png"
            },
            {
                pageNumber: 11,
                text: "おひるごはんの あとは、みんなで かくれんぼを しました。りすは とても じょうずに かくれます。",
                imageUrl: "assets/images/books/kobuta/page11.png"
            },
            {
                pageNumber: 12,
                text: "たのしい いちにちが おわり、こぶたたちは「また あした あそぼうね」と いって おうちに かえりました。",
                imageUrl: "assets/images/books/kobuta/page12.png"
            }
        ]
    }
];

// 管理者絵本をIDで取得する関数
function getOfficialBookById(bookId) {
    return OFFICIAL_BOOKS.find(book => book.id === bookId) || null;
}

// 管理者絵本の一覧を取得する関数
function getAllOfficialBooks() {
    return OFFICIAL_BOOKS;
}

// 絵本データ（管理者またはユーザー）を種類とIDから取得する関数
function getBookById(bookId, bookType = 'user') {
    // 管理者提供の絵本の場合
    if (bookType === 'official') {
        return getOfficialBookById(bookId);
    }
    
    // ユーザー作成の絵本の場合はローカルストレージから取得
    try {
        const stories = JSON.parse(localStorage.getItem('generatedStories') || '[]');
        return stories.find(story => story.id === bookId) || null;
    } catch (error) {
        console.error('ユーザー絵本の取得に失敗しました:', error);
        return null;
    }
}

// 絵本データを初期化（必要に応じて）
function initializeBookData() {
    console.log('絵本データを初期化しました');
    // 今後、初期データのロードなどが必要になったら実装
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', initializeBookData);