import { HeroGradient, InfoList } from '@theguild/components';
import { NPMBadge, handlePushRoute } from '@guild-docs/client';

export default function IndexPage() {
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
        colors={['#000', '#1cc8ee']}
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
