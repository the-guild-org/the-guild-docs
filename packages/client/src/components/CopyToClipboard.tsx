import React, { memo, useState } from 'react';
import { MdContentCopy } from 'react-icons/md/index.js';
import { TiTickOutline } from 'react-icons/ti/index.js';
import useCopyToClipboardImport from 'react-use/lib/useCopyToClipboard.js';

import { IconButton, useToast, IconButtonProps } from '@chakra-ui/react';

import { getDefault } from '../utils';

const useCopyToClipboard = getDefault(useCopyToClipboardImport);

export const CopyToClipboard = memo(function CopyToClipboard({
  value,
  buttonProps,
}: {
  value: string;
  buttonProps?: IconButtonProps;
}) {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState<string | undefined>();
  const toast = useToast();

  return (
    <IconButton
      aria-label="Copy to clipboard"
      position="absolute"
      top="0"
      right="0"
      icon={copied ? <TiTickOutline /> : <MdContentCopy />}
      title="Copy to clipboard"
      onClick={() => {
        copy(value);

        setCopied(value);
        toast({
          status: 'info',
          title: `Copied to clipboard!`,
          position: 'bottom',
          duration: 1000,
        });

        setTimeout(() => {
          setCopied(undefined);
        }, 1000);
      }}
      {...buttonProps}
    />
  );
});
