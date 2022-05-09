import React, { useEffect, useMemo, useState } from 'react';
import createZustandImport from 'zustand';
import { persist } from 'zustand/middleware';

import {
  Code,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TabsProps,
  useColorModeValue,
  TabPanelsProps,
  TabPanelProps,
  TabListProps,
} from '@chakra-ui/react';

import CopyToClipboard from './copy-to-clipboard';
import { getDefault } from '../utils';

enum PackageManagerType {
  yarn,
  pnpm,
  npm,
}

const createZustand = getDefault(createZustandImport);

const useCurrentInstaller = createZustand(
  persist(
    set => {
      return {
        current: PackageManagerType.yarn,
        setPNPM: () =>
          set({
            current: PackageManagerType.pnpm,
          }),
        setYarn: () =>
          set({
            current: PackageManagerType.yarn,
          }),
        setNPM: () =>
          set({
            current: PackageManagerType.npm,
          }),
      };
    },
    {
      name: 'PackageManager',
    }
  )
);

function AddPackagesContent(
  type: PackageManagerType,
  packages: string | string[],
  {
    isGlobal,
  }: {
    isGlobal: boolean;
  }
) {
  const packagesLines = Array.isArray(packages) ? packages : [packages];
  switch (type) {
    case PackageManagerType.pnpm:
      return packagesLines.map(names => `pnpm add${isGlobal ? ' --global' : ''} ${names}`).join('\n');
    case PackageManagerType.yarn:
      return packagesLines.map(names => `yarn${isGlobal ? ' global' : ''} add ${names}`).join('\n');
    case PackageManagerType.npm:
      return packagesLines.map(names => `npm install${isGlobal ? ' --global' : ''} ${names}`).join('\n');
    default:
      return '';
  }
}

function RunPackagesContent(type: PackageManagerType, packages: string | string[]) {
  const packagesLines = Array.isArray(packages) ? packages : [packages];
  switch (type) {
    case PackageManagerType.pnpm:
      return packagesLines.map(names => `pnpm ${names}`).join('\n');
    case PackageManagerType.yarn:
      return packagesLines.map(names => `yarn ${names}`).join('\n');
    case PackageManagerType.npm:
      return packagesLines.map(names => `npm run ${names}`).join('\n');
    default:
      return '';
  }
}

export interface PackageInstallProps extends Omit<TabsProps, 'children'> {
  packages: string | string[];
  global?: boolean;
  tabPanelsProps?: TabPanelsProps;
  singleTabPanelProps?: TabPanelProps;
  tabListProps?: TabListProps;
}

export function PackageInstall({
  packages,
  global: isGlobal = false,
  tabPanelsProps,
  singleTabPanelProps,
  tabListProps,
  ...props
}: PackageInstallProps) {
  const { current, setNPM, setPNPM, setYarn } = useCurrentInstaller();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(current);
  }, [current]);

  const currentContent = useMemo(() => {
    return AddPackagesContent(current, packages, { isGlobal });
  }, [current, packages, isGlobal]);

  const panelBgColor = useColorModeValue('gray.100', undefined);

  return (
    <Tabs
      width="100%"
      position="relative"
      shadow="md"
      borderWidth="1px"
      borderRadius="5px"
      index={index}
      marginY="1em"
      onChange={index => {
        switch (index) {
          case PackageManagerType.yarn:
            return setYarn();
          case PackageManagerType.pnpm:
            return setPNPM();
          case PackageManagerType.npm:
            return setNPM();
        }
      }}
      whiteSpace="pre-wrap"
      {...props}
    >
      <TabList {...tabListProps}>
        <Tab>yarn</Tab>
        <Tab>pnpm</Tab>
        <Tab>npm</Tab>
      </TabList>
      <TabPanels
        sx={{
          '> div': {
            padding: '0.7em',
          },
          code: {
            margin: '0px !important',
          },
        }}
        {...tabPanelsProps}
      >
        <TabPanel backgroundColor={panelBgColor} {...singleTabPanelProps}>
          <Code>{AddPackagesContent(PackageManagerType.yarn, packages, { isGlobal })}</Code>
        </TabPanel>
        <TabPanel backgroundColor={panelBgColor} {...singleTabPanelProps}>
          <Code>{AddPackagesContent(PackageManagerType.pnpm, packages, { isGlobal })}</Code>
        </TabPanel>
        <TabPanel backgroundColor={panelBgColor} {...singleTabPanelProps}>
          <Code>{AddPackagesContent(PackageManagerType.npm, packages, { isGlobal })}</Code>
        </TabPanel>
      </TabPanels>
      <CopyToClipboard value={currentContent} />
    </Tabs>
  );
}

export interface PackageRunProps extends Omit<TabsProps, 'children'> {
  scripts: string | string[];
}

export function PackageRun({ scripts, ...props }: PackageRunProps) {
  const { current, setNPM, setPNPM, setYarn } = useCurrentInstaller();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(current);
  }, [current]);

  const currentContent = useMemo(() => {
    return RunPackagesContent(current, scripts);
  }, [current, scripts]);

  const panelBgColor = useColorModeValue('gray.100', undefined);

  return (
    <Tabs
      width="100%"
      position="relative"
      shadow="md"
      borderWidth="1px"
      borderRadius="5px"
      index={index}
      marginY="1em"
      onChange={index => {
        switch (index) {
          case PackageManagerType.yarn:
            return setYarn();
          case PackageManagerType.pnpm:
            return setPNPM();
          case PackageManagerType.npm:
            return setNPM();
        }
      }}
      whiteSpace="pre-wrap"
      {...props}
    >
      <TabList>
        <Tab>yarn</Tab>
        <Tab>pnpm</Tab>
        <Tab>npm</Tab>
      </TabList>
      <TabPanels>
        <TabPanel backgroundColor={panelBgColor}>
          <Code>{RunPackagesContent(PackageManagerType.yarn, scripts)}</Code>
        </TabPanel>
        <TabPanel backgroundColor={panelBgColor}>
          <Code>{RunPackagesContent(PackageManagerType.pnpm, scripts)}</Code>
        </TabPanel>
        <TabPanel backgroundColor={panelBgColor}>
          <Code>{RunPackagesContent(PackageManagerType.npm, scripts)}</Code>
        </TabPanel>
      </TabPanels>
      <CopyToClipboard value={currentContent} />
    </Tabs>
  );
}
