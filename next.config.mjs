/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Add a rule to handle `.lottie` files
      config.module.rules.push({
        test: /\.lottie$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/lottie/',
              publicPath: '/_next/static/lottie/',
            },
          },
        ],
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  