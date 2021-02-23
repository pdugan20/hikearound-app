import React from 'react';
import { CommonActions } from '@react-navigation/native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import firebase from 'firebase';
import { Alert } from 'react-native';
import { withTranslation } from 'react-i18next';
import { spacing } from '../../constants/Index';
import { getScreenWidth } from '../../utils/Screen';
import { withTheme } from '../../utils/Themes';
import { logEvent } from '../../utils/Analytics';
import { withNavigation } from '../../utils/Navigation';
import { createUserProfile } from '../../utils/User';
import { mapCodeToTranslation } from '../../utils/Localization';
import { getPermissionStatus } from '../../utils/Permissions';
import { buildFormattedName } from '../../utils/Apple';

const { FULL_NAME, EMAIL } = AppleAuthentication.AppleAuthenticationScope;
const { WHITE, BLACK } = AppleAuthentication.AppleAuthenticationButtonStyle;

const nonce = 'APPLE_SIGN_IN';

const propTypes = {
    type: PropTypes.string.isRequired,
    dispatchUserData: PropTypes.func,
    setLoading: PropTypes.func,
    cornerRadius: PropTypes.number,
    height: PropTypes.number,
};

const defaultProps = {
    cornerRadius: 0,
    height: 42,
    dispatchUserData: () => {},
    setLoading: () => {},
};

class AppleAuthButton extends React.Component {
    getButtonType = () => {
        const { type } = this.props;
        return AppleAuthentication.AppleAuthenticationButtonType[type];
    };

    logEvent = () => {
        const { type } = this.props;
        logEvent(type.toLowerCase(), {});
    };

    maybeCreateProfile = (response, name) => {
        const { dispatchUserData } = this.props;

        if (!response.user.displayName) {
            createUserProfile(
                dispatchUserData,
                response,
                buildFormattedName(name),
            );
        }
    };

    setNextScreen = async () => {
        const { type } = this.props;
        const status = await getPermissionStatus('location');

        if (status !== 'granted' && type === 'SIGN_UP') {
            return 'LocationPermission';
        }

        return 'Home';
    };

    navigateToNextScreen = async () => {
        const { navigation } = this.props;
        const screen = await this.setNextScreen();

        const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: screen }],
        });

        navigation.dispatch(resetAction);
    };

    signInSuccessful = (response, name) => {
        this.maybeCreateProfile(response, name);
        this.logEvent();
        this.navigateToNextScreen();
    };

    handleLogin = async (credential) => {
        const { setLoading } = this.props;
        const { identityToken, fullName } = credential;

        const authCredential = new firebase.auth.OAuthProvider(
            'apple.com',
        ).credential({
            idToken: identityToken,
            rawNonce: nonce,
        });

        setLoading(true);

        await firebase
            .auth()
            .signInWithCredential(authCredential)
            .catch((error) => {
                this.showErrorAlert(error);
                setLoading(false);
            })
            .then((response) => {
                if (response) {
                    this.signInSuccessful(response, fullName);
                }
            });
    };

    showErrorAlert = (error) => {
        const { t } = this.props;
        Alert.alert(t('error.label'), mapCodeToTranslation(t, error.code));
    };

    getButtonStyle = () => {
        const { theme } = this.props;

        if (theme.dark) {
            return BLACK;
        }

        return WHITE;
    };

    onPress = async () => {
        const hashedNonce = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            nonce,
        );

        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [FULL_NAME, EMAIL],
            nonce: hashedNonce,
        });

        this.handleLogin(credential);
    };

    render() {
        const { cornerRadius, height } = this.props;

        return (
            <ButtonWrapper>
                <AppleAuthentication.AppleAuthenticationButton
                    buttonType={this.getButtonType()}
                    buttonStyle={this.getButtonStyle()}
                    cornerRadius={cornerRadius}
                    style={{ width: getScreenWidth(), height }}
                    onPress={this.onPress}
                />
            </ButtonWrapper>
        );
    }
}

export default withTheme(withTranslation()(withNavigation(AppleAuthButton)));

AppleAuthButton.propTypes = propTypes;
AppleAuthButton.defaultProps = defaultProps;

const ButtonWrapper = styled.View`
    margin-top: ${spacing.medium}px;
    margin-bottom: ${spacing.medium}px;
    border-color: ${(props) => props.theme.itemBorder};
    border-top-width: 1px;
    border-bottom-width: 1px;
`;