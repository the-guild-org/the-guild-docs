import { HeroGradient, InfoList } from '@theguild/components';
import { NPMBadge } from '@guild-docs/client';
import { handlePushRoute } from '@guild-docs/client';

export default function Index() {
  return (
    <>
      <HeroGradient
        title="The Guild Docs"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at gravida lacus"
        link={{
          href: '/docs',
          children: 'Get Started',
          title: 'Get started with The Guild Docs',
          onClick: e => handlePushRoute('/docs', e),
        }}
        version={<NPMBadge name="@guild-docs/client" />}
        colors={['#000000', '#1CC8EE']}
      />

      <InfoList
        title="First steps"
        items={[
          {
            title: 'Install',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas euismod amet duis quisque semper.',
          },
          {
            title: 'Configure',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas euismod amet duis quisque semper.',
          },
          {
            title: 'Enjoy',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas euismod amet duis quisque semper.',
          },
        ]}
      />
    </>
  );
}
