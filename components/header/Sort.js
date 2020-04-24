import React from 'react';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components';
import { colors, spacing, opacities } from '../../constants/Index';

const propTypes = {
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
};

const defaultProps = {
    name: 'md-options',
    color: colors.white,
    size: 25,
};

const Sort = ({ onPress, name, color, size }) => (
    <StyledOpacity activeOpacity={opacities.regular} onPress={onPress}>
        <Ionicons name={name} size={size} color={color} />
    </StyledOpacity>
);

Sort.propTypes = propTypes;
Sort.defaultProps = defaultProps;

export default Sort;

const StyledOpacity = styled.TouchableOpacity`
    margin-left: ${spacing.tiny}px;
`;
