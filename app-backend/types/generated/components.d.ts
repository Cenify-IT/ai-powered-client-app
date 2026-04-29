import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksBadges extends Struct.ComponentSchema {
  collectionName: 'components_blocks_badges';
  info: {
    displayName: 'Badges';
  };
  attributes: {
    badges: Schema.Attribute.Component<'utils.badge', true>;
  };
}

export interface BlocksComparison extends Struct.ComponentSchema {
  collectionName: 'components_blocks_comparisons';
  info: {
    displayName: 'Comparison';
  };
  attributes: {
    classNames: Schema.Attribute.JSON;
    comparisonCards: Schema.Attribute.Component<
      'utils.features-list-card',
      true
    >;
    heading: Schema.Attribute.JSON;
    subheading: Schema.Attribute.JSON;
  };
}

export interface BlocksFinalCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_final_ctas';
  info: {
    displayName: 'FinalCTA';
  };
  attributes: {
    additional: Schema.Attribute.JSON;
    classNames: Schema.Attribute.JSON;
    ctaLinks: Schema.Attribute.Component<'utils.link', true>;
    heading: Schema.Attribute.JSON;
    subheading: Schema.Attribute.JSON;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    description: Schema.Attribute.JSON;
    heading: Schema.Attribute.JSON;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    links: Schema.Attribute.Component<'utils.link', true>;
    subheading: Schema.Attribute.JSON;
  };
}

export interface BlocksHowItWorks extends Struct.ComponentSchema {
  collectionName: 'components_blocks_how_it_works';
  info: {
    displayName: 'How it Works';
  };
  attributes: {
    additionalMarkdown: Schema.Attribute.RichText;
    cards: Schema.Attribute.Component<'utils.card', true>;
    heading: Schema.Attribute.JSON;
    subheading: Schema.Attribute.JSON;
  };
}

export interface BlocksReviews extends Struct.ComponentSchema {
  collectionName: 'components_blocks_reviews';
  info: {
    displayName: 'Reviews';
  };
  attributes: {
    demoReviews: Schema.Attribute.JSON;
    google_places_id: Schema.Attribute.String;
    heading: Schema.Attribute.JSON;
  };
}

export interface BlocksServices extends Struct.ComponentSchema {
  collectionName: 'components_blocks_services';
  info: {
    displayName: 'Services';
  };
  attributes: {
    cards: Schema.Attribute.Component<'utils.card', true>;
    description: Schema.Attribute.JSON;
    heading: Schema.Attribute.JSON;
  };
}

export interface LayoutBanner extends Struct.ComponentSchema {
  collectionName: 'components_layout_banners';
  info: {
    displayName: 'Banner';
  };
  attributes: {
    description: Schema.Attribute.String;
    label: Schema.Attribute.String;
    link: Schema.Attribute.Component<'utils.link', false>;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    additionalSection: Schema.Attribute.JSON;
    bottomCopyright: Schema.Attribute.JSON;
    copyright: Schema.Attribute.String;
    links: Schema.Attribute.Component<'utils.link', true>;
    LinksSection: Schema.Attribute.Component<
      'utils.footer-links-section',
      true
    >;
    LinkWithSublinks: Schema.Attribute.Component<
      'utils.link-with-sublinks',
      true
    >;
    Logo: Schema.Attribute.Component<'utils.logo-link', false>;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'Header';
  };
  attributes: {
    callToAction: Schema.Attribute.Component<'utils.link', false>;
    links: Schema.Attribute.Component<'utils.link', true>;
    LinksWithSublinks: Schema.Attribute.Component<
      'utils.link-with-sublinks',
      true
    >;
    Logo: Schema.Attribute.Component<'utils.logo-link', false>;
  };
}

export interface LayoutTheme extends Struct.ComponentSchema {
  collectionName: 'components_layout_themes';
  info: {
    displayName: 'Theme';
  };
  attributes: {
    colors: Schema.Attribute.JSON;
  };
}

