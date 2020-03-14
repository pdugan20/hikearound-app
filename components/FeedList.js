import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
// TODO https://reactnavigation.org/docs/use-scroll-to-top
import FeedItem from './FeedItem';
import FeedFooter from './FeedFooter';

const propTypes = {
    onEndReached: PropTypes.func.isRequired,
    refreshControl: PropTypes.object.isRequired,
    hikes: PropTypes.array.isRequired,
    feedRef: PropTypes.object.isRequired,
};

class FeedList extends React.Component {
    renderItem = ({ item }) => (
        <FeedItem
            id={item.id}
            images={item.images}
            name={item.name}
            distance={item.distance}
            elevation={item.elevation}
            route={item.route}
            description={item.description}
            city={item.city}
            coverPhoto={item.coverPhoto}
        />
    );

    renderFooter = () => <FeedFooter />;

    keyExtractor = (item) => item.key;

    render() {
        const { onEndReached, refreshControl, hikes, feedRef } = this.props;

        return (
            <FlatList
                ref={feedRef}
                data={hikes}
                extraData={hikes}
                showsVerticalScrollIndicator={false}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                refreshControl={refreshControl}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.75}
                ListFooterComponent={this.renderFooter}
            />
        );
    }
}

FeedList.propTypes = propTypes;

export default FeedList;
