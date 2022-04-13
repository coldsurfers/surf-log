import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { ChangeEventHandler, FC, useCallback, useEffect, useState } from 'react'
import Modal from './Modal'
import { BaseModalProps, EditorSaveModalValues } from '../../types/modal'
import ModalContent from './ModalContent'

const SaveModal = styled(ModalContent)`
    width: 500px;
    height: auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 10px 20px 20px 20px rgb(92 95 112 / 8%);
    display: flex;
    flex-direction: column;
`

interface Props extends BaseModalProps {
    onClickSave: (values: EditorSaveModalValues) => void
    defaultModalValues?: EditorSaveModalValues
}

const EditorSaveModal: FC<Props> = ({
    open,
    onClickBackground,
    onClickSave,
    defaultModalValues,
}) => {
    const [modalValues, setModalValues] = useState<{
        title: string
        excerpt: string
        thumbnail: string
        category: string
        createdAt?: string
    }>(
        defaultModalValues
            ? defaultModalValues
            : {
                  title: '',
                  excerpt: '',
                  thumbnail: '',
                  category: '',
              }
    )

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const { name, value } = e.target
            setModalValues((prevState) => ({
                ...prevState,
                [name]: value,
            }))
        },
        []
    )

    const handleClickSave = useCallback(() => {
        onClickSave(modalValues)
    }, [modalValues, onClickSave])

    useEffect(() => {
        if (!open) {
            setModalValues({
                title: '',
                excerpt: '',
                thumbnail: '',
                category: '',
            })
        }
    }, [open])

    useEffect(() => {
        if (defaultModalValues) {
            setModalValues(defaultModalValues)
        }
    }, [defaultModalValues])

    return (
        <Modal open={open} onClickBackground={onClickBackground}>
            <SaveModal
                className={css`
                    label {
                        font-weight: bold;
                    }
                    input {
                        height: 1.5rem;
                        margin-top: 0.5rem;
                    }

                    input + label {
                        margin-top: 0.8rem;
                    }

                    button {
                        margin-top: 1rem;
                        font-weight: bold;
                        background-color: #000000;
                        border: 1px solid #000000;
                        border-radius: 3px;
                        color: #ffffff;
                        cursor: pointer;
                        height: 1.95rem;

                        &:active {
                            background-color: #ffffff;
                            color: #000000;
                        }
                    }
                `}
            >
                <label>Title</label>
                <input
                    name="title"
                    value={modalValues.title}
                    onChange={handleChange}
                />
                <label>Excerpt</label>
                <input
                    name="excerpt"
                    value={modalValues.excerpt}
                    onChange={handleChange}
                />
                <label>Category</label>
                <input
                    name="category"
                    value={modalValues.category}
                    onChange={handleChange}
                />
                <label>Thumbnail</label>
                <input
                    name="thumbnail"
                    value={modalValues.thumbnail}
                    onChange={handleChange}
                />
                <button onClick={handleClickSave}>save</button>
            </SaveModal>
        </Modal>
    )
}

export default EditorSaveModal
