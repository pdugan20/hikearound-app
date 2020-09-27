import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BottomSheet from 'reanimated-bottom-sheet';
import { withTheme } from '../../utils/Themes';
import { spacing, bottomSheet } from '../../constants/Index';
import { withNavigation } from '../../utils/Navigation';
import SheetHeader from './Header';

const propTypes = {
    sheetRef: PropTypes.object.isRequired,
    elevationArray: PropTypes.array.isRequired,
};

const defaultProps = {};

class GraphSheet extends React.Component {
    renderContent = () => {
        const { elevationArray } = this.props;
        console.log(elevationArray);
        return <Body />;
    };

    renderHeader = () => {
        return <SheetHeader />;
    };

    render() {
        const { sheetRef } = this.props;

        return (
            <BottomSheet
                snapPoints={[
                    bottomSheet.chart.expanded,
                    bottomSheet.chart.expanded,
                    bottomSheet.chart.collapsed,
                ]}
                renderContent={this.renderContent}
                renderHeader={this.renderHeader}
                enabledInnerScrolling={false}
                ref={sheetRef}
            />
        );
    }
}

GraphSheet.propTypes = propTypes;
GraphSheet.defaultProps = defaultProps;

export default withNavigation(withTheme(GraphSheet));

const Body = styled.View`
    height: 500px;
    padding: ${spacing.small}px;
    background-color: ${(props) => props.theme.sheetBackground};
`;
