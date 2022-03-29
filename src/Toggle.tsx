import { ComponentType, useCallback, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

export interface Item {
  icon?: JSX.Element | ComponentType;
  text?: string | JSX.Element | ComponentType;
  testid?: string;
  className?: string;
  onClick?: () => void;
}

export type ToggleItems = [Item, Item, ...Item[]];

export type Transition = 'default' | 'vertical' | 'cross-fade';

export interface ToggleProps {
  items: ToggleItems;
  className?: string;
  transition?: Transition;
}

const ToggleTrack = styled.div`
  display: flex;
  height: 100%;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
`;

const ToggleItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const StyledToggle = styled.div<{ transition: Transition }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  ${ToggleTrack} {
    flex-direction: ${({ transition }) => (transition === 'vertical' ? 'column' : 'row')};
  }

  ${ToggleItem} {
    ${({ transition }) => {
      switch (transition) {
        case 'vertical':
          return css`
            min-width: auto;
            min-height: 100%;
          `;
        case 'cross-fade':
          return css`
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            opacity: 0;
            transform: scale(0.5);
            position: absolute;
            transition: opacity 0.5s ease-in-out, transform 0.3s ease-in-out;
            pointer-events: none;
          `;
        default:
          return css`
            min-width: 100%;
            min-height: auto;
          `;
      }
    }}
  }
`;

const calculateTranslate = (activeItem: number, measurement: number, itemCount: number) => {
  const itemMeasurement = measurement / itemCount;
  return activeItem * itemMeasurement;
};

const Toggle = ({ items, transition = 'default', className }: ToggleProps) => {
  const [activeItem, setActiveItem] = useState(0);

  const toggleRef = useRef<HTMLDivElement>(null);

  const getUpdatedTranslate = useCallback(
    (currentItem: number) => {
      const element = toggleRef?.current;

      if (element) {
        const axisSize = transition === 'vertical' ? element.scrollHeight : element.scrollWidth;

        return calculateTranslate(currentItem, axisSize, items.length);
      }
      return '0';
    },
    [items, transition],
  );

  const switchActiveItem = useCallback(() => {
    setActiveItem((currentActiveItem) =>
      currentActiveItem === items.length - 1 ? 0 : currentActiveItem + 1,
    );
  }, [items]);

  const handleTransition = useCallback(() => {
    switch (transition) {
      case 'vertical':
        return {
          transform: `translateY(-${getUpdatedTranslate(activeItem)}px)`,
        };

      case 'default':
        return {
          transform: `translateX(-${getUpdatedTranslate(activeItem)}px)`,
        };
    }
  }, [activeItem, getUpdatedTranslate, transition]);

  return (
    <StyledToggle className={className} transition={transition}>
      <ToggleTrack
        style={transition !== 'cross-fade' ? handleTransition() : {}}
        data-testid="toggle-track"
        ref={toggleRef}
      >
        {items.map(({ text, icon, testid, onClick, className }, index) => (
          <ToggleItem
            className={className}
            onClick={() => {
              switchActiveItem();
              onClick?.();
            }}
            style={
              transition === 'cross-fade' && activeItem === index
                ? { opacity: 1, pointerEvents: 'all', transform: 'scale(1)' }
                : {}
            }
            data-testid={testid}
            key={index}
          >
            {text} {icon}
          </ToggleItem>
        ))}
      </ToggleTrack>
    </StyledToggle>
  );
};

export { Toggle };
