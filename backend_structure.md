### Database Schema

Users

id email password_hash created_at subscription_type

Resumes

id user_id title content_json template_type created_at updated_at

PortfolioProjects

id user_id project_name source_code_zip_path config_json created_at

Versions

id parent_id type resume or portfolio version_number content_json created_at

Subscriptions

id user_id plan status renewal_date

**API** Endpoints

**POST** /api/auth/login **POST** /api/auth/signup

**POST** /api/resume/generate **POST** /api/resume/optimize **GET** /api/resume/:id **PUT** /api/resume/:id

**POST** /api/portfolio/generate **POST** /api/portfolio/regenerate-section **GET** /api/portfolio/:id **POST** /api/portfolio/export

**POST** /api/deploy/vercel

AI Integration Contract

Input Structured **JSON**

Output resume_content portfolio_code improvement_suggestions deployment_guide

Strict schema validation required.