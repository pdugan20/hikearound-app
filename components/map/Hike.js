import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MapView from 'react-native-maps';
import { colors, borderRadius } from '@constants/Index';
import { defaultProps } from '@constants/states/HikeMap';
import { withTheme } from '@utils/Themes';
import HikeMarker from '@components/marker/Hike';

const propTypes = {
    coordinates: PropTypes.array,
    region: PropTypes.object,
    maxZoom: PropTypes.number,
    fullHeight: PropTypes.bool,
    mapHeight: PropTypes.number,
    startingCoordinates: PropTypes.object,
    mapPadding: PropTypes.object,
    mapType: PropTypes.string,
    showUserLocation: PropTypes.bool,
    mapRef: PropTypes.object,
    mapBorderRadius: PropTypes.number,
};

class HikeMap extends React.Component {
    constructor(props) {
        super(props);
        const { maxZoom, fullHeight } = this.props;

        this.state = {
            maxZoom,
            fullHeight,
            position: {},
        };
    }

    onMapReady = () => {};

    mapPress = (e) => {
        const { position } = e.nativeEvent;
        this.setState({ position });
    };

    render() {
        const {
            coordinates,
            mapBorderRadius,
            startingCoordinates,
            region,
            mapHeight,
            theme,
            mapPadding,
            mapType,
            showUserLocation,
            mapRef,
        } = this.props;
        const { maxZoom, fullHeight, position } = this.state;

        if (region) {
            return (
                <>
                    <MapView
                        ref={mapRef}
                        provider={null}
                        style={{
                            height: fullHeight ? '100%' : mapHeight,
                            zIndex: 1,
                            overflow: 'hidden',
                            borderRadius: mapBorderRadius,
                        }}
                        showsUserLocation={showUserLocation}
                        initialRegion={region}
                        showsMyLocationButton={false}
                        showsPointsOfInterest={false}
                        showsCompass={false}
                        maxZoomLevel={maxZoom}
                        onMapReady={this.onMapReady}
                        loadingIndicatorColor={theme.colors.loadingSpinner}
                        loadingBackgroundColor={theme.colors.mapViewBackground}
                        onPress={this.mapPress}
                        mapPadding={mapPadding}
                        mapType={mapType}
                        showsScale
                    >
                        {startingCoordinates && (
                            <HikeMarker
                                coordinate={{
                                    latitude: startingCoordinates.lat,
                                    longitude: startingCoordinates.lng,
                                }}
                                tracksViewChanges={false}
                                position={position}
                            />
                        )}
                        <MapView.Polyline
                            coordinates={coordinates}
                            strokeColor={colors.purple}
                            strokeWidth={2}
                        />
                    </MapView>
                </>
            );
        }
        return <EmptyMapView fullHeight={fullHeight} mapHeight={mapHeight} />;
    }
}

HikeMap.propTypes = propTypes;
HikeMap.defaultProps = defaultProps;

export default withTheme(HikeMap);

const EmptyMapView = styled.View`
    border-color: ${colors.grayMedium};
    border-radius: ${borderRadius.medium}px;
    height: ${(props) => (props.fullHeight ? '100%' : `${props.mapHeight}px`)};
    background-color: ${(props) => props.theme.loadingPrimary};
`;
