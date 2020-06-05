import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import HomeLoadingState from '../components/loading/Home';
import HomeActions from '../components/HomeActions';
import FeedList from '../components/FeedList';
import FeedRefreshControl from '../components/FeedRefreshControl';
import HomeEmptyState from '../components/empty/HomeEmptyState';
import { feedActionSheet } from '../components/action_sheets/Feed';
import { initializeUserData, initializeAvatar } from '../actions/User';
import { initializeMapData } from '../actions/Map';
import { timings } from '../constants/Index';
import { defaultState } from '../constants/states/Home';
import { RootView } from '../styles/Screens';
import { getUserProfileData } from '../utils/User';
import { getFeedHikeCount } from '../utils/Hike';
import { handleAppBadge } from '../utils/Notifications';
import { withTheme, SetBarStyle } from '../utils/Themes';
import { getMapData } from '../utils/Map';
import { getPosition, getNearestCity } from '../utils/Location';
import { pageFeed, sortHikes, buildHikeData } from '../utils/Feed';
import {
    checkInitialUrl,
    addUrlListener,
    removeUrlListener,
} from '../utils/Link';

const propTypes = {
    dispatchUserData: PropTypes.func.isRequired,
    dispatchMapData: PropTypes.func.isRequired,
    dispatchAvatar: PropTypes.func.isRequired,
};

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchUserData: (userData) => dispatch(initializeUserData(userData)),
        dispatchMapData: (mapData) => dispatch(initializeMapData(mapData)),
        dispatchAvatar: (avatarUri) => dispatch(initializeAvatar(avatarUri)),
    };
}

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        const { navigation, t } = this.props;

        this.state = defaultState;

        this.feedActionSheet = feedActionSheet.bind(this, t);
        navigation.setOptions({
            headerRight: () => (
                <HomeActions feedAction={this.feedActionSheet} />
            ),
        });
    }

    async componentDidMount() {
        const {
            navigation,
            dispatchUserData,
            dispatchAvatar,
            dispatchMapData,
        } = this.props;

        this.setFirstLoad();
        await this.getAndSetPosition();

        this.getHikeFeedData();
        this.setFeedHikeCount();

        handleAppBadge();
        checkInitialUrl(navigation);
        addUrlListener(navigation);

        await getUserProfileData(dispatchUserData, dispatchAvatar);
        await getMapData(dispatchMapData);
    }

    componentWillUnmount() {
        const { navigation } = this.props;
        removeUrlListener(navigation);
    }

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
        const {
            sortDirection,
            distance,
            pageSize,
            lastKnownPosition,
        } = this.state;

        const { data, cursor } = await pageFeed(
            pageSize,
            lastKey,
            lastKnownPosition,
            sortDirection,
            distance,
        );

        this.lastKnownKey = cursor;

        const hikes = await buildHikeData(data);

        this.addhikes(hikes);
        this.setState({ loading: false, firstLoad: false });
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

    getAndSetPosition = async () => {
        const lastKnownPosition = await getPosition('lastKnown');
        const { coords } = lastKnownPosition;
        const city = await getNearestCity(coords, 'cityName');

        this.setState({ lastKnownPosition, city });
    };

    shouldShowEmptyState = () => {
        const { hikes } = this.state;
        return hikes.length === 0;
    };

    renderHome = () => {
        const { hikes, firstLoad, loading, city } = this.state;
        const scrollRef = React.createRef();
        const showEmptyState = this.shouldShowEmptyState();

        if (firstLoad) {
            return <HomeLoadingState />;
        }

        return (
            <>
                <SetBarStyle barStyle='light-content' />
                {showEmptyState && <HomeEmptyState city={city} />}
                {!showEmptyState && (
                    <FeedList
                        refreshControl={
                            <FeedRefreshControl
                                refreshing={loading}
                                onRefresh={this.onRefresh}
                            />
                        }
                        scrollRef={scrollRef}
                        onEndReached={this.onEndReached}
                        hikes={hikes}
                        city={city}
                    />
                )}
            </>
        );
    };

    render() {
        return <RootView>{this.renderHome()}</RootView>;
    }
}

HomeScreen.propTypes = propTypes;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(withTheme(HomeScreen)));
