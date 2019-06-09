import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, HeaderSettings } from '../components/Index'
import { connect } from 'react-redux';
import { spacing, colors, fontSizes, fontWeights } from '../constants/Index'

function mapStateToProps(state) {
    return {
        action: state.action,
        name: state.name
    };
}

class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        return {
            headerTitle: 'You',
            headerBackTitle: null,
            headerRight: <HeaderSettings sortType={params.sortType}/>,
        };
    }

    render() {
        return (
            <RootView>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <ProfileHeader
                        source={require('../assets/profile-bg.png')} >
                        <AvatarWrapper>
                            <TouchableOpacity activeOpacity={0.4}>
                                <Avatar />
                            </TouchableOpacity>
                        </AvatarWrapper>
                        <NameText>{this.props.name}</NameText>
                        <LocationText>Seattle, WA</LocationText>

                        <TouchableOpacity
                            activeOpacity={0.4}
                            style={{
                                position: 'absolute',
                                right: 15,
                                bottom: 20,
                            }}>
                            <EditProfileLink>Edit Profile</EditProfileLink>
                        </TouchableOpacity>
                    </ProfileHeader>
                </ScrollView>
            </RootView>
        );
    }
}

export default connect(
    mapStateToProps,
)(ProfileScreen);

const RootView = styled.View`
    background: ${colors.white};
    flex: 1;
    overflow: hidden;
`;

const AvatarWrapper = styled.View`
    border: 0px solid #FFF;
    width: 66px;
    border-radius: 33px;
`;

const ProfileHeader = styled.ImageBackground`
    padding-left: 15px;
    padding-top: 40px;
    padding-bottom: 20px;
`;

const NameText = styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-top: 10px;
`;

const LocationText = styled.Text`
    font-size: 15px;
    font-weight: 500;
    color: #333;
`;

const EditProfileLink = styled.Text`
    font-size: 15px;
    font-weight: 500;
    color: #935DFF;
`;
