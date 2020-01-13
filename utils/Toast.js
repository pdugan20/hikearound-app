export function getToastText(action, name) {
    let toastText = '';

    if (action === 'favoriteHike') {
        toastText = `You favorited ${name}.`;
    }
    if (action === 'copyLink') {
        toastText = `Link copied to clipboard.`;
    }

    return toastText;
}

export default {
    getToastText,
};
