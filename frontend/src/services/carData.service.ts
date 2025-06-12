import axios from 'axios';

// NHTSA Vehicle API - Free and public API for vehicle data
const NHTSA_API_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

class CarDataService {
  /**
   * Get all car makes (brands)
   * @returns Promise with array of car makes
   */
  async getAllMakes(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await axios.get(
        `${NHTSA_API_BASE_URL}/GetAllMakes?format=json`
      );
      
      if (response.data && response.data.Results) {
        return response.data.Results.map((make: any) => ({
          id: make.Make_ID,
          name: make.Make_Name
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching car makes:', error);
      return [];
    }
  }

  /**
   * Get all models for a specific make (brand)
   * @param makeId The ID of the make/brand
   * @returns Promise with array of car models
   */
  async getModelsByMake(makeId: number): Promise<{ id: number; name: string }[]> {
    try {
      const response = await axios.get(
        `${NHTSA_API_BASE_URL}/GetModelsForMakeId/${makeId}?format=json`
      );
      
      if (response.data && response.data.Results) {
        return response.data.Results.map((model: any) => ({
          id: model.Model_ID,
          name: model.Model_Name
        }));
      }
      return [];
    } catch (error) {
      console.error(`Error fetching models for make ID ${makeId}:`, error);
      return [];
    }
  }

  /**
   * Get all models for a specific make by name
   * @param makeName The name of the make/brand
   * @returns Promise with array of car models
   */
  async getModelsByMakeName(makeName: string): Promise<{ id: number; name: string }[]> {
    try {
      const response = await axios.get(
        `${NHTSA_API_BASE_URL}/GetModelsForMake/${encodeURIComponent(makeName)}?format=json`
      );
      
      if (response.data && response.data.Results) {
        return response.data.Results.map((model: any) => ({
          id: model.Model_ID,
          name: model.Model_Name
        }));
      }
      return [];
    } catch (error) {
      console.error(`Error fetching models for make "${makeName}":`, error);
      return [];
    }
  }

  /**
   * Get all available years for vehicles
   * @returns Promise with array of years
   */
  async getYears(): Promise<number[]> {
    // NHTSA API doesn't have a direct endpoint for years
    // So we'll return a reasonable range of years
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 30; year--) {
      years.push(year);
    }
    return years;
  }
}

export const carDataService = new CarDataService();