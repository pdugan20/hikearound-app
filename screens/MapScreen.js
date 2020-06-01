import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import GlobalMap from '../components/GlobalMap';
import MapSearch from '../components/MapSearch';
import HikeSheet from '../components/HikeSheet';
import { withTheme, SetBarStyle, setBarStyleWithTheme } from '../utils/Themes';
import { pageFeed } from '../utils/Feed';
import { getHikeData } from '../utils/Hike';
import { withNavigation } from '../utils/Navigation';
import { defaultState } from '../constants/states/Map';

const propTypes = {
    position: PropTypes.object.isRequired,
    selectedHike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
    selectedHike: null,
};

function mapStateToProps(state) {
    return {
        selectedHike: state.mapReducer.selectedHike,
        position: state.userReducer.currentPosition,
    };
}

function mapDispatchToProps() {
    return {};
}

class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.bottomSheetRef = React.createRef();
        this.setState = this.setState.bind(this);
        this.state = defaultState;
    }

    async componentDidMount() {
        const { theme } = this.props;

        this.getHikeData();
        setBarStyleWithTheme(theme, this.setState);
    }

    async componentDidUpdate(prevProps) {
        const { selectedHike, theme } = this.props;

        if (prevProps.selectedHike !== selectedHike && selectedHike) {
            const sheetData = await getHikeData(selectedHike);
            this.setSheetData(sheetData);
        }

        if (prevProps.theme.dark !== theme.dark) {
            setBarStyleWithTheme(theme, this.setState);
        }
    }

    setSheetData = (sheetData) => {
        this.setState({ sheetData });
    };

    getHikeData = async (lastKey) => {
        const { sortDirection, pageSize } = this.state;
        const { position } = this.props;

        const { data } = await pageFeed(
            pageSize,
            lastKey,
            position,
            sortDirection,
        );

        this.setState({ hikeData: data });
    };

    render() {
        const { position, selectedHike } = this.props;
        const { hikeData, barStyle, sheetData } = this.state;

        return (
            <View>
                <SetBarStyle barStyle={barStyle} />
                <MapSearch
                    hideHikeSheet={() => {
                        this.bottomSheetRef.current.snapTo(2);
                    }}
                />
                <GlobalMap
                    position={position}
                    hikeData={hikeData}
                    showHikeSheet={() => {
                        this.bottomSheetRef.current.snapTo(1);
                    }}
                />
                <HikeSheet
                    sheetRef={this.bottomSheetRef}
                    sheetData={sheetData}
                    selectedHike={selectedHike}
                />
            </View>
        );
    }
}

MapScreen.propTypes = propTypes;
MapScreen.defaultProps = defaultProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withNavigation(withTheme(MapScreen)));
