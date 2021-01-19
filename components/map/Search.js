import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { withTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { withTheme } from '../../utils/Themes';
import { getMapSearchStyle } from '../../styles/Map';
import { withNavigation } from '../../utils/Navigation';
import { updateMapData } from '../../actions/Map';

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
            city: '',
            style: getMapSearchStyle(theme),
        };
    }

    onPress = (details) => {
        const { dispatchMapData, selectedHike } = this.props;
        const selectedCity = details;

        this.setState({ city: selectedCity.formatted_address });
        dispatchMapData({ selectedHike, selectedCity });
    };

    onFocus = () => {
        const { hideHikeSheet, theme } = this.props;
        const { city } = this.state;

        const style = getMapSearchStyle(theme, false, true);

        if (city.length > 0) {
            this.onChange();
        }

        this.setState({ style });
        hideHikeSheet();
    };

    onChange = (change) => {
        const { theme } = this.props;
        const style = getMapSearchStyle(theme, true, false);

        if (change) {
            const city = change.nativeEvent.text;
            this.setState({ city });
        }

        this.setState({ style });
    };

    onBlur = () => {
        const { theme } = this.props;
        const style = getMapSearchStyle(theme, false, true);

        this.setState({ style });
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
