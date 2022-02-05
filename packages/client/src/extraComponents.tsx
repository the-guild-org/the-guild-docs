import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { useThemeContext } from '@theguild/components';
import { BsMoonFill, BsSun } from 'react-icons/bs/index.js';
import React from 'react';

export function ThemeSwitch({
  iconButtonProps,
}: {
  iconButtonProps?: Partial<IconButtonProps>;
} = {}) {
  const { setDarkTheme, isDarkTheme } = useThemeContext();

  if (!setDarkTheme) return null;

  return (
    <IconButton
      variant="outline"
      aria-label="Theme Switch"
      icon={isDarkTheme ? <BsMoonFill /> : <BsSun />}
      onClick={() => setDarkTheme(state => !state)}
      {...iconButtonProps}
    />
  );
}
