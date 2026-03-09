// Funções utilitárias de matemática
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function randomInt(random, min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
}

module.exports = {
    clamp,
    randomInt
};
