import { colors } from '@constants/Index';

export const formatYLabel = (value) => parseFloat(value).toFixed(0);

export const formatXLabel = (value) => {
    if (value.toString() === '0.0') {
        return 0;
    }
    return value;
};

export const chartConfig = (theme) => ({
    backgroundGradientFrom: theme.colors.sheetBackground,
    backgroundGradientTo: theme.colors.sheetBackground,
    fillShadowGradient: colors.purple,
    fillShadowGradientOpacity: 0.1,
    decimalPlaces: 2,
    propsForBackgroundLines: {
        stroke: colors.grayMedium,
        opacity: 0.5,
    },
    color: () => colors.purple,
    labelColor: () => theme.colors.text,
});
