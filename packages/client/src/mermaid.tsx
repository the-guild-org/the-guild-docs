import React, { Children, ReactNode } from 'react';
import { onlyText } from 'react-children-utilities';
import { Mermaid as MdxMermaid } from 'mdx-mermaid/Mermaid';
import { useColorMode } from '@chakra-ui/react';

export const Mermaid = ({ children }: { children: ReactNode }): ReactNode => {
  const { colorMode } = useColorMode();
  if (Children.toArray(children).length > 1) {
    console.error('BEWARE: the mermaid content should not contain any empty line!');
  }
  return <MdxMermaid chart={onlyText(children)} config={{ theme: colorMode }} />;
};
