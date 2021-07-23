import { getPackagesData, PackageWithStats } from '@guild-docs/server/npm';
import { GetStaticProps } from 'next';
import { buildMultipleMDX, CompiledMDX } from '@guild-docs/server';
import { Stack, Box, Heading } from '@chakra-ui/react';
import { MDX, PackageInstall } from '@guild-docs/client';

interface Props {
  data: Array<
    PackageWithStats & {
      description: CompiledMDX;

      content: CompiledMDX;
    }
  >;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const packagesData = await getPackagesData({
    packageList: [
      {
        identifier: 'client',
        npmPackage: '@guild-docs/client',
        tags: [],
        title: 'Guild Docs Client',
        githubReadme: {
          repo: 'the-guild-org/the-guild-docs',
          path: '/examples/basic/docs/secondary.mdx',
        },
        devFilePath: 'docs/secondary.mdx',
      },
      {
        identifier: 'envelop',
        npmPackage: '@envelop/core',
        tags: [],
        title: 'Envelop',
      },
    ],
  });

  const data = await Promise.all(
    packagesData.map(async plugin => {
      const [description, content] = await buildMultipleMDX([
        `${plugin.stats?.collected?.metadata?.version || ''}\n\n${plugin.stats?.collected?.metadata?.description || ''}`,
        plugin.readme || plugin.stats?.collected?.metadata?.readme || '',
      ]);
      return {
        ...plugin,
        description,
        content,
      };
    })
  );

  return {
    props: {
      data,
    },
    // Revalidate at most once every 1 hour
    revalidate: 60 * 60,
  };
};

export default function Page({ data }: Props) {
  return (
    <Stack spacing="10em">
      {data.map(value => {
        return (
          <Box key={value.identifier}>
            <Heading fontSize="2em">{value.title}</Heading>
            <PackageInstall packages={[value.npmPackage]} />

            <MDX mdx={value.content.mdx} />
          </Box>
        );
      })}
    </Stack>
  );
}
