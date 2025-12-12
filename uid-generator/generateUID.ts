// Character sets
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // 52 chars
const DIGITS = "0123456789"; // 10 chars

// Hash a string into pseudo-random bytes (deterministic)
function hashString(input: string): number[] {
    let hash = 2166136261;

    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash +=
            (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }

    // Expand hash into 6 usable bytes
    const bytes: number[] = [];
    for (let i = 0; i < 6; i++) {
        bytes.push((hash >> (i * 4)) & 0xff);
    }

    return bytes;
}

// Generate 6-char UID (4 letters + 2 digits)
function generateUID(name: string): string {
    const normalized = name.trim().toLowerCase();
    const hashBytes = hashString(normalized);

    const chars: string[] = [];

    // Select 4 alphabet characters
    for (let i = 0; i < 4; i++) {
        const index = hashBytes[i] % ALPHABET.length;
        chars.push(ALPHABET[index]);
    }

    // Select 2 digit characters
    for (let i = 4; i < 6; i++) {
        const index = hashBytes[i] % DIGITS.length;
        chars.push(DIGITS[index]);
    }

    // Deterministic shuffle (Fisher–Yates)
    for (let i = chars.length - 1; i > 0; i--) {
        const j = hashBytes[i] % (i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join("");
}

