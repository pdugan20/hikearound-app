import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SectionList } from 'react-native';
import { SettingsItem } from '../components/Index';
import { colors, fontSizes, spacing, fontWeights } from '../constants/Index';

const MAP_SECTION = {
    title: 'Default Map',
    data: ['Apple Maps', 'Google Maps'],
};

const ACCOUNT_SECTION = {
    title: 'Account',
    data: ['Logout'],
};

const SETTING_ITEMS = [MAP_SECTION, ACCOUNT_SECTION];

function mapStateToProps() {
    return {};
}

class SettingsScreen extends React.Component {
    static navigationOptions = {
        headerTitle: 'Settings',
    };

    renderItem = ({ item, index }) => (
        <SettingsItem item={item} index={index} sections={SETTING_ITEMS} />
    );

    renderSectionHeader = ({ section }) => (
        <HeaderContainer>
            <HeaderText>{section.title}</HeaderText>
        </HeaderContainer>
    );

    render() {
        return (
            <RootView>
                <SectionList
                    extraData={this.state}
                    renderItem={this.renderItem}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={this.renderSectionHeader}
                    sections={SETTING_ITEMS}
                    keyExtractor={(item, index) => item + index}
                />
            </RootView>
        );
    }
}

export default connect(mapStateToProps)(SettingsScreen);

const RootView = styled.View`
    background: ${colors.white};
    flex: 1;
    overflow: hidden;
    margin-left: ${spacing.small}px;
`;

const HeaderContainer = styled.View`
    padding-bottom: 4px;
    margin-top: ${spacing.small}px;
`;

const HeaderText = styled.Text`
    color: ${colors.mediumGray};
    font-size: ${fontSizes.small}px;
    font-weight: ${fontWeights.medium};
    text-transform: uppercase;
`;
