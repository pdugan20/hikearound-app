import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Settings, ProfileHeader, ProfileBody } from '../components/Index';
import EditProfileModal from '../components/modal/EditProfileModal';
import { buildFavoriteHikesArray } from '../utils/User';
import ProfileLoadingState from '../components/loading/Profile';
import { timings } from '../constants/Index';
import { RootView } from '../styles/Screens';
import { withTheme, SetBarStyle } from '../utils/Themes';
import Title from '../components/header/Title';

const propTypes = {
    updatedHikeData: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
    return {
        updatedHikeData: state.hikeReducer.updatedHikeData,
        name: state.userReducer.name,
    };
}

function mapDispatchToProps() {
    return {};
}

const scrollRef = React.createRef();

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        const { navigation, t } = this.props;

        this.state = {
            loading: true,
            showEmptyState: false,
            scrollEnabled: false,
            hikeData: [],
        };

        navigation.setOptions({
            headerTitle: () => (
                <Title title={t('label.nav.you')} scrollRef={scrollRef} />
            ),
            headerRight: () => <Settings navigation={navigation} />,
        });
    }

    async componentDidMount() {
        await this.getHikeData();
    }

    async componentDidUpdate(prevProps) {
        const { updatedHikeData, name } = this.props;

        if (prevProps.updatedHikeData !== updatedHikeData) {
            setTimeout(async () => {
                await this.getHikeData();
            }, timings.extraLong);
        }

        if (prevProps.name !== name) {
            this.maybeHideLoadingState();
        }
    }

    maybeHideLoadingState = async () => {
        const { hikeData } = this.state;
        const { name } = this.props;

        if (hikeData && name) {
            this.setState({ loading: false });
        }
    };

    maybeSetEmptyState = () => {
        const { hikeData } = this.state;

        if (hikeData.length === 0) {
            this.setState({ showEmptyState: true });
        } else {
            this.setState({ showEmptyState: false });
        }
    };

    getHikeData = async () => {
        const hikeData = await buildFavoriteHikesArray();

        if (hikeData) {
            await this.setState({ hikeData });
        }

        this.maybeHideLoadingState();
        this.maybeSetEmptyState();
    };

    render() {
        const { loading, showEmptyState, hikeData, scrollEnabled } = this.state;

        return (
            <RootView>
                <SetBarStyle barStyle='light-content' />
                {loading && <ProfileLoadingState />}
                {!loading && (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        ref={scrollRef}
                        scrollEnabled={scrollEnabled}
                        contentContainerStyle={{ flex: 1 }}
                    >
                        <ProfileHeader />
                        <ProfileBody
                            hikeData={hikeData}
                            loading={loading}
                            showEmptyState={showEmptyState}
                        />
                    </ScrollView>
                )}
                <EditProfileModal />
            </RootView>
        );
    }
}

ProfileScreen.propTypes = propTypes;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(withTheme(ProfileScreen)));
