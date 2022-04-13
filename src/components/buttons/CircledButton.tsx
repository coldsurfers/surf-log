import styled from '@emotion/styled'
import { CSSProperties, FC, MouseEventHandler } from 'react'

const Button = styled.button`
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

    display: flex;
    align-items: center;
    justify-content: center;

    transition: all 0.5s linear;

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
        color: #ffffff;
    }
`

interface Props {
    onClick: MouseEventHandler<HTMLButtonElement> | undefined
    className?: string
    style?: CSSProperties
}

const CircledButton: FC<Props> = ({ children, onClick, className, style }) => {
    return (
        <Button className={className} onClick={onClick} style={style}>
            {children}
        </Button>
    )
}

export default CircledButton
