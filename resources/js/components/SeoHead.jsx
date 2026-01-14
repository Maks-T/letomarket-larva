import { Head } from '@inertiajs/react';

export default function SeoHead({ title, description, keywords, image }) {
    const siteName = 'Letomarket';
    const fullTitle = title ? `${title} - ${siteName}` : siteName;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description || 'Изделия из ДПК для вашего дома'} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph (для соцсетей) */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteName} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
        </Head>
    );
}
