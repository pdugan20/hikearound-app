import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../constants/Index';

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    fill: PropTypes.string,
};

const defaultProps = {
    width: 22,
    height: 26,
    fill: colors.grayDark,
};

const BellIcon = ({ width, height, fill }) => (
    <Svg width={width} height={height}>
        <Path
            d='M13.625 22.62c.041 1.516-1.189 2.744-2.749 2.738-1.559-.004-2.856-1.237-2.896-2.754a2.606 2.606 0 0 1 .227-1.133l5.128.015c.171.346.278.728.29 1.134zM3.008 10.282c.031-3.486 1.855-6.047 4.475-7.116-.029-.143-.061-.28-.064-.431C7.377 1.219 8.606-.005 10.165 0c1.56.004 2.856 1.238 2.898 2.753.004.143-.019.28-.039.418 2.772 1.114 4.804 3.872 5.062 7.208 0 0 .135 5.522 2.285 6.87.07.033 1.295.588 1.305 1.614.008.97-1.19 1.755-2.688 1.74L2.76 20.456c-1.497-.013-2.814-.821-2.76-1.787.054-.953 1.033-1.445 1.124-1.487 2.117-1.368 1.883-6.9 1.883-6.9z'
            fill={fill}
            fillRule='evenodd'
        />
    </Svg>
);

BellIcon.propTypes = propTypes;
BellIcon.defaultProps = defaultProps;

export default BellIcon;
