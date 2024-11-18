// pages/swagger.tsx
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import styles from './swagger.module.css'; // Assuming you create a CSS module

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const SwaggerPage = () => {
    useEffect(() => {
        document.title = 'API Documentation';
    }, []);

    return (
        <div className={styles.swaggerContainer}>
            <SwaggerUI 
                url="/swagger.json" 
                docExpansion="full" // Options: 'none', 'full', or 'list'
                defaultModelsExpandDepth={-1} // Collapse models by default
                style={{ backgroundColor: '#fff' }} // Inline styles for further customization
            />
        </div>
    );
};

export default SwaggerPage;
