import React from 'react';
import styled from 'styled-components';
import colors from '../constants/Colors';
import spacing from '../constants/Spacing';
import fontSizes from '../constants/Fonts';

class ProfileScreen extends React.Component {
    static navigationOptions = {
        headerStyle: {
            backgroundColor: colors.purple,
            height: parseInt(spacing.header),
        },
        headerTintColor: colors.white,
        headerTitle: 'You',
        headerTitleStyle: {
            fontSize: parseInt(fontSizes.header),
        },
    };

    render() {
        return (
            <Container>
                <Text>Profile Screen</Text>
            </Container>
        );
    }
}

export default ProfileScreen;

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Text = styled.Text``;
