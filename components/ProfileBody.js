import React from 'react';
import PropTypes from 'prop-types';
import HikeList from './HikeList';

const propTypes = {
    hikeData: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    maybeShowEmptyState: PropTypes.bool.isRequired,
};

class ProfileBody extends React.PureComponent {
    render() {
        const { hikeData, loading, maybeShowEmptyState, action } = this.props;

        return (
            <HikeList
                hikeData={hikeData}
                action={action}
                loading={loading}
                maybeShowEmptyState={maybeShowEmptyState}
            />
        );
    }
}

ProfileBody.propTypes = propTypes;

export default ProfileBody;
