# Deployment Guide for pbhfinal.shop

This guide outlines all the changes you need to make on your deployment to use the domain `pbhfinal.shop`.

## ✅ Code Changes (Already Done)

The following code has been updated:
- ✅ Server now listens on `0.0.0.0` (accessible via public IP)
- ✅ Google OAuth callback URL uses full domain
- ✅ Default CLIENT_BASE_URL set to `https://pbhfinal.shop`
- ✅ Default SERVER_BASE_URL set to `https://pbhfinal.shop`
- ✅ Updated data.txt files with correct domain

---

## 🔧 Deployment Configuration Changes

### 1. Backend Environment Variables

On your server (EC2/VPS), update the `.env` file in `flipchat-server-main/` directory:

```env
PORT=3000
SERVER_BASE_URL=https://pbhfinal.shop
CLIENT_BASE_URL=https://pbhfinal.shop
CORS_ORIGIN=https://pbhfinal.shop

# Keep your existing values for these:
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=420250340652-jltkqohqltqaf0ajf03tnm8ujt2q9a3j.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
USER_MAIL=your_email
USER_PASS=your_email_password
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

**Location on server:**
- If using EC2: `/home/ubuntu/flipchat/flipchat-server-main/.env`
- If using VPS: `/home/flipchat/flipchat-link/flipchat-server/.env`

### 2. Frontend Environment Variables

On your server, update the `.env` or `.env.local` file in `flipchat-client-main/` directory:

```env
VITE_APP_SERVER_URL=https://pbhfinal.shop/api
VITE_APP_BASE_URL=https://pbhfinal.shop
VITE_APP_GOOGLE_CLIENT_ID=420250340652-jltkqohqltqaf0ajf03tnm8ujt2q9a3j.apps.googleusercontent.com
```

**Note:** If you're using `data.txt` for deployment (as seen in GitHub workflows), make sure `flipchat-client-main/data.txt` has these values (already updated).

**Location on server:**
- If using EC2/VPS: `/home/flipchat/flipchat-link/flipchat-client/.env.local` or `.env`
- For S3/CloudFront: Set these during build time

### 3. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID: `420250340652-jltkqohqltqaf0ajf03tnm8ujt2q9a3j.apps.googleusercontent.com`
4. Click **Edit**
5. Under **Authorized redirect URIs**, add:
   ```
   https://pbhfinal.shop/api/auth/google/callback
   ```
6. Under **Authorized JavaScript origins**, add:
   ```
   https://pbhfinal.shop
   ```
7. Click **Save**

### 4. DNS Configuration

Point your domain `pbhfinal.shop` to your server:

**Option A: Direct IP (if using EC2/VPS directly)**
- Create an **A record**:
  - Name: `@` (or leave blank)
  - Type: `A`
  - Value: Your server's public IP address
  - TTL: 300 (or default)

**Option B: Using CloudFront (if frontend is on S3)**
- Create a **CNAME record**:
  - Name: `@` (or leave blank)
  - Type: `CNAME`
  - Value: Your CloudFront distribution domain (e.g., `d1234567890.cloudfront.net`)
  - TTL: 300 (or default)

**For subdomain (if needed):**
- If you want `api.pbhfinal.shop` for backend:
  - Create **A record**: `api` → Your server IP
- If you want `www.pbhfinal.shop`:
  - Create **CNAME record**: `www` → `pbhfinal.shop` (or CloudFront domain)

### 5. SSL/HTTPS Certificate Setup

**Option A: Using Let's Encrypt (Recommended for EC2/VPS)**

```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (if using Nginx)
sudo certbot --nginx -d pbhfinal.shop -d www.pbhfinal.shop

