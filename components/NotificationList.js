import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { withTranslation } from 'react-i18next';
import ReviewLikeNotification from './notifications/types/Review';
import DigestNotification from './notifications/types/Digest';
import { timestamps } from '../constants/Index';
import { shouldCapitalizeTimestamp } from '../utils/Localization';
import { getLocalizedMoment, formatDate } from '../utils/Time';

const propTypes = {
    notificationData: PropTypes.array.isRequired,
    refreshControl: PropTypes.object.isRequired,
};

const defaultProps = {};

class NotificationList extends React.Component {
    formatTimestamp = (createdOn) => {
        const moment = getLocalizedMoment();
        return moment(formatDate(createdOn)).format(timestamps.notification);
    };

    renderItem = ({ item }) => {
        const createdOn = this.formatTimestamp(item.createdOn);
        const capitalizeTimestamp = shouldCapitalizeTimestamp();

        if (item.type === 'reviewLike') {
            return (
                <ReviewLikeNotification
                    id={item.id}
                    nid={item.id}
                    sender={item.sender}
                    hike={item.hike}
                    hid={item.hid}
                    rid={item.extraData.rid}
                    createdOn={createdOn}
                    capitalizeTimestamp={capitalizeTimestamp}
                />
            );
        }

        if (item.type === 'digest') {
            return (
                <DigestNotification
                    id={item.id}
                    nid={item.id}
                    hike={item.hike}
                    hid={item.hid}
                    createdOn={createdOn}
                    capitalizeTimestamp={capitalizeTimestamp}
                />
            );
        }

        return null;
    };

    render() {
        const { notificationData, refreshControl } = this.props;
        const extractKey = ({ id }) => id;

        return (
            <>
                {notificationData && (
                    <FlatList
                        renderItem={this.renderItem}
                        refreshControl={refreshControl}
                        data={notificationData}
                        extraData={notificationData}
                        keyExtractor={extractKey}
                        scrollEnabled
                    />
                )}
            </>
        );
    }
}

NotificationList.propTypes = propTypes;
NotificationList.defaultProps = defaultProps;

export default withTranslation()(NotificationList);
