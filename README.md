# hws-lib.js

Hamajima Web Support client library for javascript

## 概要

浜島Webサポート上で動作するWebアプリケーション用javascriptライブラリ。

*  名前空間 : HWS
*  他のライブラリなどへの依存 : なし

## アクセス制御

CSRF対策のため，浜島Webサポート環境外からのAPIへのアクセスはできない。

## ユーザデータ

アプリケーション上から浜島Webサポートサーバ上に，任意のデータを保存・読み出しすることができる。
データは， JSON形式に変換され，現在ログインしているユーザに紐付けられて保存される。

ユーザが浜島Webサポートにログインしていない状態でデータの保存・読み出しをしようとすると，HTTP 403 (Forbidden)が返される。

### データの保存

```javascript
HWS.setUserData(opt)
```

| field | description |
| ------ | ------ |
| opt.contents_id | **[required]** 浜島Webサポートで指定されるコンテンツを識別するための文字列（アプリケーションごとの名前空間として使用される） |
| opt.key | **[required]** データを格納する項目名 |
| opt.data | **[required]** 保存されるデータ |
| opt.success | 保存成功時のコールバック |
| opt.error | 保存失敗時のコールバック |

例

```javascript
const userData = {
    a: "hoge",
    b: 123,
    c: 5.1
}

HWS.setUserData({
    client_id: "sample-client-id",
    key: "app-setting",
    data: userData,
    success: function() {
        alert("data saved");
    },
    error: function(req, status, error) {
        alert("cannot save user data");
    }
});
```

### データの取得

```javascript
HWS.getUserData(opt)
```

| field | description |
| ------ | ------ |
| opt.contents_id | **[required]** 浜島Webサポートで指定されるコンテンツを識別するための文字列（アプリケーションごとの名前空間として使用される） |
| opt.key | **[required]** データを格納する項目名 |
| opt.success | 保存成功時のコールバック |
| opt.error | 保存失敗時のコールバック |

例

```javascript
HWS.getUserData({
    client_id: "sample-client-id",
    key: "app-setting",
    success: function(data) {
        alert("data loaded");
        console.log(data);
    },
    error: function(req, status, error) {
        alert("cannot load user data");
    }
});
```