import React from 'react';
import styled from 'styled-components';
import { FlatList } from 'react-navigation';
import HikeListItem from './HikeListItem';
import {
    colors,
    fontSizes,
    fontWeights,
    spacing,
} from '../constants/Index';

class HikeList extends React.PureComponent {
    renderListHeader = () => (
        <HeaderContainer>
            <HeaderText>Your Hikes</HeaderText>
        </HeaderContainer>
    )

    renderEmptyList = () => {
        const { maybeShowEmptyState } = this.props;
        if (maybeShowEmptyState) {
            return (
                <EmptyContainer>
                    <EmptyContainerText>
                        {'Hikes that you favorite will appear here.'}
                    </EmptyContainerText>
                </EmptyContainer>
            );
        }
        return null;
    }

    renderItem = ({ item }) => (
        <HikeListItem
            id={item.id}
            name={item.name}
            location={item.location}
            distance={item.distance}
        />
    )

    render() {
        const { hikes } = this.props;
        const extractKey = ({ id }) => id;

        return (
            <RootView>
                <FlatList
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderListHeader}
                    ListEmptyComponent={this.renderEmptyList}
                    data={hikes}
                    keyExtractor={extractKey}
                />
            </RootView>
        );
    }
}

export default HikeList;

const RootView = styled.View`
    margin-left: ${spacing.small}px;
`;

const HeaderContainer = styled.View`
    padding-bottom: ${spacing.tiny}px;
    margin-top: ${spacing.tiny}px;
`;

const HeaderText = styled.Text`
    color: ${colors.mediumGray};
    font-size: ${fontSizes.small}px;
    font-weight: ${fontWeights.medium};
    text-transform: uppercase;
`;

const EmptyContainer = styled.View`
    border-color: ${colors.lightGray};
    border-top-width: 1px;
    padding: ${spacing.small}px 0;
`;

const EmptyContainerText = styled.Text`
    color: ${colors.black};
    font-size: ${fontSizes.medium}px;
`;
