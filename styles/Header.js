import styled from 'styled-components';
import { fontSizes, colors } from '@constants/Index';

const HeaderText = styled.Text`
    color: ${(props) => (props.isPageSheet ? colors.purple : colors.white)};
    font-size: ${fontSizes.large}px;
    opacity: ${(props) => (props.disabled ? '0.7' : '1')};
`;

export default HeaderText;
