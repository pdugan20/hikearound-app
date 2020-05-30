import Constants from 'expo-constants';
import { colors, spacing } from '../constants/Index';

export function getMapSearchStyle(theme) {
    return {
        textInputContainer: {
            backgroundColor: 'transparent',
            position: 'absolute',
            left: parseInt(spacing.tiny, 10),
            right: parseInt(spacing.tiny, 10),
            top: Constants.statusBarHeight - 5,
            borderTopWidth: 0,
            borderBottomWidth: 0,
        },
        textInput: {
            marginLeft: 0,
            marginRight: 0,
            color: colors.blackText,
            fontSize: 15,
            borderWidth: 1,
            borderColor: colors.grayUltraLight,
            height: 40,
        },
        container: {
            left: 0,
            right: 0,
            position: 'absolute',
            backgroundColor: colors.white,
            borderBottomLeftRadius: parseInt(spacing.tiny, 10),
            borderBottomRightRadius: parseInt(spacing.tiny, 10),
        },
        poweredContainer: {
            display: 'none',
        },
        listView: {
            marginTop: Constants.statusBarHeight + 45,
        },
        separator: {
            marginLeft: parseInt(spacing.tiny, 10),
            marginRight: parseInt(spacing.tiny, 10),
            backgroundColor: colors.grayLight,
        },
        row: {},
        powered: {},
        predefinedPlacesDescription: {},
    };
}

export default getMapSearchStyle;
