import LatticeService from './LatticeService';

export default {
  addConfig: function(config) {
    return {
      ...config,
      additionalServices: ['lattice'],
      lattice: LatticeService
    };
  }
};