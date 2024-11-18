# Next.js Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The project includes integrations with **DuckDB**, **deck.gl** and **Titiler Element 84 FCC**.

## Getting Started

### Prerequisites

- **Node.js** (v18.x or higher)
- **Docker** (optional, for containerized development)

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Rendering Titiler Element 84 FCC

This project also supports rendering **Titiler Element 84 FCC** at [http://localhost:3000/titiler](http://localhost:3000/titiler). This allows you to visualize cloud-optimized geospatial data directly through your local Next.js application.

### Modifying Pages
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Database Integration (DuckDB)

This project includes **DuckDB** to handle local analytical queries directly in your Next.js application. To connect to DuckDB, ensure you’ve installed the `duckdb` package:
```bash
npm install duckdb
```

To run queries, you can import and use DuckDB in your API routes or server-side code. Example:

```javascript
import DuckDB from 'duckdb';

const db = new DuckDB.Database(':memory:');
const connection = db.connect();
const results = connection.run('SELECT 1+1 as result');
console.log(results); // outputs the result of the query
```

### Visualization (deck.gl)

**deck.gl** provides powerful visualization capabilities for geospatial and large datasets. It can be configured within Next.js to render data in WebGL.

Install the necessary deck.gl dependencies:
```bash
npm install @deck.gl/core @deck.gl/react
```
## Docker Setup

To run this project in a container, a Dockerfile is provided. This Dockerfile uses multi-stage builds to reduce the final image size and runs the Next.js server in production mode.


### Running the Docker Container

1. Build the Docker image:
   ```bash
   docker build -t nextjs-app .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 nextjs-app
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## Learn More

To learn more about Next.js, DuckDB, deck.gl, LLMs, and Titiler Element 84, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [DuckDB Documentation](https://duckdb.org/docs/) - learn about running SQL queries directly in memory.
- [deck.gl Documentation](https://deck.gl/docs) - learn about creating high-performance WebGL-powered data visualizations.
- [OpenAI API Documentation](https://beta.openai.com/docs/) - learn about integrating LLMs for natural language processing.
- [Titiler Element 84 Documentation](https://developmentseed.org/titiler/) - learn about rendering cloud-optimized geospatial data.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

This README now includes a section highlighting the capability to render Titiler Element 84 FCC at `/titiler`. Let me know if you need further adjustments!