import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Linking } from 'expo';
import { RefreshControl } from 'react-native';
import { FeedList } from '../components/Index';
import { getFeedHikeCount, openHikeScreen } from '../utils/Hike';
import { cacheHikeImage } from '../utils/Image';
import HomeLoadingState from '../components/loading/Home';
import { getUserProfileData } from '../utils/User';
import { initializeUserData, initializeAvatar } from '../actions/User';
import toggleScreenType from '../actions/Home';
import { timings } from '../constants/Index';
import { pageFeed, sortHikes } from '../utils/Feed';
import { getHikeIdFromUrl } from '../utils/Link';
import { feedActionSheet } from '../components/action_sheets/Feed';
import HomeActions from '../components/HomeActions';
import { RootView } from '../styles/Screens';
import { getBadgeNumber, clearBadge } from '../utils/Notifications';
import { withTheme } from '../utils/Themes';
import GlobalMap from '../components/GlobalMap';

const propTypes = {
    dispatchUserData: PropTypes.func.isRequired,
    dispatchAvatar: PropTypes.func.isRequired,
    dispatchScreenType: PropTypes.func.isRequired,
    avatar: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
    return {
        avatar: state.userReducer.avatar,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchUserData: (userData) => dispatch(initializeUserData(userData)),
        dispatchAvatar: (avatarUri) => dispatch(initializeAvatar(avatarUri)),
        dispatchScreenType: (screenType) =>
            dispatch(toggleScreenType(screenType)),
    };
}

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;

        this.state = {
            feedHikeCount: 0,
            loading: false,
            firstLoad: false,
            sortDirection: 'desc',
            pageSize: 5,
            view: 'feed',
        };

        this.state.hikes = [];
        this.state.data = {};

        this.feedActionSheet = feedActionSheet.bind(this);
        navigation.setOptions({
            headerRight: () => (
                <HomeActions
                    feedAction={this.feedActionSheet}
                    toggleAction={this.toggleScreenType}
                />
            ),
        });
    }

    componentDidMount() {
        const {
            navigation,
            dispatchUserData,
            dispatchAvatar,
            avatar,
        } = this.props;

        this.checkInitialUrl(navigation);
        this.addUrlListener(navigation);
        this.setFirstLoad();
        this.getHikeFeedData();
        this.setFeedHikeCount();
        this.handleAppBadge();

        getUserProfileData(dispatchUserData, dispatchAvatar, avatar);
    }

    componentWillUnmount() {
        const { navigation } = this.props;
        this.removeUrlListener(navigation);
    }

    handleAppBadge = async () => {
        const badgeNumber = await getBadgeNumber();
        if (badgeNumber > 0) {
            clearBadge();
        }
    };

    setFirstLoad = () => {
        this.setState({ firstLoad: true });
    };

    setFeedHikeCount = async () => {
        const feedHikeCount = await getFeedHikeCount();
        this.setState({ feedHikeCount });
    };

    sortFeed = async (sortDirection) => {
        await this.setState({
            sortDirection,
            hikes: [],
            firstLoad: true,
        });
        this.onRefresh();
    };

    getHikeFeedData = async (lastKey) => {
        const hikes = {};
        const { sortDirection, pageSize } = this.state;

        const { data, cursor } = await pageFeed(
            pageSize,
            lastKey,
            sortDirection,
        );

        this.lastKnownKey = cursor;

        /* eslint-disable-next-line */
        for (const hike of data) {
            const imageUrl = await cacheHikeImage(hike);
            hike.coverPhoto = imageUrl;
            hikes[hike.key] = hike;
        }

        this.addhikes(hikes);
        this.setState({
            loading: false,
            firstLoad: false,
        });
    };

    addhikes = async (hikes) => {
        const { sortDirection } = this.state;

        this.setState((previousState) => {
            const hikeData = sortHikes(previousState, hikes, sortDirection);

            return {
                data: hikeData.data,
                hikes: hikeData.sortedHikes,
            };
        });
    };

    onRefresh = async () => {
        await this.setState({ loading: true });
        this.timeout = setTimeout(() => {
            this.getHikeFeedData();
        }, timings.medium);
    };

    onEndReached = () => {
        const { hikes, feedHikeCount } = this.state;
        if (hikes.length < feedHikeCount) {
            this.getHikeFeedData(this.lastKnownKey);
        }
    };

    checkInitialUrl = async (navigation) => {
        const url = await Linking.getInitialURL();
        if (url) {
            this.handleOpenURL(url, navigation);
        }
    };

    addUrlListener = (navigation) => {
        Linking.addEventListener('url', (event) =>
            this.handleOpenURL(event.url, navigation),
        );
    };

    removeUrlListener = (navigation) => {
        Linking.removeEventListener('url', (event) =>
            this.handleOpenURL(event.url, navigation),
        );
    };

    handleOpenURL = (url, navigation) => {
        const hid = getHikeIdFromUrl(url);
        if (hid && navigation) {
            openHikeScreen(hid, navigation);
        }
    };

    renderHomeView = () => {
        const { loading, hikes, view } = this.state;
        const { theme } = this.props;
        const scrollRef = React.createRef();

        if (view === 'map') {
            return <GlobalMap />;
        }

        return (
            <FeedList
                refreshControl={
                    <RefreshControl
                        tintColor={theme.colors.refreshControlTint}
                        refreshing={loading}
                        onRefresh={this.onRefresh}
                    />
                }
                scrollRef={scrollRef}
                onEndReached={this.onEndReached}
                hikes={hikes}
            />
        );
    };

    toggleScreenType = () => {
        const { dispatchScreenType } = this.props;
        const { view } = this.state;
        let newView = 'map';

        if (view === newView) {
            newView = 'feed';
        }

        this.setState({ view: newView });
        dispatchScreenType(newView);
    };

    render() {
        const { firstLoad } = this.state;

        return (
            <RootView>
                {firstLoad && <HomeLoadingState />}
                {!firstLoad && this.renderHomeView()}
            </RootView>
        );
    }
}

HomeScreen.propTypes = propTypes;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTheme(HomeScreen));
