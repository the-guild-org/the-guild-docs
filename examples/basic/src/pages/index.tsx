import { useRouter } from 'next/router';
import { HeroGradient, InfoList } from 'the-guild-components';

import { handleRoute } from '../../next-helpers';

export default function Index() {
  const router = useRouter();

  return (
    <>
      <HeroGradient
        title="The Guild Docs"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at gravida lacus"
        link={{
          href: '/docs',
          children: 'Get Started',
          title: 'Get started with The Guild Docs',
          onClick: e => handleRoute('/docs', e, router),
        }}
        version="0.0.12"
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
