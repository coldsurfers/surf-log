import styled from '@emotion/styled'
import { themedPalette } from '../../lib/theme'

const TagBadge = styled.div`
    background-color: ${themedPalette['tag-badge-background-color']};
    width: auto;
    height: 1.9rem;
    line-height: 1.9rem;
    color: ${themedPalette['tag-badge-text-color']};
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    border-radius: 8px;
    cursor: pointer;

    margin-right: 1rem;
    margin-bottom: 1rem;
`

export default TagBadge
