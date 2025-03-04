export const fromHtmlEntities = function(str) {
    return (str+"").replace(/&#\d+;/gm,function(s) {
        return String.fromCharCode(s.match(/\d+/gm)[0]);
    })
};

export const toHtmlEntities = function(str) {
    return str.replace(/./gm, function(s) {
        // return "&#" + s.charCodeAt(0) + ";";
        return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
    });
};

export const padNumWithChar = function (num, size, char) {
    var s = String(num);
    while (s.length < (size || 2)) { s = char + s; }
    return s;
}