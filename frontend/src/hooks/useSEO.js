import { useEffect } from 'react';

/**
 * Hook to manage page SEO metadata (title, description, canonical, structured data)
 * @param {Object} config - SEO configuration
 * @param {string} config.title - Page title (appended with site name)
 * @param {string} config.description - Meta description
 * @param {string} config.keywords - Meta keywords
 * @param {string} config.canonical - Canonical URL
 * @param {string} config.ogTitle - OpenGraph title
 * @param {string} config.ogDescription - OpenGraph description
 * @param {string} config.ogImage - OpenGraph image
 * @param {string} config.ogType - OpenGraph type (default: 'website')
 * @param {Object} config.structuredData - JSON-LD structured data
 */
export const useSEO = (config = {}) => {
    useEffect(() => {
        const {
            title = 'PetStore',
            description = 'Your trusted pet store for quality pet products and supplies',
            keywords = 'pets, pet store, pet products, dog, cat',
            canonical = window.location.href,
            ogTitle,
            ogDescription,
            ogImage = 'https://your-domain.com/logo.png',
            ogType = 'website',
            structuredData
        } = config;

        // Update page title
        document.title = `${title} | PetStore`;

        // Remove existing meta tags that we'll update
        const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], link[rel="canonical"]');
        existingMetas.forEach(meta => meta.remove());

        // Add description meta tag
        const descMeta = document.createElement('meta');
        descMeta.name = 'description';
        descMeta.content = description;
        document.head.appendChild(descMeta);

        // Add keywords meta tag
        const keywordsMeta = document.createElement('meta');
        keywordsMeta.name = 'keywords';
        keywordsMeta.content = keywords;
        document.head.appendChild(keywordsMeta);

        // Add canonical link
        const canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = canonical;
        document.head.appendChild(canonicalLink);

        // Add OpenGraph meta tags
        const ogTitleMeta = document.createElement('meta');
        ogTitleMeta.property = 'og:title';
        ogTitleMeta.content = ogTitle || title;
        document.head.appendChild(ogTitleMeta);

        const ogDescMeta = document.createElement('meta');
        ogDescMeta.property = 'og:description';
        ogDescMeta.content = ogDescription || description;
        document.head.appendChild(ogDescMeta);

        const ogImageMeta = document.createElement('meta');
        ogImageMeta.property = 'og:image';
        ogImageMeta.content = ogImage;
        document.head.appendChild(ogImageMeta);

        const ogTypeMeta = document.createElement('meta');
        ogTypeMeta.property = 'og:type';
        ogTypeMeta.content = ogType;
        document.head.appendChild(ogTypeMeta);

        const ogUrlMeta = document.createElement('meta');
        ogUrlMeta.property = 'og:url';
        ogUrlMeta.content = canonical;
        document.head.appendChild(ogUrlMeta);

        // Add Twitter Card meta tags
        const twitterCardMeta = document.createElement('meta');
        twitterCardMeta.name = 'twitter:card';
        twitterCardMeta.content = 'summary_large_image';
        document.head.appendChild(twitterCardMeta);

        const twitterTitleMeta = document.createElement('meta');
        twitterTitleMeta.name = 'twitter:title';
        twitterTitleMeta.content = ogTitle || title;
        document.head.appendChild(twitterTitleMeta);

        const twitterDescMeta = document.createElement('meta');
        twitterDescMeta.name = 'twitter:description';
        twitterDescMeta.content = ogDescription || description;
        document.head.appendChild(twitterDescMeta);

        // Add structured data (JSON-LD)
        if (structuredData) {
            // Remove existing structured data script
            const existingScript = document.querySelector('script[type="application/ld+json"]');
            if (existingScript) existingScript.remove();

            // Add new structured data
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }

        // Cleanup function
        return () => {
            // Keep meta tags - they should persist across page changes
        };
    }, [config]);
};

/**
 * Generate structured data for Organization (for homepage)
 */
export const generateOrganizationSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'PetStore',
        'url': window.location.origin,
        'logo': `${window.location.origin}/logo.png`,
        'description': 'Your trusted pet store for quality pet products and supplies',
        'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'IL',
            'addressLocality': 'Israel'
        },
        'sameAs': [
            'https://www.facebook.com/petstore',
            'https://www.instagram.com/petstore'
        ]
    };
};

/**
 * Generate structured data for Product
 */
export const generateProductSchema = (product) => {
    return {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': product.name,
        'description': product.description || product.name,
        'image': product.images && product.images[0] ? product.images[0] : '',
        'brand': {
            '@type': 'Brand',
            'name': product.brand || 'PetStore'
        },
        'offers': {
            '@type': 'Offer',
            'url': `${window.location.origin}/product/${product.id}`,
            'priceCurrency': 'ILS',
            'price': product.price?.toString() || '0',
            'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            'seller': {
                '@type': 'Organization',
                'name': 'PetStore'
            }
        },
        'aggregateRating': product.rating ? {
            '@type': 'AggregateRating',
            'ratingValue': product.rating.toString(),
            'reviewCount': product.reviewCount?.toString() || '0'
        } : undefined
    };
};

/**
 * Generate structured data for BreadcrumbList
 */
export const generateBreadcrumbSchema = (items) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.url
        }))
    };
};

/**
 * Generate structured data for LocalBusiness
 */
export const generateLocalBusinessSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': 'PetStore',
        'image': `${window.location.origin}/logo.png`,
        'description': 'Your trusted pet store for quality pet products and supplies',
        'url': window.location.origin,
        'telephone': '+972-XX-XXX-XXXX',
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Your Street Address',
            'addressLocality': 'Your City',
            'addressRegion': 'Your Region',
            'postalCode': 'XXXXX',
            'addressCountry': 'IL'
        },
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': '32.0853',
            'longitude': '34.7818'
        }
    };
};

export default useSEO;
