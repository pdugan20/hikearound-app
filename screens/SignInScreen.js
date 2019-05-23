import React from 'react';
import styled from 'styled-components';
import {
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { connect } from 'react-redux';
import firebase from '../components/Firebase';
import { NavigationActions, StackActions } from 'react-navigation';
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory';
import ActionButton from '../components/ActionButton';
import colors from '../constants/Colors';
import spacing from '../constants/Spacing';
import fontSizes from '../constants/Fonts';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
});

let inputs = [
    {
        keyboardType: 'email-address',
        placeholder: 'Email',
        autoCorrect: false,
        autoCapitalize: 'none',
    },
    {
        placeholder: 'Password',
        secureTextEntry: true,
    },
];

function mapStateToProps(state) {
    return { action: state.action };
}

class SignInScreen extends React.Component {
    static navigationOptions = {
        headerStyle: {
            backgroundColor: colors.purple,
            height: parseInt(spacing.header),
        },
        headerTintColor: colors.white,
        headerTitle: 'Sign In',
        headerTitleStyle: {
            fontSize: parseInt(fontSizes.header),
        },
    };

    constructor(props) {
        super(props);

        inputs = inputs.map(input => ({
            ref: React.createRef(),
            ...input,
        }));

        this.state = {
            activeInputIndex: 0,
            nextFocusDisabled: false,
            previousFocusDisabled: false,
            buttonsDisabled: false,
            buttonsHidden: false,
            email: '',
            password: '',
        };
    }

    setValue(text, index) {
        if (index === 0) {
            this.setState({ email: text });
        } else {
            this.setState({ password: text });
        }
    }

    handleLogin = () => {
        this.setState({ isLoading: true });

        const email = this.state.email;
        const password = this.state.password;

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(function(error) {
                Alert.alert('Error', error.message);
            })
            .then(response => {
                if (response) {
                    this.setState({ isSuccessful: true });
                    this.handleContinue();
                }
            });
    };

    handleContinue = () => {
        this.props.navigation.dispatch(resetAction);
    }

    handleFocus = index => () => {
        this.setState({
            nextFocusDisabled: index === inputs.length - 1,
            previousFocusDisabled: index === 0,
            activeInputIndex: index,
        });
    }

    handleFocusNext = () => {
        const { nextFocusDisabled, activeInputIndex } = this.state;
        if (nextFocusDisabled) {
            return;
        }
        inputs[activeInputIndex + 1].ref.current.focus();
    }

    handleFocusPrevious = () => {
        const { previousFocusDisabled, activeInputIndex } = this.state;
        if (previousFocusDisabled) {
            return;
        }
        inputs[activeInputIndex - 1].ref.current.focus();
    }

    render() {
        return (
            <RootView>
                <ScrollView keyboardShouldPersistTaps="always">
                    { inputs.map(({
                        placeholder,
                        keyboardType,
                        secureTextEntry,
                        autoCorrect,
                        autoCapitalize,
                        ref,
                    }, index) =>
                        <TextInput
                            key={`input_${index}`}
                            ref={ref}
                            placeholder={placeholder}
                            keyboardType={keyboardType}
                            secureTextEntry={secureTextEntry}
                            autoCorrect={autoCorrect}
                            autoCapitalize={autoCapitalize}
                            blurOnSubmit={false}
                            onFocus={this.handleFocus(index)}
                            autoFocus={index === 0}
                            onChangeText={text => this.setValue(text, index)}
                        />
                    )}
                    <TouchableOpacity
                        activeOpacity={0.4}>
                        <PasswordText>Forgot Password?</PasswordText>
                    </TouchableOpacity>
                </ScrollView>
                <KeyboardAccessoryNavigation
                    avoidKeyboard={true}
                    nextDisabled={this.state.nextFocusDisabled}
                    previousDisabled={this.state.previousFocusDisabled}
                    nextHidden={this.state.buttonsHidden}
                    previousHidden={this.state.buttonsHidden}
                    onNext={this.handleFocusNext}
                    onPrevious={this.handleFocusPrevious}
                    doneButton={<Text>Continue</Text>}
                    tintColor={colors.purple}
                    onDone={this.handleLogin}
                />
            </RootView>
        );
    }
}

export default connect(
    mapStateToProps,
)(SignInScreen);

const RootView = styled.View`
    flex: 1;
    margin-top: 26px;
`;

const TextInput = styled.TextInput`
    margin: 0 20px 26px 20px;
    border-bottom-width: 1px;
    border-bottom-color: #D8D8D8;
    font-size: 20px;
`;

const Text = styled.Text`
    font-size: 18px;
    color: ${colors.purple};
    font-weight: 600;
`;

const PasswordText = styled.Text`
    font-weight: 500;
    font-size: 18px;
    margin-left: 20px;
    color: ${colors.purple};
`;
