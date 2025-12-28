var appKey = "28601151";
var appSecret = "wqaVdUU88PHjxuGn71yD";

var md5 = calcMd5();
var date = new Date().toString();
var nonce = createUuid();
var timestamp = new Date().getTime();

var textToSign = "";
textToSign += request.method + "\n";
textToSign += request.headers["accept"] + "\n";
textToSign += request.headers["content-type"] + "\n";


var headers = headersToSign();
var signatureHeaders;
var sortedKeys = Array.from(headers.keys()).sort()
for (var headerName of sortedKeys) {
    textToSign += headerName + ":" + headers.get(headerName) + "\n";
    signatureHeaders = signatureHeaders ? signatureHeaders + "," + headerName : headerName;
}
textToSign += urlToSign();
console.log("textToSign\n" + textToSign.replace(/\n/g, "#"));
var hash = CryptoJS.HmacSHA256(textToSign, appSecret)
console.log("hash:" + hash)
var signature = hash.toString(CryptoJS.enc.Base64)
console.log("signature:" + signature)

pm.globals.set('AppKey', appKey);
pm.globals.set('Md5', md5);
pm.globals.set("Date", date);
pm.globals.set("Signature", signature);
pm.globals.set("SignatureHeaders", signatureHeaders);
pm.globals.set("Nonce", nonce);
pm.globals.set("Timestamp", timestamp);

function headersToSign() {
    var headers = new Map();
    for (var name in request.headers) {
        name = name.toLowerCase();
        if (!name.startsWith('x-ca-')) {
            continue;
        } 
        if (name === "x-ca-signature" || name === "x-ca-signature-headers" || name == "x-ca-key" || name === 'x-ca-nonce') {
            continue;
        }
        var value = request.headers[name];
        headers.set(name, value);
    }
    headers.set('x-ca-key', appKey);
    headers.set('x-ca-timestamp', timestamp);
    console.log("headers: " + headers.size);
    for(var key in headers){
        console.log("key:" + key + "value:" + headers[key]);
    }
    return headers;
}

function urlToSign() {
    var params = new Map();
    var contentType = request.headers["content-type"];
    if (contentType && contentType.startsWith('application/x-www-form-urlencoded')) {
        const formParams = request.data.split("&");
        formParams.forEach((p) => {
            const ss = p.split('=');
            params.set(ss[0], ss[1]);
        })
    }
    
    const ss = request.url.split('?');
    if (ss.length > 1 && ss[1]) {
        const queryParams = ss[1].split('&');
        queryParams.forEach((p) => {
            const ss = p.split('=');
            params.set(ss[0], ss[1]);
        })
    }
    
    var sortedKeys = Array.from(params.keys())
    sortedKeys.sort();

    
    var l1 = ss[0].lastIndexOf('/');
    var url = ss[0].substring(23);
    var first = true;
    var qs
    for (var k of sortedKeys) {
        var s = k + "=" + params.get(k);
        qs = qs ? qs + "&" + s : s;
        console.log("key=" + k + " value=" + params.get(k));
    }
    return qs ? url + "?" + qs : url;
}

function calcMd5() {
    var contentType = request.headers["content-type"];
    if (request.data && !contentType.startsWith('application/x-www-form-urlencoded')) {
        var data = request.data;
        var md5 = CryptoJS.MD5(data);
        var md5String = md5.toString(CryptoJS.enc.Base64);
        console.log("data:" + data + "\nmd5:" + md5String);
        return md5String;
    } else {
        return "";
    }
}

function createUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}