import { reviewState } from '../constants/Reducers';

export default function reviewReducer(state = reviewState, action) {
    switch (action.type) {
        case 'ADD_REVIEW_DATA':
            return {
                ...state,
                hid: action.reviewData.hid,
            };

        default:
            return state;
    }
}