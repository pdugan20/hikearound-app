import { userState } from '@constants/Reducers';

export default function userReducer(state = userState, action) {
    switch (action.type) {
        case 'INITIALIZE_USER_DATA':
            return {
                ...state,
                name: action.userData.name,
                location: action.userData.location,
                map: action.userData.map,
                darkMode: action.userData.darkMode,
                notifs: action.userData.notifs,
                favoriteHikes: action.userData.favoriteHikes,
                reviewedHikes: action.userData.reviewedHikes,
                notifBadgeCount: action.userData.notifBadgeCount,
            };

        case 'INITIALIZE_AVATAR':
            return {
                ...state,
                avatar: action.uri,
            };

        case 'UPDATE_USER_DATA':
            return {
                ...state,
                name: action.userData.name,
                location: action.userData.location,
            };

        case 'UPDATE_USER_POSITION':
            return {
                ...state,
                currentPosition: action.currentPosition,
            };

        case 'UPDATE_FAVORITE_HIKES':
            return {
                ...state,
                favoriteHikes: action.favoriteHikes,
            };

        case 'UPDATE_REVIEWED_HIKES':
            return {
                ...state,
                reviewedHikes: action.reviewedHikes,
            };

        case 'UPDATE_AVATAR':
            return {
                ...state,
                avatar: action.photoData.uri,
            };

        case 'UPDATE_MAP':
            return {
                ...state,
                map: action.map,
            };

        case 'UPDATE_DARK_MODE':
            return {
                ...state,
                darkMode: action.darkMode,
            };

        case 'UPDATE_NOTIFS':
            return {
                ...state,
                notifs: action.notifs,
            };

        case 'UPDATE_NOTIF_BADGE_COUNT':
            return {
                ...state,
                notifBadgeCount: action.notifBadgeCount,
            };

        default:
            return state;
    }
}
