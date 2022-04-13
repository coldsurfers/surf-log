import styled from '@emotion/styled'
import { FC, useCallback, useState } from 'react'
import Float from '../common/Float'
import CircledButton from './CircledButton'

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const MiniCircledButton = styled(CircledButton)`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    font-size: 10px;

    & + & {
        margin-top: 10px;
    }
`

interface Props {
    menu: {
        title: string
        onClick?: () => void
    }[]
}

const MenuFloatingButton: FC<Props> = ({ children, menu }) => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false)
    const onClick = useCallback(() => {
        setMenuVisible((prev) => !prev)
    }, [])
    return (
        <Float>
            {menuVisible && (
                <MenuContainer>
                    {menu.map((item, index) => {
                        return (
                            <MiniCircledButton
                                key={`${item.title}-${index}`}
                                onClick={item.onClick}
                            >
                                {item.title}
                            </MiniCircledButton>
                        )
                    })}
                </MenuContainer>
            )}
            <CircledButton onClick={onClick} style={{ marginTop: '10px' }}>
                {menuVisible ? 'Close' : children}
            </CircledButton>
        </Float>
    )
}

export default MenuFloatingButton