export interface UtilsBadge extends Struct.ComponentSchema {
  collectionName: 'components_utils_badges';
  info: {
    displayName: 'Badge';
  };
  attributes: {
    data: Schema.Attribute.JSON;
  };
}

export interface UtilsCard extends Struct.ComponentSchema {
  collectionName: 'components_utils_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    classNames: Schema.Attribute.JSON;
    description: Schema.Attribute.JSON;
    displayNumber: Schema.Attribute.Boolean;
    icon: Schema.Attribute.JSON;
    link: Schema.Attribute.Component<'utils.link', false>;
    showLink: Schema.Attribute.Boolean;
    title: Schema.Attribute.JSON;
  };
}

export interface UtilsFeaturesListCard extends Struct.ComponentSchema {
  collectionName: 'components_utils_features_list_cards';
  info: {
    displayName: 'FeaturesListCard';
  };
  attributes: {
    cardAccent: Schema.Attribute.JSON;
    classNames: Schema.Attribute.JSON;
    features: Schema.Attribute.JSON;
    icon: Schema.Attribute.JSON;
    title: Schema.Attribute.JSON;
  };
}

export interface UtilsFooterLinksSection extends Struct.ComponentSchema {
  collectionName: 'components_utils_footer_links_sections';
  info: {
    displayName: 'FooterLinksSection';
  };
  attributes: {
    Links: Schema.Attribute.JSON;
    Title: Schema.Attribute.JSON;
  };
}

export interface UtilsLink extends Struct.ComponentSchema {
  collectionName: 'components_utils_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    classNames: Schema.Attribute.JSON;
    data: Schema.Attribute.JSON;
    payload: Schema.Attribute.JSON;
  };
}

export interface UtilsLinkWithSublinks extends Struct.ComponentSchema {
  collectionName: 'components_utils_link_with_sublinks';
  info: {
    displayName: 'Link With Sublinks';
  };
  attributes: {
    LinksJson: Schema.Attribute.JSON;
  };
}

export interface UtilsListItem extends Struct.ComponentSchema {
  collectionName: 'components_utils_list_items';
  info: {
    displayName: 'List Item';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<['checkcircle', 'timescircle']>;
    label: Schema.Attribute.String;
    showLabel: Schema.Attribute.Boolean;
    text: Schema.Attribute.String;
  };
}

export interface UtilsLogoLink extends Struct.ComponentSchema {
  collectionName: 'components_utils_logo_links';
  info: {
    displayName: 'Logo Link';
  };
  attributes: {
    classNames: Schema.Attribute.JSON;
    imageUrl: Schema.Attribute.String;
    link: Schema.Attribute.Component<'utils.link', false>;
    logoJsonText: Schema.Attribute.JSON;
    textLogo: Schema.Attribute.Boolean;
  };
}

export interface UtilsSocialMediaLink extends Struct.ComponentSchema {
  collectionName: 'components_utils_social_media_links';
  info: {
    displayName: 'Social Media Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      [
        'facebook',
        'instagram',
        'x/twitter',
        'pinterest',
        'youtube',
        'tiktok',
        'whatsapp',
        'yelp',
        'googlebusiness',
        'threads',
      ]
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.badges': BlocksBadges;
      'blocks.comparison': BlocksComparison;
      'blocks.final-cta': BlocksFinalCta;
      'blocks.hero': BlocksHero;
      'blocks.how-it-works': BlocksHowItWorks;
      'blocks.reviews': BlocksReviews;
      'blocks.services': BlocksServices;
      'layout.banner': LayoutBanner;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'layout.theme': LayoutTheme;
      'utils.badge': UtilsBadge;
      'utils.card': UtilsCard;
      'utils.features-list-card': UtilsFeaturesListCard;
      'utils.footer-links-section': UtilsFooterLinksSection;
      'utils.link': UtilsLink;
      'utils.link-with-sublinks': UtilsLinkWithSublinks;
      'utils.list-item': UtilsListItem;
      'utils.logo-link': UtilsLogoLink;
      'utils.social-media-link': UtilsSocialMediaLink;
    }
  }
}
