import React from 'react';
import { Container } from '@mui/material';

/**
 * SEO-friendly semantic HTML wrapper
 * Provides proper heading hierarchy and semantic structure
 */
export const SEOSection = ({
    as = 'section',
    title,
    titleLevel = 2,
    subtitle,
    description,
    children,
    className = '',
    ...props
}) => {
    const Component = as;
    const TitleTag = `h${titleLevel}`;

    return (
        <Component className={`seo-section ${className}`} {...props}>
            {title && (
                <div className="seo-section-header">
                    <TitleTag className="seo-section-title">{title}</TitleTag>
                    {subtitle && <p className="seo-section-subtitle">{subtitle}</p>}
                    {description && <p className="seo-section-description">{description}</p>}
                </div>
            )}
            {children}
        </Component>
    );
};

/**
 * Semantic container wrapper with proper ARIA labels
 */
export const SEOContainer = ({
    as = 'div',
    label,
    children,
    className = '',
    maxWidth = 'lg',
    ...props
}) => {
    return (
        <Container
            component={as}
            maxWidth={maxWidth}
            aria-label={label}
            className={`seo-container ${className}`}
            {...props}
        >
            {children}
        </Container>
    );
};

/**
 * Product list wrapper with proper structured data
 */
export const SEOProductList = ({
    title,
    products,
    renderProduct,
    className = '',
    ariaLabel = 'Product list'
}) => {
    return (
        <SEOSection as="section" title={title} titleLevel={2} className={className}>
            <div
                className="seo-product-list"
                role="list"
                aria-label={ariaLabel}
            >
                {products && products.map((product, index) => (
                    <div
                        key={product.id || index}
                        role="listitem"
                        className="seo-product-item"
                    >
                        {renderProduct(product)}
                    </div>
                ))}
            </div>
        </SEOSection>
    );
};

/**
 * Heading with proper semantic structure
 */
export const SEOHeading = ({
    level = 1,
    children,
    className = '',
    id,
    ...props
}) => {
    const HeadingTag = `h${level}`;
    return (
        <HeadingTag id={id} className={`seo-heading h${level} ${className}`} {...props}>
            {children}
        </HeadingTag>
    );
};

/**
 * Metadata injector for dynamic content
 */
export const SEOMeta = ({ data }) => {
    React.useEffect(() => {
        if (!data) return;

        // Update meta tags
        const updateMeta = (name, content) => {
            let elem = document.querySelector(`meta[name="${name}"]`);
            if (!elem) {
                elem = document.createElement('meta');
                elem.name = name;
                document.head.appendChild(elem);
            }
            elem.content = content;
        };

        if (data.description) updateMeta('description', data.description);
        if (data.keywords) updateMeta('keywords', data.keywords);

        // Update page title
        if (data.title) {
            document.title = `${data.title} | PetStore`;
        }

        // Update structured data
        if (data.structuredData) {
            const script = document.querySelector('script[type="application/ld+json"]');
            if (script) script.remove();

            const newScript = document.createElement('script');
            newScript.type = 'application/ld+json';
            newScript.textContent = JSON.stringify(data.structuredData);
            document.head.appendChild(newScript);
        }
    }, [data]);

    return null; // This component doesn't render anything
};

export default SEOSection;
