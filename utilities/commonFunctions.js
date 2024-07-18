export function setCookie(name, value, days, path = '/', domain = '', secure = false) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    let cookieString = `${name}=${encodeURIComponent(value)}${expires}; path=${path}`;
    if (domain) {
        cookieString += `; domain=${domain}`;
    }
    if (secure) {
        cookieString += "; secure";
    }
    document.cookie = cookieString;
}

export function getCookie(name) {
    let cookieName = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

export function clearCookie(name) {
    let cookieName = name + "=";
    let expiryDate = "Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = cookieName + "; expires=" + expiryDate + "; path=/";
}