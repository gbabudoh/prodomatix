module.exports = {
  apps: [
    {
      name: 'prodomatix-api',
      cwd: './backend',
      script: 'npx',
      args: 'tsx index.ts',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: '/var/log/prodomatix/api-error.log',
      out_file: '/var/log/prodomatix/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
