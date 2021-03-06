import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Image } from 'react-native-expo-image-cache';
import { withTranslation } from 'react-i18next';
import FeedCardGradient from '@components/FeedCardGradient';
import {
    spacing,
    colors,
    transparentColors,
    borderRadius,
    fontSizes,
} from '@constants/Index';
import { withTheme } from '@utils/Themes';
import { getDistanceToHike } from '@utils/Location';
import LocationPill from '@components/feed/card/pill/Location';
import DifficultyPill from '@components/feed/card/pill/Difficulty';
import Stars from '@components/Stars';
import FavoriteButton from '@components/FavoriteButton';
import ShareButton from '@components/ShareButton';

const propTypes = {
    hid: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    elevation: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    review: PropTypes.object.isRequired,
    coordinates: PropTypes.object.isRequired,
    lastKnownPosition: PropTypes.object.isRequired,
    showShareButton: PropTypes.bool,
    showFavoriteButton: PropTypes.bool,
};

const defaultProps = {
    showShareButton: false,
    showFavoriteButton: true,
};

const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    borderRadius: borderRadius.medium,
};

class FeedCard extends React.Component {
    renderHeader = () => {
        const { city, state, difficulty, coordinates, lastKnownPosition } =
            this.props;

        const distance = getDistanceToHike(
            coordinates.starting,
            lastKnownPosition,
        );

        return (
            <Header>
                <LocationPill label={`${city}, ${state}`} distance={distance} />
                <DifficultyPill label={difficulty} />
            </Header>
        );
    };

    renderFooter = () => {
        const { name, distance, elevation, t } = this.props;

        return (
            <Footer>
                <HikeName>{name}</HikeName>
                {this.renderReview()}
                <FooterText>
                    {t('card.metadata', {
                        distance,
                        elevation: elevation.toLocaleString(),
                    })}
                </FooterText>
            </Footer>
        );
    };

    renderButtons = () => {
        const {
            name,
            distance,
            city,
            state,
            hid,
            showShareButton,
            showFavoriteButton,
        } = this.props;

        return (
            <>
                {showShareButton && <ShareButton hid={hid} />}
                {showFavoriteButton && (
                    <FavoriteButton
                        name={name}
                        hid={hid}
                        distance={distance}
                        city={city}
                        state={state}
                        placement='card'
                    />
                )}
            </>
        );
    };

    renderBackground = () => {
        const { image } = this.props;
        return <Image uri={image.uri} resizeMode='cover' style={imageStyle} />;
    };

    renderGradient = () => {
        const { image } = this.props;
        return <FeedCardGradient imageDidLoad={image.uri} />;
    };

    renderReview = () => {
        const { review, t } = this.props;

        return (
            <ReviewWrapper>
                <StarWrapper>
                    <Stars
                        rating={review.average}
                        starSize={14}
                        disabled
                        filledColor={transparentColors.white}
                        emptyColor={transparentColors.white}
                    />
                </StarWrapper>
                <ReviewText>
                    {t('card.review', { count: review.count })}
                </ReviewText>
            </ReviewWrapper>
        );
    };

    render() {
        return (
            <StyledView>
                {this.renderBackground()}
                {this.renderFooter()}
                {this.renderHeader()}
                {this.renderButtons()}
                {this.renderGradient()}
            </StyledView>
        );
    }
}

FeedCard.propTypes = propTypes;
FeedCard.defaultProps = defaultProps;

export default withTranslation()(withTheme(FeedCard));

const StyledView = styled.View`
    width: 100%;
    border-radius: ${borderRadius.medium}px;
    box-shadow: 0 4px 4px ${transparentColors.grayLight};
    height: 200px;
    border: 1px solid;
    border-color: ${(props) => props.theme.itemBorder};
`;

const Header = styled.View`
    position: absolute;
    top: ${spacing.tiny}px;
    width: 100%;
    flex-direction: row;
    left: 4px;
`;

const Footer = styled.View`
    position: absolute;
    bottom: 12px;
    left: ${spacing.tiny}px;
    z-index: 1;
    width: 80%;
`;

const StarWrapper = styled.View`
    width: 90px;
    padding: 2px 0 1px 0;
`;

const ReviewWrapper = styled.View`
    flex-direction: row;
`;

const FooterText = styled.Text`
    color: ${colors.white};
    font-size: 14px;
    margin-top: 2px;
`;

const ReviewText = styled.Text`
    color: ${colors.white};
    font-size: 14px;
    padding: 0 0 0 2px;
`;

const HikeName = styled.Text`
    color: ${colors.white};
    font-size: ${fontSizes.extraLarge}px;
    font-weight: bold;
`;
