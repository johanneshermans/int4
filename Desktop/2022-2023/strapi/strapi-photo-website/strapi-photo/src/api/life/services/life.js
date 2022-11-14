'use strict';

/**
 * life service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::life.life');