# Or if using standalone (no Nginx)
sudo certbot certonly --standalone -d pbhfinal.shop
```

**Option B: Using AWS Certificate Manager (if using CloudFront/ALB)**
1. Request a certificate in ACM for `pbhfinal.shop`
2. Validate the certificate via DNS
3. Attach to your CloudFront distribution or ALB

### 6. Nginx Configuration (If Using Reverse Proxy)

If you're using Nginx as a reverse proxy, update your configuration:

```nginx
server {
    listen 80;
    server_name pbhfinal.shop www.pbhfinal.shop;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pbhfinal.shop www.pbhfinal.shop;

    ssl_certificate /etc/letsencrypt/live/pbhfinal.shop/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pbhfinal.shop/privkey.pem;

    # Frontend (if serving from same server)
    location / {
        root /var/www/html/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3000;
    }
}
```

Then reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Security Group / Firewall Rules

**AWS Security Groups (if using EC2):**
- Allow inbound traffic on port **80** (HTTP) from `0.0.0.0/0`
- Allow inbound traffic on port **443** (HTTPS) from `0.0.0.0/0`
- **Remove** public access to port **3000** (only allow from localhost/127.0.0.1)

**UFW Firewall (if using Ubuntu VPS):**
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3000/tcp  # Block direct access to port 3000
sudo ufw reload
```

### 8. Restart Services

After updating environment variables:

**Backend:**
```bash
# If using PM2
pm2 restart flipchat-api
# or
pm2 restart flipchat-server

# Verify it's running
pm2 list
pm2 logs flipchat-api
```

**Frontend:**
```bash
# If using Nginx, just reload
sudo systemctl reload nginx

# If rebuilding frontend
cd /path/to/flipchat-client-main
npm run build
# Then sync to web server directory
```

### 9. Verify Deployment

Test these URLs:

1. **Health Check:**
   ```
   https://pbhfinal.shop/health
   ```
   Should return: `{"message":"server health check: Running"}`

2. **Frontend:**
   ```
   https://pbhfinal.shop
   ```
   Should load your React app

3. **API Endpoint:**
   ```
   https://pbhfinal.shop/api/auth/...
   ```
   Should work with CORS

4. **Google OAuth:**
   - Try logging in with Google
   - Should redirect to `https://pbhfinal.shop/api/auth/google/callback`

---

## 📋 Checklist

- [ ] Updated backend `.env` file with `SERVER_BASE_URL` and `CLIENT_BASE_URL`
- [ ] Updated frontend `.env` or `data.txt` with `VITE_APP_SERVER_URL` and `VITE_APP_BASE_URL`
- [ ] Updated Google OAuth redirect URIs in Google Cloud Console
- [ ] Configured DNS A/CNAME records pointing to server
- [ ] Set up SSL certificate (Let's Encrypt or ACM)
- [ ] Configured Nginx (if using reverse proxy)
- [ ] Updated Security Group/Firewall rules
- [ ] Restarted backend service (PM2)
- [ ] Reloaded Nginx (if applicable)
- [ ] Tested health check endpoint
- [ ] Tested frontend access
- [ ] Tested Google OAuth login

---

## 🚨 Common Issues

**Issue: CORS errors**
- Solution: Ensure `CORS_ORIGIN` in backend `.env` matches your frontend domain

**Issue: Google OAuth redirect mismatch**
- Solution: Verify redirect URI in Google Cloud Console matches exactly: `https://pbhfinal.shop/api/auth/google/callback`

**Issue: SSL certificate errors**
- Solution: Ensure DNS is properly configured and certificate is valid

**Issue: 502 Bad Gateway**
- Solution: Check if backend is running on port 3000, verify Nginx proxy_pass configuration

**Issue: Frontend can't connect to API**
- Solution: Verify `VITE_APP_SERVER_URL` is set to `https://pbhfinal.shop/api` (not `http://`)

---

## 📞 Need Help?

If you encounter issues:
1. Check PM2 logs: `pm2 logs flipchat-api`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables are loaded: Check `.env` file exists and has correct values
4. Test DNS: `nslookup pbhfinal.shop`
5. Test SSL: `curl -I https://pbhfinal.shop`

