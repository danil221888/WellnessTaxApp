class TaxService {
  async getRates(latitude: number, longitude: number) {
    return {
      state_rate: 0.04,
      county_rate: 0.03,
      city_rate: 0.015,
      special_rate: 0.00375,
    };
  }
}

export const taxService = new TaxService();