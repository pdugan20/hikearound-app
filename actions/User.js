export const updateName = () => {
    return { type: 'UPDATE_NAME' };
};

export const updateAvatar = (avatar) => {
    return { type: 'UPDATE_AVATAR', avatar };
};

export const updateLocation = () => {
    return { type: 'UPDATE_LOCATION' };
};

export const setMap = (map) => {
    return { type: 'SET_DEFAULT_MAP', map };
};
