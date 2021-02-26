import React from 'react';
import PropTypes from 'prop-types';
import HikeList from './HikeList';
import ProfileEmptyState from './empty/ProfileEmptyState';

const propTypes = {
    hikeData: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    showEmptyState: PropTypes.bool.isRequired,
};

class ProfileBody extends React.PureComponent {
    render() {
        const { hikeData, loading, showEmptyState } = this.props;
        const scrollRef = React.createRef();

        if (showEmptyState) {
            return <ProfileEmptyState />;
        }

        return (
            <HikeList
                scrollRef={scrollRef}
                hikeData={hikeData}
                loading={loading}
                showEmptyState={showEmptyState}
            />
        );
    }
}

ProfileBody.propTypes = propTypes;

export default ProfileBody;
