import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ActivityIndicator, Keyboard } from 'react-native';
import { withTheme } from '@utils/Themes';
import { colors } from '@constants/Index';

const propTypes = {
    loading: PropTypes.bool,
    transparentBackground: PropTypes.bool,
    defaultColors: PropTypes.bool,
    scale: PropTypes.number,
    topOffset: PropTypes.number,
};

const defaultProps = {
    loading: false,
    transparentBackground: false,
    defaultColors: true,
    scale: 1.1,
    topOffset: 0,
};

class LoadingOverlay extends React.Component {
    componentDidUpdate() {
        const { loading } = this.props;

        if (loading) {
            Keyboard.dismiss();
        }
    }

    render() {
        const {
            loading,
            transparentBackground,
            scale,
            defaultColors,
            topOffset,
            theme,
        } = this.props;

        return (
            <LoadingView
                topOffset={topOffset}
                loading={loading}
                transparentBackground={transparentBackground}
            >
                <ActivityView>
                    <ActivityIndicator
                        size='small'
                        color={
                            defaultColors
                                ? theme.colors.loadingSpinner
                                : colors.white
                        }
                        style={{
                            zIndex: 1,
                            transform: [{ scaleX: scale }, { scaleY: scale }],
                        }}
                    />
                </ActivityView>
            </LoadingView>
        );
    }
}

LoadingOverlay.propTypes = propTypes;
LoadingOverlay.defaultProps = defaultProps;

export default withTheme(LoadingOverlay);

const ActivityView = styled.View`
    flex: 1;
    justify-content: center;
`;

const LoadingView = styled.View`
    z-index: 1;
    display: ${(props) => (props.loading ? 'flex' : 'none')};
    position: absolute;
    left: 0;
    top: ${(props) => props.topOffset}px;
    right: 0;
    bottom: 0;
    opacity: ${(props) => (props.transparentBackground ? 1 : 0.8)};
    background-color: ${(props) =>
        props.transparentBackground
            ? 'transparent'
            : props.theme.rootBackground};
`;
