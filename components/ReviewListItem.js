import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReadMore from 'react-native-read-more-text';
import { showModal, setReviewData, setFlaggedReview } from '@actions/Modal';
import { deleteReviewData } from '@actions/Review';
import Avatar from '@components/Avatar';
import Stars from '@components/Stars';
import LikeButton from '@components/LikeButton';
import OverflowButton from '@components/review/Overflow';
import { shouldCapitalizeTimestamp } from '@utils/Localization';
import { withTheme } from '@utils/Themes';
import {
    ReviewItem,
    Header,
    Info,
    Name,
    Timestamp,
    Body,
    StarWrapper,
    Review,
    TextWrapper,
} from '@styles/Review';
import { ActionText } from '@styles/Text';
import { reviewActionSheet } from '@components/action_sheets/Review';
import { parseText } from '@utils/Text';
import { getLocalizedMoment } from '@utils/Time';
import { timestamps } from '@constants/Index';

const propTypes = {
    dispatchModalFlag: PropTypes.func.isRequired,
    dispatchReviewData: PropTypes.func.isRequired,
    dispatchDeleteReview: PropTypes.func.isRequired,
    dispatchFlaggedReview: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    rating: PropTypes.number.isRequired,
    rid: PropTypes.string.isRequired,
    hid: PropTypes.string.isRequired,
    review: PropTypes.string.isRequired,
    savedOn: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
    numberOfLines: PropTypes.number,
    userLikes: PropTypes.array.isRequired,
    truncationLimit: PropTypes.number,
    showOverflow: PropTypes.bool,
    includeMinHeight: PropTypes.bool,
    shouldShowBorder: PropTypes.bool,
};

const defaultProps = {
    numberOfLines: 5,
    truncationLimit: 300,
    showOverflow: true,
    includeMinHeight: false,
    shouldShowBorder: true,
};

function mapStateToProps(state) {
    return {
        reviewData: state.reviewReducer.reviewData,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchDeleteReview: (reviewData) =>
            dispatch(deleteReviewData(reviewData)),
        dispatchFlaggedReview: (reviewData) =>
            dispatch(setFlaggedReview(reviewData)),
        dispatchModalFlag: (modalType) => dispatch(showModal(modalType)),
        dispatchReviewData: (reviewData) => dispatch(setReviewData(reviewData)),
    };
}

class ReviewListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timestamp: null,
            review: undefined,
        };

        this.bindActionSheet();
    }

    componentDidMount() {
        this.updateReview();
        this.setTimestamp();
    }

    componentDidUpdate(prevProps) {
        const { review } = this.props;

        if (prevProps.review !== review) {
            this.updateReview();
            this.bindActionSheet();
        }
    }

    bindActionSheet = () => {
        const {
            t,
            rid,
            user,
            review,
            rating,
            dispatchModalFlag,
            dispatchReviewData,
            dispatchFlaggedReview,
        } = this.props;

        const data = { user, review, rating, rid };

        this.reviewActionSheet = reviewActionSheet.bind(
            this,
            t,
            data,
            dispatchModalFlag,
            dispatchReviewData,
            dispatchFlaggedReview,
        );
    };

    deleteReview = () => {
        const { dispatchDeleteReview, rid, hid } = this.props;
        dispatchDeleteReview({ rid, hid });
    };

    buildDate = (date) => {
        if (date.toDate) {
            date = date.toDate();
        }

        return new Date(date);
    };

    setTimestamp = () => {
        const { savedOn } = this.props;

        const moment = getLocalizedMoment();
        const date = this.buildDate(savedOn);

        this.setState({
            timestamp: moment(date).format(timestamps.standard),
        });
    };

    renderHeader = () => {
        const { user } = this.props;
        const { timestamp } = this.state;

        const capitalizeTimestamp = shouldCapitalizeTimestamp();

        return (
            <Header>
                <Avatar avatar={user.photoURL} size={40} />
                <Info>
                    <Name>{user.name}</Name>
                    <Timestamp capitalize={capitalizeTimestamp}>
                        {timestamp}
                    </Timestamp>
                </Info>
            </Header>
        );
    };

    expandText = (handlePress) => {
        const { review } = this.props;

        handlePress();
        this.setState({ review });
    };

    renderTruncatedFooter = (handlePress) => {
        const { t } = this.props;
        const truncateReview = this.maybeTruncateReview();

        if (truncateReview) {
            return (
                <ActionText onPress={() => this.expandText(handlePress)}>
                    {t('label.common.read')}
                </ActionText>
            );
        }

        return null;
    };

    renderRevealedFooter = () => null;

    maybeTruncateReview = () => {
        const { truncationLimit } = this.props;
        const { review } = this.state;

        if (review && review.length >= truncationLimit) {
            return true;
        }

        return false;
    };

    updateReview() {
        const { review } = this.props;

        if (review) {
            this.setState({
                review: parseText(review),
            });
        }
    }

    renderBody = () => {
        const { rating, numberOfLines, includeMinHeight, theme } = this.props;
        const { review } = this.state;

        return (
            <Body>
                <StarWrapper>
                    <Stars
                        rating={rating}
                        starSize={16}
                        emptyColor={theme.colors.emptyStarColor}
                    />
                </StarWrapper>
                <TextWrapper includeMinHeight={includeMinHeight}>
                    <ReadMore
                        numberOfLines={numberOfLines}
                        renderTruncatedFooter={this.renderTruncatedFooter}
                        renderRevealedFooter={this.renderRevealedFooter}
                    >
                        <Review>{review}</Review>
                    </ReadMore>
                </TextWrapper>
                {this.renderActionBar()}
            </Body>
        );
    };

    renderActionBar = () => {
        const { rid, userLikes, showOverflow } = this.props;

        return (
            <>
                <LikeButton rid={rid} userLikes={userLikes} />
                {showOverflow && (
                    <OverflowButton onPress={this.reviewActionSheet} />
                )}
            </>
        );
    };

    render() {
        const { shouldShowBorder } = this.props;

        return (
            <ReviewItem shouldShowBorder={shouldShowBorder}>
                {this.renderHeader()}
                {this.renderBody()}
            </ReviewItem>
        );
    }
}

ReviewListItem.propTypes = propTypes;
ReviewListItem.defaultProps = defaultProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(withTheme(ReviewListItem)));
