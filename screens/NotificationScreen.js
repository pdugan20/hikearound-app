import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
    registerForPushNotifications,
    getUserNotifications,
} from '../utils/Notifications';
import NotificationEmptyState from '../components/empty/NotificationEmptyState';
import { RootView } from '../styles/Screens';
import { withTheme, SetBarStyle } from '../utils/Themes';
import { updateNotifBadgeCount } from '../actions/User';
import NotificationList from '../components/NotificationList';
import { timings, spacing } from '../constants/Index';
import FeedRefreshControl from '../components/FeedRefreshControl';
import { withNavigation } from '../utils/Navigation';
import LoadingOverlay from '../components/LoadingOverlay';

const propTypes = {
    notifications: PropTypes.array.isRequired,
    notifBadgeCount: PropTypes.number,
    dispatchNotifBadgeCount: PropTypes.func.isRequired,
};

const defaultProps = {
    notifBadgeCount: 0,
};

function mapStateToProps(state) {
    return {
        notifBadgeCount: state.userReducer.notifBadgeCount,
        notifications: state.notificationReducer.notifications,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchNotifBadgeCount: () => dispatch(updateNotifBadgeCount()),
    };
}

class NotificationScreen extends React.Component {
    constructor(props) {
        super(props);

        const { notifications } = this.props;
        let firstLoad = true;

        if (notifications.length > 0) {
            firstLoad = false;
        }

        this.state = {
            notifications,
            firstLoad,
            loading: false,
        };

        this.getAndSetNotifications = this.getAndSetNotifications.bind(this);
    }

    async componentDidMount() {
        const { dispatchNotifBadgeCount, navigation } = this.props;

        this.getNotificationPermissions();
        this.getAndSetNotifications();

        this.unsubscribe = navigation.addListener('focus', () => {
            dispatchNotifBadgeCount();
        });
    }

    async componentDidUpdate(prevProps) {
        const { notifBadgeCount } = this.props;

        if (prevProps.notifBadgeCount !== notifBadgeCount) {
            this.getAndSetNotifications();
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getNotificationPermissions = async () => {
        await registerForPushNotifications();
    };

    getAndSetNotifications = async () => {
        const { t } = this.props;
        const notifications = await getUserNotifications(t);

        this.setState({
            loading: false,
            firstLoad: false,
            notifications,
        });
    };

    onRefresh = async () => {
        await this.setState({ loading: true });

        this.timeout = setTimeout(() => {
            this.getAndSetNotifications();
        }, timings.medium);
    };

    renderEmptyState = () => <NotificationEmptyState />;

    renderNotificationList = () => {
        const { notifications, loading } = this.state;

        return (
            <NotificationList
                refreshControl={
                    <FeedRefreshControl
                        refreshing={loading}
                        onRefresh={this.onRefresh}
                        topOffset={parseInt(spacing.micro, 10)}
                    />
                }
                notificationData={notifications}
            />
        );
    };

    renderNotificationScreen = () => {
        const { notifications } = this.state;

        if (notifications.length === 0) {
            return this.renderEmptyState();
        }

        return this.renderNotificationList();
    };

    renderSpinner = () => (
        <LoadingOverlay loading transparentBackground defaultColors />
    );

    render() {
        const { firstLoad } = this.state;

        return (
            <RootView>
                <SetBarStyle barStyle='light-content' />
                {firstLoad && this.renderSpinner()}
                {!firstLoad && this.renderNotificationScreen()}
            </RootView>
        );
    }
}

NotificationScreen.propTypes = propTypes;
NotificationScreen.defaultProps = defaultProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(withTheme(withNavigation(NotificationScreen))));
