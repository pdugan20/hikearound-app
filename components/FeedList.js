import React from 'react';
import PropTypes from 'prop-types';
import { CollapsibleHeaderFlatList } from 'react-native-collapsible-header-views';
import FeedItem from './FeedItem';
import FeedHeader from './FeedHeader';
import FeedFooter from './FeedFooter';
import { withScrollToTop } from '../utils/Navigation';
import { withTheme } from '../utils/Themes';

const propTypes = {
    onEndReached: PropTypes.func.isRequired,
    refreshControl: PropTypes.object.isRequired,
    hikes: PropTypes.array.isRequired,
    scrollRef: PropTypes.object.isRequired,
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

    render() {
        const {
            onEndReached,
            refreshControl,
            hikes,
            theme,
            scrollRef,
        } = this.props;

        return (
            <>
                <CollapsibleHeaderFlatList
                    ref={scrollRef}
                    data={hikes}
                    extraData={hikes}
                    CollapsibleHeaderComponent={<FeedHeader />}
                    headerHeight={35}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.key}
                    renderItem={this.renderItem}
                    refreshControl={refreshControl}
                    onEndReached={onEndReached}
                    ListFooterComponent={this.renderFooter}
                    headerContainerBackgroundColor={theme.colors.rootBackground}
                    disableHeaderSnap
                    bounces
                />
            </>
        );
    }
}

FeedList.propTypes = propTypes;

export default withScrollToTop(withTheme(FeedList));
