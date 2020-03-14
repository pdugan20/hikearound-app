import React from 'react';
import { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import { SectionList } from 'react-native';
import {
    GroupItem,
    SwitchItem,
    StaticItem,
    LinkItem,
    PushItem,
    ActionItem,
} from '../components/Index';
import { settingsControls } from '../constants/Index';
import { listData } from '../constants/lists/Settings';
import { StyledRootView, HeaderContainer, HeaderText } from '../styles/Screens';
import { withTheme } from '../hooks/Themes';

function mapStateToProps() {
    return {};
}

class SettingsScreen extends React.Component {
    static navigationOptions = {
        headerTitle: 'Settings',
    };

    renderItem = ({ item, index }) => {
        const { navigation } = this.props;

        if (item.control === settingsControls.switch) {
            return <SwitchItem item={item} index={index} />;
        }
        if (item.control === settingsControls.link) {
            return <LinkItem item={item} index={index} />;
        }
        if (item.control === settingsControls.static) {
            return <StaticItem item={item} index={index} />;
        }
        if (item.control === settingsControls.push) {
            return (
                <PushItem item={item} index={index} navigation={navigation} />
            );
        }
        if (item.control === settingsControls.action) {
            return <ActionItem item={item} index={index} />;
        }
        if (item.control === settingsControls.groupSelection) {
            return <GroupItem item={item} index={index} />;
        }

        return null;
    };

    renderSectionHeader = ({ section }) => (
        <HeaderContainer>
            <HeaderText>{section.title}</HeaderText>
        </HeaderContainer>
    );

    render() {
        const { theme } = this.props;

        return (
            <ThemeProvider theme={theme.colors}>
                <StyledRootView>
                    <SectionList
                        extraData={this.state}
                        renderItem={this.renderItem}
                        stickySectionHeadersEnabled={false}
                        renderSectionHeader={this.renderSectionHeader}
                        sections={listData}
                        keyExtractor={(item, index) => item + index}
                    />
                </StyledRootView>
            </ThemeProvider>
        );
    }
}

export default connect(mapStateToProps)(withTheme(SettingsScreen));
