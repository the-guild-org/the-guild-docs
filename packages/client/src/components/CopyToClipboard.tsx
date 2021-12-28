import React, { memo, useState } from 'react';
import useCopyToClipboardImport from 'react-use/lib/useCopyToClipboard';

import { IconButton, useToast, IconButtonProps } from '@chakra-ui/react';

const ClipboardIconSolid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={30} className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path
      fillRule="evenodd"
      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ClipboardIconOutline = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={25} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

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
      icon={copied ? <ClipboardIconSolid /> : <ClipboardIconOutline />}
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
