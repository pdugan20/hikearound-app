import { mapState } from '../constants/Reducers';

export default function mapReducer(state = mapState, action) {
    switch (action.type) {
        case 'INITIALIZE_MAP_DATA':
            return {
                ...state,
                mapStyle: action.mapData.mapStyle,
                mapType: action.mapData.mapType,
                selectedHike: action.mapData.selectedHike,
            };
        case 'UPDATE_MAP_DATA':
            return {
                ...state,
                mapStyle: action.mapData.mapStyle,
                mapType: action.mapData.mapType,
                selectedHike: action.mapData.selectedHike,
            };
        default:
            return state;
    }
}