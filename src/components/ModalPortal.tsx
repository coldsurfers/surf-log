import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const ModalPortal: FC = ({ children }) => {
    const el = useRef<HTMLDivElement | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        el.current = document.querySelector('#modal-root')
        setMounted(true)
    }, [])
    return mounted && el.current ? createPortal(children, el.current) : null
}

export default ModalPortal
