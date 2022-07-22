export function getJsonStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function setJsonStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
