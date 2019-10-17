import React from 'react';
import styled from 'styled-components';
import { Alert } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import firebase from 'firebase';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputButton from '../components/InputButton';
import InputLabelGroup from '../components/InputLabelGroup';
import { updateUserData } from '../actions/User';

const createAccountInputs = [
    {
        keyboardType: 'default',
        placeholder: 'Name',
        name: 'name',
        autoCorrect: false,
        textContentType: 'name',
    },
    {
        keyboardType: 'email-address',
        placeholder: 'Email',
        name: 'email',
        autoCorrect: false,
        autoCapitalize: 'none',
        textContentType: 'emailAddress',
    },
    {
        placeholder: 'Password',
        name: 'password',
        secureTextEntry: true,
        textContentType: 'password',
    },
];

const propTypes = {
    dispatchUserData: PropTypes.func.isRequired,
};

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchUserData: (userData) => dispatch(updateUserData(userData)),
    };
}

class CreateAccountScreen extends React.Component {
    setValue(name, text) {
        this.setState({ [name]: text });
    }

    handleCreateAccount = async () => {
        const { email, password, name } = this.state;
        const { navigation, dispatchUserData } = this.props;

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch((error) => {
                Alert.alert('Error', error.message);
            })
            .then((response) => {
                if (response) {
                    dispatchUserData({ name });
                    navigation.dispatch(resetAction);
                }
            });
    };

    static navigationOptions = {
        headerTitle: 'Create Account',
        headerBackTitle: null,
    };

    render() {
        return (
            <RootView>
                {createAccountInputs.map(
                    (
                        {
                            name,
                            placeholder,
                            keyboardType,
                            secureTextEntry,
                            autoCorrect,
                            autoCapitalize,
                            textContentType,
                        },
                        index,
                    ) => (
                        <InputLabelGroup
                            key={index}
                            placeholder={placeholder}
                            keyboardType={keyboardType}
                            secureTextEntry={secureTextEntry}
                            autoCorrect={autoCorrect}
                            autoCapitalize={autoCapitalize}
                            autoFocus={index === 0}
                            onChangeText={(text) =>
                                this.setValue(name, text, index)
                            }
                            labelName={placeholder}
                            textContentType={textContentType}
                        />
                    ),
                )}
                <InputButton
                    text='Create Account'
                    action={this.handleCreateAccount}
                />
            </RootView>
        );
    }
}

CreateAccountScreen.propTypes = propTypes;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateAccountScreen);

const RootView = styled.View`
    flex: 1;
`;
