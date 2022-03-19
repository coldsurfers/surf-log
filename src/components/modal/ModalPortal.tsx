import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MODAL_ROOT_PORTAL_TAG_HTML_ID } from '../../lib/constants'

const ModalPortal: FC = ({ children }) => {
    const el = useRef<HTMLDivElement | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        el.current = document.querySelector(`#${MODAL_ROOT_PORTAL_TAG_HTML_ID}`)
        setMounted(true)
    }, [])
    return mounted && el.current ? createPortal(children, el.current) : null
}

export default ModalPortal
