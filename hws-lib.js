/*
   Hamajima Web Support client library for javascript
   © Hamajima Shoten, Publishers
 */

const HWS = {
    version: "0.1.5",

    /*
       ユーザデータの保存
       opt.key: [required] データキー
       opt.data: [required] ユーザデータ
       opt.success: 成功時コールバック
       opt.error: 失敗時コールバック
     */
    setUserData: function(opt) {
        if(opt && opt.data instanceof Object) {
            opt.data = JSON.stringify(opt.data);
        }

        HWS_Internal.callSafeApi({
            url: "/api/v1/user/set_user_data",
            method: "POST",
            dataType: "json",
            params: {key: opt.key, value: opt.data},
            success: opt.success ? opt.success : undefined,
            error: opt.error ? opt.error : undefined
        });
    },

    /*
       ユーザデータの取得
       opt.key: [required] データキー
       opt.success: 成功時コールバック
       opt.error: 失敗時コールバック
     */
    getUserData: function(opt) {
        HWS_Internal.callSafeApi({
            url: "/api/v1/user/get_user_data",
            method: "POST",
            dataType: "json",
            params: {key: opt.key},
            success: opt.success ? opt.success : undefined,
            error: opt.error ? opt.error : undefined
        });
    },
};

const HWS_Internal = {
    /*
       XHRヘルパ
       opt.url: リクエスト先URL
       opt.method: HTTP method
       opt.dataType: レスポンスデータ形式 ("json" | "text")
       opt.params: リクエストデータ
       opt.success: リクエスト成功時コールバック
       opt.error: リクエスト失敗時コールバック
     */
    fetch: function(opt) {
        if(!opt || !opt.url) {
            throw "insufficient parameter";
        }
        const method = opt.method ? opt.method : "GET";
        const dataType = opt.dataType ? opt.dataType : "json";
        const parseResponseText = function(text) {
            if(dataType === "json") {
                return JSON.parse(text);
            }
            else {
                return text;
            }
        };

        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        if(opt.params) {
            for(let name in opt.params) {
                fd.append(name, opt.params[name]);
            }
        }
        xhr.addEventListener("load", function() {
            if(xhr.readyState === xhr.DONE) {
                if(xhr.status === 200) {
                    if(opt.success) {
                        const data = parseResponseText(xhr.responseText);
                        opt.success(data);
                    }
                }
                else {
                    if(opt.error) {
                        opt.error(xhr, "error", xhr.statusText);
                    }
                }
            }
        });
        xhr.open(method, opt.url);
        if(opt.params) {
	    xhr.send(fd);
        }
        else {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send("");
        }
    },

    /*
       opt.url: リクエスト先URL
       opt.method: HTTP method
       opt.dataType: レスポンスデータ形式 ("json" | "text")
       opt.params: リクエストデータ
       opt.success: リクエスト成功時コールバック
       opt.error: リクエスト失敗時コールバック
     */
    callSafeApi: function(opt) {
        HWS_Internal.fetch({
            url: "/api/v1/token/get",
            method: "POST",
            success: function(data) {
                const token = data.token;
                opt.params = opt.params ? opt.params : {};
                opt.params.token = token;
                HWS_Internal.fetch(opt);
            },
            error: function(req, status, error) {
                if(opt.error) {
                    opt.error(req, status, error);
                }
            }
        });
    },
};
