/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  compiler: {
    emotion: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // socket.io-client의 ws 라이브러리가 사용하는 optional native dependencies
    // 브라우저에서는 필요 없으므로 external로 처리
    config.externals.push({
      bufferutil: 'bufferutil',
      'utf-8-validate': 'utf-8-validate',
    });

    return config;
  },
};

export default nextConfig;
