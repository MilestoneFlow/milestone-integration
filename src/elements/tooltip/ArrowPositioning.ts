import { CardProps } from '../model/VisualElementCard'

export const getArrowCSS = (props: CardProps): { borderWidth: string; positionStyles: string } => {
  const arrowColor = props.template === 'dark' ? '#32363E' : '#f5f5f5'

  switch (props.arrowPlacement) {
    case 'right':
      return {
        borderWidth: '7px 10px 7px 0',
        positionStyles: `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-color: transparent ${arrowColor} transparent transparent;
        `,
      }
    case 'left':
      return {
        borderWidth: '7px 0 7px 10px',
        positionStyles: `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-color: transparent transparent transparent ${arrowColor};
        `,
      }
    case 'bottom':
      return {
        borderWidth: '0 7px 10px 7px',
        positionStyles: `
          bottom: 100%;
          left: 50%;
          transform: translateX(-10%);
          border-color: transparent transparent ${arrowColor} transparent;
        `,
      }
    case 'top':
      return {
        borderWidth: '10px 7px 0 7px',
        positionStyles: `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-color: ${arrowColor} transparent transparent transparent;
        `,
      }
    default:
      return {
        borderWidth: '7px 0 7px 10px', // Default to right
        positionStyles: '',
      }
  }
}
