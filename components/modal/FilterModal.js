import React from 'react';
import PropTypes from 'prop-types';
import { Modal, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import styled from 'styled-components';
import ModalDismiss from './header/Dismiss';
import ModalReset from './header/Reset';
import ModalBase from './ModalBase';
import FilterSegmentedControl from '../FilterSegmentedControl';
import { withTheme } from '../../utils/Themes';
import { RootView } from '../../styles/Screens';
import { getSegmentedControls } from '../../utils/Filter';
import {
    PageSheetModalHeader,
    PageSheetModalTitleText,
    ModalBody,
} from '../../styles/Modals';
import { defaultState } from '../../constants/states/FilterModal';
import { Button, Text } from '../../styles/Actions';
import { opacities, spacing } from '../../constants/Index';
import { filterFeed } from '../../actions/Feed';
import { closeModal } from '../../actions/Modal';

function mapStateToProps(state) {
    return {
        action: state.modalReducer.action,
        modalCloseAction: state.modalReducer.modalCloseAction,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchFilterParams: (filterParams) =>
            dispatch(filterFeed(filterParams)),
        dispatchModalFlag: () => dispatch(closeModal()),
    };
}

const propTypes = {
    animationType: PropTypes.string,
    presentationStyle: PropTypes.string,
};

const defaultProps = {
    animationType: 'slide',
    presentationStyle: 'pageSheet',
};

class FilterModal extends ModalBase {
    constructor(props, context) {
        super(props, context);

        const { t } = this.props;
        const controls = getSegmentedControls(t, 'filter');

        this.handleSingleIndexSelect = this.handleSingleIndexSelect.bind(this);
        this.handleMultipleIndexSelect = this.handleMultipleIndexSelect.bind(
            this,
        );

        this.state = defaultState;
        this.state.controls = controls;
    }

    hideModal = () => {
        const { dispatchModalFlag } = this.props;
        dispatchModalFlag();
        this.setState({ modalVisible: false });
    };

    resetFilters = () => {
        this.setState({
            selectedIndices: {
                sort: 0,
                route: [],
                difficulty: [],
                elevation: [],
                distance: [],
            },
        });
    };

    handleSingleIndexSelect = (index, type) => {
        const { selectedIndices } = this.state;
        selectedIndices[type] = index;

        this.setState({ selectedIndices });
    };

    handleMultipleIndexSelect = (index, type) => {
        const { selectedIndices } = this.state;

        if (selectedIndices[type].includes(index)) {
            selectedIndices[type] = selectedIndices[type].filter(
                (item) => item !== index,
            );
        } else {
            selectedIndices[type].push(index);
        }

        this.setState({ selectedIndices });
    };

    renderModalHeader = (t) => (
        <PageSheetModalHeader>
            <PageSheetModalTitleText>
                {t('modal.filter.title')}
            </PageSheetModalTitleText>
            <ModalDismiss isPageSheet textDismiss dismissLanguage='cancel' />
            <ModalReset
                isPageSheet
                resetText={t('label.modal.reset')}
                resetFilters={this.resetFilters}
            />
        </PageSheetModalHeader>
    );

    renderModalBody = () => {
        const { selectedIndices, controls } = this.state;

        return (
            <ModalBody includePadding>
                {controls.map(({ title, multiple, values, type }, index) => {
                    if (multiple) {
                        return (
                            <FilterSegmentedControl
                                title={title}
                                key={index}
                                multiple={multiple}
                                values={values}
                                selectedIndices={selectedIndices[type]}
                                selectedIndex={0}
                                type={type}
                                onTabPress={this.handleMultipleIndexSelect}
                            />
                        );
                    }
                    return (
                        <FilterSegmentedControl
                            title={title}
                            key={index}
                            multiple={multiple}
                            values={values}
                            selectedIndices={[]}
                            selectedIndex={selectedIndices[type]}
                            type={type}
                            onTabPress={this.handleSingleIndexSelect}
                        />
                    );
                })}
                {this.renderFilterButton()}
            </ModalBody>
        );
    };

    applyFilters = () => {
        const { dispatchFilterParams } = this.props;
        const { selectedIndices } = this.state;

        dispatchFilterParams(selectedIndices);
        this.hideModal();
    };

    renderFilterButton = () => {
        const { t } = this.props;

        return (
            <ButtonWrapper>
                <TouchableOpacity
                    onPress={() => {
                        this.applyFilters();
                    }}
                    activeOpacity={opacities.regular}
                >
                    <Button primary>
                        <Text primary>{t('modal.filter.cta')}</Text>
                    </Button>
                </TouchableOpacity>
            </ButtonWrapper>
        );
    };

    render() {
        const { modalVisible } = this.state;
        const { animationType, transparent, presentationStyle, t } = this.props;

        return (
            <Modal
                animationType={animationType}
                transparent={transparent}
                visible={modalVisible}
                presentationStyle={presentationStyle}
            >
                <RootView>
                    {this.renderModalHeader(t)}
                    {this.renderModalBody()}
                </RootView>
            </Modal>
        );
    }
}

FilterModal.propTypes = propTypes;
FilterModal.defaultProps = defaultProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(withTheme(FilterModal)));

const ButtonWrapper = styled.View`
    position: absolute;
    bottom: 75px;
    left: ${spacing.tiny}px;
    right: ${spacing.tiny}px;
`;
