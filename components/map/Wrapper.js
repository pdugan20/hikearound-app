import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import InfoBar from '@components/InfoBar';
import HikeMap from '@components/map/Hike';
import { spacing, borderRadius, opacities } from '@constants/Index';
import { defaultProps } from '@constants/states/MapWrapper';
import { showModal, setSelectedHike } from '@actions/Modal';
import { withTheme } from '@utils/Themes';
import MapLoadingState from '@components/loading/Map';
import ExpandButton from '@components/map/button/Expand';

const propTypes = {
    dispatchModalFlag: PropTypes.func.isRequired,
    dispatchSelectedHike: PropTypes.func.isRequired,
    distance: PropTypes.number.isRequired,
    elevation: PropTypes.number,
    route: PropTypes.string,
    coordinates: PropTypes.array,
    region: PropTypes.object,
    modalType: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    hid: PropTypes.string.isRequired,
    mapPadding: PropTypes.object,
};

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchModalFlag: (modalType) => dispatch(showModal(modalType)),
        dispatchSelectedHike: (hid) => dispatch(setSelectedHike(hid)),
    };
}

class MapWrapper extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.mapRef = React.createRef();
    }

    mapPress = () => {
        const { dispatchModalFlag, dispatchSelectedHike, hid, modalType } =
            this.props;

        dispatchModalFlag(modalType);
        dispatchSelectedHike(hid);
    };

    render() {
        const {
            coordinates,
            region,
            distance,
            elevation,
            route,
            theme,
            isLoading,
            mapPadding,
        } = this.props;

        return (
            <MapViewWrapper isDark={theme.dark}>
                <InnerMapViewWrapper>
                    {isLoading && <MapLoadingState />}
                    {!isLoading && (
                        <>
                            <HikeMap
                                mapRef={this.mapRef}
                                coordinates={coordinates}
                                region={region}
                                cacheEnabled
                                mapPadding={mapPadding}
                                showUserLocation={false}
                            />
                            <ExpandButton />
                        </>
                    )}
                    <InfoBar
                        distance={distance}
                        elevation={elevation}
                        route={route}
                    />
                    <TouchableOpacity
                        activeOpacity={opacities.regular}
                        onPress={this.mapPress}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                    >
                        <MapOverlay />
                    </TouchableOpacity>
                </InnerMapViewWrapper>
                <BlockView />
            </MapViewWrapper>
        );
    }
}

MapWrapper.propTypes = propTypes;
MapWrapper.defaultProps = defaultProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTheme(MapWrapper));

const MapViewWrapper = styled.View`
    flex: 1;
    height: ${(props) => (props.isDark ? '250px' : '265px')};
    background-color: ${(props) => props.theme.mapBackground};
    padding: 0 ${spacing.small}px ${spacing.micro}px ${spacing.small}px;
`;

const InnerMapViewWrapper = styled.View`
    position: relative;
    background-color: '${(props) => props.theme.card}';
    border-radius: ${borderRadius.medium}px;
    box-shadow: ${(props) =>
        props.theme.cardShadow
            ? `0 4px 12px ${props.theme.cardShadow}`
            : '0 0'};
    z-index: 1;
`;

const BlockView = styled.View`
    flex: 1;
    height: 165px;
    background-color: ${(props) => props.theme.mapViewBackground};
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
`;

const MapOverlay = styled.View`
    opacity: 0;
`;
