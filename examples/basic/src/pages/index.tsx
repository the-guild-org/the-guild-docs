import { HeroGradient, InfoList } from 'the-guild-components';

export default function Index() {
  return (
    <>
      <HeroGradient
        title="The Guild Docs"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at gravida lacus"
        // TODO: We need an "onClick" handler to do client-side navigation
        link={{
          label: 'Get Started',
          title: 'Get started with The Guild Docs',
          href: '/docs',
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
