# 🔒 Security Guidelines

## ⚠️ IMPORTANT: Before Publishing to GitHub

### 1. Environment Variables Protection
**NEVER commit these files:**
- `.env` (backend)
- Any file containing real Salesforce credentials
- Access tokens or API keys

### 2. Files Already Protected by .gitignore
The following sensitive files are automatically ignored:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
backend/.env
frontend/.env
```

### 3. What to Check Before Committing

#### ✅ Safe to commit:
- `env.example` (with placeholder values)
- Source code files
- Configuration files without secrets
- Documentation files

#### ❌ NEVER commit:
- Real Salesforce credentials
- Access tokens
- API keys
- Database passwords
- Any `.env` files with real values

### 4. How to Setup for Others

When someone clones your repository, they should:

1. **Copy the example file:**
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Fill in their own credentials:**
   ```env
   SF_CLIENT_ID=their_actual_client_id
   SF_CLIENT_SECRET=their_actual_client_secret
   SF_USERNAME=their_salesforce_username
   SF_PASSWORD=their_salesforce_password
   ```

### 5. Salesforce Security Best Practices

#### Connected App Settings:
- Enable IP restrictions if possible
- Use least privilege principle for OAuth scopes
- Regularly rotate client secrets
- Monitor API usage

#### User Account Security:
- Use strong passwords
- Enable two-factor authentication
- Regularly review login history
- Use dedicated integration user accounts

### 6. Additional Security Measures

#### Backend Security:
- Helmet.js for security headers ✅ (already implemented)
- CORS configuration ✅ (already implemented)
- Input validation and sanitization
- Rate limiting (consider implementing)
- HTTPS in production

#### Frontend Security:
- Secure token storage (localStorage with expiration)
- XSS protection
- CSRF protection
- Content Security Policy

### 7. Production Deployment

#### Environment Variables in Production:
- Use environment variable services (Heroku Config Vars, AWS Systems Manager, etc.)
- Never hardcode credentials in source code
- Use different credentials for different environments

#### HTTPS:
- Always use HTTPS in production
- Update CORS settings for production domains
- Use secure cookies for session management

### 8. Monitoring and Logging

#### What to Log:
- Authentication attempts
- API usage patterns
- Error rates
- Performance metrics

#### What NOT to Log:
- Passwords
- Access tokens
- Personal information
- Credit card numbers

### 9. Incident Response

If credentials are accidentally committed:

1. **Immediately:**
   - Revoke the exposed credentials in Salesforce
   - Generate new credentials
   - Update production systems

2. **Clean Git History:**
   ```bash
   # Remove sensitive data from git history
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch path/to/sensitive/file' \
   --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push (if repository is private):**
   ```bash
   git push origin --force --all
   ```

### 10. Security Checklist

Before publishing:
- [ ] All `.env` files are in `.gitignore`
- [ ] No real credentials in source code
- [ ] `env.example` has placeholder values only
- [ ] README.md has setup instructions
- [ ] Security guidelines documented
- [ ] Dependencies are up to date
- [ ] No sensitive data in git history

### 11. Contact

If you discover a security vulnerability, please report it responsibly:
- Create a private issue or
- Contact the maintainer directly
- Do not publish security issues publicly

---

**Remember: Security is everyone's responsibility! 🛡️**
