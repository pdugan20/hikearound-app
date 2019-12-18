import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ThemeContext } from 'react-navigation';
import { themes } from '../constants/Themes';
import { Settings, ProfileHeader, ProfileBody } from '../components/Index';
import EditProfileModal from '../components/modals/EditProfileModal';
import { getUserFavoriteHikes } from '../utils/User';
import ProfileLoadingState from '../components/loading/Profile';
import { initializeHikeData } from '../actions/Hike';
import { timings } from '../constants/Index';

const propTypes = {
    dispatchHikeData: PropTypes.func.isRequired,
    updatedHikeData: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        hikeData: state.hikeReducer.hikeData,
        updatedHikeData: state.hikeReducer.updatedHikeData,
        avatar: state.userReducer.avatar,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchHikeData: (hikeData) => dispatch(initializeHikeData(hikeData)),
    };
}

class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'You',
        headerBackTitle: null,
        headerRight: <Settings navigation={navigation} />,
    });

    constructor(props) {
        super(props);

        this.state = {
            firstLoad: true,
            maybeShowEmptyState: false,
            hikeData: [],
        };
    }

    async componentDidMount() {
        await this.getHikeData();

        this.loadingTimeout = setTimeout(() => {
            this.setState({
                shouldLoad: true,
            });
        }, timings.short);
    }

    async componentDidUpdate(prevProps) {
        const { updatedHikeData } = this.props;

        if (prevProps.updatedHikeData !== updatedHikeData) {
            await this.getHikeData();
        }
    }

    getHikeData = async () => {
        const hikeData = [];
        const favoritedHikes = await getUserFavoriteHikes();
        const { dispatchHikeData } = this.props;

        if (favoritedHikes) {
            this.setState({ firstLoad: false });
        }

        favoritedHikes.forEach((hike) => {
            if (hike.exists) {
                const favoriteHike = hike.data() || {};
                favoriteHike.id = hike.id;
                hikeData.push(favoriteHike);
            }
        });

        if (hikeData.length === 0) {
            this.setState({ maybeShowEmptyState: true });
        }

        if (hikeData) {
            dispatchHikeData(hikeData);
            this.setState({ hikeData });
        }
    };

    static contextType = ThemeContext;

    render() {
        const {
            firstLoad,
            maybeShowEmptyState,
            hikeData,
            shouldLoad,
        } = this.state;

        const theme = themes[this.context];

        return (
            <RootView theme={theme}>
                {firstLoad && shouldLoad && <ProfileLoadingState />}
                {!firstLoad && (
                    <>
                        <ProfileHeader />
                        <ProfileBody
                            hikeData={hikeData}
                            loading={firstLoad}
                            maybeShowEmptyState={maybeShowEmptyState}
                        />
                    </>
                )}
                <EditProfileModal
                    animationType='push'
                    modalAction='showEditProfile'
                    transparent
                    hideStatusBar={false}
                    fullScreen={false}
                />
            </RootView>
        );
    }
}

ProfileScreen.propTypes = propTypes;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProfileScreen);

const RootView = styled.View`
    background: ${(props) => props.theme.rootBackground};
    flex: 1;
    overflow: hidden;
    width: 100%;
`;
