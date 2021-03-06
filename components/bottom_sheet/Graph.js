import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BottomSheet from 'reanimated-bottom-sheet';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from '@utils/Themes';
import {
    SheetPadding,
    Header,
    HeaderItem,
    HeaderLabel,
    HeaderSubtext,
} from '@styles/Sheets';
import { bottomSheet } from '@constants/Index';
import { withNavigation } from '@utils/Navigation';
import SheetHeader from '@components/bottom_sheet/Header';
import { formatYLabel, formatXLabel, chartConfig } from '@utils/Graph';

const propTypes = {
    sheetRef: PropTypes.object.isRequired,
    elevationArray: PropTypes.array.isRequired,
    hike: PropTypes.object.isRequired,
    axisIncrement: PropTypes.number,
    marginOffset: PropTypes.number,
    height: PropTypes.number,
    strokeWidth: PropTypes.number,
    mapRef: PropTypes.object,
};

const defaultProps = {
    axisIncrement: 4,
    marginOffset: 10,
    height: 200,
    strokeWidth: 2,
    mapRef: {},
};

const { width } = Dimensions.get('window');

function GraphSheet({
    sheetRef,
    mapRef,
    elevationArray,
    hike,
    axisIncrement,
    marginOffset,
    height,
    strokeWidth,
    t,
    theme,
}) {
    const { distance, elevation } = hike;

    const buildDistanceArray = () => {
        let currentIncrement = 0;

        const distanceArray = [];
        const increment = distance / axisIncrement;

        for (let i = 0; i < axisIncrement; i += 1) {
            distanceArray.push(parseFloat(currentIncrement).toFixed(1));
            currentIncrement += increment;
        }

        return distanceArray;
    };

    const data = {
        labels: buildDistanceArray(),
        datasets: [
            {
                data: elevationArray,
                strokeWidth,
            },
        ],
    };

    const renderContentHeaderItem = (label, subtext) => (
        <React.Fragment key={label}>
            <HeaderItem>
                <HeaderLabel>{label}</HeaderLabel>
                <HeaderSubtext>{subtext}</HeaderSubtext>
            </HeaderItem>
        </React.Fragment>
    );

    const renderContentHeader = () => [
        renderContentHeaderItem(
            t('sheet.elevation.label.distance'),
            t('sheet.elevation.distance', {
                unit: t('sheet.elevation.unit.miles'),
                distance,
            }),
        ),
        renderContentHeaderItem(
            t('sheet.elevation.label.elevation'),
            t('sheet.elevation.distance', {
                unit: t('sheet.elevation.unit.feet'),
                distance: elevation.toLocaleString(),
            }),
        ),
    ];

    const renderContent = () => (
        <Body>
            <Header>{renderContentHeader()}</Header>
            <LineChart
                data={data}
                width={width + marginOffset}
                height={height}
                chartConfig={chartConfig(theme)}
                bezier
                withDots={false}
                yAxisSuffix={` ${t('sheet.elevation.unit.feet')}`}
                xAxisLabel={` ${t('sheet.elevation.unit.miles')}`}
                yAxisInterval={elevationArray.length / axisIncrement}
                formatYLabel={formatYLabel}
                formatXLabel={formatXLabel}
                segments={axisIncrement - 1}
                style={{
                    marginLeft: -marginOffset,
                }}
                withOuterLines={false}
            />
        </Body>
    );

    const renderHeader = () => (
        <SheetHeader
            mapRef={mapRef}
            sheetRef={sheetRef}
            shouldShowLocationButton
        />
    );

    return (
        <>
            <SheetPadding />
            <BottomSheet
                snapPoints={[
                    bottomSheet.chart.expanded,
                    bottomSheet.chart.expanded,
                    bottomSheet.chart.collapsed,
                ]}
                renderContent={renderContent}
                renderHeader={renderHeader}
                enabledInnerScrolling={false}
                ref={sheetRef}
            />
        </>
    );
}

GraphSheet.propTypes = propTypes;
GraphSheet.defaultProps = defaultProps;

export default withTranslation()(withNavigation(withTheme(GraphSheet)));

const Body = styled.View`
    height: 300px;
    background-color: ${(props) => props.theme.sheetBackground};
`;
