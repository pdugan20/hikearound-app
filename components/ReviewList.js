import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import { withTranslation } from 'react-i18next';
import ReviewListItem from '@components/ReviewListItem';
import {
    HeaderContainer,
    HeaderText,
    EmptyContainerText,
    TopBorder,
} from '@styles/Lists';
import { spacing } from '@constants/Index';

const propTypes = {
    reviewListRef: PropTypes.object,
    showEmptyState: PropTypes.bool.isRequired,
    reviewData: PropTypes.array.isRequired,
    shouldShowHeader: PropTypes.bool,
};

const defaultProps = {
    reviewListRef: {},
    shouldShowHeader: true,
};

class ReviewList extends React.Component {
    renderListHeader = () => {
        const { t, shouldShowHeader } = this.props;

        if (shouldShowHeader) {
            return (
                <HeaderContainer>
                    <HeaderText>{t('label.heading.reviews')}</HeaderText>
                </HeaderContainer>
            );
        }

        return null;
    };

    renderEmptyList = () => {
        const { showEmptyState, t } = this.props;

        if (showEmptyState) {
            return (
                <View style={{ marginBottom: parseInt(spacing.tiny, 10) }}>
                    <TopBorder />
                    <EmptyContainerText>
                        {t('screen.hike.review.empty')}
                    </EmptyContainerText>
                </View>
            );
        }
        return null;
    };

    renderItem = ({ item }) => (
        <ReviewListItem
            id={item.id}
            rid={item.id}
            hid={item.hid}
            user={item.user}
            rating={item.rating}
            review={item.review}
            savedOn={item.savedOn}
            userLikes={item.userLikes}
        />
    );

    render() {
        const { reviewData, reviewListRef } = this.props;
        const extractKey = ({ id }) => id;

        return (
            <View ref={reviewListRef}>
                {reviewData && (
                    <FlatList
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.renderListHeader}
                        ListEmptyComponent={this.renderEmptyList}
                        data={reviewData}
                        extraData={reviewData}
                        keyExtractor={extractKey}
                        scrollEnabled={false}
                    />
                )}
            </View>
        );
    }
}

ReviewList.propTypes = propTypes;
ReviewList.defaultProps = defaultProps;

export default withTranslation()(ReviewList);
