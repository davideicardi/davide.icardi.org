"use strict";

const config = {};

config.web = {};

// nodejs server listening port
config.web.port =
  process.env.PORT ||
  process.env.WEB_PORT ||
  process.env.OPENSHIFT_NODEJS_PORT ||
  8181;

config.web.ip =
  process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP;

module.exports = config;
