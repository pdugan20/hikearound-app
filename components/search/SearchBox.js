import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { connectSearchBox } from 'react-instantsearch-native';
import { withTheme } from '../../utils/Themes';
import SearchIcon from '../../icons/Search';
import Cancel from './Cancel';
import {
    fontSizes,
    colors,
    spacing,
    borderRadius,
} from '../../constants/Index';
import { getHeaderHeight } from '../../utils/Navigation';

const headerHeight = getHeaderHeight();

const propTypes = {
    refine: PropTypes.func.isRequired,
    currentRefinement: PropTypes.string.isRequired,
};

class SearchBox extends React.PureComponent {
    assignRef = (ref) => {
        this.searchInput = ref;
    };

    render() {
        const { refine, currentRefinement, t } = this.props;

        return (
            <ModalHeader>
                <SearchContainer>
                    <InputView>
                        <SearchIcon />
                        <SearchInput
                            autoFocus
                            onSubmitEditing={() => this.handleSubmitEditing()}
                            ref={(ref) => this.assignRef(ref)}
                            enablesReturnKeyAutomatically={false}
                            returnKeyType='search'
                            clearButtonMode='always'
                            placeholder={t('label.nav.search')}
                            onChangeText={(text) => refine(text)}
                            value={currentRefinement}
                            autoCorrect={false}
                        />
                    </InputView>
                    <Cancel />
                </SearchContainer>
            </ModalHeader>
        );
    }
}

SearchBox.propTypes = propTypes;

export default withTranslation()(withTheme(connectSearchBox(SearchBox)));

export const ModalHeader = styled.View`
    background-color: ${(props) => props.theme.headerStyle};
    border-bottom-color: ${colors.gray};
    height: ${headerHeight}px;
    width: 100%;
    position: relative;
`;

const SearchContainer = styled.View`
    display: flex;
    flex: 1;
    flex-direction: row;
`;

const InputView = styled.View`
    display: flex;
    flex: 1;
    margin-top: auto;
    margin-bottom: ${spacing.tiny}px;
    margin-left: ${spacing.tiny}px;
    margin-right: ${spacing.tiny}px;
    border-radius: ${borderRadius.medium}px;
    flex-direction: row;
    background-color: ${(props) => props.theme.searchBackground};
`;

const SearchInput = styled.TextInput.attrs((props) => ({
    placeholderTextColor: props.theme.inputPlaceholderText,
}))`
    color: ${(props) => props.theme.text};
    font-size: ${fontSizes.medium}px;
    padding: 7px ${spacing.tiny}px 7px ${spacing.micro}px;
    display: flex;
    flex: 1;
`;