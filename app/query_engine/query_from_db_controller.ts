import duckdb from "duckdb";
import fs from "fs";
import path from "path";
import PlaceRepository from "./query_place_repository";

class QueryFromDBController {
  private db: duckdb.Database;
  private placeRepository?: PlaceRepository;

  constructor() {
    this.db = new duckdb.Database(":memory:");
  }

  public async initialize(): Promise<void> {
    await this.initializeDatabase();
    console.log("Database initialized successfully");
  }

  private initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Install and load the spatial extension for geometry support
      this.db.run("INSTALL spatial;", (err: any) => {
        if (err) {
          console.error("Error installing spatial extension:", err);
          return reject(err);
        }
        console.log("Spatial extension installed.");

        this.db.run("LOAD spatial;", (err: any) => {
          if (err) {
            console.error("Error loading spatial extension:", err);
            return reject(err);
          }
          console.log("Spatial extension loaded.");

          // Create the `places` table with `GEOMETRY` type
          this.db.run(
            "CREATE TABLE IF NOT EXISTS places (NAME VARCHAR, REGION VARCHAR, geometry GEOMETRY);",
            (err: any) => {
              if (err) {
                console.error("Error creating places table:", err);
                return reject(err);
              }
              console.log("places table is ready.");

              // Load data from the CSV file into the DuckDB table
              const csvFilePath = path.resolve("./app/query_engine/states.csv"); // Adjust the path as needed
              if (fs.existsSync(csvFilePath)) {
                this.db.run(
                  `COPY places FROM '${csvFilePath}' (DELIMITER ',', HEADER TRUE);`,
                  (err: any) => {
                    if (err) {
                      console.error("Error loading data from CSV:", err);
                      return reject(err);
                    }
                    console.log("Data loaded successfully from CSV.");
                    resolve(); // Resolve when the data is loaded
                  }
                );
              } else {
                console.error("CSV file not found at", csvFilePath);
                reject(new Error("CSV file not found"));
              }
            }
          );
        });
      });
    });
  }

  public async queryByPlaceName(placeName: string): Promise<any> {
    console.log(placeName, "Placename");
    this.placeRepository = new PlaceRepository(this.db); // Use the existing db instance

    if (!this.placeRepository) {
      throw new Error("Place repository is not initialized");
    }

    const result = await this.placeRepository.queryByPlaceName(placeName); // Await the query result
    console.log("Query output:", result);
    return result;
  }

  public async querythecentroid(placeName: string): Promise<any> {
    console.log(placeName, "Placename");
    this.placeRepository = new PlaceRepository(this.db); // Use the existing db instance

    if (!this.placeRepository) {
      throw new Error("Place repository is not initialized");
    }

    const result = await this.placeRepository.getCentroidByPlaceName(placeName); // Await the query result
    console.log("Query output:", result);
    return result;
  }

  public async handleQuery(placeName: string) {
    try {
      await this.initialize(); // Ensure the database is initialized
      const result = await this.queryByPlaceName(placeName); // Query the place name
      console.log(result, "the result form reoisutiry");
      return result;
    } catch (error) {
      console.error("Error handling query:", error);
    }
  }


    public async getcentroid(placeName: string) {
        try {
        await this.initialize(); // Ensure the database is initialized
        const result = await this.querythecentroid(placeName); // Query the place name
        console.log(result, "the result form reoisutiry");
        return result;
        } catch (error) {
        console.error("Error handling query:", error);
        }
    }
    }

export default QueryFromDBController;
