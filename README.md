# 🗄️ S3 Storage Manager

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ashishworld/amazon-s3-bucket-GUI-manager)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://amazon-s3-bucket-gui-manager.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, feature-rich React application for managing AWS S3 buckets with an intuitive interface. Built with TypeScript, Tailwind CSS, and following SOLID principles.

![S3 Storage Manager Screenshot](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=S3+Storage+Manager)

## ✨ Features

### 🔐 **Secure S3 Management**
- **Dynamic Credentials**: Input Access Key, Secret Key, Region, and Bucket Name
- **All AWS Regions**: Complete dropdown with 30+ AWS regions
- **Secure Connection**: HTTPS-only with session-based credential storage
- **CORS Compatible**: Works with proper S3 CORS configuration

### 📁 **Complete File Operations**
- **Upload Files**: Multiple file selection and upload
- **Create Folders**: Organize your S3 objects
- **Rename Objects**: Inline renaming for files and folders
- **Delete Operations**: Safe deletion with confirmation
- **Download Files**: Direct download with pre-signed URLs

### 🎬 **Media Preview**
- **Image Preview**: JPG, PNG, GIF, WebP, SVG
- **Video Player**: MP4, WebM, OGG, MOV with controls
- **Audio Player**: MP3, WAV, AAC with controls
- **PDF Viewer**: Embedded PDF preview
- **Modal Interface**: Full-screen preview experience

### 📊 **Advanced View Options**
- **Multiple Views**: List, Grid, and Details view (Windows Explorer-style)
- **Smart Sorting**: Click headers to sort by Name, Size, or Date
- **Pagination**: 100 items per page for optimal performance
- **Search & Filter**: Quick object filtering

### 🌙 **Modern UI/UX**
- **Dark/Light Mode**: Toggle between themes with persistence
- **Responsive Design**: Works perfectly on all devices
- **Real-time Updates**: Live bucket statistics
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- AWS S3 bucket with proper CORS configuration
- AWS IAM credentials with S3 permissions

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashishworld/amazon-s3-bucket-GUI-manager.git
   cd amazon-s3-bucket-GUI-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## ⚙️ S3 CORS Configuration

Add this CORS policy to your S3 bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

## 🏗️ Architecture

### SOLID Principles Implementation
- **Single Responsibility**: Each component handles one specific functionality
- **Open/Closed**: Components are extensible without modification
- **Liskov Substitution**: Interfaces ensure component interchangeability
- **Interface Segregation**: Clean, focused TypeScript interfaces
- **Dependency Inversion**: Services abstracted from UI components

### DRY Methodology
- **Custom Hooks**: Reusable logic (useS3, useTheme)
- **Utility Functions**: Shared formatters and helpers
- **Component Composition**: Modular, reusable components
- **Service Layer**: Centralized AWS S3 operations

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── Header.tsx       # App header with logo and theme toggle
│   ├── CredentialsForm.tsx  # AWS credentials input form
│   ├── BucketInfo.tsx   # Bucket statistics display
│   ├── FileUpload.tsx   # File upload and folder creation
│   ├── ObjectsList.tsx  # Main objects list with views
│   └── MediaPreview.tsx # Media preview modal
├── hooks/               # Custom React hooks
│   ├── useS3.ts        # S3 operations and state management
│   └── useTheme.ts     # Dark/light theme management
├── services/           # Business logic layer
│   └── s3Service.ts    # AWS S3 SDK integration
├── types/              # TypeScript definitions
│   └── index.ts        # Shared type definitions
└── App.tsx             # Main application component
```

## 🔧 Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **One-click deploy**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ashishworld/amazon-s3-bucket-GUI-manager)

2. **Manual deployment**
   ```bash
   npm run build
   npx vercel --prod
   ```

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy build folder** to Netlify

### Deploy to AWS S3 + CloudFront

1. **Build and deploy**
   ```bash
   npm run build
   aws s3 sync build/ s3://your-bucket-name
   ```

## 🔒 Security Best Practices

- ✅ **No credential storage**: Credentials only in memory during session
- ✅ **HTTPS only**: All AWS operations use secure connections
- ✅ **Pre-signed URLs**: Download URLs expire after 1 hour
- ✅ **CORS validation**: Proper CORS configuration required
- ✅ **Input validation**: All user inputs are validated
- ✅ **Error handling**: Secure error messages without sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AWS SDK**: For S3 integration
- **React**: UI framework
- **Tailwind CSS**: Styling framework
- **Lucide React**: Beautiful icons
- **TypeScript**: Type safety

## 📞 Support

If you have any questions or need help:

- 📧 Email: ashishworld.dev@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/ashishworld/amazon-s3-bucket-GUI-manager/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/ashishworld/amazon-s3-bucket-GUI-manager/discussions)

## 🔐 Required AWS S3 Permissions

**Create an IAM user with the following policy for full S3 bucket access:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketVersioning",
        "s3:ListBucketVersions",
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:DeleteObject",
        "s3:DeleteObjectVersion",
        "s3:RestoreObject",
        "s3:GetObjectAcl",
        "s3:GetObjectVersionAcl",
        "s3:PutObjectVersionAcl"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    }
  ]
}
```

**How to create IAM user:**
1. Go to AWS IAM Console
2. Click **Users** → **Create user**
3. Enter username and select **Programmatic access**
4. Click **Attach policies directly** → **Create policy**
5. Paste the above JSON (replace YOUR-BUCKET-NAME)
6. Complete user creation and **save Access Key & Secret Key**

## ⚠️ Important: S3 Bucket CORS Configuration

**Add this CORS policy to your S3 bucket:**

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**How to add CORS policy:**
1. Go to your S3 bucket in AWS Console
2. Navigate to **Permissions** tab
3. Scroll down to **Cross-origin resource sharing (CORS)**
4. Click **Edit** and paste the above JSON
5. Click **Save changes**

---

**Made with ❤️ by [Ashish Kumar](https://github.com/ashishworld)**