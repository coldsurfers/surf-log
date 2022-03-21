import styled from '@emotion/styled'
import { FC, MouseEventHandler } from 'react'

const Container = styled.button`
    margin-left: auto;
    border: 1px solid #ffffff;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    box-shadow: 10px 20px 20px 20px rgb(92 95 112 / 8%);
    background-color: #ffffff;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 4px;
    padding-bottom: 4px;
    cursor: pointer;

    font-size: 13px;
    font-weight: bold;

    position: fixed;
    right: 10px;
    bottom: 10px;

    transition: all 0.5s linear;

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
        color: #ffffff;
    }
`

interface Props {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

const FloatingButton: FC<Props> = ({ onClick, children }) => {
    return <Container onClick={onClick}>{children}</Container>
}

export default FloatingButton
