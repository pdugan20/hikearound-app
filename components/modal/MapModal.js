import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from 'react-native';
import { connect } from 'react-redux';
import ModalDismiss from './header/Dismiss';
import ModalBase from './ModalBase';
import HikeMap from '../map/Hike';
import GraphSheet from '../bottom_sheet/Graph';

function mapStateToProps(state) {
    return {
        action: state.modalReducer.action,
    };
}

const propTypes = {
    maxZoom: PropTypes.number,
    modifier: PropTypes.number,
    startingCoordinates: PropTypes.object,
    elevationArray: PropTypes.array,
};

const defaultProps = {
    maxZoom: 16,
    modifier: 0.01,
    startingCoordinates: null,
    elevationArray: [],
};

class MapModal extends ModalBase {
    constructor(props, context) {
        super(props, context);

        this.bottomSheetRef = React.createRef();

        this.state = {
            modalVisible: true,
        };
    }

    setRegion = (region) => {
        const { modifier } = this.props;

        return {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta + modifier,
            longitudeDelta: region.longitudeDelta + modifier,
        };
    };

    render() {
        const { modalVisible } = this.state;
        const {
            animationType,
            mapRef,
            coordinates,
            region,
            maxZoom,
            startingCoordinates,
            hid,
            selectedHike,
            elevationArray,
        } = this.props;

        const initialRegion = this.setRegion(region);

        if (hid === selectedHike) {
            return (
                <Modal
                    animationType={animationType}
                    transparent={false}
                    visible={modalVisible}
                >
                    <ModalRoot>
                        <HikeMap
                            fullHeight
                            mapRef={mapRef}
                            coordinates={coordinates}
                            startingCoordinates={startingCoordinates}
                            region={initialRegion}
                            maxZoom={maxZoom}
                        />
                        <ModalDismiss includeBackground />
                    </ModalRoot>
                    <GraphSheet
                        sheetRef={this.bottomSheetRef}
                        elevationArray={elevationArray}
                    />
                </Modal>
            );
        }

        return null;
    }
}

MapModal.propTypes = propTypes;
MapModal.defaultProps = defaultProps;

export default connect(mapStateToProps)(MapModal);

const ModalRoot = styled.View`
    display: flex;
    height: 100%;
`;
