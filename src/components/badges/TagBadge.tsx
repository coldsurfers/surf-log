import { themeVariables } from '@coldsurfers/ocean-road'
import styled from '@emotion/styled'

const TagBadge = styled.div`
    background-color: ${themeVariables['color-background-2']};
    width: auto;
    height: 1.9rem;
    line-height: 1.9rem;
    color: ${themeVariables['color-foreground-2']};
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    border-radius: 8px;
    cursor: pointer;

    margin-right: 1rem;
    margin-bottom: 1rem;
`

export default TagBadge
