import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Toggle } from './Toggle';
import userEvent from '@testing-library/user-event';

type NodeMeasurement = Partial<
  Pick<HTMLElement, 'offsetWidth' | 'scrollWidth' | 'offsetHeight' | 'scrollHeight'>
>;

const setMockRefElement = (node: NodeMeasurement): void => {
  const mockRef = {
    get current() {
      return node;
    },
    set current(_value) {
      // noop
    },
  };

  jest.spyOn(React, 'useRef').mockReturnValue(mockRef);
};

test('should render correctly', () => {
  render(<Toggle items={[{ text: 'item1' }, { text: 'item2', testid: 'item2' }]} />);

  expect(screen.getByText('item1')).toBeInTheDocument();
  expect(screen.getByText('item2')).toBeInTheDocument();

  expect(screen.getByTestId('toggle-track')).toHaveStyle('transform: translateX(-0px)');
});

test('should switch active element when clicking on toggle', () => {
  setMockRefElement({ offsetWidth: 100, scrollWidth: 200 });
  render(
    <div data-testid="wrapper">
      <Toggle items={[{ text: 'item1', testid: 'item1' }, { text: 'item2' }]} />
    </div>,
  );
  expect(screen.getByTestId('toggle-track')).toHaveStyle('transform: translateX(-0px)');

  userEvent.click(screen.getByTestId('item1'));

  expect(screen.getByTestId('toggle-track')).toHaveStyle('transform: translateX(-100px)');
});

test('should return to first element when the last one is active', () => {
  setMockRefElement({ offsetWidth: 100, scrollWidth: 200 });
  render(
    <div data-testid="wrapper">
      <Toggle
        items={[
          { text: 'item1', testid: 'item1' },
          { text: 'item2', testid: 'item2' },
        ]}
      />
    </div>,
  );
  expect(screen.getByTestId('toggle-track')).toHaveStyle('transform: translateX(-0px)');

  userEvent.click(screen.getByTestId('item1'));

  expect(screen.getByTestId('toggle-track')).toHaveStyle('transform: translateX(-100px)');

  userEvent.click(screen.getByTestId('item2'));

  expect(screen.getByTestId('toggle-track')).toHaveStyle('transform: translateX(-0px)');
});

test('should execute callback when clicking on toggle item', () => {
  const onClick = jest.fn();

  render(
    <div data-testid="wrapper">
      <Toggle items={[{ text: 'item1', testid: 'item1', onClick }, { text: 'item2' }]} />
    </div>,
  );
  userEvent.click(screen.getByTestId('item1'));

  expect(onClick).toHaveBeenCalledTimes(1);
});

test('should handle switch transition vertical', () => {
  setMockRefElement({ offsetHeight: 100, scrollHeight: 200 });
  render(
    <div data-testid="wrapper">
      <Toggle
        transition="vertical"
        items={[
          { text: 'item1', testid: 'item1' },
          { text: 'item2', testid: 'item2' },
        ]}
      />
    </div>,
  );

  expect(screen.getByTestId('toggle-track')).toHaveStyle('transform: translateY(-0px)');

  userEvent.click(screen.getByTestId('item1'));

  expect(screen.getByTestId('toggle-track')).toHaveStyle('transform: translateY(-100px)');
});

test('should handle switch transition cross-fade', () => {
  render(
    <div data-testid="wrapper">
      <Toggle
        transition="cross-fade"
        items={[
          { text: 'item1', testid: 'item1' },
          { text: 'item2', testid: 'item2' },
        ]}
      />
    </div>,
  );

  expect(screen.getByTestId('item1')).toHaveStyle('position: absolute');
  expect(screen.getByTestId('item1')).toHaveStyle('opacity: 1');

  expect(screen.getByTestId('item2')).toHaveStyle('position: absolute');
  expect(screen.getByTestId('item2')).toHaveStyle('opacity: 0');

  userEvent.click(screen.getByTestId('item1'));

  expect(screen.getByTestId('item1')).toHaveStyle('opacity: 0');
  expect(screen.getByTestId('item2')).toHaveStyle('opacity: 1');
});

test('should return 0 when ref element is null', () => {
  render(
    <div data-testid="wrapper">
      <Toggle
        transition="vertical"
        items={[
          { text: 'item1', testid: 'item1' },
          { text: 'item2', testid: 'item2' },
        ]}
      />
    </div>,
  );

  expect(screen.getByTestId('toggle-track')).toHaveStyle('transform: translateY(-0px)');
});
