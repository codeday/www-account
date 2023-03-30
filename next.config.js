const { withTopo } = require('@codeday/topo/Next');

/** @type {import('next').NextConfig} */
module.exports = withTopo({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
});
