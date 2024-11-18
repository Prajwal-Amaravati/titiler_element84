// PlaceRepository.ts
import duckdb from "duckdb";
import path from "path";

class PlaceRepository {
  private db: duckdb.Database;

  constructor(db: duckdb.Database) {
    this.db = db;
  }

  public async queryByPlaceName(placeName: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.db.all(
        `SELECT NAME,REGION FROM places WHERE NAME = ?`,
        [placeName],
        (err, rows) => {
          if (err) {
            console.error("Error querying the database:", err);
            reject(err);
          } else {
            resolve(rows[0]);
          }
        }
      );
    });
  }

  public async getCentroidByPlaceName(placeName: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.db.all(
        `SELECT ST_AsText(ST_Centroid(geometry)) AS centroid FROM places WHERE NAME = ?`,
        [placeName],
        (err, rows) => {
          if (err) {
            console.error("Error querying the centroid:", err);
            reject(err);
          } else {
            resolve(rows[0]?.centroid); // Return the centroid if it exists
          }
        }
      );
    });
  }
  public async getbuffer(placeName: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.db.all(
        `SELECT ST_AsText(ST_Centroid(geometry)) AS centroid FROM places WHERE NAME = ?`,
        [placeName],
        (err, rows) => {
          if (err) {
            console.error("Error querying the centroid:", err);
            reject(err);
          } else {
            resolve(rows[0]?.centroid); // Return the centroid if it exists
          }
        }
      );
    });
  }
}


export default PlaceRepository;
