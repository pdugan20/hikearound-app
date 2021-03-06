import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { withTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { withTheme } from '@utils/Themes';
import { getMapSearchStyle, EmptyStateText } from '@styles/Map';
import { withNavigation } from '@utils/Navigation';
import { updateMapData } from '@actions/Map';

const propTypes = {
    hideHikeSheet: PropTypes.func.isRequired,
    dispatchMapData: PropTypes.func.isRequired,
    selectedHike: PropTypes.string,
    language: PropTypes.string,
    types: PropTypes.string,
    components: PropTypes.string,
    fields: PropTypes.string,
    returnKeyType: PropTypes.string,
    clearButtonMode: PropTypes.string,
};

const defaultProps = {
    selectedHike: null,
    language: 'en',
    types: '(cities)',
    components: 'country:us',
    fields: 'formatted_address,geometry',
    returnKeyType: 'search',
    clearButtonMode: 'while-editing',
};

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchMapData: (mapData) => dispatch(updateMapData(mapData)),
    };
}

class MapSearch extends React.Component {
    constructor(props, context) {
        super(props, context);
        const { theme } = this.props;

        this.searchInputRef = React.createRef();

        this.state = {
            textInput: '',
            style: getMapSearchStyle(theme),
        };
    }

    componentDidUpdate(prevProps) {
        const { theme } = this.props;

        if (prevProps.theme !== theme) {
            this.updateMapStyle();
        }
    }

    updateMapStyle = () => {
        const { theme } = this.props;

        this.setState({
            style: getMapSearchStyle(theme),
        });
    };

    onPress = (details) => {
        const { dispatchMapData, selectedHike } = this.props;
        const selectedCity = details;

        this.setState({ textInput: '' });
        dispatchMapData({ selectedHike, selectedCity });
    };

    onFocus = () => {
        const { hideHikeSheet } = this.props;
        const { textInput } = this.state;

        if (!textInput) {
            this.setMapStyle(false, true);
        }

        if (textInput.length > 0) {
            this.onChange();
        }

        hideHikeSheet();
    };

    onChange = (change) => {
        if (change) {
            this.setState({
                textInput: change.nativeEvent.text,
            });
        }

        this.setMapStyle(true, false);
    };

    onBlur = () => {
        this.setMapStyle(false, false);
    };

    setMapStyle = (hideShadow, hideBackground) => {
        const { theme } = this.props;

        this.setState({
            style: getMapSearchStyle(theme, hideShadow, hideBackground),
        });
    };

    renderEmptyList = () => {
        const { t } = this.props;
        const { textInput } = this.state;

        if (textInput) {
            return (
                <EmptyStateText>{t('screen.map.results.empty')}</EmptyStateText>
            );
        }

        return null;
    };

    render() {
        const {
            language,
            types,
            components,
            fields,
            returnKeyType,
            clearButtonMode,
            theme,
            t,
        } = this.props;
        const { style } = this.state;

        return (
            <GooglePlacesAutocomplete
                placeholder={t('screen.map.search')}
                ref={this.searchInputRef}
                query={{
                    key: Constants.manifest.extra.googlePlaces.apiKey,
                    language,
                    types,
                    components,
                }}
                fetchDetails
                GooglePlacesDetailsQuery={{ fields }}
                textInputProps={{
                    onFocus: () => this.onFocus(),
                    onChange: (change) => this.onChange(change),
                    onBlur: () => this.onBlur(),
                    enablesReturnKeyAutomatically: false,
                    returnKeyType,
                    clearButtonMode,
                    placeholderTextColor: theme.colors.inputPlaceholderText,
                }}
                onPress={(data, details = null) => this.onPress(details)}
                styles={style}
                listUnderlayColor={theme.colors.searchBackground}
                listEmptyComponent={this.renderEmptyList}
            />
        );
    }
}

MapSearch.propTypes = propTypes;
MapSearch.defaultProps = defaultProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(withNavigation(withTheme(MapSearch))));
