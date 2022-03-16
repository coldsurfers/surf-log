import { BREAK_POINTS_METRIC, BREAK_POINTS_SIZE } from '../types/breakpoints'

const mediaQuery: Record<BREAK_POINTS_SIZE, string> = {
    [BREAK_POINTS_SIZE.SMALL]: `@media(max-width: ${BREAK_POINTS_METRIC.SMALL}px)`,
    [BREAK_POINTS_SIZE.MEDIUM]: `@media(max-width: ${BREAK_POINTS_METRIC.MEDIUM}px)`,
    [BREAK_POINTS_SIZE.LARGE]: `@media(max-width: ${BREAK_POINTS_METRIC.LARGE}px)`,
    [BREAK_POINTS_SIZE.XLARGE]: `@media(max-width: ${BREAK_POINTS_METRIC.XLARGE}px)`,
}

export default mediaQuery
