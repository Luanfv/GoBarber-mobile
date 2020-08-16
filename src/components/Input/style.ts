import styled, { css } from 'styled-components/native';

interface ContainerProps {
    isFocus: boolean;
    isError: boolean;
}

export const Container = styled.View<ContainerProps>`
    width: 100%;
    height: 50px;
    padding: 0 16px;
    background: #232129;
    border-radius: 10px;
    margin-bottom: 8px;
    border-width: 2px;
    border-color: #232119;

    flex-direction: row;
    align-items: center;

    ${props => props.isError && css`
        border-color: #c53030;
    `}

    ${props => props.isFocus && css`
        border-color: #ff9000;
    `}
`;

export const TextInput = styled.TextInput`
    flex: 1;
    color: #fff;
    font-size: 16px;
    font-family: 'RobotoSlab-Regular';
    padding-left: 16px;
`;