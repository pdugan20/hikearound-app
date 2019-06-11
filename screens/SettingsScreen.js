import React from 'react';
import styled from 'styled-components';
import { SectionList } from 'react-native';
import { SettingsItem } from '../components/Index'
import { spacing, colors, fontSizes, fontWeights } from '../constants/Index'

const SETTING_ITEMS = [
    {
        title: 'Default Map',
        data: ['Apple', 'Google Maps']
    },
    {
        title: 'Account',
        data: ['Logout']
    },
];

class SettingsScreen extends React.Component {
    static navigationOptions = {
        headerTitle: 'Settings',
    };

    renderItem({item, index, section}) {
        return (
            <SettingsItem item={item} index={index}/>
        )
    }

    renderSectionHeader({section}) {
        return (
            <HeaderContainer>
                <HeaderText>{section.title}</HeaderText>
            </HeaderContainer>
        )
    }

    render() {
        return (
            <RootView>
                <SectionList
                    renderItem={this.renderItem}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={this.renderSectionHeader}
                    sections={SETTING_ITEMS}
                    keyExtractor={
                        (item, index) => item + index
                    }
                />
            </RootView>
        );
    }
}

export default SettingsScreen;

const RootView = styled.View`
    background: ${colors.white};
    flex: 1;
    overflow: hidden;
    margin-left: 15px;
`;

const HeaderContainer = styled.View`
    padding-bottom: 4px;
    margin-top: 15px;
`;

const HeaderText = styled.Text`
    color: #9C9C9C;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
`;