# CampusLearn Deployment Guide

This document provides instructions for deploying the CampusLearn application in both development and production environments.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for development)
- Java 17 JDK (for development)
- Maven (for building the backend)
- Git (for version control)

## Development Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/campuslearn.git
cd campuslearn
```

### 2. Start Development Environment
```bash
# Start all services
docker-compose up --build

# Or start services in detached mode
docker-compose up -d
```

### 3. Access Development Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: PostgreSQL on localhost:5432
- **PGAdmin**: http://localhost:5050 (admin@campuslearn.com/admin)

## Production Deployment

### 1. Server Requirements
- Linux server with Docker and Docker Compose installed
- Minimum 2GB RAM, 2 CPU cores
- Domain name with SSL certificate (recommended)

### 2. Deployment Steps

#### Option A: Manual Deployment

1. **Copy the project files** to your server
2. **Set environment variables** in `.env` file
3. **Start the services**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

#### Option B: CI/CD Deployment (Recommended)

1. **Set up GitHub Secrets**:
   - `PROD_SERVER_HOST`: Production server IP/hostname
   - `PROD_SERVER_USER`: SSH username
   - `PROD_SERVER_SSH_KEY`: Private SSH key for deployment

2. **Push to main branch** to trigger automatic deployment

### 3. Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
POSTGRES_DB=campuslearn
POSTGRES_USER=your_secure_username
POSTGRES_PASSWORD=your_secure_password

# Backend
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your_jwt_secret_key

# Frontend
VITE_API_BASE_URL=https://your-api-domain.com
```

## Monitoring and Maintenance

### Logs
```bash
# View logs for all services
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f backend
```

### Database Backups
```bash
# Create a backup
docker exec -t campuslearn-db pg_dump -U postgres campuslearn > backup_$(date +%Y-%m-%d).sql

# Restore from backup
cat backup_file.sql | docker exec -i campuslearn-db psql -U postgres campuslearn
```

### Updates
```bash
# Pull latest changes
git pull

# Rebuild and restart services
docker-compose up -d --build

# Run database migrations (if any)
docker-compose exec backend ./mvnw flyway:migrate
```

## Scaling

### Vertical Scaling
- Increase container resources in `docker-compose.yml`
- Adjust JVM options in `Dockerfile.backend`

### Horizontal Scaling
1. Set up a load balancer (e.g., Nginx, Traefik)
2. Scale backend services:
   ```bash
   docker-compose up -d --scale backend=3
   ```
3. Configure session management for multiple instances

## Troubleshooting

### Common Issues

**Port conflicts**
- Check if ports 3000, 8080, 5432 are available
- Update ports in `docker-compose.yml` if needed

**Database connection issues**
- Verify database credentials
- Check if the database container is running
- Ensure proper network configuration

**Build failures**
- Clear Docker cache: `docker system prune -a`
- Check for dependency conflicts

## Security Considerations

1. **Update default credentials** for all services
2. **Enable HTTPS** using Let's Encrypt
3. **Regularly update** Docker images
4. **Monitor** for security vulnerabilities
5. **Restrict access** to sensitive endpoints

## Support

For issues and support, please contact the development team or open an issue in the repository.