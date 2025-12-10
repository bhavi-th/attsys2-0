// Character sets
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // 52 chars
var DIGITS = "0123456789"; // 10 chars
// Hash a string into pseudo-random bytes (deterministic)
function hashString(input) {
    var hash = 2166136261;
    for (var i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash +=
            (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    // Expand hash into 6 usable bytes
    var bytes = [];
    for (var i = 0; i < 6; i++) {
        bytes.push((hash >> (i * 4)) & 0xff);
    }
    return bytes;
}
// Generate 6-char UID (4 letters + 2 digits)
function generateUID(name) {
    var _a;
    var normalized = name.trim().toLowerCase();
    var hashBytes = hashString(normalized);
    var chars = [];
    // Select 4 alphabet characters
    for (var i = 0; i < 4; i++) {
        var index = hashBytes[i] % ALPHABET.length;
        chars.push(ALPHABET[index]);
    }
    // Select 2 digit characters
    for (var i = 4; i < 6; i++) {
        var index = hashBytes[i] % DIGITS.length;
        chars.push(DIGITS[index]);
    }
    // Deterministic shuffle (Fisher–Yates)
    for (var i = chars.length - 1; i > 0; i--) {
        var j = hashBytes[i] % (i + 1);
        _a = [chars[j], chars[i]], chars[i] = _a[0], chars[j] = _a[1];
    }
    return chars.join("");
}
